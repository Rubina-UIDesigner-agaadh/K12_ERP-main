import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import {
  Search,
  FileText,
  Download,
  Calendar,
  Mail,
  Eye,
  Save,
  UserCheck,
  Briefcase,
  Award,
  LogOut,
  MoreHorizontal,
  CheckCircle,
  Clock,
  XCircle,
  Printer,
  RefreshCw,
  X,
  Edit3,
  User,
  Building,
  Hash,
  Plus,
  Upload,
  Image,
  Type,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
  Underline,
  List,
  Settings,
  Trash2,
  Copy,
  FileUp,
  FolderOpen,
  Tag,
  Info,
  ChevronDown,
  ChevronUp,
  Palette,
  Layout,
  FileSignature,
  Edit,
  Check,
  AlertCircle,
  ArrowUp,
  ArrowDown,
  AlignJustify,
  Undo2
} from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Badge } from '../../../components/ui/Badge';
import { Select } from '../../../components/ui/Select';
import { Table } from '../../../components/ui/Table';
import { Modal } from '../../../components/ui/Modal';

// ==================== TYPES ====================
interface Employee {
  id: string;
  name: string;
  code: string;
  designation: string;
  department: string;
  dateOfJoining: string;
  employmentStatus: 'Active' | 'On Notice' | 'Relieved' | 'Probation';
  employmentType: 'Permanent' | 'Contract' | 'Probation';
  email: string;
  phone: string;
  salary: string;
  reportingManager: string;
  avatar: string;
}

interface LetterTemplate {
  id: string;
  name: string;
  category: string;
  content: string;
  placeholders: string[];
  isDefault: boolean;
  isCustom?: boolean;
  isImported?: boolean;
  logoUrl?: string;
  headerText?: string;
  footerText?: string;
  createdAt?: string;
  createdBy?: string;
  groupId?: string;
  blocks?: EditorBlock[];
}

interface LetterHistory {
  id: string;
  date: string;
  letterType: string;
  templateName: string;
  generatedBy: string;
  status: 'Generated' | 'Emailed' | 'Downloaded' | 'Saved';
  employeeId: string;
  employeeName: string;
}

interface ImportedLetter {
  id: string;
  fileName: string;
  originalName: string;
  fileType: string;
  fileSize: string;
  category: string;
  purpose: string;
  description: string;
  importedAt: string;
  importedBy: string;
  status: 'Active' | 'Draft' | 'Archived';
  content: string;
  isEdited: boolean;
  groupId?: string;
}

interface CustomLetterSettings {
  logoUrl: string;
  logoPosition: 'left' | 'center' | 'right';
  schoolName: string;
  schoolAddress: string;
  schoolContact: string;
  schoolEmail: string;
  headerEnabled: boolean;
  footerEnabled: boolean;
  footerText: string;
  primaryColor: string;
  fontFamily: string;
  fontSize: string;
  marginTop: string;
  marginBottom: string;
  marginLeft: string;
  marginRight: string;
  showDate: boolean;
  showRefNumber: boolean;
  refNumberPrefix: string;
}

interface Toast {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
}

type MainTab = 'generate' | 'custom' | 'groups' | 'import' | 'history';
type LetterCategory = 'onboarding' | 'confirmation' | 'experience' | 'relieving' | 'other';

// ==================== MOCK DATA ====================
const employeesData: Employee[] = [
{
  id: '1',
  name: 'Dr. Rajesh Kumar',
  code: 'EMP001',
  designation: 'HOD - Mathematics',
  department: 'Mathematics',
  dateOfJoining: '15 Jun 2018',
  employmentStatus: 'Active',
  employmentType: 'Permanent',
  email: 'rajesh.kumar@school.edu',
  phone: '+91 98765 43210',
  salary: '₹85,000',
  reportingManager: 'Dr. Sunita Sharma',
  avatar: 'RK'
},
{
  id: '2',
  name: 'Priya Sharma',
  code: 'EMP002',
  designation: 'Senior Teacher - English',
  department: 'English',
  dateOfJoining: '01 Apr 2020',
  employmentStatus: 'Active',
  employmentType: 'Permanent',
  email: 'priya.sharma@school.edu',
  phone: '+91 98765 43211',
  salary: '₹65,000',
  reportingManager: 'Dr. Rajesh Kumar',
  avatar: 'PS'
},
{
  id: '3',
  name: 'Amit Patel',
  code: 'EMP003',
  designation: 'Science Teacher',
  department: 'Science',
  dateOfJoining: '15 Jul 2021',
  employmentStatus: 'Probation',
  employmentType: 'Probation',
  email: 'amit.patel@school.edu',
  phone: '+91 98765 43212',
  salary: '₹45,000',
  reportingManager: 'Dr. Meena Gupta',
  avatar: 'AP'
},
{
  id: '4',
  name: 'Sunita Verma',
  code: 'EMP004',
  designation: 'Administrative Assistant',
  department: 'Administration',
  dateOfJoining: '10 Jan 2019',
  employmentStatus: 'On Notice',
  employmentType: 'Permanent',
  email: 'sunita.verma@school.edu',
  phone: '+91 98765 43213',
  salary: '₹35,000',
  reportingManager: 'Mr. Vijay Singh',
  avatar: 'SV'
},
{
  id: '5',
  name: 'Rahul Mehta',
  code: 'EMP005',
  designation: 'Sports Coach',
  department: 'Physical Education',
  dateOfJoining: '01 Aug 2022',
  employmentStatus: 'Active',
  employmentType: 'Contract',
  email: 'rahul.mehta@school.edu',
  phone: '+91 98765 43214',
  salary: '₹40,000',
  reportingManager: 'Mr. Anil Kapoor',
  avatar: 'RM'
}];


const letterTemplates: LetterTemplate[] = [
{
  id: '1',
  name: 'Standard Offer Letter',
  category: 'onboarding',
  content: `Dear {{employee_name}},

We are pleased to offer you the position of {{designation}} in the {{department}} department at our institution.

Your employment will commence on {{date_of_joining}} and you will report to {{reporting_manager}}.

Your initial compensation will be {{salary}} per month.

Please confirm your acceptance of this offer by signing and returning this letter.

Welcome to our team!

Sincerely,
Human Resources Department`,
  placeholders: ['employee_name', 'designation', 'department', 'date_of_joining', 'reporting_manager', 'salary'],
  isDefault: true
},
{
  id: '2',
  name: 'Appointment Letter',
  category: 'onboarding',
  content: `APPOINTMENT LETTER

Date: {{current_date}}

Dear {{employee_name}},

With reference to your application and subsequent interview, we are pleased to appoint you as {{designation}} in our {{department}} department.

Your appointment is effective from {{date_of_joining}}.

Terms and Conditions:
1. Your monthly salary will be {{salary}}
2. You will report to {{reporting_manager}}
3. Standard working hours apply

We look forward to your contribution to our institution.

HR Department`,
  placeholders: ['current_date', 'employee_name', 'designation', 'department', 'date_of_joining', 'salary', 'reporting_manager'],
  isDefault: false
},
{
  id: '4',
  name: 'Probation Confirmation Letter',
  category: 'confirmation',
  content: `CONFIRMATION OF EMPLOYMENT

Date: {{current_date}}

Dear {{employee_name}},

We are pleased to confirm that you have successfully completed your probation period.

Your services are hereby confirmed with effect from {{confirmation_date}}.

Your designation: {{designation}}
Department: {{department}}
Confirmed Salary: {{salary}}

Congratulations on your confirmation!

HR Department`,
  placeholders: ['current_date', 'employee_name', 'confirmation_date', 'designation', 'department', 'salary'],
  isDefault: true
},
{
  id: '6',
  name: 'Standard Experience Letter',
  category: 'experience',
  content: `EXPERIENCE CERTIFICATE

Date: {{current_date}}

TO WHOM IT MAY CONCERN

This is to certify that {{employee_name}} (Employee Code: {{employee_code}}) was employed with our institution from {{date_of_joining}} to {{relieving_date}}.

During this period, they served as {{designation}} in the {{department}} department.

We found them to be hardworking, dedicated, and a valuable member of our team.

We wish them all the best in their future endeavors.

HR Department`,
  placeholders: ['current_date', 'employee_name', 'employee_code', 'date_of_joining', 'relieving_date', 'designation', 'department'],
  isDefault: true
},
{
  id: '8',
  name: 'Standard Relieving Letter',
  category: 'relieving',
  content: `RELIEVING LETTER

Date: {{current_date}}

Dear {{employee_name}},

This is to confirm that you have been relieved from your duties as {{designation}} in the {{department}} department effective {{relieving_date}}.

Your resignation submitted on {{resignation_date}} has been accepted.

All dues have been settled as per company policy.

We thank you for your services and wish you success in your future endeavors.

HR Department`,
  placeholders: ['current_date', 'employee_name', 'designation', 'department', 'relieving_date', 'resignation_date'],
  isDefault: true
},
{
  id: '10',
  name: 'Salary Certificate',
  category: 'other',
  content: `SALARY CERTIFICATE

Date: {{current_date}}

TO WHOM IT MAY CONCERN

This is to certify that {{employee_name}} ({{employee_code}}) is employed with our institution as {{designation}}.

Current Monthly Salary: {{salary}}
Annual CTC: {{annual_ctc}}

This certificate is issued upon request for {{purpose}}.

HR Department`,
  placeholders: ['current_date', 'employee_name', 'employee_code', 'designation', 'salary', 'annual_ctc', 'purpose'],
  isDefault: true
}];


const importedLettersData: ImportedLetter[] = [
{
  id: '1',
  fileName: 'transfer_letter_template.pdf',
  originalName: 'Transfer Letter - Internal.pdf',
  fileType: 'PDF',
  fileSize: '245 KB',
  category: 'other',
  purpose: 'Internal Transfer',
  description: 'Standard template for internal department transfers',
  importedAt: '10 Jan 2025',
  importedBy: 'Admin',
  status: 'Active',
  content: `INTERNAL TRANSFER LETTER

Date: [DATE]

Dear [EMPLOYEE_NAME],

This is to inform you that you have been transferred from [OLD_DEPARTMENT] to [NEW_DEPARTMENT] effective [TRANSFER_DATE].

Your new reporting manager will be [NEW_MANAGER].

All other terms and conditions remain unchanged.

HR Department`,
  isEdited: false
},
{
  id: '2',
  fileName: 'warning_letter_template.docx',
  originalName: 'Warning Letter Template.docx',
  fileType: 'DOCX',
  fileSize: '128 KB',
  category: 'other',
  purpose: 'Disciplinary Action',
  description: 'Warning letter for disciplinary issues',
  importedAt: '05 Jan 2025',
  importedBy: 'HR Manager',
  status: 'Active',
  content: `WARNING LETTER

Date: [DATE]
Reference: [REF_NUMBER]

Dear [EMPLOYEE_NAME],

This letter serves as a formal warning regarding [ISSUE_DESCRIPTION].

This behavior is unacceptable and violates company policy. Please ensure this does not happen again.

Failure to comply may result in further disciplinary action.

HR Department`,
  isEdited: true
}];


const letterHistoryData: LetterHistory[] = [
{
  id: '1',
  date: '15 Jan 2025',
  letterType: 'Experience Letter',
  templateName: 'Standard Experience Letter',
  generatedBy: 'HR Admin',
  status: 'Emailed',
  employeeId: '1',
  employeeName: 'Dr. Rajesh Kumar'
},
{
  id: '2',
  date: '10 Jan 2025',
  letterType: 'Confirmation Letter',
  templateName: 'Probation Confirmation Letter',
  generatedBy: 'HR Admin',
  status: 'Saved',
  employeeId: '3',
  employeeName: 'Amit Patel'
},
{
  id: '3',
  date: '05 Jan 2025',
  letterType: 'Offer Letter',
  templateName: 'Standard Offer Letter',
  generatedBy: 'HR Manager',
  status: 'Downloaded',
  employeeId: '5',
  employeeName: 'Rahul Mehta'
}];


