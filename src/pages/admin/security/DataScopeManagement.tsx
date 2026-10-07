// DataScopeManagement.tsx — Data Scope Management (Master List · Create / Edit · Rule Builder)
//
// PAGE 1  /admin/data-scopes              → Data Scope List (master list + filters + pagination)
// PAGE 2  /admin/data-scopes/create       → Create / Edit Data Scope (basic info · filters · logic · preview)
// PAGE 3  /admin/data-scopes/:id/rules    → Scope Rule Builder (rule groups → generated SQL preview)
//
// Everything is client-side; the three screens switch in-component (the sidebar link
// always enters on the master list, exactly like the routes above).
import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Modal } from '../../../components/ui/Modal';
import {
  Shield,
  Plus,
  Search,
  Eye,
  Pencil,
  Trash2,
  Copy,
  ArrowLeft,
  Layers,
  Users,
  Save,
  X,
  Code2,
  CheckCircle2,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Filter as FilterIcon,
  GitBranch,
  Info
} from 'lucide-react';

/* ==========================================================================
   TYPES
   ========================================================================== */

type ScopeType = 'System' | 'Custom';
type ScopeStatus = 'Active' | 'Draft' | 'Inactive';

interface FilterConfig {
  id: string;
  entity: string;
  enabled: boolean;
  /** Where the value for this filter comes from */
  source: string;
}

interface DataScopeRecord {
  id: string;
  name: string;
  code: string;
  type: ScopeType;
  description: string;
  rulesCount: number;
  /** Roles currently using this scope */
  usedByRoles: string[];
  status: ScopeStatus;
  applicableFor: string[];
  logic: 'AND' | 'OR';
  logicMode?: 'Simple' | 'Advanced';
  filters: FilterConfig[];
}

interface Rule {
  id: string;
  entity: string;
  field: string;
  operator: string;
  valueSource: string;
  staticValue: string;
}

interface RuleGroup {
  id: string;
  mode: 'AND' | 'OR';
  rules: Rule[];
}

/* ==========================================================================
   OPTIONS / REFERENCE DATA
   ========================================================================== */

const SCOPE_TYPES: ScopeType[] = ['System', 'Custom'];
const SCOPE_STATUSES: ScopeStatus[] = ['Active', 'Draft', 'Inactive'];
const APPLICABLE_ROLES = ['Teachers', 'Staff', 'HODs', 'Custom'];

/** SECTION 2 of the create/edit screen — what data can be restricted */
const FILTER_ENTITIES = [
  'Branch',
  'Class',
  'Subject',
  'Division',
  'Section',
  'Academic Year',
  'Created By (Own Records)',
  'Department'
];

/** Filter source options (create/edit screen) */
const FILTER_SOURCES = [
  "User's Assigned Branch",
  "User's Assigned Class",
  "User's Assigned Subject",
  "User's Assigned Division",
  "User's Assigned Section",
  "User's Assigned Department",
  'Static Value',
  'Parent Scope',
  'Session Data'
];

const SOURCES_BY_ENTITY: Record<string, string[]> = {
  'Branch': ["User's Assigned Branch", 'Static Value', 'Parent Scope'],
  'Class': ["User's Assigned Class", 'Static Value', 'Parent Scope'],
  'Subject': ["User's Assigned Subject", 'Static Value', 'Parent Scope'],
  'Division': ["User's Assigned Division", 'Static Value'],
  'Section': ["User's Assigned Section", 'Static Value'],
  'Department': ["User's Assigned Department", 'Static Value', 'Parent Scope'],
  'Academic Year': ['Current Academic Year', 'Static Value', 'Session Data'],
  'Created By (Own Records)': ['Logged-in User ID']
};

const getSourcesForEntity = (entity: string): string[] =>
  SOURCES_BY_ENTITY[entity] ?? FILTER_SOURCES;

const getDefaultSourceForEntity = (entity: string): string =>
  getSourcesForEntity(entity)[0] || FILTER_SOURCES[0];

/* ----------------------------- Rule Builder ------------------------------ */

const ENTITY_FIELDS: Record<string, string[]> = {
  Branch: ['branch_id', 'branch_name', 'branch_code'],
  Class: ['class_id', 'class_name', 'class_level'],
  Division: ['division_id', 'division_name'],
  Section: ['section_id', 'section_name'],
  Subject: ['subject_id', 'subject_name', 'subject_code'],
  Department: ['dept_id', 'dept_name', 'dept_code'],
  Student: ['student_id', 'admission_no', 'student_name'],
  Teacher: ['teacher_id', 'employee_code', 'teacher_name'],
  'Academic Year': ['academic_year_id', 'year_label', 'is_current']
};

const RULE_ENTITIES = Object.keys(ENTITY_FIELDS);

const RULE_OPERATORS = [
  'Equals',
  'Not Equals',
  'IN',
  'NOT IN',
  'Like',
  'Between',
  'Is Null',
  'Is Not Null'
];

const RULE_VALUE_SOURCES = [
  "User's Assigned Branch",
  "User's Assigned Classes",
  "User's Assigned Subjects",
  "User's Assigned Division",
  "User's Assigned Section",
  "User's Assigned Department",
  'Static Value',
  'Current Academic Year',
  'Logged-in User ID',
  "User's Branch",
  "User's Department"
];

// Maps a filter entity name → its best matching Rule Value Source
const ENTITY_TO_VALUE_SOURCE: Record<string, string> = {
  'Branch': "User's Assigned Branch",
  'Class': "User's Assigned Classes",
  'Subject': "User's Assigned Subjects",
  'Division': "User's Assigned Division",
  'Section': "User's Assigned Section",
  'Department': "User's Assigned Department",
  'Academic Year': 'Current Academic Year',
  'Created By (Own Records)': 'Logged-in User ID'
};

const SQL_VALUE_SOURCE: Record<string, string> = {
  "User's Assigned Branch": ':user_branch',
  "User's Assigned Classes": ':user_classes',
  "User's Assigned Subjects": ':user_subjects',
  "User's Assigned Division": ':user_divisions',
  "User's Assigned Section": ':user_sections',
  "User's Assigned Department": ':user_dept',
  'Current Academic Year': ':current_academic_year',
  'Logged-in User ID': ':logged_in_user_id',
  "User's Branch": ':user_branch',
  "User's Department": ':user_dept'
};

const SQL_OPERATOR: Record<string, string> = {
  Equals: '=',
  'Not Equals': '<>',
  IN: 'IN',
  'NOT IN': 'NOT IN',
  Like: 'LIKE',
  Between: 'BETWEEN',
  'Is Null': 'IS NULL',
  'Is Not Null': 'IS NOT NULL'
};

/* ==========================================================================
   SEED DATA — 12 scopes (5 system + 7 custom)
   ========================================================================== */

const buildFilters = (enabledEntities: string[], sourceFor: (e: string) => string): FilterConfig[] =>
  FILTER_ENTITIES.map((entity, index) => ({
    id: `f-${index}-${entity.replace(/\W+/g, '').toLowerCase()}`,
    entity,
    enabled: enabledEntities.includes(entity),
    source: sourceFor(entity)
  }));

