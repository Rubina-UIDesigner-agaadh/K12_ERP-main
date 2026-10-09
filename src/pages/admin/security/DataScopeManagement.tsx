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
  /** Conditions inside every logical block are always ANDed. Blocks themselves are ORed. */
  mode: 'AND';
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

type RuleFieldType = 'identifier' | 'text' | 'number' | 'date' | 'boolean';

const ENTITY_FIELDS: Record<string, string[]> = {
  Branch: ['branch_id', 'branch_name', 'branch_code'],
  Class: ['class_id', 'class_name', 'class_level'],
  Division: ['division_id', 'division_name'],
  Section: ['section_id', 'section_name'],
  Subject: ['subject_id', 'subject_name', 'subject_code'],
  Department: ['dept_id', 'dept_name', 'dept_code'],
  Student: ['student_id', 'admission_no', 'student_name', 'attendance_percentage', 'admission_date'],
  Teacher: ['teacher_id', 'employee_code', 'teacher_name', 'joining_date'],
  'Academic Year': ['academic_year_id', 'year_label', 'is_current', 'start_date', 'end_date'],
  Semester: ['semester_id', 'semester_name', 'is_active', 'start_date', 'end_date'],
  'Created By (Own Records)': ['created_by_user_id']
};

const RULE_ENTITIES = Object.keys(ENTITY_FIELDS);

const ENTITY_FIELD_TYPES: Record<string, Record<string, RuleFieldType>> = {
  Branch: { branch_id: 'identifier', branch_name: 'text', branch_code: 'text' },
  Class: { class_id: 'identifier', class_name: 'text', class_level: 'text' },
  Division: { division_id: 'identifier', division_name: 'text' },
  Section: { section_id: 'identifier', section_name: 'text' },
  Subject: { subject_id: 'identifier', subject_name: 'text', subject_code: 'text' },
  Department: { dept_id: 'identifier', dept_name: 'text', dept_code: 'text' },
  Student: { student_id: 'identifier', admission_no: 'text', student_name: 'text', attendance_percentage: 'number', admission_date: 'date' },
  Teacher: { teacher_id: 'identifier', employee_code: 'text', teacher_name: 'text', joining_date: 'date' },
  'Academic Year': { academic_year_id: 'identifier', year_label: 'text', is_current: 'boolean', start_date: 'date', end_date: 'date' },
  Semester: { semester_id: 'identifier', semester_name: 'text', is_active: 'boolean', start_date: 'date', end_date: 'date' },
  'Created By (Own Records)': { created_by_user_id: 'identifier' }
};

const OPERATORS_BY_FIELD_TYPE: Record<RuleFieldType, string[]> = {
  identifier: ['Equals', 'Not Equals', 'IN', 'NOT IN', 'Is Null', 'Is Not Null'],
  text: ['Equals', 'Not Equals', 'IN', 'NOT IN', 'Like', 'Is Null', 'Is Not Null'],
  number: ['Equals', 'Not Equals', 'Between', 'Is Null', 'Is Not Null'],
  date: ['Equals', 'Not Equals', 'Between', 'Is Null', 'Is Not Null'],
  boolean: ['Equals', 'Not Equals']
};

const getRuleFieldType = (entity: string, field: string): RuleFieldType =>
  ENTITY_FIELD_TYPES[entity]?.[field] || 'text';

const getRuleOperators = (entity: string, field: string): string[] =>
  OPERATORS_BY_FIELD_TYPE[getRuleFieldType(entity, field)];

const hasAssignedContext = (entity: string) =>
  ['Branch', 'Class', 'Division', 'Section', 'Subject', 'Department', 'Student', 'Teacher', 'Academic Year', 'Semester'].includes(entity);

const getRuleValueSources = (entity: string, field: string, operator: string): string[] => {
  if (!operator || operator === 'Is Null' || operator === 'Is Not Null') return [];
  if (entity === 'Created By (Own Records)' || field === 'created_by_user_id') return ['Logged-in User ID'];
  if (operator === 'Between') return ['Static Value'];
  return hasAssignedContext(entity) ? ["User's Assigned Context", 'Static Value'] : ['Static Value'];
};