// ==================== CATEGORY CONFIG ====================
const categoryTabs: {id: LetterCategory;label: string;icon: React.ElementType;}[] = [
{ id: 'onboarding', label: 'Onboarding', icon: Briefcase },
{ id: 'confirmation', label: 'Confirmation', icon: UserCheck },
{ id: 'experience', label: 'Experience', icon: Award },
{ id: 'relieving', label: 'Relieving', icon: LogOut },
{ id: 'other', label: 'Other', icon: MoreHorizontal }];


const fontFamilies = [
{ value: 'Arial', label: 'Arial' },
{ value: 'Times New Roman', label: 'Times New Roman' },
{ value: 'Georgia', label: 'Georgia' },
{ value: 'Verdana', label: 'Verdana' },
{ value: 'Calibri', label: 'Calibri' }];


const fontSizes = [
{ value: '10', label: '10px' },
{ value: '11', label: '11px' },
{ value: '12', label: '12px' },
{ value: '14', label: '14px' },
{ value: '16', label: '16px' }];


// ==================== TOAST COMPONENT ====================
const ToastContainer: React.FC<{toasts: Toast[];onDismiss: (id: string) => void;}> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  const getToastStyle = (type: Toast['type']) => {
    switch (type) {
      case 'success':return 'bg-green-50 border-green-200 text-green-800';
      case 'error':return 'bg-red-50 border-red-200 text-red-800';
      case 'warning':return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      default:return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  const getIcon = (type: Toast['type']) => {
    switch (type) {
      case 'success':return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'error':return <XCircle className="w-5 h-5 text-red-600" />;
      case 'warning':return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      default:return <Info className="w-5 h-5 text-blue-600" />;
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) =>
      <div key={toast.id} className={`flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg min-w-[300px] ${getToastStyle(toast.type)}`}>
          {getIcon(toast.type)}
          <span className="font-medium flex-1">{toast.message}</span>
          <button onClick={() => onDismiss(toast.id)} className="hover:opacity-70">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>);

};

// ==================== MAIN TAB COMPONENT ====================
const MainTabs: React.FC<{
  activeTab: MainTab;
  onTabChange: (tab: MainTab) => void;
  counts: {templates: number;imported: number;history: number;};
}> = ({ activeTab, onTabChange, counts }) => {
  const tabs = [
  { id: 'generate' as MainTab, label: 'Generate Letters', icon: FileText, count: counts.templates },
  { id: 'custom' as MainTab, label: 'Custom Letter', icon: Edit3 },
  { id: 'groups' as MainTab, label: 'Letter Groups', icon: FolderOpen },
  { id: 'import' as MainTab, label: 'Import Letters', icon: Upload, count: counts.imported },
  { id: 'history' as MainTab, label: 'History', icon: Clock, count: counts.history }];


  return (
    <div className="border-b border-gray-200 bg-white rounded-t-lg">
      <nav className="flex -mb-px overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`group inline-flex items-center gap-2 px-6 py-4 border-b-2 font-medium text-sm whitespace-nowrap transition-all ${
              isActive ?
              'border-blue-500 text-blue-600 bg-blue-50/50' :
              'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50'}`
              }>

              <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
              {tab.label}
              {tab.count !== undefined &&
              <Badge variant={isActive ? 'primary' : 'secondary'} className="text-xs">
                  {tab.count}
                </Badge>
              }
            </button>);

        })}
      </nav>
    </div>);

};

// ==================== MAIN COMPONENT ====================
// ==================== LETTER EDITOR & GROUP HELPERS ====================
type EditorKind = 'heading' | 'paragraph' | 'bullets' | 'table' | 'image' | 'divider' | 'signature' | 'date' | 'field' | 'spacer' | 'pagebreak';

interface EditorBlock {
  id: string;
  kind: EditorKind;
  text: string;
  items: string[];
  rows: string[][];
  imageSrc: string;
  imageWidth: number;
  align: 'left' | 'center' | 'right' | 'justify';
  fontFamily: string;
  fontSize: number;
  color: string;
  bold: boolean;
  italic: boolean;
  underline: boolean;
  size: number;
  dateFormat: 'long' | 'short';
  fieldKey: string;
}

interface LetterGroup {
  id: string;
  name: string;
  description: string;
}

const PAGE_SIZES: Record<string, { label: string; width: number; height: number }> = {
  A4: { label: 'A4 (210 × 297 mm)', width: 210, height: 297 },
  Letter: { label: 'Letter (216 × 279 mm)', width: 216, height: 279 },
  Legal: { label: 'Legal (216 × 356 mm)', width: 216, height: 356 },
  A5: { label: 'A5 (148 × 210 mm)', width: 148, height: 210 }
};
const MM_TO_PX = 96 / 25.4;
const ZOOM_OPTIONS = [50, 75, 100, 125, 150];
const EDITOR_SELECT = 'px-2 py-1 border border-gray-300 rounded-lg text-sm bg-white';
const INSERT_ITEMS: { kind: EditorKind; label: string }[] = [
  { kind: 'heading', label: 'Heading' },
  { kind: 'paragraph', label: 'Paragraph' },
  { kind: 'bullets', label: 'Bulleted list' },
  { kind: 'table', label: 'Table' },
  { kind: 'image', label: 'Image' },
  { kind: 'divider', label: 'Divider line' },
  { kind: 'signature', label: 'Signature block' },
  { kind: 'date', label: 'Date' },
  { kind: 'field', label: 'Dynamic field' },
  { kind: 'spacer', label: 'Spacer' },
  { kind: 'pagebreak', label: 'Page break' }
];
const DYNAMIC_FIELDS: { key: string; label: string }[] = [
  { key: 'employee_name', label: 'Employee name' },
  { key: 'designation', label: 'Designation' },
  { key: 'department', label: 'Department' },
  { key: 'employee_code', label: 'Employee code' },
  { key: 'joining_date', label: 'Date of joining' }
];
const FIELD_VALUE_KEYS: Record<string, keyof Employee> = {
  employee_name: 'name',
  designation: 'designation',
  department: 'department',
  employee_code: 'code',
  joining_date: 'dateOfJoining'
};
const INITIAL_GROUPS: LetterGroup[] = [
  { id: 'grp-joining', name: 'Joining & Onboarding', description: 'Appointment, joining and induction letters' },
  { id: 'grp-confirmation', name: 'Confirmation & Probation', description: 'Confirmation, probation extension and review letters' },
  { id: 'grp-service', name: 'Service & Experience', description: 'Experience, salary and service certificates' },
  { id: 'grp-separation', name: 'Separation & Relieving', description: 'Relieving, resignation acceptance and exit letters' }
];

let editorBlockCounter = 0;
const createBlock = (kind: EditorKind): EditorBlock => {
  editorBlockCounter += 1;
  return {
    id: `blk-${Date.now()}-${editorBlockCounter}`,
    kind,
    text: kind === 'heading' ? 'Heading' : kind === 'signature' ? 'Authorised Signatory' : kind === 'paragraph' ? 'Type your text here.' : '',
    items: kind === 'bullets' ? ['First point', 'Second point'] : [],
    rows: kind === 'table' ? [['Item', 'Details'], ['', ''], ['', '']] : [],
    imageSrc: '',
    imageWidth: 40,
    align: 'left',
    fontFamily: '',
    fontSize: kind === 'heading' ? 18 : 12,
    color: '#111827',
    bold: kind === 'heading',
    italic: false,
    underline: false,
    size: kind === 'divider' ? 1 : kind === 'spacer' ? 8 : 0,
    dateFormat: 'long',
    fieldKey: 'employee_name'
  };
};

const blocksToText = (blocks: EditorBlock[]): string =>
  blocks
    .map((block) => {
      switch (block.kind) {
        case 'heading':
        case 'paragraph':
          return block.text;
        case 'bullets':
          return block.items.map((item) => `• ${item}`).join('\n');
        case 'table':
          return block.rows.map((row) => row.join(' | ')).join('\n');
        case 'field':
          return `{{${block.fieldKey}}}`;
        case 'date':
          return '{{date}}';
        case 'signature':
          return `${'_'.repeat(20)}\n${block.text}`;
        case 'image':
          return block.imageSrc ? '[Image]' : '';
        default:
          return '';
      }
    })
    .filter((part) => part.trim() !== '')
    .join('\n\n');

const textToBlocks = (content: string): EditorBlock[] =>
  content
    .split(/\n\s*\n/)
    .filter((part) => part.trim() !== '')
    .map((part) => {
      const block = createBlock('paragraph');
      block.text = part.trim();
      return block;
    });

const resolveField = (key: string, employee: Employee | null): string => {
  const field = FIELD_VALUE_KEYS[key];
  if (employee && field) return String(employee[field] ?? '');
  return `[${DYNAMIC_FIELDS.find((item) => item.key === key)?.label ?? key}]`;
};

const formatLetterDate = (format: 'long' | 'short'): string =>
  new Date().toLocaleDateString('en-GB', format === 'long'
    ? { day: '2-digit', month: 'long', year: 'numeric' }
    : { day: '2-digit', month: '2-digit', year: 'numeric' });

// Contenteditable text that keeps the caret in place while the value is edited
const EditableText: React.FC<{
  value: string;
  style: React.CSSProperties;
  onChange: (value: string) => void;
  onFocus: () => void;
}> = ({ value, style, onChange, onFocus }) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const current = (el as HTMLElement).innerText ?? el.textContent ?? '';
    if (current !== value) el.textContent = value;
  }, [value]);
  return (
    <div
      ref={ref}
      contentEditable
      suppressContentEditableWarning
      style={style}
      onFocus={onFocus}
      onInput={(event) => {
        const el = event.currentTarget as HTMLElement;
        onChange(el.innerText ?? el.textContent ?? '');
      }} />
  );
};

export function LetterGenerationSystem() {
  // Main Tab State
  const [activeMainTab, setActiveMainTab] = useState<MainTab>('generate');

  // Employee Selection State
  const [searchTerm, setSearchTerm] = useState('');
  const [showEmployeeDropdown, setShowEmployeeDropdown] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  // Letter Selection State
  const [activeCategory, setActiveCategory] = useState<LetterCategory>('onboarding');
  const [selectedTemplate, setSelectedTemplate] = useState<LetterTemplate | null>(null);
  const [templates, setTemplates] = useState<LetterTemplate[]>(letterTemplates);

  // Additional Fields State
  const [additionalFields, setAdditionalFields] = useState<Record<string, string>>({});

  // Letter History State
  const [letterHistory, setLetterHistory] = useState<LetterHistory[]>(letterHistoryData);

  // Imported Letters State
  const [importedLetters, setImportedLetters] = useState<ImportedLetter[]>(importedLettersData);
  const [selectedImportedLetter, setSelectedImportedLetter] = useState<ImportedLetter | null>(null);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showEditImportedModal, setShowEditImportedModal] = useState(false);

  // Import Form State
  const [importForm, setImportForm] = useState({
    file: null as File | null,
    fileName: '',
    category: '',
    purpose: '',
    description: '',
    content: '',
    groupId: ''
  });

  // Custom Letter State
  const [customLetterSettings, setCustomLetterSettings] = useState<CustomLetterSettings>({
    logoUrl: '',
    logoPosition: 'center',
    schoolName: 'Delhi Public School',
    schoolAddress: '123 Education Street, New Delhi - 110001',
    schoolContact: '+91 11 2345 6789',
    schoolEmail: 'info@dps.edu.in',
    headerEnabled: true,
    footerEnabled: true,
    footerText: 'This is a computer-generated document. No signature required.',
    primaryColor: '#1e40af',
    fontFamily: 'Arial',
    fontSize: '12',
    marginTop: '20',
    marginBottom: '20',
    marginLeft: '25',
    marginRight: '25',
    showDate: true,
    showRefNumber: true,
    refNumberPrefix: 'HR/LTR/'
  });

  const [customBlocks, setCustomBlocks] = useState<EditorBlock[]>([]);
  const [customSelectedId, setCustomSelectedId] = useState<string | null>(null);
  const [customUndo, setCustomUndo] = useState<EditorBlock[][]>([]);
  const [customPageSize, setCustomPageSize] = useState('A4');
  const [customOrientation, setCustomOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [customZoom, setCustomZoom] = useState(100);
  const [customPreviewMode, setCustomPreviewMode] = useState(false);
  const [customGroupId, setCustomGroupId] = useState('');
  const [editingTemplateId, setEditingTemplateId] = useState<string | null>(null);
  const [editorImageError, setEditorImageError] = useState('');
  const editorImageRef = useRef<HTMLInputElement>(null);
  const customLetterContent = useMemo(() => blocksToText(customBlocks), [customBlocks]);
  const [letterGroups, setLetterGroups] = useState<LetterGroup[]>(INITIAL_GROUPS);
  const [groupForm, setGroupForm] = useState({ name: '', description: '' });
  const [groupError, setGroupError] = useState('');
  const [customLetterTitle, setCustomLetterTitle] = useState('');
  const [customLetterCategory, setCustomLetterCategory] = useState<LetterCategory>('other');
  const [showSettingsPanel, setShowSettingsPanel] = useState(false);

  // Modal State
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailAddress, setEmailAddress] = useState('');

  // Loading State
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Toast State
  const [toasts, setToasts] = useState<Toast[]>([]);

  // File Input Ref
  const fileInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  // ==================== HELPERS ====================
  const addToast = useCallback((type: Toast['type'], message: string) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 5000);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Filter employees
  const filteredEmployees = useMemo(() => {
    if (!searchTerm) return employeesData;
    const term = searchTerm.toLowerCase();
    return employeesData.filter(
      (emp) =>
      emp.name.toLowerCase().includes(term) ||
      emp.code.toLowerCase().includes(term) ||
      emp.phone.includes(term)
    );
  }, [searchTerm]);

  // Filter templates by category
  const filteredTemplates = useMemo(() => {
    return templates.filter((t) => t.category === activeCategory);
  }, [templates, activeCategory]);

  // Generate content with placeholders
  const generatedContent = useMemo(() => {
    if (!selectedTemplate || !selectedEmployee) return '';
    let content = selectedTemplate.content;
    const replacements: Record<string, string> = {
      employee_name: selectedEmployee.name,
      employee_code: selectedEmployee.code,
      designation: selectedEmployee.designation,
      department: selectedEmployee.department,
      date_of_joining: selectedEmployee.dateOfJoining,
      salary: selectedEmployee.salary,
      reporting_manager: selectedEmployee.reportingManager,
      employment_status: selectedEmployee.employmentStatus,
      current_date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      ...additionalFields
    };
    Object.entries(replacements).forEach(([key, value]) => {
      content = content.replace(new RegExp(`{{${key}}}`, 'g'), value || `[${key}]`);
    });
    return content;
  }, [selectedTemplate, selectedEmployee, additionalFields]);

  // Missing placeholders
  const missingPlaceholders = useMemo(() => {
    if (!selectedTemplate) return [];
    const employeeFields = ['employee_name', 'employee_code', 'designation', 'department', 'date_of_joining', 'salary', 'reporting_manager', 'employment_status', 'current_date'];
    return selectedTemplate.placeholders.filter((p) => !employeeFields.includes(p) && !additionalFields[p]);
  }, [selectedTemplate, additionalFields]);

  // ==================== HANDLERS ====================
  const handleEmployeeSelect = (employee: Employee) => {
    setSelectedEmployee(employee);
    setShowEmployeeDropdown(false);
    setSearchTerm('');
    setEmailAddress(employee.email);
    addToast('info', `Selected: ${employee.name}`);
  };

  const handleCategoryChange = (category: LetterCategory) => {
    setActiveCategory(category);
    setSelectedTemplate(null);
  };

  const handleTemplateSelect = (templateId: string) => {
    const template = templates.find((t) => t.id === templateId);
    setSelectedTemplate(template || null);
  };

  const handlePreview = () => {
    if (!selectedEmployee) {
      addToast('error', 'Please select an employee first');
      return;
    }
    if (!selectedTemplate) {
      addToast('error', 'Please select a letter template');
      return;
    }
    setShowPreviewModal(true);
  };

  const handleGeneratePDF = () => {
    if (!selectedEmployee || !selectedTemplate) {
      addToast('error', 'Please select employee and template');
      return;
    }
    setIsGenerating(true);
    setTimeout(() => {
      const newHistory: LetterHistory = {
        id: Date.now().toString(),
        date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        letterType: categoryTabs.find((c) => c.id === activeCategory)?.label || 'Letter',
        templateName: selectedTemplate.name,
        generatedBy: 'Current User',
        status: 'Generated',
        employeeId: selectedEmployee.id,
        employeeName: selectedEmployee.name
      };
      setLetterHistory((prev) => [newHistory, ...prev]);
      setIsGenerating(false);
      addToast('success', 'PDF generated successfully');
    }, 1500);
  };

  const handleDownload = () => {
    if (!selectedEmployee || !selectedTemplate) {
      addToast('error', 'Please select employee and template');
      return;
    }
    setIsGenerating(true);
    setTimeout(() => {
      const blob = new Blob([generatedContent], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${selectedTemplate.name.replace(/\s+/g, '_')}_${selectedEmployee.code}.txt`;
      a.click();
      window.URL.revokeObjectURL(url);

      const newHistory: LetterHistory = {
        id: Date.now().toString(),
        date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        letterType: categoryTabs.find((c) => c.id === activeCategory)?.label || 'Letter',
        templateName: selectedTemplate.name,
        generatedBy: 'Current User',
        status: 'Downloaded',
        employeeId: selectedEmployee.id,
        employeeName: selectedEmployee.name
      };
      setLetterHistory((prev) => [newHistory, ...prev]);
      setIsGenerating(false);
      addToast('success', 'Letter downloaded successfully');
    }, 1000);
  };

  const handleSendEmail = () => {
    if (!selectedEmployee || !selectedTemplate) {
      addToast('error', 'Please select employee and template');
      return;
    }
    setShowEmailModal(true);
  };

  const confirmSendEmail = () => {
    if (!emailAddress) {
      addToast('error', 'Please enter email address');
      return;
    }
    setIsSending(true);
    setTimeout(() => {
      const newHistory: LetterHistory = {
        id: Date.now().toString(),
        date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        letterType: categoryTabs.find((c) => c.id === activeCategory)?.label || 'Letter',
        templateName: selectedTemplate!.name,
        generatedBy: 'Current User',
        status: 'Emailed',
        employeeId: selectedEmployee!.id,
        employeeName: selectedEmployee!.name
      };
      setLetterHistory((prev) => [newHistory, ...prev]);
      setIsSending(false);
      setShowEmailModal(false);
      addToast('success', `Email sent to ${emailAddress}`);
    }, 2000);
  };

  const handleSaveToDocuments = () => {
    if (!selectedEmployee || !selectedTemplate) {
      addToast('error', 'Please select employee and template');
      return;
    }
    setIsGenerating(true);
    setTimeout(() => {
      const newHistory: LetterHistory = {
        id: Date.now().toString(),
        date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        letterType: categoryTabs.find((c) => c.id === activeCategory)?.label || 'Letter',
        templateName: selectedTemplate.name,
        generatedBy: 'Current User',
        status: 'Saved',
        employeeId: selectedEmployee.id,
        employeeName: selectedEmployee.name
      };
      setLetterHistory((prev) => [newHistory, ...prev]);
      setIsGenerating(false);
      addToast('success', 'Letter saved to employee documents');
    }, 1000);
  };

  const handleReset = () => {
    setSelectedEmployee(null);
    setSelectedTemplate(null);
    setAdditionalFields({});
    setSearchTerm('');
    addToast('info', 'Form reset successfully');
  };

  // Custom Letter Handlers
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCustomLetterSettings((prev) => ({
          ...prev,
          logoUrl: event.target?.result as string
        }));
        addToast('success', 'Logo uploaded successfully');
      };
      reader.readAsDataURL(file);
    }
  };

  const selectedBlock = customBlocks.find((block) => block.id === customSelectedId) ?? null;
  const pageDims = PAGE_SIZES[customPageSize] ?? PAGE_SIZES.A4;
  const pageWidthPx = Math.round((customOrientation === 'portrait' ? pageDims.width : pageDims.height) * MM_TO_PX);
  const pageHeightPx = Math.round((customOrientation === 'portrait' ? pageDims.height : pageDims.width) * MM_TO_PX);
  const zoomFactor = customZoom / 100;
  const groupableLetters = [
    ...templates.filter((item) => item.isCustom).map((item) => ({
      key: `custom-${item.id}`,
      kind: 'custom' as const,
      id: item.id,
      title: item.name,
      category: item.category,
      date: item.createdAt ?? '',
      status: 'Saved',
      groupId: item.groupId,
      template: item
    })),
    ...importedLetters.map((item) => ({
      key: `imported-${item.id}`,
      kind: 'imported' as const,
      id: item.id,
      title: item.originalName,
      category: item.category,
      date: item.importedAt,
      status: item.status,
      groupId: item.groupId,
      template: undefined as LetterTemplate | undefined
    }))
  ];

  const commitEditor = (next: EditorBlock[]) => {
    setCustomUndo((prev) => [...prev.slice(-29), customBlocks]);
    setCustomBlocks(next);
  };
  const updateBlock = (id: string, patch: Partial<EditorBlock>) =>
    setCustomBlocks((prev) => prev.map((block) => (block.id === id ? { ...block, ...patch } : block)));
  const updateBlockCommitted = (id: string, patch: Partial<EditorBlock>) =>
    commitEditor(customBlocks.map((block) => (block.id === id ? { ...block, ...patch } : block)));
  const insertBlock = (kind: EditorKind) => {
    const block = createBlock(kind);
    const index = customSelectedId ? customBlocks.findIndex((item) => item.id === customSelectedId) : -1;
    const next = [...customBlocks];
    next.splice(index >= 0 ? index + 1 : next.length, 0, block);
    commitEditor(next);
    setCustomSelectedId(block.id);
  };
  const moveBlock = (id: string, direction: -1 | 1) => {
    const index = customBlocks.findIndex((item) => item.id === id);
    const target = index + direction;
    if (index < 0 || target < 0 || target >= customBlocks.length) return;
    const next = [...customBlocks];
    [next[index], next[target]] = [next[target], next[index]];
    commitEditor(next);
  };
  const duplicateBlock = (id: string) => {
    const index = customBlocks.findIndex((item) => item.id === id);
    if (index < 0) return;
    const copy: EditorBlock = { ...customBlocks[index], id: createBlock('paragraph').id };
    const next = [...customBlocks];
    next.splice(index + 1, 0, copy);
    commitEditor(next);
    setCustomSelectedId(copy.id);
  };
  const deleteBlock = (id: string) => {
    commitEditor(customBlocks.filter((item) => item.id !== id));
    setCustomSelectedId(null);
  };
  const undoEditor = () => {
    const previous = customUndo[customUndo.length - 1];
    if (!previous) return;
    setCustomUndo((prev) => prev.slice(0, -1));
    setCustomBlocks(previous);
    setCustomSelectedId(null);
  };
  const handleEditorImage = (id: string, file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setEditorImageError('Choose an image file (PNG, JPG, SVG or WebP).');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setEditorImageError('The image must be 2 MB or smaller.');
      return;
    }
    setEditorImageError('');
    const reader = new FileReader();
    reader.onload = () => updateBlock(id, { imageSrc: String(reader.result) });
    reader.readAsDataURL(file);
  };
  const resetEditor = () => {
    setCustomBlocks([]);
    setCustomUndo([]);
    setCustomSelectedId(null);
    setCustomGroupId('');
    setCustomLetterTitle('');
    setEditingTemplateId(null);
    setEditorImageError('');
  };

  const handleSaveCustomLetter = () => {
    if (!customLetterTitle.trim()) {
      addToast('error', 'Please enter a letter title');
      return;
    }
    if (!customGroupId) {
      addToast('error', 'Choose the letter group to save this letter in');
      return;
    }
    if (customBlocks.length === 0 || !customLetterContent.trim()) {
      addToast('error', 'Add at least one element to the letter');
      return;
    }
    setIsSaving(true);
    setTimeout(() => {
      const record: LetterTemplate = {
        id: editingTemplateId ?? Date.now().toString(),
        name: customLetterTitle.trim(),
        category: customLetterCategory,
        content: customLetterContent,
        placeholders: DYNAMIC_FIELDS.filter((field) => customBlocks.some((block) => block.kind === 'field' && block.fieldKey === field.key)).map((field) => field.key),
        isDefault: false,
        isCustom: true,
        groupId: customGroupId,
        blocks: customBlocks,
        logoUrl: customLetterSettings.logoUrl,
        headerText: customLetterSettings.schoolName,
        footerText: customLetterSettings.footerText,
        createdAt: new Date().toLocaleDateString('en-GB'),
        createdBy: 'Current User'
      };
      setTemplates((prev) => (editingTemplateId
        ? prev.map((item) => (item.id === editingTemplateId ? record : item))
        : [...prev, record]));
      setIsSaving(false);
      addToast('success', editingTemplateId ? 'Letter updated in its group' : 'Letter saved to its group');
      resetEditor();
    }, 800);
  };

  const openTemplateInEditor = (template: LetterTemplate) => {
    setCustomBlocks(template.blocks ?? textToBlocks(template.content));
    setCustomUndo([]);
    setCustomSelectedId(null);
    setCustomLetterTitle(template.name);
    setCustomLetterCategory((template.category as LetterCategory) || 'other');
    setCustomGroupId(template.groupId ?? '');
    setEditingTemplateId(template.id);
    setCustomPreviewMode(false);
    setActiveMainTab('custom');
  };

  const createGroup = () => {
    const name = groupForm.name.trim();
    if (!name) {
      setGroupError('Enter a group name.');
      return;
    }
    if (letterGroups.some((group) => group.name.toLowerCase() === name.toLowerCase())) {
      setGroupError('A group with this name already exists.');
      return;
    }
    setLetterGroups((prev) => [...prev, { id: `grp-${Date.now()}`, name, description: groupForm.description.trim() }]);
    setGroupForm({ name: '', description: '' });
    setGroupError('');
    addToast('success', `Group "${name}" created`);
  };

  const deleteGroup = (groupId: string) => {
    setLetterGroups((prev) => prev.filter((group) => group.id !== groupId));
    setTemplates((prev) => prev.map((item) => (item.groupId === groupId ? { ...item, groupId: undefined } : item)));
    setImportedLetters((prev) => prev.map((item) => (item.groupId === groupId ? { ...item, groupId: undefined } : item)));
    addToast('info', 'Group deleted. Its letters are now ungrouped.');
  };

  const moveLetterToGroup = (letter: { kind: 'custom' | 'imported'; id: string }, groupId: string) => {
    if (letter.kind === 'custom') {
      setTemplates((prev) => prev.map((item) => (item.id === letter.id ? { ...item, groupId: groupId || undefined } : item)));
    } else {
      setImportedLetters((prev) => prev.map((item) => (item.id === letter.id ? { ...item, groupId: groupId || undefined } : item)));
    }
  };

  const renderEditorBlock = (block: EditorBlock, editable: boolean): React.ReactNode => {
    const textStyle: React.CSSProperties = {
      textAlign: block.align,
      fontFamily: block.fontFamily || undefined,
      fontSize: block.fontSize,
      color: block.color,
      fontWeight: block.bold ? 700 : 400,
      fontStyle: block.italic ? 'italic' : 'normal',
      textDecoration: block.underline ? 'underline' : 'none',
      margin: '0 0 8px',
      lineHeight: 1.5,
      whiteSpace: 'pre-wrap',
      minHeight: '1.5em'
    };
    switch (block.kind) {
      case 'heading':
      case 'paragraph':
        return editable
          ? <EditableText value={block.text} style={textStyle} onChange={(value) => updateBlock(block.id, { text: value })} onFocus={() => setCustomSelectedId(block.id)} />
          : <div style={textStyle}>{block.text}</div>;
      case 'bullets':
        return (
          <ul style={{ ...textStyle, paddingLeft: 22, listStyle: 'disc' }}>
            {block.items.map((item, index) => <li key={`${block.id}-${index}`}>{item}</li>)}
          </ul>
        );
      case 'table':
        return (
          <table className="w-full border-collapse" style={{ fontFamily: block.fontFamily || undefined, fontSize: block.fontSize, color: block.color, margin: '0 0 8px' }}>
            <tbody>
              {block.rows.map((row, rowIndex) => (
                <tr key={`${block.id}-${rowIndex}`}>
                  {row.map((cell, cellIndex) => (
                    <td key={`${block.id}-${rowIndex}-${cellIndex}`} className="border border-gray-400 px-2 py-1" style={{ fontWeight: rowIndex === 0 ? 700 : 400 }}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        );
      case 'image':
        return (
          <div style={{ textAlign: block.align, margin: '0 0 8px' }}>
            {block.imageSrc
              ? <img src={block.imageSrc} alt="Letter element" style={{ width: `${block.imageWidth}%`, display: 'inline-block' }} />
              : <div className="inline-flex items-center justify-center border border-dashed border-gray-400 text-xs text-gray-400 p-3" style={{ width: `${block.imageWidth}%`, minHeight: 80 }}>Choose a picture in the properties panel</div>}
          </div>
        );
      case 'divider':
        return <hr style={{ border: 'none', borderTop: `${block.size || 1}px solid ${block.color}`, margin: '10px 0' }} />;
      case 'signature':
        return (
          <div style={{ ...textStyle, marginTop: 28 }}>
            <div style={{ width: 220, borderTop: '1px solid #111827', paddingTop: 4 }}>{block.text}</div>
          </div>
        );
      case 'date':
        return <div style={textStyle}>{formatLetterDate(block.dateFormat)}</div>;
      case 'field':
        return (
          <div style={textStyle}>
            <span style={{ background: editable ? '#eef2ff' : 'transparent', color: editable ? '#3730a3' : block.color, borderRadius: 4, padding: editable ? '0 4px' : 0 }}>
              {editable ? `{{${block.fieldKey}}}` : resolveField(block.fieldKey, selectedEmployee ?? employeesData[0] ?? null)}
            </span>
          </div>
        );
      case 'spacer':
        return <div style={{ height: `${block.size}mm` }} />;
      case 'pagebreak':
        return editable
          ? <div className="my-2 border-t-2 border-dashed border-gray-300 text-center text-[10px] uppercase tracking-wide text-gray-400">Page break</div>
          : <div style={{ breakAfter: 'page' }} />;
      default:
        return null;
    }
  };

  const renderLetterRows = (letters: typeof groupableLetters) => {
    if (letters.length === 0) {
      return <p className="p-4 text-sm text-gray-500">No letters here yet. Save a custom letter or import a file and choose this group.</p>;
    }
    return (
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-gray-200 bg-gray-50">
              {['Letter', 'Type', 'Category', 'Date', 'Status', 'Move to group', 'Actions'].map((head) => (
                <th key={head} className="text-left py-2 px-3 text-xs font-semibold text-gray-600 uppercase whitespace-nowrap">{head}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {letters.map((letter) => (
              <tr key={letter.key} className="border-b border-gray-100">
                <td className="py-2 px-3 text-sm font-medium text-gray-900">{letter.title}</td>
                <td className="py-2 px-3"><Badge variant={letter.kind === 'custom' ? 'primary' : 'info'}>{letter.kind === 'custom' ? 'Custom' : 'Imported'}</Badge></td>
                <td className="py-2 px-3 text-sm text-gray-700 capitalize">{letter.category}</td>
                <td className="py-2 px-3 text-sm text-gray-700 whitespace-nowrap">{letter.date}</td>
                <td className="py-2 px-3 text-sm text-gray-700">{letter.status}</td>
                <td className="py-2 px-3">
                  <select
                    aria-label={`Move ${letter.title} to group`}
                    value={letter.groupId ?? ''}
                    onChange={(e) => moveLetterToGroup({ kind: letter.kind, id: letter.id }, e.target.value)}
                    className={EDITOR_SELECT}>
                    <option value="">Ungrouped</option>
                    {letterGroups.map((group) => <option key={group.id} value={group.id}>{group.name}</option>)}
                  </select>
                </td>
                <td className="py-2 px-3">
                  {letter.template && (
                    <Button size="sm" variant="outline" onClick={() => letter.template && openTemplateInEditor(letter.template)}>Open in editor</Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  // Import Handlers
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImportForm((prev) => ({
          ...prev,
          file,
          fileName: file.name,
          content: event.target?.result as string || `[Content of ${file.name}]`
        }));
      };
      reader.readAsText(file);
    }
  };

  const handleImportLetter = () => {
    if (!importForm.fileName || !importForm.category || !importForm.purpose || !importForm.groupId) {
      addToast('error', 'Please fill in all required fields');
      return;
    }

    setIsSaving(true);
    setTimeout(() => {
      const newImport: ImportedLetter = {
        id: Date.now().toString(),
        fileName: importForm.fileName.replace(/\s+/g, '_').toLowerCase(),
        originalName: importForm.fileName,
        fileType: importForm.fileName.split('.').pop()?.toUpperCase() || 'TXT',
        fileSize: importForm.file ? `${Math.round(importForm.file.size / 1024)} KB` : '0 KB',
        category: importForm.category,
        purpose: importForm.purpose,
        description: importForm.description,
        importedAt: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        importedBy: 'Current User',
        status: 'Active',
        content: importForm.content || `[Content of ${importForm.fileName}]`,
        isEdited: false,
        groupId: importForm.groupId || undefined
      };
      setImportedLetters((prev) => [newImport, ...prev]);
      setImportForm({ file: null, fileName: '', category: '', purpose: '', description: '', content: '', groupId: '' });
      setShowImportModal(false);
      setIsSaving(false);
      addToast('success', 'Letter imported successfully');
    }, 1500);
  };

  const handleEditImportedLetter = () => {
    if (!selectedImportedLetter) return;

    setIsSaving(true);
    setTimeout(() => {
      setImportedLetters((prev) =>
      prev.map((letter) =>
      letter.id === selectedImportedLetter.id ?
      { ...selectedImportedLetter, isEdited: true } :
      letter
      )
      );
      setShowEditImportedModal(false);
      setSelectedImportedLetter(null);
      setIsSaving(false);
      addToast('success', 'Letter updated successfully');
    }, 1000);
  };

  const handleDeleteImportedLetter = (id: string) => {
    setImportedLetters((prev) => prev.filter((letter) => letter.id !== id));
    addToast('success', 'Letter deleted successfully');
  };

  const handleConvertToTemplate = (letter: ImportedLetter) => {
    const newTemplate: LetterTemplate = {
      id: Date.now().toString(),
      name: letter.purpose,
      category: letter.category,
      content: letter.content,
      placeholders: [],
      isDefault: false,
      isImported: true,
      createdAt: new Date().toLocaleDateString('en-GB'),
      createdBy: 'Current User'
    };
    setTemplates((prev) => [...prev, newTemplate]);
    addToast('success', 'Letter converted to template successfully');
  };

  // History columns
  const historyColumns = [
  {
    key: 'date',
    header: 'Date',
    render: (row: LetterHistory) =>
    <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span className="text-sm font-medium text-gray-900">{row.date}</span>
        </div>

  },
  {
    key: 'employeeName',
    header: 'Employee',
    render: (row: LetterHistory) =>
    <div>
          <p className="font-medium text-gray-900">{row.employeeName}</p>
          <p className="text-xs text-gray-500">{row.employeeId}</p>
        </div>

  },
  {
    key: 'letterType',
    header: 'Letter Type',
    render: (row: LetterHistory) =>
    <div>
          <p className="font-medium text-gray-900">{row.letterType}</p>
          <p className="text-xs text-gray-500">{row.templateName}</p>
        </div>

  },
  {
    key: 'generatedBy',
    header: 'Generated By',
    render: (row: LetterHistory) => <span className="text-sm text-gray-700">{row.generatedBy}</span>
  },
  {
    key: 'status',
    header: 'Status',
    render: (row: LetterHistory) => {
      const config = {
        Generated: { variant: 'secondary' as const, icon: FileText },
        Downloaded: { variant: 'primary' as const, icon: Download },
        Emailed: { variant: 'success' as const, icon: Mail },
        Saved: { variant: 'warning' as const, icon: Save }
      }[row.status];
      const Icon = config.icon;
      return (
        <Badge variant={config.variant} className="flex items-center gap-1 w-fit">
            <Icon className="w-3 h-3" />
            {row.status}
          </Badge>);

    }
  },
  {
    key: 'actions',
    header: 'Actions',
    render: () =>
    <Button variant="ghost" size="sm">
          <Download className="w-4 h-4" />
        </Button>

  }];


  // Imported letters columns
  const importedColumns = [
  {
    key: 'fileName',
    header: 'File Name',
    render: (row: ImportedLetter) =>
    <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <FileText className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="font-medium text-gray-900">{row.originalName}</p>
            <p className="text-xs text-gray-500">{row.fileType} • {row.fileSize}</p>
          </div>
        </div>

  },
  {
    key: 'category',
    header: 'Category',
    render: (row: ImportedLetter) =>
    <Badge variant="secondary" className="capitalize">
          {row.category}
        </Badge>

  },
  {
    key: 'purpose',
    header: 'Purpose',
    render: (row: ImportedLetter) =>
    <div>
          <p className="font-medium text-gray-900">{row.purpose}</p>
          <p className="text-xs text-gray-500 line-clamp-1">{row.description}</p>
        </div>

  },
  {
    key: 'importedAt',
    header: 'Imported',
    render: (row: ImportedLetter) =>
    <div>
          <p className="text-sm text-gray-900">{row.importedAt}</p>
          <p className="text-xs text-gray-500">By {row.importedBy}</p>
        </div>

  },
  {
    key: 'status',
    header: 'Status',
    render: (row: ImportedLetter) =>
    <div className="flex items-center gap-2">
          <Badge variant={row.status === 'Active' ? 'success' : row.status === 'Draft' ? 'warning' : 'secondary'}>
            {row.status}
          </Badge>
          {row.isEdited &&
      <Badge variant="primary" className="text-xs">Edited</Badge>
      }
        </div>

  },
  {
    key: 'actions',
    header: 'Actions',
    render: (row: ImportedLetter) =>
    <div className="flex gap-1">
          <Button
        variant="ghost"
        size="sm"
        onClick={() => {
          setSelectedImportedLetter(row);
          setShowEditImportedModal(true);
        }}
        title="Edit">

            <Edit className="w-4 h-4" />
          </Button>
          <Button
        variant="ghost"
        size="sm"
        onClick={() => handleConvertToTemplate(row)}
        title="Convert to Template">

            <Copy className="w-4 h-4" />
          </Button>
          <Button
        variant="ghost"
        size="sm"
        onClick={() => handleDeleteImportedLetter(row.id)}
        title="Delete">

            <Trash2 className="w-4 h-4 text-red-500" />
          </Button>
        </div>

  }];


  // ==================== RENDER ====================
  return (
    <div className="space-y-6">
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Letter Generation System</h1>
          <p className="text-sm text-gray-500">Generate, customize, import, and manage official letters</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleReset} leftIcon={<RefreshCw className="w-4 h-4" />}>
            Reset
          </Button>
        </div>
      </div>

      {/* Main Tabs */}
      <Card className="p-0 overflow-hidden">
        <MainTabs
          activeTab={activeMainTab}
          onTabChange={setActiveMainTab}
          counts={{
            templates: templates.length,
            imported: importedLetters.length,
            history: letterHistory.length
          }} />


        <div className="p-6">
          {/* ==================== GENERATE LETTERS TAB ==================== */}
          {activeMainTab === 'generate' &&
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column */}
              <div className="lg:col-span-1 space-y-6">
                {/* Employee Selection */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <User className="w-5 h-5 text-blue-600" />
                    Select Employee
                  </h3>
                  <div className="relative">
                    <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
                    <Input
                    placeholder="Search by Name, ID or Phone..."
                    className="pl-9"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setShowEmployeeDropdown(true);
                    }}
                    onFocus={() => setShowEmployeeDropdown(true)} />

                    {showEmployeeDropdown && searchTerm &&
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        {filteredEmployees.length > 0 ?
                    filteredEmployees.map((emp) =>
                    <button
                      key={emp.id}
                      type="button"
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 border-b border-gray-100 last:border-0"
                      onClick={() => handleEmployeeSelect(emp)}>

                              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-sm font-semibold text-blue-600">
                                {emp.avatar}
                              </div>
                              <div className="flex-1">
                                <p className="font-medium text-gray-900">{emp.name}</p>
                                <p className="text-xs text-gray-500">{emp.code} • {emp.designation}</p>
                              </div>
                            </button>
                    ) :

                    <div className="px-4 py-3 text-sm text-gray-500">No employees found</div>
                    }
                      </div>
                  }
                  </div>

                  {selectedEmployee ?
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-600">
                          {selectedEmployee.avatar}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{selectedEmployee.name}</h4>
                          <p className="text-sm text-gray-500">{selectedEmployee.code}</p>
                        </div>
                        <button onClick={() => setSelectedEmployee(null)} className="p-1 hover:bg-gray-200 rounded">
                          <X className="w-4 h-4 text-gray-500" />
                        </button>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Designation:</span>
                          <span className="font-medium">{selectedEmployee.designation}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Department:</span>
                          <span className="font-medium">{selectedEmployee.department}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Joined:</span>
                          <span className="font-medium">{selectedEmployee.dateOfJoining}</span>
                        </div>
                      </div>
                    </div> :

                <div className="bg-gray-50 rounded-lg p-6 border border-dashed border-gray-300 text-center">
                      <User className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">Search and select an employee</p>
                    </div>
                }
                </div>

                {/* Letter Type */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                    Letter Type
                  </h3>
                  <div className="space-y-2">
                    {categoryTabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeCategory === tab.id;
                    const count = templates.filter((t) => t.category === tab.id).length;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => handleCategoryChange(tab.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${
                        isActive ?
                        'bg-blue-50 border-2 border-blue-500 text-blue-700' :
                        'bg-gray-50 border-2 border-transparent hover:bg-gray-100 text-gray-700'}`
                        }>

                          <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
                          <span className="flex-1 font-medium">{tab.label}</span>
                          <Badge variant={isActive ? 'primary' : 'secondary'}>{count}</Badge>
                        </button>);

                  })}
                  </div>
                </div>

                {/* Template Selection */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <Edit3 className="w-5 h-5 text-blue-600" />
                    Select Template
                  </h3>
                  <Select
                  value={selectedTemplate?.id || ''}
                  onChange={handleTemplateSelect}
                  options={[
                  { value: '', label: 'Choose a template...' },
                  ...filteredTemplates.map((t) => ({
                    value: t.id,
                    label: t.name + (t.isDefault ? ' (Default)' : t.isCustom ? ' (Custom)' : '')
                  }))]
                  } />

                  {selectedTemplate &&
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-sm font-medium text-green-800">{selectedTemplate.name}</p>
                      <p className="text-xs text-green-600 mt-1">
                        {selectedTemplate.placeholders.length} placeholders
                      </p>
                    </div>
                }
                </div>
              </div>

              {/* Right Column */}
              <div className="lg:col-span-2 space-y-6">
                {/* Additional Fields */}
                {selectedTemplate && missingPlaceholders.length > 0 &&
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm font-medium text-yellow-800 mb-3">Fill in additional fields:</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {missingPlaceholders.map((placeholder) =>
                  <div key={placeholder}>
                          <label className="block text-xs font-medium text-gray-700 mb-1 capitalize">
                            {placeholder.replace(/_/g, ' ')}
                          </label>
                          <Input
                      type={placeholder.includes('date') ? 'date' : 'text'}
                      value={additionalFields[placeholder] || ''}
                      onChange={(e) => setAdditionalFields((prev) => ({ ...prev, [placeholder]: e.target.value }))}
                      placeholder={`Enter ${placeholder.replace(/_/g, ' ')}`} />

                        </div>
                  )}
                    </div>
                  </div>
              }

                {/* Preview */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <Eye className="w-5 h-5 text-blue-600" />
                    Letter Preview
                  </h3>
                  {selectedEmployee && selectedTemplate ?
                <div className="bg-white border border-gray-200 rounded-lg p-6 min-h-[300px] font-mono text-sm whitespace-pre-wrap">
                      {generatedContent}
                    </div> :

                <div className="bg-gray-50 border border-dashed border-gray-300 rounded-lg p-12 text-center min-h-[300px] flex flex-col items-center justify-center">
                      <FileText className="w-12 h-12 text-gray-300 mb-4" />
                      <p className="text-gray-500 font-medium">Letter Preview</p>
                      <p className="text-sm text-gray-400 mt-1">Select an employee and template</p>
                    </div>
                }
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-3">
                  <Button variant="outline" onClick={handlePreview} disabled={!selectedEmployee || !selectedTemplate} leftIcon={<Eye className="w-4 h-4" />}>
                    Preview
                  </Button>
                  <Button variant="outline" onClick={handleGeneratePDF} disabled={!selectedEmployee || !selectedTemplate || isGenerating} leftIcon={<FileText className="w-4 h-4" />}>
                    {isGenerating ? 'Generating...' : 'Generate PDF'}
                  </Button>
                  <Button variant="primary" onClick={handleDownload} disabled={!selectedEmployee || !selectedTemplate || isGenerating} leftIcon={<Download className="w-4 h-4" />}>
                    Download
                  </Button>
                  <Button variant="outline" onClick={handleSendEmail} disabled={!selectedEmployee || !selectedTemplate} leftIcon={<Mail className="w-4 h-4" />}>
                    Email
                  </Button>
                  <Button variant="outline" onClick={handleSaveToDocuments} disabled={!selectedEmployee || !selectedTemplate || isGenerating} leftIcon={<Save className="w-4 h-4" />}>
                    Save
                  </Button>
                  <Button variant="ghost" onClick={handlePreview} disabled={!selectedEmployee || !selectedTemplate} leftIcon={<Printer className="w-4 h-4" />}>
                    Print
                  </Button>
                </div>
              </div>
            </div>
          }

          {/* ==================== CUSTOM LETTER TAB ==================== */}
          {activeMainTab === 'custom' &&
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left - Settings */}
              <div className="lg:col-span-1 space-y-6">
                {/* Logo Upload */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <Image className="w-5 h-5 text-blue-600" />
                    School Logo
                  </h3>
                  <div className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
                    {customLetterSettings.logoUrl ?
                  <div className="relative">
                        <img src={customLetterSettings.logoUrl} alt="Logo" className="max-h-24 max-w-full object-contain" />
                        <button
                      onClick={() => setCustomLetterSettings((prev) => ({ ...prev, logoUrl: '' }))}
                      className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full">

                          <X className="w-3 h-3" />
                        </button>
                      </div> :

                  <div className="text-center">
                        <Upload className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                        <p className="text-sm text-gray-500 mb-2">Upload school logo</p>
                      </div>
                  }
                    <input ref={logoInputRef} type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                    <Button variant="outline" size="sm" onClick={() => logoInputRef.current?.click()} className="mt-2">
                      {customLetterSettings.logoUrl ? 'Change Logo' : 'Upload Logo'}
                    </Button>
                  </div>
                  <Select
                  label="Logo Position"
                  value={customLetterSettings.logoPosition}
                  onChange={(val) => setCustomLetterSettings((prev) => ({ ...prev, logoPosition: val as any }))}
                  options={[
                  { value: 'left', label: 'Left' },
                  { value: 'center', label: 'Center' },
                  { value: 'right', label: 'Right' }]
                  } />

                </div>

                {/* School Details */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <Building className="w-5 h-5 text-blue-600" />
                    School Details
                  </h3>
                  <Input
                  label="School Name"
                  value={customLetterSettings.schoolName}
                  onChange={(e) => setCustomLetterSettings((prev) => ({ ...prev, schoolName: e.target.value }))} />

                  <Input
                  label="Address"
                  value={customLetterSettings.schoolAddress}
                  onChange={(e) => setCustomLetterSettings((prev) => ({ ...prev, schoolAddress: e.target.value }))} />

                  <div className="grid grid-cols-2 gap-3">
                    <Input
                    label="Contact"
                    value={customLetterSettings.schoolContact}
                    onChange={(e) => setCustomLetterSettings((prev) => ({ ...prev, schoolContact: e.target.value }))} />

                    <Input
                    label="Email"
                    value={customLetterSettings.schoolEmail}
                    onChange={(e) => setCustomLetterSettings((prev) => ({ ...prev, schoolEmail: e.target.value }))} />

                  </div>
                </div>

                {/* Format Settings */}
                <div className="space-y-4">
                  <button
                  onClick={() => setShowSettingsPanel(!showSettingsPanel)}
                  className="w-full flex items-center justify-between font-semibold text-gray-900">

                    <span className="flex items-center gap-2">
                      <Settings className="w-5 h-5 text-blue-600" />
                      Format Settings
                    </span>
                    {showSettingsPanel ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                  {showSettingsPanel &&
                <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
                      <div className="grid grid-cols-2 gap-3">
                        <Select
                      label="Font"
                      value={customLetterSettings.fontFamily}
                      onChange={(val) => setCustomLetterSettings((prev) => ({ ...prev, fontFamily: val }))}
                      options={fontFamilies} />

                        <Select
                      label="Size"
                      value={customLetterSettings.fontSize}
                      onChange={(val) => setCustomLetterSettings((prev) => ({ ...prev, fontSize: val }))}
                      options={fontSizes} />

                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Primary Color</label>
                        <div className="flex gap-2">
                          <input
                        type="color"
                        value={customLetterSettings.primaryColor}
                        onChange={(e) => setCustomLetterSettings((prev) => ({ ...prev, primaryColor: e.target.value }))}
                        className="w-10 h-10 rounded border border-gray-300 cursor-pointer" />

                          <Input
                        value={customLetterSettings.primaryColor}
                        onChange={(e) => setCustomLetterSettings((prev) => ({ ...prev, primaryColor: e.target.value }))}
                        className="flex-1" />

                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <Input
                      label="Margin Top (mm)"
                      type="number"
                      value={customLetterSettings.marginTop}
                      onChange={(e) => setCustomLetterSettings((prev) => ({ ...prev, marginTop: e.target.value }))} />

                        <Input
                      label="Margin Bottom (mm)"
                      type="number"
                      value={customLetterSettings.marginBottom}
                      onChange={(e) => setCustomLetterSettings((prev) => ({ ...prev, marginBottom: e.target.value }))} />

                      </div>
                      <label className="flex items-center gap-2">
                        <input
                      type="checkbox"
                      checked={customLetterSettings.headerEnabled}
                      onChange={(e) => setCustomLetterSettings((prev) => ({ ...prev, headerEnabled: e.target.checked }))}
                      className="w-4 h-4 text-blue-600 rounded" />

                        <span className="text-sm text-gray-700">Show Header</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                      type="checkbox"
                      checked={customLetterSettings.footerEnabled}
                      onChange={(e) => setCustomLetterSettings((prev) => ({ ...prev, footerEnabled: e.target.checked }))}
                      className="w-4 h-4 text-blue-600 rounded" />

                        <span className="text-sm text-gray-700">Show Footer</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                      type="checkbox"
                      checked={customLetterSettings.showDate}
                      onChange={(e) => setCustomLetterSettings((prev) => ({ ...prev, showDate: e.target.checked }))}
                      className="w-4 h-4 text-blue-600 rounded" />

                        <span className="text-sm text-gray-700">Show Date</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                      type="checkbox"
                      checked={customLetterSettings.showRefNumber}
                      onChange={(e) => setCustomLetterSettings((prev) => ({ ...prev, showRefNumber: e.target.checked }))}
                      className="w-4 h-4 text-blue-600 rounded" />

                        <span className="text-sm text-gray-700">Show Reference Number</span>
                      </label>
                      {customLetterSettings.showRefNumber &&
                  <Input
                    label="Reference Prefix"
                    value={customLetterSettings.refNumberPrefix}
                    onChange={(e) => setCustomLetterSettings((prev) => ({ ...prev, refNumberPrefix: e.target.value }))} />

                  }
                    </div>
                }
                </div>
              </div>

              {/* Right - Editor */}
              <div className="lg:col-span-2 space-y-6">
                {/* Letter Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input
                  label="Letter Title"
                  placeholder="e.g., Transfer Letter"
                  value={customLetterTitle}
                  onChange={(e) => setCustomLetterTitle(e.target.value)} />

                  <Select
                  label="Category"
                  value={customLetterCategory}
                  onChange={(val) => setCustomLetterCategory(val as LetterCategory)}
                  options={categoryTabs.map((c) => ({ value: c.id, label: c.label }))} />

                  <Select
                  label="Save to group *"
                  value={customGroupId}
                  onChange={(val) => setCustomGroupId(val)}
                  options={[{ value: '', label: 'Select a group...' }, ...letterGroups.map((group) => ({ value: group.id, label: group.name }))]} />

                </div>

                {/* Editor toolbar: page setup, text styles and history */}
                <div className="flex flex-wrap items-center gap-2 p-2 bg-gray-100 rounded-lg border border-gray-200">
                  <select aria-label="Page size" value={customPageSize} onChange={(e) => setCustomPageSize(e.target.value)} className={EDITOR_SELECT}>
                    {Object.entries(PAGE_SIZES).map(([key, size]) => (
                      <option key={key} value={key}>{size.label}</option>
                    ))}
                  </select>
                  <select aria-label="Orientation" value={customOrientation} onChange={(e) => setCustomOrientation(e.target.value as 'portrait' | 'landscape')} className={EDITOR_SELECT}>
                    <option value="portrait">Portrait</option>
                    <option value="landscape">Landscape</option>
                  </select>
                  <select aria-label="Zoom" value={customZoom} onChange={(e) => setCustomZoom(Number(e.target.value))} className={EDITOR_SELECT}>
                    {ZOOM_OPTIONS.map((zoom) => (
                      <option key={zoom} value={zoom}>{zoom}%</option>
                    ))}
                  </select>
                  <div className="w-px h-6 bg-gray-300 mx-1" />
                  <button type="button" title="Undo" aria-label="Undo" onClick={undoEditor} disabled={customUndo.length === 0} className="p-2 rounded hover:bg-gray-200 disabled:opacity-40">
                    <Undo2 className="w-4 h-4" />
                  </button>
                  <button type="button" title="Bold" aria-label="Bold" aria-pressed={!!selectedBlock?.bold} disabled={!selectedBlock} onClick={() => selectedBlock && updateBlockCommitted(selectedBlock.id, { bold: !selectedBlock.bold })} className={`p-2 rounded hover:bg-gray-200 disabled:opacity-40 ${selectedBlock?.bold ? 'bg-white shadow-inner' : ''}`}>
                    <Bold className="w-4 h-4" />
                  </button>
                  <button type="button" title="Italic" aria-label="Italic" aria-pressed={!!selectedBlock?.italic} disabled={!selectedBlock} onClick={() => selectedBlock && updateBlockCommitted(selectedBlock.id, { italic: !selectedBlock.italic })} className={`p-2 rounded hover:bg-gray-200 disabled:opacity-40 ${selectedBlock?.italic ? 'bg-white shadow-inner' : ''}`}>
                    <Italic className="w-4 h-4" />
                  </button>
                  <button type="button" title="Underline" aria-label="Underline" aria-pressed={!!selectedBlock?.underline} disabled={!selectedBlock} onClick={() => selectedBlock && updateBlockCommitted(selectedBlock.id, { underline: !selectedBlock.underline })} className={`p-2 rounded hover:bg-gray-200 disabled:opacity-40 ${selectedBlock?.underline ? 'bg-white shadow-inner' : ''}`}>
                    <Underline className="w-4 h-4" />
                  </button>
                  <div className="w-px h-6 bg-gray-300 mx-1" />
                  {([
                    { value: 'left', icon: AlignLeft, title: 'Align left' },
                    { value: 'center', icon: AlignCenter, title: 'Align centre' },
                    { value: 'right', icon: AlignRight, title: 'Align right' },
                    { value: 'justify', icon: AlignJustify, title: 'Justify' }
                  ] as { value: EditorBlock['align']; icon: React.ElementType; title: string }[]).map((option) => {
                    const AlignIcon = option.icon;
                    return (
                      <button
                        key={option.value}
                        type="button"
                        title={option.title}
                        aria-label={option.title}
                        disabled={!selectedBlock}
                        onClick={() => selectedBlock && updateBlockCommitted(selectedBlock.id, { align: option.value })}
                        className={`p-2 rounded hover:bg-gray-200 disabled:opacity-40 ${selectedBlock?.align === option.value ? 'bg-white shadow-inner' : ''}`}>
                        <AlignIcon className="w-4 h-4" />
                      </button>
                    );
                  })}
                  <div className="flex-1" />
                  <Badge variant="secondary" className="self-center">Use {"{{field}}"} for dynamic fields</Badge>
                </div>

                {/* Insert elements */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-medium text-gray-500 mr-1">Insert:</span>
                  {INSERT_ITEMS.map((item) => (
                    <button
                      key={item.kind}
                      type="button"
                      onClick={() => insertBlock(item.kind)}
                      disabled={customPreviewMode}
                      className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg bg-white hover:bg-indigo-50 hover:border-indigo-200 disabled:opacity-40">
                      + {item.label}
                    </button>
                  ))}
                </div>

                {/* Page canvas and element properties */}
                <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_300px] gap-4 items-start">
                  <div className="bg-gray-100 rounded-lg p-4 overflow-auto max-h-[780px]">
                    <div style={{ width: pageWidthPx * zoomFactor, minHeight: pageHeightPx * zoomFactor, margin: '0 auto' }}>
                      <div
                        onClick={() => setCustomSelectedId(null)}
                        className="bg-white shadow-lg"
                        style={{
                          width: pageWidthPx,
                          minHeight: pageHeightPx,
                          transform: `scale(${zoomFactor})`,
                          transformOrigin: 'top left',
                          padding: `${customLetterSettings.marginTop}mm ${customLetterSettings.marginRight}mm ${customLetterSettings.marginBottom}mm ${customLetterSettings.marginLeft}mm`,
                          boxSizing: 'border-box',
                          fontFamily: customLetterSettings.fontFamily,
                          fontSize: `${customLetterSettings.fontSize}px`,
                          color: '#111827'
                        }}>
                        {customLetterSettings.headerEnabled && (
                          <div className="flex items-center gap-3 border-b pb-3 mb-4" style={{ justifyContent: customLetterSettings.logoPosition === 'center' ? 'center' : customLetterSettings.logoPosition === 'right' ? 'flex-end' : 'flex-start' }}>
                            {customLetterSettings.logoUrl && <img src={customLetterSettings.logoUrl} alt="School logo" className="h-12 w-auto" />}
                            <div style={{ textAlign: customLetterSettings.logoPosition === 'center' ? 'center' : 'left' }}>
                              <p className="font-bold" style={{ color: customLetterSettings.primaryColor }}>{customLetterSettings.schoolName}</p>
                              <p className="text-xs text-gray-600">{customLetterSettings.schoolAddress}</p>
                              <p className="text-xs text-gray-600">{customLetterSettings.schoolContact} · {customLetterSettings.schoolEmail}</p>
                            </div>
                          </div>
                        )}
                        {customLetterSettings.showDate && (
                          <p className="text-right text-sm text-gray-600 mb-4">Date: {formatLetterDate('long')}</p>
                        )}
                        {customLetterSettings.showRefNumber && (
                          <p className="text-sm text-gray-600 mb-4">Ref: {customLetterSettings.refNumberPrefix}{Date.now().toString().slice(-6)}</p>
                        )}
                        {customBlocks.map((block) => {
                          const isSelected = !customPreviewMode && customSelectedId === block.id;
                          return (
                            <div
                              key={block.id}
                              onClick={(event) => {
                                if (customPreviewMode) return;
                                event.stopPropagation();
                                setCustomSelectedId(block.id);
                              }}
                              className={`relative rounded-sm ${customPreviewMode ? '' : isSelected ? 'ring-2 ring-indigo-500 ring-offset-2' : 'hover:ring-1 hover:ring-indigo-300 hover:ring-offset-2'}`}>
                              {renderEditorBlock(block, !customPreviewMode)}
                            </div>
                          );
                        })}
                        {customBlocks.length === 0 && (
                          <p className="text-sm text-gray-400 italic">Empty page. Use Insert above to add a heading, paragraph, table, image, signature or dynamic field.</p>
                        )}
                        {customLetterSettings.footerEnabled && (
                          <div className="mt-6 border-t pt-2 text-center text-xs text-gray-500">{customLetterSettings.footerText}</div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg border border-gray-200 bg-white p-4 space-y-3 xl:sticky xl:top-4">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="font-semibold text-gray-900 flex items-center gap-2"><Settings className="w-4 h-4" />Element properties</h4>
                      {selectedBlock && <Badge variant="secondary">{INSERT_ITEMS.find((item) => item.kind === selectedBlock.kind)?.label}</Badge>}
                    </div>
                    {customPreviewMode ? (
                      <p className="text-sm text-gray-500">Preview mode. Use Back to editing to change elements.</p>
                    ) : !selectedBlock ? (
                      <p className="text-sm text-gray-500">Click an element on the page to edit it. Insert elements with the buttons above.</p>
                    ) : (
                      <div className="space-y-3">
                        {['heading', 'paragraph', 'bullets', 'signature', 'date', 'field'].includes(selectedBlock.kind) && (
                          <div className="grid grid-cols-2 gap-2">
                            <div className="col-span-2">
                              <label className="block text-xs font-medium text-gray-600 mb-1">Font family</label>
                              <select value={selectedBlock.fontFamily} onChange={(e) => updateBlock(selectedBlock.id, { fontFamily: e.target.value })} className={`w-full ${EDITOR_SELECT}`}>
                                <option value="">Page default</option>
                                {fontFamilies.map((font) => <option key={font.value} value={font.value}>{font.label}</option>)}
                              </select>
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">Size (px)</label>
                              <input type="number" min={8} max={36} value={selectedBlock.fontSize} onChange={(e) => updateBlock(selectedBlock.id, { fontSize: Math.min(36, Math.max(8, Number(e.target.value) || 8)) })} className={`w-full ${EDITOR_SELECT}`} />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">Colour</label>
                              <input type="color" value={selectedBlock.color} onChange={(e) => updateBlock(selectedBlock.id, { color: e.target.value })} className="w-full h-8 border border-gray-300 rounded-lg bg-white p-1" />
                            </div>
                          </div>
                        )}

                        {(selectedBlock.kind === 'heading' || selectedBlock.kind === 'paragraph') && (
                          <textarea rows={4} value={selectedBlock.text} onChange={(e) => updateBlock(selectedBlock.id, { text: e.target.value })} className={`w-full ${EDITOR_SELECT}`} />
                        )}
                        {selectedBlock.kind === 'bullets' && (
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">One point per line</label>
                            <textarea rows={5} value={selectedBlock.items.join('\n')} onChange={(e) => updateBlock(selectedBlock.id, { items: e.target.value.split('\n') })} className={`w-full ${EDITOR_SELECT}`} />
                          </div>
                        )}
                        {selectedBlock.kind === 'signature' && (
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Signatory label</label>
                            <input type="text" value={selectedBlock.text} onChange={(e) => updateBlock(selectedBlock.id, { text: e.target.value })} className={`w-full ${EDITOR_SELECT}`} />
                          </div>
                        )}
                        {selectedBlock.kind === 'date' && (
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Date format</label>
                            <select value={selectedBlock.dateFormat} onChange={(e) => updateBlock(selectedBlock.id, { dateFormat: e.target.value as 'long' | 'short' })} className={`w-full ${EDITOR_SELECT}`}>
                              <option value="long">Long (09 October 2026)</option>
                              <option value="short">Short (09/10/2026)</option>
                            </select>
                          </div>
                        )}
                        {selectedBlock.kind === 'field' && (
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Dynamic field</label>
                            <select value={selectedBlock.fieldKey} onChange={(e) => updateBlock(selectedBlock.id, { fieldKey: e.target.value })} className={`w-full ${EDITOR_SELECT}`}>
                              {DYNAMIC_FIELDS.map((field) => <option key={field.key} value={field.key}>{field.label}</option>)}
                            </select>
                          </div>
                        )}
                        {selectedBlock.kind === 'table' && (
                          <div className="space-y-2">
                            <div className="overflow-x-auto">
                              <table className="w-full">
                                <tbody>
                                  {selectedBlock.rows.map((row, rowIndex) => (
                                    <tr key={rowIndex}>
                                      {row.map((cell, cellIndex) => (
                                        <td key={cellIndex} className="p-0.5">
                                          <input
                                            aria-label={`Row ${rowIndex + 1}, column ${cellIndex + 1}`}
                                            value={cell}
                                            onChange={(e) => updateBlock(selectedBlock.id, {
                                              rows: selectedBlock.rows.map((item, r) => item.map((value, c) => (r === rowIndex && c === cellIndex ? e.target.value : value)))
                                            })}
                                            className="w-full px-1.5 py-1 border border-gray-300 rounded text-xs" />
                                        </td>
                                      ))}
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              <Button size="sm" variant="outline" onClick={() => updateBlockCommitted(selectedBlock.id, { rows: [...selectedBlock.rows, selectedBlock.rows[0].map(() => '')] })}>+ Row</Button>
                              <Button size="sm" variant="outline" onClick={() => updateBlockCommitted(selectedBlock.id, { rows: selectedBlock.rows.map((row) => [...row, '']) })}>+ Column</Button>
                              <Button size="sm" variant="outline" disabled={selectedBlock.rows.length <= 1} onClick={() => updateBlockCommitted(selectedBlock.id, { rows: selectedBlock.rows.slice(0, -1) })}>− Row</Button>
                              <Button size="sm" variant="outline" disabled={selectedBlock.rows[0].length <= 1} onClick={() => updateBlockCommitted(selectedBlock.id, { rows: selectedBlock.rows.map((row) => row.slice(0, -1)) })}>− Column</Button>
                            </div>
                          </div>
                        )}
                        {selectedBlock.kind === 'image' && (
                          <div className="space-y-2">
                            <input
                              ref={editorImageRef}
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                handleEditorImage(selectedBlock.id, e.target.files?.[0]);
                                e.target.value = '';
                              }} />
                            <Button size="sm" variant="outline" leftIcon={<Upload className="w-4 h-4" />} onClick={() => editorImageRef.current?.click()}>
                              {selectedBlock.imageSrc ? 'Replace picture' : 'Upload picture'}
                            </Button>
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">Width ({selectedBlock.imageWidth}% of the text area)</label>
                              <input type="range" min={10} max={100} value={selectedBlock.imageWidth} onChange={(e) => updateBlock(selectedBlock.id, { imageWidth: Number(e.target.value) })} className="w-full" />
                            </div>
                            {editorImageError && <p className="text-xs text-red-600">{editorImageError}</p>}
                            <p className="text-[11px] text-gray-500">PNG, JPG, SVG or WebP up to 2 MB. Align it with the toolbar.</p>
                          </div>
                        )}
                        {selectedBlock.kind === 'divider' && (
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Thickness (px)</label>
                            <input type="number" min={1} max={8} value={selectedBlock.size} onChange={(e) => updateBlock(selectedBlock.id, { size: Math.min(8, Math.max(1, Number(e.target.value) || 1)) })} className={`w-full ${EDITOR_SELECT}`} />
                          </div>
                        )}
                        {selectedBlock.kind === 'spacer' && (
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Height (mm)</label>
                            <input type="number" min={2} max={40} value={selectedBlock.size} onChange={(e) => updateBlock(selectedBlock.id, { size: Math.min(40, Math.max(2, Number(e.target.value) || 2)) })} className={`w-full ${EDITOR_SELECT}`} />
                          </div>
                        )}
                        {selectedBlock.kind === 'pagebreak' && (
                          <p className="text-sm text-gray-500">Content after this element starts on a new printed page.</p>
                        )}

                        <div className="grid grid-cols-2 gap-2 pt-3 border-t border-gray-200">
                          <Button size="sm" variant="outline" leftIcon={<ArrowUp className="w-3.5 h-3.5" />} onClick={() => moveBlock(selectedBlock.id, -1)}>Move up</Button>
                          <Button size="sm" variant="outline" leftIcon={<ArrowDown className="w-3.5 h-3.5" />} onClick={() => moveBlock(selectedBlock.id, 1)}>Move down</Button>
                          <Button size="sm" variant="outline" leftIcon={<Copy className="w-3.5 h-3.5" />} onClick={() => duplicateBlock(selectedBlock.id)}>Duplicate</Button>
                          <Button size="sm" variant="danger" leftIcon={<Trash2 className="w-3.5 h-3.5" />} onClick={() => deleteBlock(selectedBlock.id)}>Delete</Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-3 justify-end">
                  <Button variant="outline" onClick={resetEditor}>
                    Clear
                  </Button>
                  <Button variant="outline" leftIcon={<Eye className="w-4 h-4" />} onClick={() => { setCustomPreviewMode((value) => !value); setCustomSelectedId(null); }}>
                    {customPreviewMode ? 'Back to editing' : 'Preview'}
                  </Button>
                  <Button
                  variant="primary"
                  onClick={handleSaveCustomLetter}
                  disabled={!customLetterTitle || !customGroupId || customBlocks.length === 0 || isSaving}
                  leftIcon={<Save className="w-4 h-4" />}>
                    {isSaving ? 'Saving...' : editingTemplateId ? 'Update Letter' : 'Save to Group'}
                  </Button>
                </div>
              </div>
            </div>
          }

          {/* ==================== LETTER GROUPS TAB ==================== */}
          {activeMainTab === 'groups' && (
            <div className="space-y-6">
              <div className="rounded-lg border border-gray-200 p-4 space-y-3">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2"><FolderOpen className="w-4 h-4" />Create a letter group</h3>
                <p className="text-sm text-gray-500">Groups hold letter types. Imported letters and custom letters are saved inside a group.</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
                  <Input
                  label="Group name *"
                  placeholder="e.g., Transfer and Posting"
                  value={groupForm.name}
                  onChange={(e) => setGroupForm((prev) => ({ ...prev, name: e.target.value }))} />
                  <Input
                  label="Description"
                  placeholder="Which letters belong here"
                  value={groupForm.description}
                  onChange={(e) => setGroupForm((prev) => ({ ...prev, description: e.target.value }))} />
                  <Button variant="primary" onClick={createGroup} leftIcon={<Plus className="w-4 h-4" />}>Create group</Button>
                </div>
                {groupError && <p className="text-sm text-red-600">{groupError}</p>}
              </div>

              {letterGroups.map((group) => {
                const members = groupableLetters.filter((letter) => letter.groupId === group.id);
                return (
                  <div key={group.id} className="rounded-lg border border-gray-200 overflow-hidden">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 p-4 bg-gray-50 border-b border-gray-200">
                      <div>
                        <h3 className="font-semibold text-gray-900">{group.name}</h3>
                        <p className="text-sm text-gray-500">{group.description || 'No description'} · {members.length} letter(s)</p>
                      </div>
                      <Button size="sm" variant="outline" onClick={() => deleteGroup(group.id)} leftIcon={<Trash2 className="w-4 h-4" />}>Delete group</Button>
                    </div>
                    {renderLetterRows(members)}
                  </div>
                );
              })}

              <div className="rounded-lg border border-dashed border-gray-300 overflow-hidden">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-900">Ungrouped letters</h3>
                  <p className="text-sm text-gray-500">Choose a group in the Move to group column to file these letters.</p>
                </div>
                {renderLetterRows(groupableLetters.filter((letter) => !letter.groupId))}
              </div>
            </div>
          )}

          {/* ==================== IMPORT LETTERS TAB ==================== */}
          {activeMainTab === 'import' &&
          <div className="space-y-6">
              {/* Import Button */}
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-gray-900">Imported Letters</h3>
                  <p className="text-sm text-gray-500">Import existing letters and convert them to templates</p>
                </div>
                <Button variant="primary" onClick={() => setShowImportModal(true)} leftIcon={<Plus className="w-4 h-4" />}>
                  Import Letter
                </Button>
              </div>

              {/* Import Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-900">Import Your Existing Letters</h4>
                    <p className="text-sm text-blue-800 mt-1">
                      Upload letters your school has already created. Supported formats: PDF, DOCX, DOC, TXT.
                      You can edit imported letters and convert them to reusable templates.
                    </p>
                  </div>
                </div>
              </div>

              {/* Imported Letters Table */}
              {importedLetters.length > 0 ?
            <Table columns={importedColumns} data={importedLetters} /> :

            <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                  <FolderOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No imported letters</h3>
                  <p className="text-gray-500 mb-4">Import your existing letters to manage them here</p>
                  <Button variant="primary" onClick={() => setShowImportModal(true)} leftIcon={<Upload className="w-4 h-4" />}>
                    Import First Letter
                  </Button>
                </div>
            }
            </div>
          }

          {/* ==================== HISTORY TAB ==================== */}
          {activeMainTab === 'history' &&
          <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-gray-900">Letter Generation History</h3>
                  <p className="text-sm text-gray-500">Track all generated letters</p>
                </div>
                <Badge variant="secondary">{letterHistory.length} Records</Badge>
              </div>

              {letterHistory.length > 0 ?
            <Table columns={historyColumns} data={letterHistory} /> :

            <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                  <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No history yet</h3>
                  <p className="text-gray-500">Generated letters will appear here</p>
                </div>
            }
            </div>
          }
        </div>
      </Card>

      {/* ==================== MODALS ==================== */}

      {/* Preview Modal */}
      <Modal isOpen={showPreviewModal} onClose={() => setShowPreviewModal(false)} title="Letter Preview" size="lg">
        <div className="space-y-4">
          {selectedEmployee && selectedTemplate &&
          <>
              <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{selectedTemplate.name}</p>
                  <p className="text-sm text-gray-500">For: {selectedEmployee.name}</p>
                </div>
                <Badge variant="primary">{activeCategory}</Badge>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-6 max-h-[60vh] overflow-y-auto">
                <pre className="whitespace-pre-wrap font-mono text-sm">{generatedContent}</pre>
              </div>
              <div className="flex gap-3 justify-end pt-4 border-t">
                <Button variant="outline" onClick={() => setShowPreviewModal(false)}>Close</Button>
                <Button
                variant="primary"
                onClick={() => {setShowPreviewModal(false);handleDownload();}}
                leftIcon={<Download className="w-4 h-4" />}>

                  Download
                </Button>
              </div>
            </>
          }
        </div>
      </Modal>

      {/* Email Modal */}
      <Modal isOpen={showEmailModal} onClose={() => setShowEmailModal(false)} title="Send Letter via Email" size="md">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Recipient Email</label>
            <Input
              type="email"
              value={emailAddress}
              onChange={(e) => setEmailAddress(e.target.value)}
              placeholder="Enter email address"
              leftIcon={<Mail className="w-4 h-4 text-gray-400" />} />

          </div>
          {selectedEmployee && selectedTemplate &&
          <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600"><strong>Letter:</strong> {selectedTemplate.name}</p>
              <p className="text-sm text-gray-600"><strong>Employee:</strong> {selectedEmployee.name}</p>
            </div>
          }
          <div className="flex gap-3 justify-end pt-4 border-t">
            <Button variant="outline" onClick={() => setShowEmailModal(false)}>Cancel</Button>
            <Button
              variant="primary"
              onClick={confirmSendEmail}
              disabled={!emailAddress || isSending}
              leftIcon={<Mail className="w-4 h-4" />}>

              {isSending ? 'Sending...' : 'Send Email'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Import Modal */}
      <Modal isOpen={showImportModal} onClose={() => setShowImportModal(false)} title="Import Letter" size="lg">
        <div className="space-y-4">
          {/* File Upload */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            {importForm.fileName ?
            <div className="flex items-center justify-center gap-3">
                <FileText className="w-10 h-10 text-blue-600" />
                <div className="text-left">
                  <p className="font-medium text-gray-900">{importForm.fileName}</p>
                  <p className="text-sm text-gray-500">{importForm.file?.size ? `${Math.round(importForm.file.size / 1024)} KB` : ''}</p>
                </div>
                <button
                onClick={() => setImportForm((prev) => ({ ...prev, file: null, fileName: '', content: '' }))}
                className="p-1 hover:bg-gray-100 rounded">

                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div> :

            <>
                <FileUp className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-600 mb-2">Drag and drop or click to upload</p>
                <p className="text-xs text-gray-500 mb-3">Supported: PDF, DOCX, DOC, TXT (Max 10MB)</p>
              </>
            }
            <input ref={fileInputRef} type="file" accept=".pdf,.docx,.doc,.txt" onChange={handleFileSelect} className="hidden" />
            <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
              {importForm.fileName ? 'Change File' : 'Choose File'}
            </Button>
          </div>

          {/* Letter Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Letter Category *"
              value={importForm.category}
              onChange={(val) => setImportForm((prev) => ({ ...prev, category: val }))}
              options={[
              { value: '', label: 'Select category...' },
              ...categoryTabs.map((c) => ({ value: c.id, label: c.label }))]
              } />

            <Select
              label="Save to group *"
              value={importForm.groupId}
              onChange={(val) => setImportForm((prev) => ({ ...prev, groupId: val }))}
              options={[{ value: '', label: 'Select group...' }, ...letterGroups.map((group) => ({ value: group.id, label: group.name }))]} />

            <Input
              label="Purpose *"
              placeholder="e.g., Internal Transfer"
              value={importForm.purpose}
              onChange={(e) => setImportForm((prev) => ({ ...prev, purpose: e.target.value }))} />

          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={importForm.description}
              onChange={(e) => setImportForm((prev) => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Brief description of this letter..." />

          </div>

          {/* Content Preview/Edit */}
          {importForm.content &&
          <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Letter Content (Editable)</label>
              <textarea
              value={importForm.content}
              onChange={(e) => setImportForm((prev) => ({ ...prev, content: e.target.value }))}
              rows={8}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-blue-500 focus:border-transparent" />

            </div>
          }

          <div className="flex gap-3 justify-end pt-4 border-t">
            <Button variant="outline" onClick={() => setShowImportModal(false)}>Cancel</Button>
            <Button
              variant="primary"
              onClick={handleImportLetter}
              disabled={!importForm.fileName || !importForm.category || !importForm.purpose || !importForm.groupId || isSaving}
              leftIcon={<Upload className="w-4 h-4" />}>

              {isSaving ? 'Importing...' : 'Import Letter'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Edit Imported Letter Modal */}
      <Modal
        isOpen={showEditImportedModal}
        onClose={() => {setShowEditImportedModal(false);setSelectedImportedLetter(null);}}
        title="Edit Imported Letter"
        size="lg">

        {selectedImportedLetter &&
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
              label="Category"
              value={selectedImportedLetter.category}
              onChange={(val) => setSelectedImportedLetter({ ...selectedImportedLetter, category: val })}
              options={categoryTabs.map((c) => ({ value: c.id, label: c.label }))} />

              <Input
              label="Purpose"
              value={selectedImportedLetter.purpose}
              onChange={(e) => setSelectedImportedLetter({ ...selectedImportedLetter, purpose: e.target.value })} />

            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
              value={selectedImportedLetter.description}
              onChange={(e) => setSelectedImportedLetter({ ...selectedImportedLetter, description: e.target.value })}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />

            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Letter Content</label>
              <textarea
              value={selectedImportedLetter.content}
              onChange={(e) => setSelectedImportedLetter({ ...selectedImportedLetter, content: e.target.value })}
              rows={12}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono" />

            </div>

            <Select
            label="Status"
            value={selectedImportedLetter.status}
            onChange={(val) => setSelectedImportedLetter({ ...selectedImportedLetter, status: val as any })}
            options={[
            { value: 'Active', label: 'Active' },
            { value: 'Draft', label: 'Draft' },
            { value: 'Archived', label: 'Archived' }]
            } />


            <div className="flex gap-3 justify-end pt-4 border-t">
              <Button variant="outline" onClick={() => {setShowEditImportedModal(false);setSelectedImportedLetter(null);}}>
                Cancel
              </Button>
              <Button
              variant="primary"
              onClick={handleEditImportedLetter}
              disabled={isSaving}
              leftIcon={<Save className="w-4 h-4" />}>

                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        }
      </Modal>
    </div>);

}

export default LetterGenerationSystem;