const INITIAL_SCOPES: DataScopeRecord[] = [
  {
    id: 'ds-001',
    name: 'All Data',
    code: 'all_data',
    type: 'System',
    description:
      'Full institutional data visibility. Reserved for management, trustees and the super administrator login.',
    rulesCount: 0,
    usedByRoles: ['Super Admin', 'Management', 'Trustee'],
    status: 'Active',
    applicableFor: ['Custom'],
    logic: 'AND',
    filters: buildFilters([], (e) => `User's Assigned ${e}`)
  },
  {
    id: 'ds-002',
    name: 'Own Branch Only',
    code: 'own_branch_only',
    type: 'System',
    description:
      'Restricts every screen to the branch the user is posted in. Multi-campus institutions use this for branch principals and front-office staff.',
    rulesCount: 1,
    usedByRoles: ['Branch Principal', 'Front Office', 'Accountant', 'Store Keeper', 'Transport Head'],
    status: 'Active',
    applicableFor: ['Staff', 'HODs'],
    logic: 'AND',
    filters: buildFilters(['Branch'], (e) => `User's Assigned ${e}`)
  },
  {
    id: 'ds-003',
    name: 'Own Class+Subject',
    code: 'own_class_subject',
    type: 'System',
    description:
      'Class teacher and subject teacher view — students, marks and attendance limited to the classes and subjects assigned to the user.',
    rulesCount: 3,
    usedByRoles: [
      'Class Teacher',
      'Subject Teacher',
      'Co-Teacher',
      'Assistant Teacher',
      'Lab Instructor',
      'Sports Coach',
      'Librarian',
      'Counselor'
    ],
    status: 'Active',
    applicableFor: ['Teachers'],
    logic: 'AND',
    filters: buildFilters(['Branch', 'Class', 'Subject'], (e) => `User's Assigned ${e}`)
  },
  {
    id: 'ds-004',
    name: 'HOD Department',
    code: 'hod_department',
    type: 'Custom',
    description:
      'Department heads see only the data of their own department — subject allocation, staff of the department and departmental reports.',
    rulesCount: 2,
    usedByRoles: ['HOD Science', 'HOD Commerce'],
    status: 'Active',
    applicableFor: ['HODs', 'Staff'],
    logic: 'AND',
    filters: buildFilters(['Class', 'Department'], (e) =>
      e === 'Department' ? "User's Assigned Department" : "User's Assigned Class"
    )
  },
  {
    id: 'ds-005',
    name: 'Exam Coordinator',
    code: 'exam_coordinator',
    type: 'Custom',
    description:
      'Exam cell scope — exam schedules, seating plans and result publishing for the selected academic year and classes.',
    rulesCount: 2,
    usedByRoles: ['Exam Coordinator'],
    status: 'Draft',
    applicableFor: ['Staff'],
    logic: 'OR',
    filters: buildFilters(['Academic Year', 'Class'], (e) =>
      e === 'Class' ? "User's Assigned Class" : 'Session Data'
    )
  },
  {
    id: 'ds-006',
    name: 'Fee Collection Officer',
    code: 'fee_collection_officer',
    type: 'Custom',
    description:
      'Fee counter scope — receipts, dues and defaulter lists for the officer’s own branch only, with online payment reconciliation.',
    rulesCount: 2,
    usedByRoles: ['Fee Clerk', 'Cashier', 'Accounts Assistant', 'Online Payment Desk'],
    status: 'Active',
    applicableFor: ['Staff'],
    logic: 'AND',
    filters: buildFilters(['Branch', 'Academic Year'], (e) =>
      e === 'Branch' ? "User's Assigned Branch" : 'Session Data'
    )
  },
  {
    id: 'ds-007',
    name: 'Accounts Read-Only',
    code: 'accounts_read_only',
    type: 'Custom',
    description:
      'Auditor scope — read-only visibility of ledgers, vouchers and reports for the selected academic year, without any posting rights.',
    rulesCount: 1,
    usedByRoles: ['Internal Auditor', 'Statutory Auditor'],
    status: 'Active',
    applicableFor: ['Staff', 'Custom'],
    logic: 'AND',
    filters: buildFilters(['Academic Year'], () => 'Session Data')
  },
  {
    id: 'ds-008',
    name: 'Transport Coordinator',
    code: 'transport_coordinator',
    type: 'Custom',
    description:
      'Route, stop and vehicle data for the coordinator’s own branch, including student pick-up mapping and driver records.',
    rulesCount: 2,
    usedByRoles: ['Transport Incharge', 'Route Supervisor', 'Driver Lead'],
    status: 'Inactive',
    applicableFor: ['Staff'],
    logic: 'AND',
    filters: buildFilters(['Branch', 'Section'], (e) => `User's Assigned ${e}`)
  },
  {
    id: 'ds-009',
    name: 'Library Manager',
    code: 'library_manager',
    type: 'Custom',
    description:
      'Catalogue, issue-return and fine data for the library desk, limited to the branch where the librarian is posted.',
    rulesCount: 2,
    usedByRoles: ['Head Librarian', 'Library Assistant'],
    status: 'Active',
    applicableFor: ['Staff'],
    logic: 'AND',
    filters: buildFilters(['Branch', 'Created By (Own Records)'], (e) =>
      e === 'Branch' ? "User's Assigned Branch" : "User's Assigned Branch"
    )
  },
  {
    id: 'ds-010',
    name: 'Hostel Warden',
    code: 'hostel_warden',
    type: 'Custom',
    description:
      'Hostel block scope — boarders, room allocation and mess records for the warden’s allotted block only.',
    rulesCount: 2,
    usedByRoles: ['Hostel Warden'],
    status: 'Active',
    applicableFor: ['Staff'],
    logic: 'AND',
    filters: buildFilters(['Branch', 'Section'], () => 'Static Value')
  },
  {
    id: 'ds-011',
    name: 'Sports Department',
    code: 'sports_department',
    type: 'Custom',
    description:
      'Sports and physical-education scope — house teams, competition entries and sports certificates of the department.',
    rulesCount: 1,
    usedByRoles: ['Sports Head'],
    status: 'Draft',
    applicableFor: ['HODs', 'Teachers'],
    logic: 'OR',
    filters: buildFilters(['Department'], () => "User's Assigned Department")
  },
  {
    id: 'ds-012',
    name: 'Parent View (Own Child)',
    code: 'parent_own_child',
    type: 'System',
    description:
      'Parent / guardian portal scope — attendance, marks, fee dues and circulars of the linked student(s) only.',
    rulesCount: 1,
    usedByRoles: ['Parent', 'Guardian', 'Alumni Parent', 'Sibling Account', 'Day-Scholar Parent', 'Hostel Parent'],
    status: 'Active',
    applicableFor: ['Custom'],
    logic: 'AND',
    filters: buildFilters(['Created By (Own Records)'], () => 'Parent Scope')
  }
];

const TODAY = '30-Sep-2025';

const emptyScopeForm = (id: string): DataScopeRecord => ({
  id,
  name: '',
  code: '',
  description: '',
  type: 'Custom',
  status: 'Active',
  applicableFor: ['Teachers'],
  logic: 'AND',
  logicMode: 'Simple',
  rulesCount: 0,
  usedByRoles: [],
  filters: buildFilters([], (e) => `User's Assigned ${e}`)
});

/* ==========================================================================
   HELPERS
   ========================================================================== */

const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/\+/g, '')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 40);

const statusBadge: Record<ScopeStatus, 'success' | 'warning' | 'default'> = {
  Active: 'success',
  Draft: 'warning',
  Inactive: 'default'
};

const sqlValueFor = (rule: Rule) => {
  if (rule.valueSource === 'Static Value') return `'${rule.staticValue || 'value'}'`;
  return SQL_VALUE_SOURCE[rule.valueSource] || ':value';
};

const sqlForRule = (rule: Rule) => {
  const op = SQL_OPERATOR[rule.operator] || '=';
  if (rule.operator === 'Is Null' || rule.operator === 'Is Not Null') {
    return `${rule.field} ${op}`;
  }
  return `${rule.field} ${op} ${sqlValueFor(rule)}`;
};

const buildSql = (groups: RuleGroup[]) =>
  groups
    .filter((g) => g.rules.length > 0)
    .map((g) => `(${g.rules.map(sqlForRule).join(` ${g.mode} `)})`)
    .join('\n   OR ');