// Dynamic context is resolved for the logged-in user against the active term's master schedule.
const ENTITY_TO_VALUE_SOURCE: Record<string, string> = {
  Branch: "User's Assigned Context",
  Class: "User's Assigned Context",
  Subject: "User's Assigned Context",
  Division: "User's Assigned Context",
  Section: "User's Assigned Context",
  Department: "User's Assigned Context",
  Student: "User's Assigned Context",
  Teacher: "User's Assigned Context",
  'Academic Year': "User's Assigned Context",
  Semester: "User's Assigned Context",
  'Created By (Own Records)': 'Logged-in User ID'
};

const SQL_VALUE_SOURCE: Record<string, string> = {
  "User's Assigned Context": ':user_assigned_context',
  'Logged-in User ID': ':logged_in_user_id'
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
      'Unfiltered institutional data visibility that bypasses scope evaluation. Reserved for the Super Admin role only.',
    rulesCount: 0,
    usedByRoles: ['Super Admin'],
    status: 'Active',
    applicableFor: ['Super Admin'],
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

const isUnaryOperator = (operator: string) => operator === 'Is Null' || operator === 'Is Not Null';

const isRuleComplete = (rule: Rule) => {
  if (!rule.entity || !rule.field || !rule.operator) return false;
  if (isUnaryOperator(rule.operator)) return true;
  if (!rule.valueSource) return false;
  return rule.valueSource !== 'Static Value' || Boolean(rule.staticValue.trim());
};

const sqlValueFor = (rule: Rule) => {
  if (rule.valueSource !== 'Static Value') return SQL_VALUE_SOURCE[rule.valueSource] || ':user_assigned_context';
  const values = rule.staticValue.split(',').map((value) => value.trim()).filter(Boolean);
  const quote = (value: string) => `'${value.replace(/'/g, "''")}'`;
  if (rule.operator === 'Between' && values.length >= 2) return `${quote(values[0])} AND ${quote(values[1])}`;
  if ((rule.operator === 'IN' || rule.operator === 'NOT IN') && values.length > 1) return `(${values.map(quote).join(', ')})`;
  return quote(values[0] || 'value');
};

const sqlForRule = (rule: Rule) => {
  const op = SQL_OPERATOR[rule.operator] || '=';
  if (isUnaryOperator(rule.operator)) return `${rule.field} ${op}`;
  return `${rule.field} ${op} ${sqlValueFor(rule)}`;
};

const buildSql = (groups: RuleGroup[]) =>
  groups
    .map((group) => group.rules.filter(isRuleComplete))
    .filter((rules) => rules.length > 0)
    .map((rules) => `(${rules.map(sqlForRule).join(' AND ')})`)
    .join('\n   OR ');

const newRule = (index: number): Rule => ({
  id: `rule-${Date.now()}-${index}`,
  entity: '',
  field: '',
  operator: '',
  valueSource: '',
  staticValue: ''
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
                    <div className="flex flex-wrap items-center gap-1.5 font-semibold text-gray-900">
                      {s.name}
                      {s.code === 'all_data' && <Badge variant="warning" className="text-[9px]">Super Admin bypass</Badge>}
                    </div>
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
                        disabled={s.code === 'all_data'}
                        className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded disabled:cursor-not-allowed disabled:text-gray-300 disabled:hover:bg-transparent"
                        title={s.code === 'all_data' ? 'All Data is a protected Super Admin escape hatch' : 'Edit'}
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
              { value: 'Advanced' as const, title: 'Advanced logic', hint: 'Build Blocks: AND within a Block, OR between Blocks.' }
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
  if (scope.code === 'all_data') return [];
  const enabledFilters = scope.filters.filter((filter) => filter.enabled);
  const filtersToBuild = enabledFilters.length ? enabledFilters : [{ entity: 'Class', source: "User's Assigned Context" } as FilterConfig];
  const makeRule = (filter: FilterConfig, index: number): Rule => {
    const entity = filter.entity;
    const field = ENTITY_FIELDS[entity]?.[0] || 'id';
    const operators = getRuleOperators(entity, field);
    const operator = entity === 'Created By (Own Records)' ? 'Equals' : operators.includes('IN') ? 'IN' : operators[0] || 'Equals';
    const valueSource = filter.source === 'Static Value'
      ? 'Static Value'
      : ENTITY_TO_VALUE_SOURCE[entity] || "User's Assigned Context";
    return { id: `r${index + 1}`, entity, field, operator, valueSource, staticValue: '' };
  };

  if (scope.logic === 'OR' && enabledFilters.length > 1) {
    return enabledFilters.map((filter, index) => ({
      id: `g${index + 1}`,
      mode: 'AND' as const,
      rules: [makeRule(filter, index)]
    }));
  }

  return [{ id: 'g1', mode: 'AND' as const, rules: filtersToBuild.map(makeRule) }];
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
  const isAllDataBypass = scope.code === 'all_data';
  const [groups, setGroups] = useState<RuleGroup[]>(() =>
    isAllDataBypass ? [] : savedRules && savedRules.length > 0 ? savedRules.map((group) => ({ ...group, mode: 'AND' as const, rules: [...group.rules] })) : initializeRulesFromFilters(scope)
  );
  const [showSql, setShowSql] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateRule = (groupId: string, ruleId: string, patch: Partial<Rule>) =>
    setGroups((previous) => previous.map((group) => {
      if (group.id !== groupId) return group;
      return {
        ...group,
        rules: group.rules.map((rule) => {
          if (rule.id !== ruleId) return rule;
          if (Object.prototype.hasOwnProperty.call(patch, 'entity')) return { ...rule, ...patch, field: '', operator: '', valueSource: '', staticValue: '' };
          if (Object.prototype.hasOwnProperty.call(patch, 'field')) return { ...rule, ...patch, operator: '', valueSource: '', staticValue: '' };
          if (Object.prototype.hasOwnProperty.call(patch, 'operator')) return { ...rule, ...patch, valueSource: '', staticValue: '' };
          if (Object.prototype.hasOwnProperty.call(patch, 'valueSource')) return { ...rule, ...patch, staticValue: patch.valueSource === 'Static Value' ? rule.staticValue : '' };
          return { ...rule, ...patch };
        })
      };
    }));

  const addRule = (groupId: string) => {
    if (isAllDataBypass) return;
    setGroups((previous) => previous.map((group) => group.id === groupId ? { ...group, rules: [...group.rules, newRule(group.rules.length + 1)] } : group));
  };
  const removeRule = (groupId: string, ruleId: string) => setGroups((previous) => previous.map((group) => group.id === groupId ? { ...group, rules: group.rules.filter((rule) => rule.id !== ruleId) } : group));
  const addGroup = () => {
    if (isAllDataBypass) return;
    setGroups((previous) => [...previous, { id: `block-${Date.now()}`, mode: 'AND' as const, rules: [newRule(1)] }]);
  };
  const removeGroup = (groupId: string) => setGroups((previous) => previous.filter((group) => group.id !== groupId));

  const sql = buildSql(groups);
  const operatorWords: Record<string, string> = {
    Equals: 'equals', 'Not Equals': 'does not equal', IN: 'is one of', 'NOT IN': 'is not one of',
    Like: 'contains', Between: 'is between', 'Is Null': 'is empty', 'Is Not Null': 'is not empty'
  };
  const describeValueSource = (rule: Rule) => {
    if (rule.valueSource === 'Static Value') return `the fixed value “${rule.staticValue || 'not entered'}”`;
    if (rule.valueSource === 'Logged-in User ID') return 'the logged-in user’s ID (own records only)';
    if (rule.valueSource === "User's Assigned Context") {
      if (rule.entity === 'Academic Year' || rule.entity === 'Semester') return 'the active academic year and semester for the current term';
      if (['Class', 'Subject', 'Division', 'Section'].includes(rule.entity)) return `the logged-in user’s ${rule.entity.toLowerCase()} assignments from the active-term master schedule`;
      return `the logged-in user’s assigned ${rule.entity.toLowerCase()} context`;
    }
    return 'the configured context value';
  };
  const plainEnglishGroups = groups.map((group, index) => ({
    id: group.id,
    number: index + 1,
    rules: group.rules.filter(isRuleComplete).map((rule) => {
      const field = `${rule.entity} (${rule.field})`;
      return isUnaryOperator(rule.operator) ? `${field} ${operatorWords[rule.operator] || rule.operator}` : `${field} ${operatorWords[rule.operator] || rule.operator} ${describeValueSource(rule)}`;
    }),
    incompleteCount: group.rules.filter((rule) => !isRuleComplete(rule)).length
  })).filter((group) => group.rules.length > 0 || group.incompleteCount > 0);

  const save = () => {
    if (isAllDataBypass) return;
    const flatRules = groups.flatMap((group) => group.rules);
    if (flatRules.length === 0) { setError('Add a complete rule before saving this scope.'); return; }
    if (groups.some((group) => group.rules.length === 0)) { setError('Remove empty Blocks or add at least one condition to each Block before saving.'); return; }
    if (flatRules.some((rule) => !isRuleComplete(rule))) { setError('Complete the Entity → Field → Operator → Value Source chain for every rule before saving.'); return; }
    if (flatRules.some((rule) => rule.operator === 'Between' && rule.staticValue.split(',').filter((value) => value.trim()).length !== 2)) { setError('“Between” needs two comma-separated static values, e.g. 10, 20.'); return; }
    onSave(groups.map((group) => ({ ...group, mode: 'AND' as const })));
  };

  return (
    <div className="space-y-6 py-6">
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
        <div>
          <button onClick={onBack} className="mb-2 flex items-center gap-2 text-xs text-gray-500 hover:text-gray-900"><ArrowLeft className="h-4 w-4" />Back to scopes</button>
          <h1 className="flex items-center gap-2 text-xl font-bold text-gray-900"><GitBranch className="h-6 w-6 text-purple-600" />Rule Builder: “{scope.name}”</h1>
          <p className="mt-1 text-xs text-gray-500">Every condition inside a Block uses AND. Separate Blocks are alternative OR paths to data.</p>
        </div>
        <Badge variant="secondary" className="border border-purple-200 bg-purple-50 text-xs text-purple-700"><Code2 className="mr-1 h-3 w-3" />{scope.code}</Badge>
      </div>

      {!isAllDataBypass && <Card className="border-indigo-200 bg-indigo-50/70 p-4"><div className="flex items-start gap-3"><Info className="mt-0.5 h-4 w-4 shrink-0 text-indigo-600" /><div className="text-xs text-indigo-950"><p className="font-semibold">Dynamic context & academic-year roll-over</p><p className="mt-1">“User’s Assigned Context” resolves from the logged-in user’s current-term master-schedule assignments. Academic Year and Semester context follows the active session automatically after roll-over, so reusable templates do not need to be rebuilt. “Static Value” is a fixed lock; “Logged-in User ID” is for own-record restrictions.</p></div></div></Card>}

      {isAllDataBypass ? (
        <>
          <Card className="overflow-hidden border-2 border-emerald-300 shadow-sm"><div className="flex items-start gap-3 bg-emerald-50 px-5 py-4"><Shield className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700" /><div><h2 className="text-sm font-bold text-emerald-950">All Data — Super Admin escape hatch</h2><p className="mt-1 text-xs leading-relaxed text-emerald-900">This protected scope bypasses the data-scope engine entirely. Super Admin users assigned to All Data can access all records; no rule blocks or filters are evaluated. Keep this scope reserved for Super Admin access.</p></div></div><div className="border-t border-emerald-200 bg-white px-5 py-4 text-xs text-slate-600">All Data contains zero rules by design. Configure restrictions on a separate scope instead of adding conditions here.</div></Card>
          <Card className="overflow-hidden border border-blue-200 shadow-sm"><div className="flex items-center gap-2 border-b border-blue-100 bg-blue-50 px-5 py-3"><Eye className="h-4 w-4 text-blue-600" /><h3 className="text-sm font-semibold text-gray-900">Plain-English Preview</h3></div><div className="p-5 text-sm leading-relaxed text-blue-950">When this scope is assigned to a Super Admin, no data filters run and all records are visible.</div></Card>
          <div className="flex justify-end"><Button variant="outline" size="sm" onClick={onCancel}>Back to scope list</Button></div>
        </>
      ) : (
        <>
          {scope.filters.filter((filter) => filter.enabled).length > 0 && <div className="flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3"><Info className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" /><div className="text-xs text-blue-900"><p className="mb-1 font-semibold">Starting context from the Scope Editor</p><div className="flex flex-wrap gap-1.5">{scope.filters.filter((filter) => filter.enabled).map((filter) => <span key={filter.id} className="inline-flex items-center gap-1 rounded-full border border-blue-300 bg-white px-2 py-0.5 text-[11px] font-medium text-blue-800">{filter.entity}<span className="text-blue-500">→ {filter.source}</span></span>)}</div><p className="mt-2 text-[11px] text-blue-700">Each rule follows Entity → Field → Operator → Value Source.</p></div></div>}

          {groups.map((group, groupIndex) => <React.Fragment key={group.id}>
            {groupIndex > 0 && <div className="flex items-center gap-3 py-1"><div className="h-px flex-1 bg-amber-300" /><div className="flex flex-col items-center gap-1"><span className="rounded-full border-2 border-amber-300 bg-amber-100 px-5 py-1.5 text-sm font-bold text-amber-800">OR</span><p className="text-[10px] font-medium text-amber-700">either Block can grant a path to matching data</p></div><div className="h-px flex-1 bg-amber-300" /></div>}
            <Card className="overflow-hidden border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50 px-5 py-3"><div className="flex items-center gap-3"><h3 className="text-sm font-semibold text-gray-900">Block {groupIndex + 1}</h3><Badge variant="info">ALL conditions · AND</Badge></div>{groups.length > 1 && <button onClick={() => removeGroup(group.id)} className="text-[11px] text-rose-600 hover:text-rose-800">Remove Block</button>}</div>
              <div className="space-y-3 p-5">{group.rules.map((rule, ruleIndex) => {
                const fields = rule.entity ? ENTITY_FIELDS[rule.entity] || [] : [];
                const operators = rule.field ? getRuleOperators(rule.entity, rule.field) : [];
                const valueSources = getRuleValueSources(rule.entity, rule.field, rule.operator);
                const noValueNeeded = isUnaryOperator(rule.operator);
                return <React.Fragment key={rule.id}>
                  {ruleIndex > 0 && <div className="flex items-center gap-2 px-1 py-0.5"><div className="h-px flex-1 bg-indigo-100" /><span className="rounded border border-indigo-200 bg-indigo-50 px-2 py-0.5 text-[10px] font-bold text-indigo-500">AND</span><div className="h-px flex-1 bg-indigo-100" /></div>}
                  <div className="rounded-lg border border-gray-200 bg-white p-3"><div className="mb-2 flex items-center justify-between"><span className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">Condition {ruleIndex + 1}</span><button onClick={() => removeRule(group.id, rule.id)} className="flex items-center gap-1 text-[11px] text-gray-400 hover:text-rose-600"><Trash2 className="h-3.5 w-3.5" />Remove</button></div>
                    <div className="grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-4">
                      <label className="block"><span className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-indigo-700">1 · Choose Entity</span><select value={rule.entity} onChange={(event) => updateRule(group.id, rule.id, { entity: event.target.value })} className="w-full rounded-md border border-gray-300 bg-white p-2 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"><option value="">Select entity…</option>{RULE_ENTITIES.map((entity) => <option key={entity} value={entity}>{entity}</option>)}</select></label>
                      <label className="block"><span className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-indigo-700">2 · Auto-Populated Field</span><select value={rule.field} disabled={!rule.entity} onChange={(event) => updateRule(group.id, rule.id, { field: event.target.value })} className="w-full rounded-md border border-gray-300 bg-white p-2 font-mono text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:bg-gray-100"><option value="">{rule.entity ? 'Select field…' : 'Choose entity first'}</option>{fields.map((field) => <option key={field} value={field}>{field}</option>)}</select>{rule.field && <span className="mt-1 block text-[10px] text-gray-400">Field type: {getRuleFieldType(rule.entity, rule.field)}</span>}</label>
                      <label className="block"><span className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-indigo-700">3 · Choose Operator</span><select value={rule.operator} disabled={!rule.field} onChange={(event) => updateRule(group.id, rule.id, { operator: event.target.value })} className="w-full rounded-md border border-gray-300 bg-white p-2 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:bg-gray-100"><option value="">{rule.field ? 'Select compatible operator…' : 'Choose field first'}</option>{operators.map((operator) => <option key={operator} value={operator}>{operator}</option>)}</select></label>
                      <label className="block"><span className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-indigo-700">4 · Choose Value Source</span><select value={rule.valueSource} disabled={!rule.operator || noValueNeeded || valueSources.length === 0} onChange={(event) => updateRule(group.id, rule.id, { valueSource: event.target.value })} className="w-full rounded-md border border-gray-300 bg-white p-2 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:bg-gray-100"><option value="">{noValueNeeded ? 'Not required for this operator' : rule.operator ? 'Select compatible source…' : 'Choose operator first'}</option>{valueSources.map((source) => <option key={source} value={source}>{source}</option>)}</select></label>
                    </div>
                    {rule.valueSource === 'Static Value' && !noValueNeeded && <div className="mt-3"><label className="block text-[11px] font-medium text-gray-600">Fixed value{rule.operator === 'Between' ? ' range' : ''}<input type="text" value={rule.staticValue} onChange={(event) => updateRule(group.id, rule.id, { staticValue: event.target.value })} placeholder={rule.operator === 'Between' ? '10, 20' : rule.operator === 'IN' || rule.operator === 'NOT IN' ? 'Value 1, Value 2' : 'Enter a fixed value'} className="mt-1 w-full rounded-md border border-gray-300 p-2 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500" /></label></div>}
                    {rule.valueSource === "User's Assigned Context" && <div className="mt-3 flex items-start gap-2 rounded-md border border-blue-100 bg-blue-50 px-3 py-2 text-[11px] text-blue-900"><Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-blue-600" /><span>{rule.entity === 'Academic Year' || rule.entity === 'Semester' ? 'Resolves to the active academic year / semester and follows term roll-over automatically.' : `Resolves to this user’s current-term ${rule.entity.toLowerCase()} assignments from the master schedule.`}</span></div>}
                    {rule.valueSource === 'Logged-in User ID' && <div className="mt-3 rounded-md border border-violet-100 bg-violet-50 px-3 py-2 text-[11px] text-violet-900">Own Records Only: match the record’s creator ID to the logged-in user ID.</div>}
                    {noValueNeeded && <div className="mt-3 rounded-md border border-gray-100 bg-gray-50 px-3 py-2 text-[11px] text-gray-500">This operator does not require a value source.</div>}
                    <p className="mt-2 break-all font-mono text-[10px] text-gray-400">{isRuleComplete(rule) ? sqlForRule(rule) : 'Complete the selection chain to build this condition.'}</p>
                  </div>
                </React.Fragment>;
              })}
                <button onClick={() => addRule(group.id)} className="w-full rounded-lg border border-dashed border-indigo-300 bg-indigo-50/50 px-3 py-2 text-xs font-semibold text-indigo-700 hover:bg-indigo-50"><Plus className="mr-1 inline h-3.5 w-3.5" />Add Condition to Block</button>
              </div>
            </Card>
          </React.Fragment>)}

          <Button variant="outline" size="sm" className="border-amber-300 text-xs text-amber-800 hover:bg-amber-50" onClick={addGroup}><Plus className="mr-1 h-3.5 w-3.5" />Add Block (OR)</Button>

          <Card className="overflow-hidden border border-blue-200 shadow-sm"><div className="flex items-center gap-2 border-b border-blue-100 bg-blue-50 px-5 py-3"><Eye className="h-4 w-4 text-blue-600" /><h3 className="text-sm font-semibold text-gray-900">Plain-English Preview</h3><span className="ml-auto text-[10px] font-medium text-blue-600">Updates as rules change</span></div><div className="space-y-3 p-5">
            <p className="text-xs text-slate-600">A record is visible when <strong>any one Block</strong> matches. <strong>Every condition inside that Block</strong> must match (AND).</p>
            {plainEnglishGroups.length === 0 ? <p className="text-xs italic text-gray-400">Complete the rule chain to see a human-readable preview.</p> : plainEnglishGroups.map((group, index) => <React.Fragment key={group.id}>{index > 0 && <div className="flex items-center gap-2"><div className="h-px flex-1 bg-amber-200" /><span className="rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700">OR — alternatively</span><div className="h-px flex-1 bg-amber-200" /></div>}<div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3"><p className="mb-2 text-xs font-bold text-emerald-900">Block {group.number} · all conditions must be true</p><ul className="list-disc space-y-1 pl-5 text-xs leading-relaxed text-emerald-950">{group.rules.map((rule, ruleIndex) => <li key={`${group.id}-${ruleIndex}`}>{rule}</li>)}</ul>{group.incompleteCount > 0 && <p className="mt-2 text-[10px] text-amber-700">{group.incompleteCount} incomplete condition(s) are not yet included in this preview.</p>}</div></React.Fragment>)}
          </div></Card>

          <Card className="overflow-hidden border border-gray-200 shadow-sm"><button onClick={() => setShowSql((value) => !value)} aria-expanded={showSql} className="flex w-full items-center justify-between border-b border-gray-100 bg-slate-50 px-5 py-3 transition-colors hover:bg-slate-100"><div className="flex items-center gap-2"><Code2 className="h-4 w-4 text-slate-600" /><h3 className="text-sm font-semibold text-gray-900">Technical SQL Preview</h3><span className="text-[10px] font-medium text-slate-400">for developers only</span></div><span className="text-[10px] font-semibold text-indigo-600">{showSql ? '▲ Hide' : '▼ Show'}</span></button>{showSql && <div className="p-5"><pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 font-mono text-[11px] leading-relaxed text-emerald-200">{sql ? `WHERE ${sql}` : '-- complete at least one rule to preview the filter'}</pre><p className="mt-2 text-[10px] text-gray-400">The preview shows the intended filter shape; production enforcement must apply the same scope at the data-access layer.</p></div>}</Card>

          {error && <div className="flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-[11px] text-rose-700"><AlertTriangle className="h-4 w-4" />{error}</div>}
          <div className="flex items-center justify-end gap-2"><Button variant="outline" size="sm" className="text-xs" onClick={onCancel}>Cancel</Button><Button size="sm" className="bg-indigo-600 text-xs text-white hover:bg-indigo-700" onClick={save}><Save className="mr-1 h-3.5 w-3.5" />Save Rules</Button></div>
        </>
      )}
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
                disabled={viewScope.code === 'all_data'}
                className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white"
                onClick={() => {
                  const s = viewScope;
                  setViewScope(null);
                  handleEdit(s);
                }}
              >
                <Pencil className="w-3.5 h-3.5 mr-1" /> {viewScope.code === 'all_data' ? 'Protected Scope' : 'Edit Scope'}
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