const newRule = (index: number): Rule => ({
  id: `rule-${Date.now()}-${index}`,
  entity: 'Class',
  field: 'class_id',
  operator: 'IN',
  valueSource: "User's Assigned Classes",
  staticValue: 'Class 8'
});

/* ==========================================================================
   SHARED LITTLE PIECES
   ========================================================================== */

const thClass =
  'p-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap';

function SectionHeading({ index, title, hint }: { index: number; title: string; hint?: string }) {
  return (
    <div className="flex items-start gap-3 border-b border-gray-100 px-5 py-3">
      <span className="w-6 h-6 rounded-md bg-indigo-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
        {index}
      </span>
      <div>
        <h3 className="font-semibold text-gray-900 text-sm">{title}</h3>
        {hint && <p className="text-xs text-gray-500 mt-0.5">{hint}</p>}
      </div>
    </div>
  );
}

/* ==========================================================================
   PAGE 1 — DATA SCOPE LIST
   ========================================================================== */

function DataScopeList({
  scopes,
  onCreate,
  onView,
  onEdit,
  onRules,
  onDuplicate,
  onDelete
}: {
  scopes: DataScopeRecord[];
  onCreate: () => void;
  onView: (s: DataScopeRecord) => void;
  onEdit: (s: DataScopeRecord) => void;
  onRules: (s: DataScopeRecord) => void;
  onDuplicate: (s: DataScopeRecord) => void;
  onDelete: (s: DataScopeRecord) => void;
}) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [page, setPage] = useState(1);
  const PER_PAGE = 5;

  const filtered = scopes.filter((s) => {
    if (search && !s.name.toLowerCase().includes(search.toLowerCase()) && !s.code.toLowerCase().includes(search.toLowerCase()))
      return false;
    if (statusFilter !== 'All' && s.status !== statusFilter) return false;
    if (typeFilter !== 'All' && s.type !== typeFilter) return false;
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const pageRows = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

  const resetFilters = () => {
    setSearch('');
    setStatusFilter('All');
    setTypeFilter('All');
    setPage(1);
  };

  return (
    <div className="space-y-6 py-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-sm">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              Data Scope Management
              <Badge variant="secondary" className="text-xs bg-indigo-50 text-indigo-700 border border-indigo-200">
                {scopes.length} scopes
              </Badge>
            </h1>
            <p className="text-xs text-gray-500">
              View, search and manage every data scope used for record-level access control
            </p>
          </div>
        </div>
        <Button onClick={onCreate} className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs">
          <Plus className="w-4 h-4 mr-1.5" /> ➕ Create Scope
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-4 bg-white border-gray-200 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search scope name or code…"
              className="w-full pl-9 pr-3 py-1.5 border border-gray-300 rounded-md text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
          <div className="md:col-span-3">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="w-full py-1.5 px-2 border border-gray-300 rounded-md text-xs bg-white focus:outline-none"
            >
              <option value="All">Status: All</option>
              {SCOPE_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2">
            <select
              value={typeFilter}
              onChange={(e) => {
                setTypeFilter(e.target.value);
                setPage(1);
              }}
              className="w-full py-1.5 px-2 border border-gray-300 rounded-md text-xs bg-white focus:outline-none"
            >
              <option value="All">Type: All</option>
              {SCOPE_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div className="md:col-span-1 flex justify-end">
            <Button variant="ghost" size="sm" onClick={resetFilters} title="Reset filters">
              <X className="w-4 h-4 text-gray-500 hover:text-gray-800" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Master list */}
      <Card className="overflow-hidden border border-gray-200 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse" data-testid="data-scope-table">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className={`${thClass} w-12 text-center`}>#</th>
                <th className={thClass}>Scope Name</th>
                <th className={thClass}>Scope Type</th>
                <th className={thClass}>Description</th>
                <th className={`${thClass} text-center`}>Rules Count</th>
                <th className={thClass}>Used By</th>
                <th className={thClass}>Status</th>
                <th className={`${thClass} text-right`}>Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {pageRows.map((s, index) => (
                <tr key={s.id} className="hover:bg-indigo-50/20 transition-colors">
                  <td className="p-3 text-center text-gray-400 font-mono">
                    {(currentPage - 1) * PER_PAGE + index + 1}
                  </td>
                  <td className="p-3">
                    <div className="font-semibold text-gray-900">{s.name}</div>
                    <div className="text-[10px] text-gray-500 font-mono">{s.code}</div>
                  </td>
                  <td className="p-3">
                    <Badge variant={s.type === 'System' ? 'info' : 'primary'}>{s.type}</Badge>
                  </td>
                  <td className="p-3 text-gray-600 max-w-[320px]">{s.description}</td>
                  <td className="p-3 text-center font-semibold text-gray-800">{s.rulesCount}</td>
                  <td className="p-3">
                    <span className="inline-flex items-center gap-1 rounded-full border border-indigo-200 bg-indigo-50 px-2 py-0.5 text-[10px] font-semibold text-indigo-700">
                      <Users className="w-3 h-3" />
                      {(s.usedByRoles || []).length} {(s.usedByRoles || []).length === 1 ? 'role' : 'roles'}
                    </span>
                    <div
                      className="text-[10px] text-gray-500 mt-1 truncate max-w-[220px]"
                      title={(s.usedByRoles || []).join(', ')}
                    >
                      {(s.usedByRoles || []).length === 0
                        ? 'Not assigned to any role yet'
                        : (s.usedByRoles || []).slice(0, 2).join(', ') +
                          ((s.usedByRoles || []).length > 2 ? ` +${(s.usedByRoles || []).length - 2} more` : '')}
                    </div>
                  </td>
                  <td className="p-3">
                    <Badge variant={statusBadge[s.status]}>{s.status}</Badge>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => onView(s)}
                        className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onEdit(s)}
                        className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                        title="Edit"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDuplicate(s)}
                        className="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded"
                        title="Duplicate"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      {s.type === 'Custom' ? (
                        <button
                          onClick={() => onDelete(s)}
                          className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      ) : (
                        <span
                          className="p-1.5 text-gray-300 cursor-not-allowed"
                          title="System scopes cannot be deleted"
                        >
                          <Trash2 className="w-4 h-4" />
                        </span>
                      )}
                      <button
                        onClick={() => onRules(s)}
                        className="p-1.5 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded"
                        title="Rule Builder"
                      >
                        <Code2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {pageRows.length === 0 && (
                <tr>
                  <td colSpan={8} className="p-12 text-center text-gray-500">
                    No data scopes match the selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-gray-100 px-5 py-3">
          <p className="text-xs text-gray-500">
            Showing {filtered.length === 0 ? 0 : (currentPage - 1) * PER_PAGE + 1}-
            {Math.min(currentPage * PER_PAGE, filtered.length)} of {filtered.length} scopes
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="w-7 h-7 rounded-md border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 flex items-center justify-center"
              title="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                onClick={() => setPage(n)}
                className={`w-7 h-7 rounded-md text-xs font-semibold ${
                  n === currentPage
                    ? 'bg-indigo-600 text-white'
                    : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                {n}
              </button>
            ))}
            <button
              onClick={() => setPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="w-7 h-7 rounded-md border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 flex items-center justify-center"
              title="Next page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </Card>

      <div className="flex items-start gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-[11px] text-blue-800">
        <Info className="w-4 h-4 shrink-0 mt-0.5" />
        <p>
          <strong>System scopes</strong> are shipped with the product — they can be edited but never deleted.
          Create a <strong>Custom</strong> scope when an institution-specific restriction is needed, and attach it to
          roles from Roles &amp; Permissions.
        </p>
      </div>
    </div>
  );
}

/* ==========================================================================
   PAGE 2 — CREATE / EDIT DATA SCOPE
   ========================================================================== */

function DataScopeEditor({
  draft,
  isNew,
  onCancel,
  onBackToList,
  onSave,
  onOpenRules
}: {
  draft: DataScopeRecord;
  isNew: boolean;
  onCancel: () => void;
  onBackToList: () => void;
  onSave: (scope: DataScopeRecord, status: ScopeStatus) => void;
  onOpenRules: (scope: DataScopeRecord) => void;
}) {
  const [form, setForm] = useState(() => ({
    name: draft.name,
    code: draft.code,
    description: draft.description,
    type: draft.type,
    status: draft.status,
    applicableFor: [...draft.applicableFor],
    logic: draft.logic,
    logicMode: draft.logicMode || 'Simple',
    filters: draft.filters.map((f) => ({ ...f }))
  }));
  const [error, setError] = useState<string | null>(null);

  const enabledFilters = form.filters.filter((f) => f.enabled);

  const toggleFilter = (entity: string) =>
    setForm((f) => ({
      ...f,
      filters: f.filters.map((flt) =>
        flt.entity === entity
          ? {
              ...flt,
              enabled: !flt.enabled,
              source: !flt.enabled ? getDefaultSourceForEntity(entity) : flt.source
            }
          : flt
      )
    }));

  const setFilterSource = (entity: string, source: string) =>
    setForm((f) => ({
      ...f,
      filters: f.filters.map((flt) => (flt.entity === entity ? { ...flt, source } : flt))
    }));

  const toggleApplicable = (role: string) =>
    setForm((f) => ({
      ...f,
      applicableFor: f.applicableFor.includes(role)
        ? f.applicableFor.filter((r) => r !== role)
        : [...f.applicableFor, role]
    }));

  const buildScope = (status: ScopeStatus): DataScopeRecord | null => {
    if (!form.name.trim()) {
      setError('Scope Name is required.');
      return null;
    }
    if (enabledFilters.length === 0) {
      setError('Select at least one filter — a scope must restrict at least one entity.');
      return null;
    }
    const name = form.name.trim();
    return {
      ...draft,
      name,
      code: form.code.trim() || slugify(name),
      description: form.description.trim() || name,
      type: form.type,
      status,
      applicableFor: form.applicableFor,
      logic: form.logic,
      logicMode: form.logicMode,
      filters: form.filters,
      rulesCount: enabledFilters.length
    };
  };

  const save = (status: ScopeStatus) => {
    const scope = buildScope(status);
    if (!scope) return;
    onSave(scope, status);
  };

  const openAdvancedRuleBuilder = () => {
    const advancedForm = { ...form, logicMode: 'Advanced' as const };
    setForm(advancedForm);
    // Build against the advanced choice immediately so the rule builder opens
    // with the requested mode and the saved scope draft.
    const name = advancedForm.name.trim();
    if (!name) {
      setError('Scope Name is required before opening the Rule Builder.');
      return;
    }
    if (!advancedForm.filters.some((filter) => filter.enabled)) {
      setError('Select at least one filter before opening the Rule Builder.');
      return;
    }
    const scope: DataScopeRecord = {
      ...draft,
      name,
      code: advancedForm.code.trim() || slugify(name),
      description: advancedForm.description.trim() || name,
      type: advancedForm.type,
      status: 'Draft',
      applicableFor: advancedForm.applicableFor,
      logic: advancedForm.logic,
      logicMode: 'Advanced',
      filters: advancedForm.filters,
      rulesCount: advancedForm.filters.filter((filter) => filter.enabled).length
    };
    onSave(scope, 'Draft');
    onOpenRules(scope);
  };

  return (
    <div className="space-y-6 py-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-1">
        <div>
          <button
            onClick={onBackToList}
            className="flex items-center gap-2 text-xs text-gray-500 hover:text-gray-900 mb-2"
          >
            <ArrowLeft className="w-4 h-4" /> Back to List
          </button>
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Layers className="w-6 h-6 text-blue-600" />
            {isNew ? 'Create New Data Scope' : `Edit Data Scope — ${draft.name}`}
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Define the scope metadata, the entities it restricts and how the filters combine
          </p>
        </div>

      </div>

      {/* SECTION 1 — Basic information */}
      <Card className="overflow-hidden border border-gray-200 shadow-sm">
        <SectionHeading index={1} title="Basic Information" hint="Name, code, type and who may use this scope" />
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-600 mb-1 font-medium text-xs">
                Scope Name <span className="text-rose-600">*</span>
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => {
                  const name = e.target.value;
                  setForm((f) => ({
                    ...f,
                    name,
                    code: isNew || !f.code ? slugify(name) : f.code
                  }));
                }}
                placeholder="e.g. HOD Department Scope"
                className="w-full p-2 border border-gray-300 rounded-md text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-gray-600 mb-1 font-medium text-xs">
                Scope Code <span className="text-rose-600">*</span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={form.code}
                  onChange={(e) => setForm((f) => ({ ...f, code: slugify(e.target.value) }))}
                  placeholder="auto-generated"
                  className="w-full p-2 border border-gray-300 rounded-md text-xs font-mono focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-[11px] text-gray-500 whitespace-nowrap"
                  onClick={() => setForm((f) => ({ ...f, code: slugify(f.name) }))}
                  title="Regenerate from the scope name"
                >
                  ↻ Auto
                </Button>
              </div>
              <p className="text-[10px] text-gray-400 mt-1">Auto-generated slug, editable — used in code &amp; APIs</p>
            </div>
          </div>

          <div>
            <label className="block text-gray-600 mb-1 font-medium text-xs">Description</label>
            <textarea
              rows={2}
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="What does this scope allow, and who is it meant for?"
              className="w-full p-2 border border-gray-300 rounded-md text-xs resize-none focus:ring-1 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-600 mb-1 font-medium text-xs">Scope Type</label>
              <div className="flex items-center gap-5 p-2.5 border border-gray-200 rounded-md bg-gray-50">
                {['Predefined', 'Custom'].map((t) => {
                  const value: ScopeType = t === 'Predefined' ? 'System' : 'Custom';
                  return (
                    <label key={t} className="flex items-center gap-2 cursor-pointer text-xs">
                      <input
                        type="radio"
                        name="scopeType"
                        checked={form.type === value}
                        onChange={() => setForm((f) => ({ ...f, type: value }))}
                      />
                      <span className={form.type === value ? 'font-semibold text-gray-900' : 'text-gray-600'}>
                        {t}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
            <div>
              <label className="block text-gray-600 mb-1 font-medium text-xs">Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as ScopeStatus }))}
                className="w-full p-2 border border-gray-300 rounded-md text-xs bg-white focus:outline-none"
              >
                {SCOPE_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-gray-600 mb-1 font-medium text-xs">
              Applicable For <span className="text-gray-400">(role categories)</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {APPLICABLE_ROLES.map((role) => {
                const active = form.applicableFor.includes(role);
                return (
                  <button
                    key={role}
                    type="button"
                    onClick={() => toggleApplicable(role)}
                    className={`flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                      active
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                        : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <span
                      className={`w-4 h-4 rounded border flex items-center justify-center ${
                        active ? 'border-indigo-600 bg-indigo-600' : 'border-gray-300'
                      }`}
                    >
                      {active && <CheckCircle2 className="w-3 h-3 text-white" />}
                    </span>
                    {role}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </Card>

      {/* SECTION 2 — Scope filters */}
      <Card className="overflow-hidden border border-gray-200 shadow-sm">
        <SectionHeading
          index={2}
          title="Scope Filters"
          hint="What data does this scope restrict? Tick an entity and choose where its value comes from."
        />
        <div className="p-5 space-y-3">
          {form.filters.map((flt) => (
            <div
              key={flt.id}
              className={`rounded-lg border p-3 transition-colors ${
                flt.enabled ? 'border-indigo-200 bg-indigo-50/40' : 'border-gray-200 bg-white'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={flt.enabled} onChange={() => toggleFilter(flt.entity)} />
                  <span className={`text-xs font-semibold ${flt.enabled ? 'text-gray-900' : 'text-gray-500'}`}>
                    Filter by {flt.entity}
                  </span>
                </label>
                {flt.enabled && flt.entity !== 'Created By (Own Records)' && (
                  <div className="flex items-center gap-2 sm:w-[360px]">
                    <span className="text-[11px] text-gray-500 whitespace-nowrap">Source:</span>
                    <select
                      value={flt.source}
                      onChange={(e) => setFilterSource(flt.entity, e.target.value)}
                      className="w-full p-1.5 border border-gray-300 rounded-md text-xs bg-white focus:outline-none"
                    >
                      {getSourcesForEntity(flt.entity).map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                {flt.enabled && flt.entity === 'Created By (Own Records)' && (
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-gray-500">Source:</span>
                    <span className="text-[11px] text-indigo-700 bg-white border border-indigo-200 rounded-md px-2 py-1 font-medium">
                      Logged-in User ID
                    </span>
                    <span className="text-[10px] text-gray-400">(auto — only valid source for this entity)</span>
                  </div>
                )}
              </div>
            </div>
          ))}
          <p className="text-[11px] text-gray-500">
            Source options: User’s Assigned [Entity] · Static Value · Parent Scope · Session Data
          </p>
        </div>
      </Card>

      {/* SECTION 3 — Combination logic */}
      <Card className="overflow-hidden border border-gray-200 shadow-sm">
        <SectionHeading index={3} title="Filter Combination Logic" hint="Choose simple AND/OR logic or advanced rule groups." />
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {([
              { value: 'Simple' as const, title: 'Simple logic', hint: 'Combine enabled filters with one AND or OR rule.' },
              { value: 'Advanced' as const, title: 'Advanced logic', hint: 'Build multiple rule groups with their own conditions.' }
            ]).map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => { setError(null); setForm((current) => ({ ...current, logicMode: option.value })); }}
                className={`rounded-lg border p-3 text-left transition-colors ${form.logicMode === option.value ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 bg-white hover:bg-gray-50'}`}
              >
                <div className="flex items-center gap-2">
                  <span className={`w-3.5 h-3.5 rounded-full border-2 ${form.logicMode === option.value ? 'border-indigo-600 bg-indigo-600' : 'border-gray-300'}`} />
                  <span className="text-xs font-semibold text-gray-900">{option.title}</span>
                </div>
                <p className="mt-1.5 text-[11px] text-gray-500">{option.hint}</p>
              </button>
            ))}
          </div>

          {form.logicMode === 'Simple' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 border-t border-gray-100 pt-4">
              {([
                { value: 'AND' as const, title: 'AND (All conditions must match)', hint: 'Every enabled filter must match.' },
                { value: 'OR' as const, title: 'OR (Any condition can match)', hint: 'A record can match any enabled filter.' }
              ]).map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setForm((current) => ({ ...current, logic: option.value }))}
                  className={`rounded-lg border p-3 text-left transition-colors ${form.logic === option.value ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 bg-white hover:bg-gray-50'}`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-3.5 h-3.5 rounded-full border-2 ${form.logic === option.value ? 'border-indigo-600 bg-indigo-600' : 'border-gray-300'}`} />
                    <span className="text-xs font-semibold text-gray-900">{option.title}</span>
                  </div>
                  <p className="mt-1.5 text-[11px] text-gray-500">{option.hint}</p>
                </button>
              ))}
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-t border-gray-100 pt-4">
              <p className="text-xs text-gray-600">Advanced mode uses the rule builder for nested conditions and groups. The scope will be saved as a draft before opening it.</p>
              <Button variant="outline" size="sm" className="shrink-0 text-xs text-purple-700 border-purple-200 hover:bg-purple-50" onClick={openAdvancedRuleBuilder}>
                <Code2 className="w-4 h-4 mr-1.5" /> Open Rule Builder
              </Button>
            </div>
          )}

          {error && <div className="flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-[11px] text-rose-700"><AlertTriangle className="w-4 h-4" />{error}</div>}
          <p className="text-[11px] text-gray-500">{enabledFilters.length} filter(s) selected · {form.logicMode === 'Advanced' ? 'advanced rule groups' : `${form.logic} logic`} · applicable for <strong>{form.applicableFor.join(', ') || '—'}</strong></p>
        </div>
      </Card>

      {/* Footer actions */}
      <div className="flex flex-wrap items-center justify-end gap-2">
        <Button variant="outline" size="sm" className="text-xs" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="text-xs text-amber-700 border-amber-300 hover:bg-amber-50"
          onClick={() => save('Draft')}
        >
          💾 Save as Draft
        </Button>
        <Button
          size="sm"
          className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white"
          onClick={() => save('Active')}
        >
          <Save className="w-3.5 h-3.5 mr-1" /> Save
        </Button>
      </div>
    </div>
  );
}

/* ==========================================================================
   PAGE 3 — SCOPE RULE BUILDER
   ========================================================================== */

const initializeRulesFromFilters = (scope: DataScopeRecord): RuleGroup[] => {
  const enabledFilters = scope.filters.filter((f) => f.enabled);

  if (enabledFilters.length === 0) {
    return [{
      id: 'g1',
      mode: 'AND',
      rules: [{
        id: 'r1',
        entity: 'Class',
        field: 'class_id',
        operator: 'IN',
        valueSource: "User's Assigned Classes",
        staticValue: ''
      }]
    }];
  }

  return [{
    id: 'g1',
    mode: scope.logic,
    rules: enabledFilters.map((filter, i) => {
      const entity = filter.entity === 'Created By (Own Records)' ? 'Teacher' : filter.entity;
      const fields = ENTITY_FIELDS[entity] || ['id'];
      const valueSource = ENTITY_TO_VALUE_SOURCE[filter.entity] ?? filter.source ?? "User's Assigned Branch";
      return {
        id: `r${i + 1}`,
        entity,
        field: fields[0] || 'id',
        operator: 'IN',
        valueSource,
        staticValue: ''
      };
    })
  }];
};

function RuleBuilder({
  scope,
  onBack,
  onCancel,
  onSave,
  savedRules
}: {
  scope: DataScopeRecord;
  onBack: () => void;
  onCancel: () => void;
  onSave: (groups: RuleGroup[]) => void;
  savedRules?: RuleGroup[];
}) {
  const [groups, setGroups] = useState<RuleGroup[]>(() =>
    savedRules && savedRules.length > 0
      ? savedRules
      : initializeRulesFromFilters(scope)
  );
  const [showSql, setShowSql] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateRule = (groupId: string, ruleId: string, patch: Partial<Rule>) =>
    setGroups((prev) =>
      prev.map((g) =>
        g.id === groupId
          ? {
              ...g,
              rules: g.rules.map((r) => {
                if (r.id !== ruleId) return r;
                const next = { ...r, ...patch };
                // entity change re-populates the field list + keeps a valid field
                if (patch.entity) {
                  const fields = ENTITY_FIELDS[patch.entity] || [];
                  next.field = fields[0] || 'id';
                }
                return next;
              })
            }
          : g
      )
    );

  const addRule = (groupId: string) =>
    setGroups((prev) =>
      prev.map((g) =>
        g.id === groupId ? { ...g, rules: [...g.rules, newRule(g.rules.length + 1)] } : g
      )
    );

  const removeRule = (groupId: string, ruleId: string) =>
    setGroups((prev) =>
      prev.map((g) => (g.id === groupId ? { ...g, rules: g.rules.filter((r) => r.id !== ruleId) } : g))
    );

  const addGroup = (mode: 'AND' | 'OR') =>
    setGroups((prev) => [
      ...prev,
      {
        id: `g${Date.now()}`,
        mode,
        rules: [
          {
            id: `r${Date.now()}`,
            entity: 'Branch',
            field: 'branch_id',
            operator: 'Equals',
            valueSource: "User's Assigned Branch",
            staticValue: 'Branch A'
          }
        ]
      }
    ]);

  const removeGroup = (groupId: string) =>
    setGroups((prev) => prev.filter((g) => g.id !== groupId));

  const sql = buildSql(groups);

  const buildPlainEnglish = (groups: RuleGroup[]): string[] =>
    groups
      .filter((g) => g.rules.length > 0)
      .map((g) => {
        const parts = g.rules.map((rule) => {
          const isStatic = rule.valueSource === 'Static Value';
          const val = isStatic ? `"${rule.staticValue || 'value'}"` : rule.valueSource;
          const opMap: Record<string, string> = {
            IN: 'is one of',
            'NOT IN': 'is NOT one of',
            Equals: 'equals',
            'Not Equals': 'does not equal',
            Like: 'contains',
            Between: 'is between',
            'Is Null': 'is empty',
            'Is Not Null': 'is not empty'
          };
          const opText = opMap[rule.operator] || rule.operator;
          if (rule.operator === 'Is Null' || rule.operator === 'Is Not Null') {
            return `${rule.entity} ${opText}`;
          }
          return `${rule.entity} ${opText} ${val}`;
        });
        return parts.join(` ${g.mode} `);
      });

  const plainEnglishGroups = buildPlainEnglish(groups);

  const save = () => {
    const flat = groups.flatMap((g) => g.rules);
    if (flat.length === 0) {
      setError('Add at least one rule before saving.');
      return;
    }
    if (flat.some((r) => r.operator === 'Between' && !r.staticValue.includes(','))) {
      setError('“Between” needs two comma-separated values, e.g. 10, 20.');
      return;
    }
    onSave(groups);
  };

  return (
    <div className="space-y-6 py-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-xs text-gray-500 hover:text-gray-900 mb-2"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <GitBranch className="w-6 h-6 text-purple-600" /> Rule Builder: “{scope.name}”
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Build complex rules for this scope — rules inside a group combine with the group’s logic, groups combine with OR
          </p>
        </div>
        <Badge variant="secondary" className="text-xs bg-purple-50 text-purple-700 border border-purple-200">
          <Code2 className="w-3 h-3 mr-1" /> {scope.code}
        </Badge>
      </div>

      {/* Context Banner — shows what was set in the Editor */}
      {scope.filters.filter((f) => f.enabled).length > 0 && (
        <div className="flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3">
          <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <div className="text-xs text-blue-900">
            <p className="font-semibold mb-1">📋 This scope was configured with these filters in the Editor:</p>
            <div className="flex flex-wrap gap-1.5">
              {scope.filters.filter((f) => f.enabled).map((f) => (
                <span key={f.id} className="inline-flex items-center gap-1 rounded-full border border-blue-300 bg-white px-2 py-0.5 text-[11px] font-medium text-blue-800">
                  {f.entity}<span className="text-blue-500">→ {f.source}</span>
                </span>
              ))}
            </div>
            <p className="mt-2 text-[11px] text-blue-700">The rules below should match these filters. Add more Rule Groups (OR) below to create more complex logic.</p>
          </div>
        </div>
      )}

      {/* Rule groups */}
      {groups.map((group, gIndex) => (
        <React.Fragment key={group.id}>
          {gIndex > 0 && (
            <div className="flex items-center gap-3 py-1">
              <div className="h-px flex-1 bg-amber-300" />
              <div className="flex flex-col items-center gap-1">
                <span className="px-5 py-1.5 bg-amber-100 text-amber-800 font-bold text-sm rounded-full border-2 border-amber-300 shadow-sm">OR</span>
                <p className="text-[10px] text-amber-600 font-medium">if either group matches, the record is shown</p>
              </div>
              <div className="h-px flex-1 bg-amber-300" />
            </div>
          )}
          <Card className="overflow-hidden border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 bg-gray-50">
            <div className="flex items-center gap-3">
              <h3 className="text-sm font-semibold text-gray-900">Rule Group {gIndex + 1}</h3>
              <div className="flex items-center gap-1 rounded-md border border-gray-200 bg-white p-0.5">
                {(['AND', 'OR'] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() =>
                      setGroups((prev) => prev.map((g) => (g.id === group.id ? { ...g, mode: m } : g)))
                    }
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      group.mode === m ? 'bg-indigo-600 text-white' : 'text-gray-500 hover:bg-gray-100'
                    }`}
                    title={`Rules in this group combine with ${m}`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>
            {groups.length > 1 && (
              <button
                onClick={() => removeGroup(group.id)}
                className="text-[11px] text-rose-600 hover:text-rose-800"
              >
                Remove group
              </button>
            )}
          </div>

          <div className="p-5 space-y-3">
            {group.rules.map((rule, rIndex) => (
              <React.Fragment key={rule.id}>
                {rIndex > 0 && (
                  <div className="flex items-center gap-2 py-0.5 px-1">
                    <div className="h-px flex-1 bg-indigo-100" />
                    <span className="text-[10px] font-bold text-indigo-400 px-2 py-0.5 bg-indigo-50 rounded border border-indigo-200">
                      {group.mode}
                    </span>
                    <div className="h-px flex-1 bg-indigo-100" />
                  </div>
                )}
                <div className="rounded-lg border border-gray-200 bg-white p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                    Rule {rIndex + 1}
                  </span>
                  <button
                    onClick={() => removeRule(group.id, rule.id)}
                    className="flex items-center gap-1 text-[11px] text-gray-400 hover:text-rose-600"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Del
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                  <select
                    value={rule.entity}
                    onChange={(e) => updateRule(group.id, rule.id, { entity: e.target.value })}
                    className="p-1.5 border border-gray-300 rounded-md text-xs bg-white focus:outline-none"
                    title="Entity"
                  >
                    {RULE_ENTITIES.map((e) => (
                      <option key={e} value={e}>
                        {e}
                      </option>
                    ))}
                  </select>
                  <select
                    value={rule.field}
                    onChange={(e) => updateRule(group.id, rule.id, { field: e.target.value })}
                    className="p-1.5 border border-gray-300 rounded-md text-xs bg-white font-mono focus:outline-none"
                    title="Field"
                  >
                    {(ENTITY_FIELDS[rule.entity] || []).map((f) => (
                      <option key={f} value={f}>
                        {f}
                      </option>
                    ))}
                  </select>
                  <select
                    value={rule.operator}
                    onChange={(e) => updateRule(group.id, rule.id, { operator: e.target.value })}
                    className="p-1.5 border border-gray-300 rounded-md text-xs bg-white focus:outline-none"
                    title="Operator"
                  >
                    {RULE_OPERATORS.map((op) => (
                      <option key={op} value={op}>
                        {op}
                      </option>
                    ))}
                  </select>
                  <select
                    value={rule.valueSource}
                    onChange={(e) => updateRule(group.id, rule.id, { valueSource: e.target.value })}
                    className="p-1.5 border border-gray-300 rounded-md text-xs bg-white focus:outline-none"
                    title="Value Source"
                  >
                    {RULE_VALUE_SOURCES.map((v) => (
                      <option key={v} value={v}>
                        {v}
                      </option>
                    ))}
                  </select>
                </div>

                {rule.valueSource === 'Static Value' &&
                  rule.operator !== 'Is Null' &&
                  rule.operator !== 'Is Not Null' && (
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-[11px] text-gray-500 whitespace-nowrap">Static value:</span>
                      <input
                        type="text"
                        value={rule.staticValue}
                        onChange={(e) => updateRule(group.id, rule.id, { staticValue: e.target.value })}
                        placeholder={rule.operator === 'Between' ? '10, 20' : 'Branch A'}
                        className="w-full md:w-72 p-1.5 border border-gray-300 rounded-md text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                      />
                    </div>
                  )}

                  <p className="mt-2 text-[10px] text-gray-400 font-mono">{sqlForRule(rule)}</p>
                </div>
              </React.Fragment>
            ))}

            <button
              onClick={() => addRule(group.id)}
              className="w-full rounded-lg border border-dashed border-indigo-300 bg-indigo-50/50 px-3 py-2 text-xs font-semibold text-indigo-700 hover:bg-indigo-50"
            >
              <Plus className="w-3.5 h-3.5 inline mr-1" /> Add Rule to this Group
            </button>
          </div>
          </Card>
        </React.Fragment>
      ))}

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="text-xs text-indigo-700 border-indigo-200 hover:bg-indigo-50"
          onClick={() => addGroup('OR')}
        >
          <Plus className="w-3.5 h-3.5 mr-1" /> Add Rule Group (OR)
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="text-xs text-indigo-700 border-indigo-200 hover:bg-indigo-50"
          onClick={() => addGroup('AND')}
        >
          <Plus className="w-3.5 h-3.5 mr-1" /> Add Rule Group (AND)
        </Button>
      </div>

      {/* Plain English Preview — always visible */}
      <Card className="overflow-hidden border border-gray-200 shadow-sm">
        <div className="flex items-center gap-2 px-5 py-3 border-b border-gray-100 bg-blue-50">
          <Eye className="w-4 h-4 text-blue-600" />
          <h3 className="font-semibold text-gray-900 text-sm">What this scope does</h3>
          <span className="ml-auto text-[10px] text-blue-500 font-medium">Plain English — for everyone</span>
        </div>
        <div className="p-5 space-y-3">
          {plainEnglishGroups.length === 0 ? (
            <p className="text-xs text-gray-400 italic">Add at least one rule above to see a description here.</p>
          ) : (
            <div className="space-y-2">
              <p className="text-xs font-semibold text-gray-700 mb-3">👁️ A user with this scope will ONLY see records where:</p>
              {plainEnglishGroups.map((groupText, i) => (
                <React.Fragment key={i}>
                  {i > 0 && (
                    <div className="flex items-center gap-2 my-1">
                      <div className="h-px flex-1 bg-amber-200" />
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 rounded-full px-2 py-0.5">OR alternatively:</span>
                      <div className="h-px flex-1 bg-amber-200" />
                    </div>
                  )}
                  <div className="flex items-start gap-2 rounded-lg bg-emerald-50 border border-emerald-200 px-3 py-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                    <p className="text-xs text-emerald-900 leading-relaxed">{groupText}</p>
                  </div>
                </React.Fragment>
              ))}
            </div>
          )}
        </div>
      </Card>

      {/* SQL Preview — collapsible, hidden by default */}
      <Card className="overflow-hidden border border-gray-200 shadow-sm">
        <button
          onClick={() => setShowSql((v) => !v)}
          aria-expanded={showSql}
          className="w-full flex items-center justify-between px-5 py-3 border-b border-gray-100 bg-slate-50 hover:bg-slate-100 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Code2 className="w-4 h-4 text-slate-600" />
            <h3 className="font-semibold text-gray-900 text-sm">Technical SQL Preview</h3>
            <span className="text-[10px] text-slate-400 font-medium">for developers only</span>
          </div>
          <span className="text-[10px] text-indigo-600 font-semibold">{showSql ? '▲ Hide' : '▼ Show'}</span>
        </button>
        {showSql && (
          <div className="p-5">
            <pre className="rounded-lg bg-slate-900 text-emerald-200 text-[11px] leading-relaxed p-4 overflow-x-auto font-mono">
              {sql ? `WHERE ${sql}` : '-- add at least one rule to generate the WHERE clause'}
            </pre>
            <p className="text-[10px] text-gray-400 mt-2">This WHERE clause is automatically applied to every database query when a user with this scope loads a page.</p>
          </div>
        )}
      </Card>

      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-[11px] text-rose-700">
          <AlertTriangle className="w-4 h-4" /> {error}
        </div>
      )}

      <div className="flex items-center justify-end gap-2">
        <Button variant="outline" size="sm" className="text-xs" onClick={onCancel}>
          Cancel
        </Button>
        <Button size="sm" className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white" onClick={save}>
          <Save className="w-3.5 h-3.5 mr-1" /> Save Rules
        </Button>
      </div>
    </div>
  );
}

/* ==========================================================================
   MAIN — three screens in one route
   ========================================================================== */

export function DataScopeManagement() {
  const [scopes, setScopes] = useState<DataScopeRecord[]>(INITIAL_SCOPES);
  const [screen, setScreen] = useState<'list' | 'editor' | 'rules'>('list');
  const [draft, setDraft] = useState<DataScopeRecord | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [viewScope, setViewScope] = useState<DataScopeRecord | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<DataScopeRecord | null>(null);
  const [ruleTarget, setRuleTarget] = useState<DataScopeRecord | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  /** rules kept per scope for the Rule Builder screen */
  const [scopeRules, setScopeRules] = useState<Record<string, RuleGroup[]>>({});

  const showToast = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 3500);
  };

  const handleCreate = () => {
    setDraft(emptyScopeForm(`ds-${Date.now()}`));
    setIsNew(true);
    setScreen('editor');
  };

  const handleEdit = (scope: DataScopeRecord) => {
    setDraft({ ...scope, filters: scope.filters.map((f) => ({ ...f })) });
    setIsNew(false);
    setScreen('editor');
  };

  const handleDuplicate = (scope: DataScopeRecord) => {
    const copy: DataScopeRecord = {
      ...scope,
      id: `ds-${Date.now()}`,
      name: `${scope.name} (Copy)`,
      code: `${scope.code}_copy`,
      type: 'Custom',
      status: 'Draft',
      usedByRoles: [],
      filters: scope.filters.map((f) => ({ ...f }))
    };
    setScopes((prev) => [copy, ...prev]);
    showToast(`Scope “${scope.name}” duplicated as “${copy.name}” (Draft).`);
  };

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    setScopes((prev) => prev.filter((s) => s.id !== deleteTarget.id));
    showToast(`Custom scope “${deleteTarget.name}” deleted.`);
    setDeleteTarget(null);
  };

  const handleSave = (scope: DataScopeRecord, status: ScopeStatus) => {
    const saved: DataScopeRecord = { ...scope, status };
    setScopes((prev) =>
      prev.some((s) => s.id === saved.id)
        ? prev.map((s) => (s.id === saved.id ? { ...s, ...saved } : s))
        : [saved, ...prev]
    );
    setDraft(null);
    setScreen('list');
    showToast(
      status === 'Draft'
        ? `Draft saved for “${saved.name}” — it stays hidden from role assignment until activated.`
        : `Scope “${saved.name}” saved successfully.`
    );
  };

  const openRules = (scope: DataScopeRecord) => {
    setRuleTarget(scope);
    setDraft(null);
    setScreen('rules');
    // scopeRules[scope.id] will be passed to RuleBuilder so it can restore previously saved rules
  };

  const handleSaveRules = (groups: RuleGroup[]) => {
    if (ruleTarget) {
      setScopeRules((prev) => ({ ...prev, [ruleTarget.id]: groups }));
      setScopes((prev) =>
        prev.map((s) =>
          s.id === ruleTarget.id
            ? { ...s, rulesCount: groups.reduce((n, g) => n + g.rules.length, 0) }
            : s
        )
      );
      showToast(`Rules saved for “${ruleTarget.name}”.`);
    }
    setRuleTarget(null);
    setScreen('list');
  };

  /* ------------------------------- render ------------------------------- */

  return (
    <div className="relative">
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 bg-gray-900 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-gray-700">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-sm font-medium">{toast}</span>
          <button onClick={() => setToast(null)} className="ml-2 text-gray-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {screen === 'list' && (
        <DataScopeList
          scopes={scopes}
          onCreate={handleCreate}
          onView={(s) => setViewScope(s)}
          onEdit={handleEdit}
          onRules={openRules}
          onDuplicate={handleDuplicate}
          onDelete={(s) => setDeleteTarget(s)}
        />
      )}

      {screen === 'editor' && draft && (
        <DataScopeEditor
          draft={draft}
          isNew={isNew}
          onCancel={() => {
            setDraft(null);
            setScreen('list');
          }}
          onBackToList={() => {
            setDraft(null);
            setScreen('list');
          }}
          onSave={handleSave}
          onOpenRules={openRules}
        />
      )}

      {screen === 'rules' && ruleTarget && (
        <RuleBuilder
          scope={ruleTarget}
          onBack={() => {
            setRuleTarget(null);
            setScreen('list');
          }}
          onCancel={() => {
            setRuleTarget(null);
            setScreen('list');
          }}
          onSave={handleSaveRules}
          savedRules={scopeRules[ruleTarget.id]}
        />
      )}

      {/* View Details modal */}
      {viewScope && (
        <Modal
          isOpen
          onClose={() => setViewScope(null)}
          title={`Scope Details — ${viewScope.name}`}
          size="lg"
        >
          <div className="space-y-4 text-xs">
            <div className="p-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-lg flex items-center justify-between">
              <div>
                <div className="font-bold text-sm">{viewScope.name}</div>
                <div className="text-[11px] text-indigo-100 font-mono">{viewScope.code}</div>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-white/20 text-white border-none">{viewScope.type}</Badge>
                <Badge className="bg-white/20 text-white border-none">{viewScope.status}</Badge>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-3 bg-white space-y-2">
              <div className="font-bold text-gray-800 text-[11px] border-b pb-1">SCOPE SUMMARY</div>
              <p className="text-gray-600 leading-relaxed">{viewScope.description}</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-1">
                <div>
                  <span className="text-gray-400 block text-[10px]">Rules Count</span>
                  <span className="font-semibold">{viewScope.rulesCount}</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px]">Used by Roles</span>
                  <span className="font-semibold">{viewScope.usedByRoles.length}</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px]">Combination</span>
                  <span className="font-semibold">{viewScope.logic}</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px]">Applicable For</span>
                  <span className="font-semibold">{viewScope.applicableFor.join(', ') || '—'}</span>
                </div>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-3 bg-white space-y-2">
              <div className="font-bold text-gray-800 text-[11px] border-b pb-1">
                ACTIVE FILTERS ({viewScope.filters.filter((f) => f.enabled).length})
              </div>
              {viewScope.filters.filter((f) => f.enabled).length === 0 ? (
                <p className="text-gray-500">No restriction — this scope grants full data access.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {viewScope.filters
                    .filter((f) => f.enabled)
                    .map((f) => (
                      <span
                        key={f.id}
                        className="inline-flex items-center gap-1 rounded-full border border-indigo-200 bg-indigo-50 px-2.5 py-1 text-[11px] text-indigo-800"
                      >
                        <FilterIcon className="w-3 h-3" />
                        {f.entity}: <span className="font-medium">{f.source}</span>
                      </span>
                    ))}
                </div>
              )}
            </div>

            {/* Impact Summary Panel */}
            <div className="border border-indigo-200 rounded-lg p-3 bg-indigo-50 space-y-2">
              <div className="font-bold text-indigo-800 text-[11px] border-b border-indigo-200 pb-1">📊 IMPACT SUMMARY</div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white rounded-lg border border-indigo-100 p-2.5 text-center">
                  <div className="text-xl font-bold text-indigo-700">{viewScope.usedByRoles.length}</div>
                  <div className="text-[10px] text-gray-500 mt-0.5">Roles using this scope</div>
                </div>
                <div className="bg-white rounded-lg border border-indigo-100 p-2.5 text-center">
                  <div className="text-xl font-bold text-indigo-700">{viewScope.rulesCount}</div>
                  <div className="text-[10px] text-gray-500 mt-0.5">Active filter rules</div>
                </div>
              </div>
              {viewScope.usedByRoles.length > 0 ? (
                <div className="flex items-start gap-2 rounded-md border border-indigo-200 bg-white px-2.5 py-2 text-[11px] text-indigo-800">
                  <Info className="w-3.5 h-3.5 shrink-0 mt-0.5 text-indigo-500" />
                  <span>Editing or deleting this scope will immediately affect all <strong>{viewScope.usedByRoles.length}</strong> roles listed below and every user assigned to those roles.</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-[11px] text-gray-500 italic">
                  <Info className="w-3.5 h-3.5 shrink-0 text-gray-400" />
                  This scope is not yet assigned to any role. Assign it from Roles &amp; Permissions.
                </div>
              )}
            </div>

            <div className="border border-gray-200 rounded-lg p-3 bg-white space-y-2">
              <div className="font-bold text-gray-800 text-[11px] border-b pb-1">
                USED BY ROLES ({viewScope.usedByRoles.length})
              </div>
              <div className="flex flex-wrap gap-2">
                {viewScope.usedByRoles.map((r) => (
                  <span
                    key={r}
                    className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-[11px] text-gray-700"
                  >
                    <Users className="w-3 h-3" /> {r}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
              <Button
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={() => {
                  const s = viewScope;
                  setViewScope(null);
                  openRules(s);
                }}
              >
                <Code2 className="w-3.5 h-3.5 mr-1" /> Rule Builder
              </Button>
              <Button
                size="sm"
                className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white"
                onClick={() => {
                  const s = viewScope;
                  setViewScope(null);
                  handleEdit(s);
                }}
              >
                <Pencil className="w-3.5 h-3.5 mr-1" /> Edit Scope
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete confirmation */}
      {deleteTarget && (
        <Modal isOpen onClose={() => setDeleteTarget(null)} title="Delete Data Scope">
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              You are about to permanently delete the <strong className="text-gray-900">{deleteTarget.name}</strong> scope. This action cannot be undone.
            </p>

            {deleteTarget.usedByRoles.length > 0 ? (
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 space-y-2">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  <p className="text-xs font-semibold text-amber-800">⚠️ This scope is currently used by {deleteTarget.usedByRoles.length} {deleteTarget.usedByRoles.length === 1 ? 'role' : 'roles'}</p>
                </div>
                <div className="max-h-40 overflow-y-auto rounded border border-amber-200 bg-white">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="bg-amber-50 border-b border-amber-200">
                        <th className="px-3 py-2 text-left font-semibold text-amber-800">Role</th>
                        <th className="px-3 py-2 text-left font-semibold text-amber-800">What happens</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-amber-100">
                      {deleteTarget.usedByRoles.map((role) => (
                        <tr key={role} className="hover:bg-amber-50/50">
                          <td className="px-3 py-2 font-medium text-gray-800">{role}</td>
                          <td className="px-3 py-2 text-gray-500">Will fall back to <span className="font-semibold text-rose-600">All Data</span> (no restriction)</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-[11px] text-amber-700">After deletion, all roles above will have unrestricted access to data on pages that used this scope. Reassign a scope to those roles before deleting, or proceed carefully.</p>
              </div>
            ) : (
              <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <p className="text-xs text-emerald-800">This scope is not currently assigned to any role. Safe to delete.</p>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
              <Button variant="outline" onClick={() => setDeleteTarget(null)}>Cancel</Button>
              <Button variant="danger" onClick={handleDeleteConfirm}>
                {deleteTarget.usedByRoles.length > 0 ? `Delete Anyway (${deleteTarget.usedByRoles.length} roles affected)` : 'Delete Scope'}
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* footer hint keeps the last save date visible like the other security screens */}
      <p className="px-1 pb-2 text-[10px] text-gray-400">Last reviewed: {TODAY}</p>
    </div>
  );
}

export default DataScopeManagement;
