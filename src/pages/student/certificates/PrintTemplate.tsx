import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Printer,
  Plus,
  Edit2,
  Copy,
  FileText,
  Settings,
  Search,
  Filter,
  Download,
  Upload,
  Trash2,
  Eye,
  Check,
  X,
  Star,
  StarOff,
  MoreVertical,
  ChevronRight,
  ChevronDown,
  Layout,
  Type,
  Image,
  QrCode,
  Signature,
  Calendar,
  Clock,
  User,
  Building,
  Globe,
  Palette,
  Move,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
  Underline,
  RefreshCw,
  History,
  Lock,
  Unlock,
  ExternalLink,
  Maximize2,
  Minimize2,
  Grid,
  List,
  Tag,
  Layers,
  Save,
  Undo,
  Redo,
  ZoomIn,
  ZoomOut,
  RotateCcw } from
'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Tabs } from '../../../components/ui/Tabs';
import { Table } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import { Modal } from '../../../components/ui/Modal';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';

interface Template {
  id: string;
  name: string;
  type: string;
  language: string;
  isDefault: boolean;
  lastUpdated: string;
  status: 'Active' | 'Inactive' | 'Draft';
  version: string;
  createdBy: string;
  usageCount: number;
  paperSize: string;
  orientation: 'Portrait' | 'Landscape';
  hasDigitalSignature: boolean;
  hasQrCode: boolean;
  hasWatermark: boolean;
  description: string;
  tags: string[];
  isLocked: boolean;
}

interface TemplateField {
  id: string;
  name: string;
  type: 'text' | 'date' | 'image' | 'signature' | 'qr' | 'barcode';
  placeholder: string;
  required: boolean;
  category: string;
}

const MOCK_TEMPLATES: Template[] = [
{
  id: 'TMP-BON-01',
  name: 'Bonafide - Standard English',
  type: 'Bonafide',
  language: 'English',
  isDefault: true,
  lastUpdated: '2024-01-15',
  status: 'Active',
  version: '2.1',
  createdBy: 'Admin',
  usageCount: 1250,
  paperSize: 'A4',
  orientation: 'Portrait',
  hasDigitalSignature: true,
  hasQrCode: true,
  hasWatermark: true,
  description: 'Standard bonafide certificate template with school header and digital signature',
  tags: ['Official', 'Standard'],
  isLocked: false
},
{
  id: 'TMP-BON-02',
  name: 'Bonafide - Hindi',
  type: 'Bonafide',
  language: 'Hindi',
  isDefault: false,
  lastUpdated: '2023-11-20',
  status: 'Active',
  version: '1.5',
  createdBy: 'Admin',
  usageCount: 340,
  paperSize: 'A4',
  orientation: 'Portrait',
  hasDigitalSignature: true,
  hasQrCode: false,
  hasWatermark: true,
  description: 'Hindi version of bonafide certificate with regional formatting',
  tags: ['Regional', 'Hindi'],
  isLocked: false
},
{
  id: 'TMP-BON-03',
  name: 'Bonafide - Bilingual',
  type: 'Bonafide',
  language: 'Bilingual',
  isDefault: false,
  lastUpdated: '2024-02-10',
  status: 'Draft',
  version: '0.8',
  createdBy: 'Teacher',
  usageCount: 0,
  paperSize: 'A4',
  orientation: 'Portrait',
  hasDigitalSignature: false,
  hasQrCode: true,
  hasWatermark: false,
  description: 'Bilingual template with English and Hindi content',
  tags: ['Bilingual', 'New'],
  isLocked: true
},
{
  id: 'TMP-LC-01',
  name: 'Leaving Cert - State Board',
  type: 'Leaving',
  language: 'English',
  isDefault: true,
  lastUpdated: '2024-02-01',
  status: 'Active',
  version: '3.0',
  createdBy: 'Admin',
  usageCount: 890,
  paperSize: 'A4',
  orientation: 'Portrait',
  hasDigitalSignature: true,
  hasQrCode: true,
  hasWatermark: true,
  description: 'State board format leaving certificate with all required fields',
  tags: ['State Board', 'Official'],
  isLocked: false
},
{
  id: 'TMP-LC-02',
  name: 'Leaving Cert - CBSE Format',
  type: 'Leaving',
  language: 'English',
  isDefault: false,
  lastUpdated: '2023-12-10',
  status: 'Active',
  version: '2.2',
  createdBy: 'Admin',
  usageCount: 560,
  paperSize: 'A4',
  orientation: 'Portrait',
  hasDigitalSignature: true,
  hasQrCode: true,
  hasWatermark: true,
  description: 'CBSE compliant leaving certificate format',
  tags: ['CBSE', 'Official'],
  isLocked: false
},
{
  id: 'TMP-LC-03',
  name: 'Leaving Cert - Migration',
  type: 'Leaving',
  language: 'English',
  isDefault: false,
  lastUpdated: '2024-01-25',
  status: 'Active',
  version: '1.0',
  createdBy: 'Admin',
  usageCount: 120,
  paperSize: 'A4',
  orientation: 'Portrait',
  hasDigitalSignature: true,
  hasQrCode: true,
  hasWatermark: false,
  description: 'Special format for student migration between boards',
  tags: ['Migration', 'Special'],
  isLocked: false
},
{
  id: 'TMP-CHR-01',
  name: 'Character Cert - General',
  type: 'Character',
  language: 'English',
  isDefault: true,
  lastUpdated: '2023-10-05',
  status: 'Active',
  version: '1.8',
  createdBy: 'Admin',
  usageCount: 2100,
  paperSize: 'A4',
  orientation: 'Portrait',
  hasDigitalSignature: true,
  hasQrCode: false,
  hasWatermark: true,
  description: 'General character certificate for employment and higher education',
  tags: ['General', 'Employment'],
  isLocked: false
},
{
  id: 'TMP-CHR-02',
  name: 'Character Cert - Scholarship',
  type: 'Character',
  language: 'English',
  isDefault: false,
  lastUpdated: '2024-01-08',
  status: 'Active',
  version: '1.2',
  createdBy: 'Admin',
  usageCount: 450,
  paperSize: 'A4',
  orientation: 'Portrait',
  hasDigitalSignature: true,
  hasQrCode: true,
  hasWatermark: true,
  description: 'Specialized character certificate format for scholarship applications',
  tags: ['Scholarship', 'Special'],
  isLocked: false
},
{
  id: 'TMP-FT-01',
  name: 'First Trial - Standard',
  type: 'First Trial',
  language: 'English',
  isDefault: true,
  lastUpdated: '2024-02-05',
  status: 'Active',
  version: '1.0',
  createdBy: 'Admin',
  usageCount: 320,
  paperSize: 'A4',
  orientation: 'Portrait',
  hasDigitalSignature: true,
  hasQrCode: false,
  hasWatermark: false,
  description: 'Standard first trial certificate template',
  tags: ['Standard'],
  isLocked: false
},
{
  id: 'TMP-TR-01',
  name: 'Transfer Cert - Inter-School',
  type: 'Transfer',
  language: 'English',
  isDefault: true,
  lastUpdated: '2024-01-20',
  status: 'Active',
  version: '2.0',
  createdBy: 'Admin',
  usageCount: 780,
  paperSize: 'A4',
  orientation: 'Portrait',
  hasDigitalSignature: true,
  hasQrCode: true,
  hasWatermark: true,
  description: 'Transfer certificate for inter-school transfers',
  tags: ['Transfer', 'Official'],
  isLocked: false
},
{
  id: 'TMP-OT-01',
  name: 'Sports Achievement',
  type: 'Other',
  language: 'English',
  isDefault: false,
  lastUpdated: '2023-09-15',
  status: 'Active',
  version: '1.5',
  createdBy: 'Sports Dept',
  usageCount: 230,
  paperSize: 'A4',
  orientation: 'Landscape',
  hasDigitalSignature: true,
  hasQrCode: false,
  hasWatermark: true,
  description: 'Certificate template for sports achievements and events',
  tags: ['Sports', 'Achievement'],
  isLocked: false
},
{
  id: 'TMP-OT-02',
  name: 'Merit Certificate',
  type: 'Other',
  language: 'English',
  isDefault: false,
  lastUpdated: '2024-02-01',
  status: 'Active',
  version: '1.0',
  createdBy: 'Admin',
  usageCount: 890,
  paperSize: 'A4',
  orientation: 'Landscape',
  hasDigitalSignature: false,
  hasQrCode: false,
  hasWatermark: true,
  description: 'Merit certificate for academic achievements',
  tags: ['Merit', 'Academic'],
  isLocked: false
}];


const TEMPLATE_FIELDS: TemplateField[] = [
{ id: 'student_name', name: 'Student Name', type: 'text', placeholder: '{{student_name}}', required: true, category: 'Student' },
{ id: 'gr_number', name: 'GR Number', type: 'text', placeholder: '{{gr_number}}', required: true, category: 'Student' },
{ id: 'class_section', name: 'Class & Section', type: 'text', placeholder: '{{class_section}}', required: true, category: 'Academic' },
{ id: 'dob', name: 'Date of Birth', type: 'date', placeholder: '{{dob}}', required: true, category: 'Student' },
{ id: 'admission_date', name: 'Admission Date', type: 'date', placeholder: '{{admission_date}}', required: false, category: 'Academic' },
{ id: 'father_name', name: "Father's Name", type: 'text', placeholder: '{{father_name}}', required: true, category: 'Parent' },
{ id: 'mother_name', name: "Mother's Name", type: 'text', placeholder: '{{mother_name}}', required: false, category: 'Parent' },
{ id: 'address', name: 'Address', type: 'text', placeholder: '{{address}}', required: false, category: 'Contact' },
{ id: 'school_name', name: 'School Name', type: 'text', placeholder: '{{school_name}}', required: true, category: 'School' },
{ id: 'school_logo', name: 'School Logo', type: 'image', placeholder: '{{school_logo}}', required: true, category: 'School' },
{ id: 'principal_sign', name: 'Principal Signature', type: 'signature', placeholder: '{{principal_sign}}', required: true, category: 'Signatures' },
{ id: 'verification_qr', name: 'Verification QR', type: 'qr', placeholder: '{{verification_qr}}', required: false, category: 'Security' },
{ id: 'issue_date', name: 'Issue Date', type: 'date', placeholder: '{{issue_date}}', required: true, category: 'Document' },
{ id: 'certificate_no', name: 'Certificate Number', type: 'text', placeholder: '{{certificate_no}}', required: true, category: 'Document' }];


const FIELD_CATEGORIES = ['All', 'Student', 'Academic', 'Parent', 'Contact', 'School', 'Signatures', 'Security', 'Document'];

export function PrintTemplate() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Bonafide');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isEditorModalOpen, setIsEditorModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isVersionHistoryOpen, setIsVersionHistoryOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterLanguage, setFilterLanguage] = useState('all');
  const [selectedTemplates, setSelectedTemplates] = useState<string[]>([]);
  const [showFilterPanel, setShowFilterPanel] = useState(true);
  const [showFieldsPanel, setShowFieldsPanel] = useState(false);
  const [selectedFieldCategory, setSelectedFieldCategory] = useState('All');
  const [editorZoom, setEditorZoom] = useState(100);
  const [editorTool, setEditorTool] = useState('select');

  // New template form state
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    type: 'Bonafide',
    language: 'English',
    paperSize: 'A4',
    orientation: 'Portrait',
    description: '',
    hasDigitalSignature: true,
    hasQrCode: true,
    hasWatermark: false,
    baseTemplate: 'blank'
  });

  const filteredTemplates = useMemo(() => {
    return MOCK_TEMPLATES.filter((template) => {
      const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesStatus = filterStatus === 'all' || template.status.toLowerCase() === filterStatus;
      const matchesLanguage = filterLanguage === 'all' || template.language.toLowerCase() === filterLanguage;
      return matchesSearch && matchesStatus && matchesLanguage;
    });
  }, [searchQuery, filterStatus, filterLanguage]);

  const getTemplatesByType = (type: string) =>
  filteredTemplates.filter((t) => t.type === type);

  const handleSelectTemplate = (template: Template) => {
    setSelectedTemplate(template);
  };

  const handleSelectAll = (type: string) => {
    const typeTemplates = getTemplatesByType(type);
    const allSelected = typeTemplates.every((t) => selectedTemplates.includes(t.id));
    if (allSelected) {
      setSelectedTemplates((prev) => prev.filter((id) => !typeTemplates.find((t) => t.id === id)));
    } else {
      setSelectedTemplates((prev) => [...new Set([...prev, ...typeTemplates.map((t) => t.id)])]);
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedTemplates((prev) =>
    prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSetDefault = (template: Template) => {
    console.log('Setting as default:', template.id);
    // In real app, this would update the template
  };

  const handleDuplicate = (template: Template) => {
    console.log('Duplicating:', template.id);
    // In real app, this would create a copy
  };

  const handleDelete = (template: Template) => {
    setSelectedTemplate(template);
    setIsDeleteModalOpen(true);
  };

  const handlePreview = (template: Template) => {
    setSelectedTemplate(template);
    setIsPreviewModalOpen(true);
  };

  const handleEdit = (template: Template) => {
    setSelectedTemplate(template);
    setIsEditorModalOpen(true);
  };

  const handleExport = () => {
    console.log('Exporting templates:', selectedTemplates);
  };

  const handleBulkDelete = () => {
    console.log('Deleting templates:', selectedTemplates);
    setSelectedTemplates([]);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active':
        return <Badge variant="success">{status}</Badge>;
      case 'Inactive':
        return <Badge variant="secondary">{status}</Badge>;
      case 'Draft':
        return <Badge variant="warning">{status}</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const columns = [
  {
    key: 'select',
    header:
    <input
      type="checkbox"
      className="rounded border-gray-300"
      onChange={() => handleSelectAll(activeTab)}
      checked={getTemplatesByType(activeTab).length > 0 &&
      getTemplatesByType(activeTab).every((t) => selectedTemplates.includes(t.id))} />,


    render: (row: Template) =>
    <input
      type="checkbox"
      className="rounded border-gray-300"
      checked={selectedTemplates.includes(row.id)}
      onChange={() => handleToggleSelect(row.id)} />


  },
  {
    key: 'name',
    header: 'Template',
    render: (row: Template) =>
    <div
      className="cursor-pointer hover:text-blue-600"
      onClick={() => handleSelectTemplate(row)}>

          <div className="flex items-center gap-2">
            <span className="font-medium">{row.name}</span>
            {row.isLocked && <Lock className="w-3 h-3 text-gray-400" />}
          </div>
          <div className="text-xs text-gray-500 mt-1">{row.description.substring(0, 50)}...</div>
          <div className="flex gap-1 mt-1">
            {row.tags.map((tag) =>
        <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                {tag}
              </span>
        )}
          </div>
        </div>

  },
  {
    key: 'language',
    header: 'Language',
    render: (row: Template) =>
    <div className="flex items-center gap-1">
          <Globe className="w-3 h-3 text-gray-400" />
          <span>{row.language}</span>
        </div>

  },
  {
    key: 'version',
    header: 'Version',
    render: (row: Template) =>
    <span className="text-sm text-gray-600">v{row.version}</span>

  },
  {
    key: 'features',
    header: 'Features',
    render: (row: Template) =>
    <div className="flex gap-1">
          {row.hasDigitalSignature &&
      <span className="p-1 bg-green-50 rounded" title="Digital Signature">
              <Signature className="w-3 h-3 text-green-600" />
            </span>
      }
          {row.hasQrCode &&
      <span className="p-1 bg-blue-50 rounded" title="QR Code">
              <QrCode className="w-3 h-3 text-blue-600" />
            </span>
      }
          {row.hasWatermark &&
      <span className="p-1 bg-purple-50 rounded" title="Watermark">
              <Image className="w-3 h-3 text-purple-600" />
            </span>
      }
        </div>

  },
  {
    key: 'usageCount',
    header: 'Usage',
    render: (row: Template) =>
    <span className="text-sm">{row.usageCount.toLocaleString()} prints</span>

  },
  {
    key: 'lastUpdated',
    header: 'Last Updated',
    render: (row: Template) =>
    <div className="text-sm">
          <div>{row.lastUpdated}</div>
          <div className="text-xs text-gray-500">by {row.createdBy}</div>
        </div>

  },
  {
    key: 'isDefault',
    header: 'Default',
    render: (row: Template) =>
    <button
      onClick={() => handleSetDefault(row)}
      className={`p-1 rounded transition-colors ${
      row.isDefault ?
      'text-yellow-500 hover:text-yellow-600' :
      'text-gray-300 hover:text-yellow-400'}`
      }
      title={row.isDefault ? 'Default Template' : 'Set as Default'}>

          {row.isDefault ? <Star className="w-4 h-4 fill-current" /> : <StarOff className="w-4 h-4" />}
        </button>

  },
  {
    key: 'status',
    header: 'Status',
    render: (row: Template) => getStatusBadge(row.status)
  },
  {
    key: 'actions',
    header: 'Actions',
    render: (row: Template) =>
    <div className="flex gap-1">
          <Button
        variant="ghost"
        size="xs"
        title="Preview"
        onClick={() => handlePreview(row)}>

            <Eye className="w-3 h-3" />
          </Button>
          <Button
        variant="ghost"
        size="xs"
        title="Edit"
        onClick={() => handleEdit(row)}
        disabled={row.isLocked}>

            <Edit2 className="w-3 h-3" />
          </Button>
          <Button
        variant="ghost"
        size="xs"
        title="Duplicate"
        onClick={() => handleDuplicate(row)}>

            <Copy className="w-3 h-3" />
          </Button>
          <Button
        variant="ghost"
        size="xs"
        title="Version History"
        onClick={() => {
          setSelectedTemplate(row);
          setIsVersionHistoryOpen(true);
        }}>

            <History className="w-3 h-3" />
          </Button>
          <Button
        variant="ghost"
        size="xs"
        title="Delete"
        onClick={() => handleDelete(row)}
        disabled={row.isDefault}>

            <Trash2 className="w-3 h-3 text-red-500" />
          </Button>
        </div>

  }];


  const gridColumns = columns.filter((c) => !['select', 'actions'].includes(c.key));

  const tabs = [
  {
    id: 'Bonafide',
    label: `Bonafide (${getTemplatesByType('Bonafide').length})`,
    content: viewMode === 'list' ?
    <Table columns={columns} data={getTemplatesByType('Bonafide')} /> :

    <TemplateGrid
      templates={getTemplatesByType('Bonafide')}
      onPreview={handlePreview}
      onEdit={handleEdit}
      onDuplicate={handleDuplicate}
      onDelete={handleDelete}
      selectedTemplates={selectedTemplates}
      onToggleSelect={handleToggleSelect} />


  },
  {
    id: 'Leaving',
    label: `Leaving (${getTemplatesByType('Leaving').length})`,
    content: viewMode === 'list' ?
    <Table columns={columns} data={getTemplatesByType('Leaving')} /> :

    <TemplateGrid
      templates={getTemplatesByType('Leaving')}
      onPreview={handlePreview}
      onEdit={handleEdit}
      onDuplicate={handleDuplicate}
      onDelete={handleDelete}
      selectedTemplates={selectedTemplates}
      onToggleSelect={handleToggleSelect} />


  },
  {
    id: 'Character',
    label: `Character (${getTemplatesByType('Character').length})`,
    content: viewMode === 'list' ?
    <Table columns={columns} data={getTemplatesByType('Character')} /> :

    <TemplateGrid
      templates={getTemplatesByType('Character')}
      onPreview={handlePreview}
      onEdit={handleEdit}
      onDuplicate={handleDuplicate}
      onDelete={handleDelete}
      selectedTemplates={selectedTemplates}
      onToggleSelect={handleToggleSelect} />


  },
  {
    id: 'First Trial',
    label: `First Trial (${getTemplatesByType('First Trial').length})`,
    content: viewMode === 'list' ?
    <Table columns={columns} data={getTemplatesByType('First Trial')} /> :

    <TemplateGrid
      templates={getTemplatesByType('First Trial')}
      onPreview={handlePreview}
      onEdit={handleEdit}
      onDuplicate={handleDuplicate}
      onDelete={handleDelete}
      selectedTemplates={selectedTemplates}
      onToggleSelect={handleToggleSelect} />


  },
  {
    id: 'Transfer',
    label: `Transfer (${getTemplatesByType('Transfer').length})`,
    content: viewMode === 'list' ?
    <Table columns={columns} data={getTemplatesByType('Transfer')} /> :

    <TemplateGrid
      templates={getTemplatesByType('Transfer')}
      onPreview={handlePreview}
      onEdit={handleEdit}
      onDuplicate={handleDuplicate}
      onDelete={handleDelete}
      selectedTemplates={selectedTemplates}
      onToggleSelect={handleToggleSelect} />


  },
  {
    id: 'Other',
    label: `Other (${getTemplatesByType('Other').length})`,
    content: viewMode === 'list' ?
    <Table columns={columns} data={getTemplatesByType('Other')} /> :

    <TemplateGrid
      templates={getTemplatesByType('Other')}
      onPreview={handlePreview}
      onEdit={handleEdit}
      onDuplicate={handleDuplicate}
      onDelete={handleDelete}
      selectedTemplates={selectedTemplates}
      onToggleSelect={handleToggleSelect} />


  }];


  const filteredFields = TEMPLATE_FIELDS.filter(
    (field) => selectedFieldCategory === 'All' || field.category === selectedFieldCategory
  );

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
         
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Certificate Print Templates
            </h1>
            <p className="text-gray-500">
              Configure layouts and content for all certificate types • {MOCK_TEMPLATES.length} templates
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsSettingsModalOpen(true)}>

            <Settings className="w-4 h-4 mr-2" />
            Print Settings
          </Button>
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            leftIcon={<Plus className="w-4 h-4" />}>

            Create Template
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex gap-4">
        {/* Left Sidebar - Filters */}
        {showFilterPanel &&
        <Card className="w-64 flex-shrink-0 h-fit">
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Filters
              </h3>
              <Button
              variant="ghost"
              size="xs"
              onClick={() => {
                setSearchQuery('');
                setFilterStatus('all');
                setFilterLanguage('all');
              }}>

                Clear
              </Button>
            </div>
            <div className="p-4 space-y-4">
              {/* Search */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Search
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                  type="text"
                  placeholder="Search templates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />

                </div>
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <div className="space-y-1">
                  {['all', 'active', 'inactive', 'draft'].map((status) =>
                <label
                  key={status}
                  className="flex items-center gap-2 cursor-pointer p-2 rounded hover:bg-gray-50">

                      <input
                    type="radio"
                    name="status"
                    checked={filterStatus === status}
                    onChange={() => setFilterStatus(status)}
                    className="text-blue-600" />

                      <span className="text-sm capitalize">{status === 'all' ? 'All Status' : status}</span>
                    </label>
                )}
                </div>
              </div>

              {/* Language Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Language
                </label>
                <div className="space-y-1">
                  {['all', 'english', 'hindi', 'bilingual'].map((lang) =>
                <label
                  key={lang}
                  className="flex items-center gap-2 cursor-pointer p-2 rounded hover:bg-gray-50">

                      <input
                    type="radio"
                    name="language"
                    checked={filterLanguage === lang}
                    onChange={() => setFilterLanguage(lang)}
                    className="text-blue-600" />

                      <span className="text-sm capitalize">{lang === 'all' ? 'All Languages' : lang}</span>
                    </label>
                )}
                </div>
              </div>

              {/* Features Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Features
                </label>
                <div className="space-y-1">
                  <label className="flex items-center gap-2 cursor-pointer p-2 rounded hover:bg-gray-50">
                    <input type="checkbox" className="rounded text-blue-600" />
                    <Signature className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">Digital Signature</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer p-2 rounded hover:bg-gray-50">
                    <input type="checkbox" className="rounded text-blue-600" />
                    <QrCode className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">QR Code</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer p-2 rounded hover:bg-gray-50">
                    <input type="checkbox" className="rounded text-blue-600" />
                    <Image className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">Watermark</span>
                  </label>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="pt-4 border-t">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quick Actions
                </label>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Upload className="w-4 h-4 mr-2" />
                    Import Template
                  </Button>
                  <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={handleExport}
                  disabled={selectedTemplates.length === 0}>

                    <Download className="w-4 h-4 mr-2" />
                    Export Selected ({selectedTemplates.length})
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        }

        {/* Main Content Area */}
        <div className="flex-1 min-w-0">
          {/* Toolbar */}
          <Card className="mb-4">
            <div className="p-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowFilterPanel(!showFilterPanel)}>

                  <Filter className="w-4 h-4" />
                </Button>
                
                {selectedTemplates.length > 0 &&
                <div className="flex items-center gap-2 pl-2 border-l">
                    <span className="text-sm text-gray-600">
                      {selectedTemplates.length} selected
                    </span>
                    <Button variant="outline" size="xs">
                      <Download className="w-3 h-3 mr-1" />
                      Export
                    </Button>
                    <Button
                    variant="outline"
                    size="xs"
                    className="text-red-600 border-red-200 hover:bg-red-50"
                    onClick={handleBulkDelete}>

                      <Trash2 className="w-3 h-3 mr-1" />
                      Delete
                    </Button>
                    <Button
                    variant="ghost"
                    size="xs"
                    onClick={() => setSelectedTemplates([])}>

                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                }
              </div>
              
              <div className="flex items-center gap-2">
                <div className="flex items-center border rounded-lg overflow-hidden">
                  <button
                    className={`p-2 ${viewMode === 'list' ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:bg-gray-50'}`}
                    onClick={() => setViewMode('list')}>

                    <List className="w-4 h-4" />
                  </button>
                  <button
                    className={`p-2 ${viewMode === 'grid' ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:bg-gray-50'}`}
                    onClick={() => setViewMode('grid')}>

                    <Grid className="w-4 h-4" />
                  </button>
                </div>
                <Button variant="outline" size="sm">
                  <RefreshCw className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>

          {/* Templates Table/Grid */}
          <Card noPadding>
            <Tabs
              tabs={tabs}
              defaultTab="Bonafide"
              onChange={(tabId) => setActiveTab(tabId)} />

          </Card>
        </div>

        {/* Right Sidebar - Template Details */}
        {selectedTemplate &&
        <Card className="w-80 flex-shrink-0 h-fit">
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Template Details</h3>
              <Button
              variant="ghost"
              size="xs"
              onClick={() => setSelectedTemplate(null)}>

                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="p-4 space-y-4">
              {/* Preview Thumbnail */}
              <div className="aspect-[3/4] bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                <div className="text-center">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Template Preview</p>
                  <Button
                  variant="outline"
                  size="xs"
                  className="mt-2"
                  onClick={() => handlePreview(selectedTemplate)}>

                    <Maximize2 className="w-3 h-3 mr-1" />
                    Full Preview
                  </Button>
                </div>
              </div>

              {/* Template Info */}
              <div>
                <h4 className="font-medium text-gray-900">{selectedTemplate.name}</h4>
                <p className="text-sm text-gray-500 mt-1">{selectedTemplate.description}</p>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-gray-500">Type</span>
                  <p className="font-medium">{selectedTemplate.type}</p>
                </div>
                <div>
                  <span className="text-gray-500">Language</span>
                  <p className="font-medium">{selectedTemplate.language}</p>
                </div>
                <div>
                  <span className="text-gray-500">Paper Size</span>
                  <p className="font-medium">{selectedTemplate.paperSize}</p>
                </div>
                <div>
                  <span className="text-gray-500">Orientation</span>
                  <p className="font-medium">{selectedTemplate.orientation}</p>
                </div>
                <div>
                  <span className="text-gray-500">Version</span>
                  <p className="font-medium">v{selectedTemplate.version}</p>
                </div>
                <div>
                  <span className="text-gray-500">Usage</span>
                  <p className="font-medium">{selectedTemplate.usageCount.toLocaleString()}</p>
                </div>
              </div>

              {/* Status & Features */}
              <div className="flex flex-wrap gap-2">
                {getStatusBadge(selectedTemplate.status)}
                {selectedTemplate.isDefault && <Badge variant="warning">Default</Badge>}
                {selectedTemplate.isLocked && <Badge variant="secondary">Locked</Badge>}
              </div>

              <div className="flex gap-2 flex-wrap">
                {selectedTemplate.hasDigitalSignature &&
              <span className="flex items-center gap-1 text-xs bg-green-50 text-green-700 px-2 py-1 rounded">
                    <Signature className="w-3 h-3" /> Signature
                  </span>
              }
                {selectedTemplate.hasQrCode &&
              <span className="flex items-center gap-1 text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
                    <QrCode className="w-3 h-3" /> QR Code
                  </span>
              }
                {selectedTemplate.hasWatermark &&
              <span className="flex items-center gap-1 text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded">
                    <Image className="w-3 h-3" /> Watermark
                  </span>
              }
              </div>

              {/* Tags */}
              <div>
                <span className="text-sm text-gray-500">Tags</span>
                <div className="flex gap-1 mt-1 flex-wrap">
                  {selectedTemplate.tags.map((tag) =>
                <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                      {tag}
                    </span>
                )}
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t space-y-2">
                <Button
                className="w-full"
                onClick={() => handleEdit(selectedTemplate)}
                disabled={selectedTemplate.isLocked}>

                  <Edit2 className="w-4 h-4 mr-2" />
                  Edit Template
                </Button>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" onClick={() => handleDuplicate(selectedTemplate)}>
                    <Copy className="w-4 h-4 mr-2" />
                    Duplicate
                  </Button>
                  <Button variant="outline" onClick={() => handlePreview(selectedTemplate)}>
                    <Printer className="w-4 h-4 mr-2" />
                    Test Print
                  </Button>
                </div>
                {!selectedTemplate.isDefault &&
              <Button
                variant="outline"
                className="w-full"
                onClick={() => handleSetDefault(selectedTemplate)}>

                    <Star className="w-4 h-4 mr-2" />
                    Set as Default
                  </Button>
              }
              </div>

              {/* Metadata */}
              <div className="pt-4 border-t text-xs text-gray-500">
                <div className="flex justify-between">
                  <span>Created by</span>
                  <span>{selectedTemplate.createdBy}</span>
                </div>
                <div className="flex justify-between mt-1">
                  <span>Last updated</span>
                  <span>{selectedTemplate.lastUpdated}</span>
                </div>
                <div className="flex justify-between mt-1">
                  <span>Template ID</span>
                  <span className="font-mono">{selectedTemplate.id}</span>
                </div>
              </div>
            </div>
          </Card>
        }
      </div>

      {/* Create Template Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Template"
        size="lg"
        footer={
        <div className="flex justify-between">
            <Button variant="outline">
              <FileText className="w-4 h-4 mr-2" />
              Use Existing Template
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => {
              setIsCreateModalOpen(false);
              setIsEditorModalOpen(true);
            }}>
                <Plus className="w-4 h-4 mr-2" />
                Create & Open Editor
              </Button>
            </div>
          </div>
        }>

        <div className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Basic Information</h4>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Template Name"
                placeholder="e.g., Bonafide Certificate 2024"
                value={newTemplate.name}
                onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                required />

              <Select
                label="Certificate Type"
                value={newTemplate.type}
                onChange={(e) => setNewTemplate({ ...newTemplate, type: e.target.value })}
                options={[
                { value: 'Bonafide', label: 'Bonafide' },
                { value: 'Leaving', label: 'Leaving Certificate' },
                { value: 'Character', label: 'Character Certificate' },
                { value: 'First Trial', label: 'First Trial' },
                { value: 'Transfer', label: 'Transfer Certificate' },
                { value: 'Other', label: 'Other / Custom' }]
                } />

            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                rows={2}
                placeholder="Brief description of this template..."
                value={newTemplate.description}
                onChange={(e) => setNewTemplate({ ...newTemplate, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />

            </div>
          </div>

          {/* Page Settings */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Page Settings</h4>
            <div className="grid grid-cols-3 gap-4">
              <Select
                label="Language"
                value={newTemplate.language}
                onChange={(e) => setNewTemplate({ ...newTemplate, language: e.target.value })}
                options={[
                { value: 'English', label: 'English' },
                { value: 'Hindi', label: 'Hindi' },
                { value: 'Marathi', label: 'Marathi' },
                { value: 'Bilingual', label: 'Bilingual (EN/HI)' }]
                } />

              <Select
                label="Paper Size"
                value={newTemplate.paperSize}
                onChange={(e) => setNewTemplate({ ...newTemplate, paperSize: e.target.value })}
                options={[
                { value: 'A4', label: 'A4 (210 × 297 mm)' },
                { value: 'Letter', label: 'Letter (8.5 × 11 in)' },
                { value: 'Legal', label: 'Legal (8.5 × 14 in)' },
                { value: 'A5', label: 'A5 (148 × 210 mm)' }]
                } />

              <Select
                label="Orientation"
                value={newTemplate.orientation}
                onChange={(e) => setNewTemplate({ ...newTemplate, orientation: e.target.value })}
                options={[
                { value: 'Portrait', label: 'Portrait' },
                { value: 'Landscape', label: 'Landscape' }]
                } />

            </div>
          </div>

          {/* Features */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Template Features</h4>
            <div className="grid grid-cols-3 gap-4">
              <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={newTemplate.hasDigitalSignature}
                  onChange={(e) => setNewTemplate({ ...newTemplate, hasDigitalSignature: e.target.checked })}
                  className="rounded text-blue-600" />

                <div>
                  <div className="flex items-center gap-2">
                    <Signature className="w-4 h-4 text-green-600" />
                    <span className="font-medium text-sm">Digital Signature</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Add signature fields</p>
                </div>
              </label>
              <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={newTemplate.hasQrCode}
                  onChange={(e) => setNewTemplate({ ...newTemplate, hasQrCode: e.target.checked })}
                  className="rounded text-blue-600" />

                <div>
                  <div className="flex items-center gap-2">
                    <QrCode className="w-4 h-4 text-blue-600" />
                    <span className="font-medium text-sm">QR Code</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Verification QR code</p>
                </div>
              </label>
              <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={newTemplate.hasWatermark}
                  onChange={(e) => setNewTemplate({ ...newTemplate, hasWatermark: e.target.checked })}
                  className="rounded text-blue-600" />

                <div>
                  <div className="flex items-center gap-2">
                    <Image className="w-4 h-4 text-purple-600" />
                    <span className="font-medium text-sm">Watermark</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Background watermark</p>
                </div>
              </label>
            </div>
          </div>

          {/* Base Template Selection */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Start From</h4>
            <div className="grid grid-cols-3 gap-4">
              <div
                className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                newTemplate.baseTemplate === 'blank' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`
                }
                onClick={() => setNewTemplate({ ...newTemplate, baseTemplate: 'blank' })}>

                <Layout className="w-8 h-8 text-gray-400 mb-2" />
                <h5 className="font-medium text-sm">Blank Template</h5>
                <p className="text-xs text-gray-500 mt-1">Start from scratch</p>
              </div>
              <div
                className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                newTemplate.baseTemplate === 'standard' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`
                }
                onClick={() => setNewTemplate({ ...newTemplate, baseTemplate: 'standard' })}>

                <FileText className="w-8 h-8 text-blue-400 mb-2" />
                <h5 className="font-medium text-sm">Standard Layout</h5>
                <p className="text-xs text-gray-500 mt-1">Pre-configured layout</p>
              </div>
              <div
                className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                newTemplate.baseTemplate === 'existing' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`
                }
                onClick={() => setNewTemplate({ ...newTemplate, baseTemplate: 'existing' })}>

                <Copy className="w-8 h-8 text-green-400 mb-2" />
                <h5 className="font-medium text-sm">Copy Existing</h5>
                <p className="text-xs text-gray-500 mt-1">Duplicate a template</p>
              </div>
            </div>
          </div>

          {/* Info Box */}
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
            <h4 className="text-sm font-medium text-blue-900 mb-2 flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Template Editor Features
            </h4>
            <div className="grid grid-cols-2 gap-4 text-xs text-blue-700">
              <ul className="list-disc list-inside space-y-1">
                <li>Drag and drop dynamic fields</li>
                <li>Configure header and footer</li>
                <li>Add school branding elements</li>
                <li>Set up digital signatures</li>
              </ul>
              <ul className="list-disc list-inside space-y-1">
                <li>Insert QR/Barcode elements</li>
                <li>Define visibility rules</li>
                <li>Preview with sample data</li>
                <li>Export as PDF template</li>
              </ul>
            </div>
          </div>
        </div>
      </Modal>

      {/* Template Editor Modal */}
      <Modal
        isOpen={isEditorModalOpen}
        onClose={() => setIsEditorModalOpen(false)}
        title={
        <div className="flex items-center gap-4">
            <span>Template Editor</span>
            {selectedTemplate &&
          <Badge variant="secondary">{selectedTemplate.name}</Badge>
          }
          </div>
        }
        size="xl"
        footer={
        <div className="flex justify-between">
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Undo className="w-4 h-4 mr-1" />
                Undo
              </Button>
              <Button variant="outline" size="sm">
                <Redo className="w-4 h-4 mr-1" />
                Redo
              </Button>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsEditorModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="outline">
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>
              <Button>
                <Save className="w-4 h-4 mr-2" />
                Save Template
              </Button>
            </div>
          </div>
        }>

        <div className="flex gap-4 h-[600px]">
          {/* Left Panel - Fields Library */}
          <div className="w-64 border-r pr-4 flex flex-col">
            <div className="mb-4">
              <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                <Layers className="w-4 h-4" />
                Fields Library
              </h4>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search fields..."
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm" />

              </div>
            </div>

            {/* Category Tabs */}
            <div className="flex flex-wrap gap-1 mb-3">
              {FIELD_CATEGORIES.map((cat) =>
              <button
                key={cat}
                className={`px-2 py-1 text-xs rounded-full ${
                selectedFieldCategory === cat ?
                'bg-blue-100 text-blue-700' :
                'bg-gray-100 text-gray-600 hover:bg-gray-200'}`
                }
                onClick={() => setSelectedFieldCategory(cat)}>

                  {cat}
                </button>
              )}
            </div>

            {/* Fields List */}
            <div className="flex-1 overflow-y-auto space-y-1">
              {filteredFields.map((field) =>
              <div
                key={field.id}
                className="p-2 border border-gray-200 rounded-lg cursor-move hover:border-blue-300 hover:bg-blue-50 transition-colors"
                draggable>

                  <div className="flex items-center gap-2">
                    <Move className="w-3 h-3 text-gray-400" />
                    {field.type === 'text' && <Type className="w-4 h-4 text-gray-500" />}
                    {field.type === 'date' && <Calendar className="w-4 h-4 text-gray-500" />}
                    {field.type === 'image' && <Image className="w-4 h-4 text-gray-500" />}
                    {field.type === 'signature' && <Signature className="w-4 h-4 text-gray-500" />}
                    {field.type === 'qr' && <QrCode className="w-4 h-4 text-gray-500" />}
                    <span className="text-sm font-medium">{field.name}</span>
                    {field.required && <span className="text-red-500 text-xs">*</span>}
                  </div>
                  <code className="text-xs text-gray-400 mt-1 block">{field.placeholder}</code>
                </div>
              )}
            </div>

            {/* Add Custom Field */}
            <Button variant="outline" size="sm" className="mt-3">
              <Plus className="w-4 h-4 mr-2" />
              Add Custom Field
            </Button>
          </div>

          {/* Center - Canvas */}
          <div className="flex-1 flex flex-col">
            {/* Toolbar */}
            <div className="flex items-center justify-between pb-3 border-b mb-3">
              <div className="flex items-center gap-1">
                <Button
                  variant={editorTool === 'select' ? 'secondary' : 'ghost'}
                  size="xs"
                  onClick={() => setEditorTool('select')}>

                  <Move className="w-4 h-4" />
                </Button>
                <Button
                  variant={editorTool === 'text' ? 'secondary' : 'ghost'}
                  size="xs"
                  onClick={() => setEditorTool('text')}>

                  <Type className="w-4 h-4" />
                </Button>
                <Button
                  variant={editorTool === 'image' ? 'secondary' : 'ghost'}
                  size="xs"
                  onClick={() => setEditorTool('image')}>

                  <Image className="w-4 h-4" />
                </Button>
                <div className="w-px h-6 bg-gray-200 mx-1" />
                <Button variant="ghost" size="xs">
                  <Bold className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="xs">
                  <Italic className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="xs">
                  <Underline className="w-4 h-4" />
                </Button>
                <div className="w-px h-6 bg-gray-200 mx-1" />
                <Button variant="ghost" size="xs">
                  <AlignLeft className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="xs">
                  <AlignCenter className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="xs">
                  <AlignRight className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="xs" onClick={() => setEditorZoom(Math.max(50, editorZoom - 10))}>
                  <ZoomOut className="w-4 h-4" />
                </Button>
                <span className="text-sm text-gray-600 w-12 text-center">{editorZoom}%</span>
                <Button variant="ghost" size="xs" onClick={() => setEditorZoom(Math.min(200, editorZoom + 10))}>
                  <ZoomIn className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="xs" onClick={() => setEditorZoom(100)}>
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Canvas Area */}
            <div className="flex-1 bg-gray-100 rounded-lg overflow-auto flex items-center justify-center p-4">
              <div
                className="bg-white shadow-lg"
                style={{
                  width: `${595 * editorZoom / 100}px`,
                  height: `${842 * editorZoom / 100}px`,
                  transform: `scale(${editorZoom / 100})`,
                  transformOrigin: 'center center'
                }}>

                {/* A4 Paper Preview */}
                <div className="w-full h-full border p-8 relative">
                  {/* Header Section */}
                  <div className="border-2 border-dashed border-gray-300 rounded p-4 mb-4 text-center bg-gray-50">
                    <div className="text-xs text-gray-500 mb-2">HEADER SECTION</div>
                    <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-2" />
                    <div className="text-lg font-bold">School Name</div>
                    <div className="text-sm text-gray-600">Address Line</div>
                  </div>

                  {/* Title */}
                  <div className="text-center mb-6">
                    <div className="text-xl font-bold border-b-2 border-gray-800 inline-block pb-1">
                      BONAFIDE CERTIFICATE
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="border-2 border-dashed border-blue-300 rounded p-4 mb-4 min-h-[200px] bg-blue-50/30">
                    <div className="text-xs text-blue-500 mb-2">CONTENT AREA - Drop fields here</div>
                    <p className="text-sm text-gray-600">
                      This is to certify that <span className="font-semibold">{"{{student_name}}"}</span>, 
                      bearing GR No. <span className="font-semibold">{"{{gr_number}}"}</span>, 
                      is a bonafide student of this institution studying in Class{" "}
                      <span className="font-semibold">{"{{class_section}}"}</span>.
                    </p>
                  </div>

                  {/* Footer Section */}
                  <div className="absolute bottom-8 left-8 right-8">
                    <div className="flex justify-between items-end">
                      <div className="border-2 border-dashed border-green-300 rounded p-2 w-24 h-24 bg-green-50/30 flex items-center justify-center">
                        <div className="text-center">
                          <QrCode className="w-8 h-8 text-gray-400 mx-auto" />
                          <span className="text-xs text-gray-500">QR Code</span>
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="border-2 border-dashed border-purple-300 rounded p-2 w-32 h-16 bg-purple-50/30 flex items-center justify-center mb-1">
                          <span className="text-xs text-gray-500">Signature</span>
                        </div>
                        <div className="text-sm font-medium">Principal</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Properties */}
          <div className="w-64 border-l pl-4">
            <h4 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Properties
            </h4>

            {/* Page Properties */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Paper Size</label>
                <Select
                  options={[
                  { value: 'A4', label: 'A4' },
                  { value: 'Letter', label: 'Letter' },
                  { value: 'Legal', label: 'Legal' }]
                  } />

              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Orientation</label>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">Portrait</Button>
                  <Button variant="ghost" size="sm" className="flex-1">Landscape</Button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Margins (mm)</label>
                <div className="grid grid-cols-2 gap-2">
                  <Input placeholder="Top" defaultValue="20" />
                  <Input placeholder="Right" defaultValue="15" />
                  <Input placeholder="Bottom" defaultValue="20" />
                  <Input placeholder="Left" defaultValue="15" />
                </div>
              </div>

              <div className="pt-4 border-t">
                <label className="block text-sm font-medium text-gray-700 mb-2">Background</label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded text-blue-600" />
                    <span className="text-sm">Watermark</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded text-blue-600" />
                    <span className="text-sm">Border Design</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded text-blue-600" defaultChecked />
                    <span className="text-sm">School Header</span>
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t">
                <label className="block text-sm font-medium text-gray-700 mb-2">Security Features</label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded text-blue-600" defaultChecked />
                    <span className="text-sm">QR Verification</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded text-blue-600" defaultChecked />
                    <span className="text-sm">Digital Signature</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded text-blue-600" />
                    <span className="text-sm">Serial Number</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>

      {/* Preview Modal */}
      <Modal
        isOpen={isPreviewModalOpen}
        onClose={() => setIsPreviewModalOpen(false)}
        title={`Preview: ${selectedTemplate?.name || ''}`}
        size="lg"
        footer={
        <div className="flex justify-between">
            <div className="flex gap-2">
              <Select
              options={[
              { value: 'sample1', label: 'Sample Student 1' },
              { value: 'sample2', label: 'Sample Student 2' },
              { value: 'custom', label: 'Enter Custom Data' }]
              } />

            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsPreviewModalOpen(false)}>
                Close
              </Button>
              <Button>
                <Printer className="w-4 h-4 mr-2" />
                Test Print
              </Button>
            </div>
          </div>
        }>

        <div className="bg-gray-100 p-4 rounded-lg">
          <div className="bg-white shadow-lg mx-auto" style={{ width: '595px', height: '842px' }}>
            {/* Certificate Preview Content */}
            <div className="p-8 h-full flex flex-col">
              {/* Header */}
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-3 flex items-center justify-center">
                  <Building className="w-10 h-10 text-gray-400" />
                </div>
                <h2 className="text-xl font-bold">DEMO PUBLIC SCHOOL</h2>
                <p className="text-sm text-gray-600">123 Education Street, City - 400001</p>
                <p className="text-xs text-gray-500">Phone: (022) 1234-5678 | Email: info@demoschool.edu</p>
              </div>

              {/* Title */}
              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold border-b-2 border-gray-800 inline-block pb-2">
                  BONAFIDE CERTIFICATE
                </h1>
              </div>

              {/* Reference */}
              <div className="flex justify-between text-sm mb-6">
                <span>Ref. No.: BON/2024/001</span>
                <span>Date: {new Date().toLocaleDateString()}</span>
              </div>

              {/* Content */}
              <div className="flex-1">
                <p className="text-justify leading-relaxed mb-4">
                  This is to certify that <strong>RAJESH KUMAR</strong>, son/daughter of{' '}
                  <strong>MR. SURESH KUMAR</strong>, bearing GR No. <strong>GR-2024-0156</strong>,
                  is a bonafide student of this institution.
                </p>
                <p className="text-justify leading-relaxed mb-4">
                  He/She is studying in <strong>Class X - Section A</strong> during the academic year 
                  <strong> 2024-2025</strong>. His/Her date of birth as per our records is{' '}
                  <strong>15th August 2010</strong>.
                </p>
                <p className="text-justify leading-relaxed">
                  This certificate is issued upon request for official purposes.
                </p>
              </div>

              {/* Footer */}
              <div className="flex justify-between items-end mt-8">
                <div className="w-24 h-24 border flex items-center justify-center">
                  <QrCode className="w-16 h-16 text-gray-400" />
                </div>
                <div className="text-center">
                  <div className="w-32 h-16 border-b border-gray-400 mb-1" />
                  <p className="text-sm font-medium">Principal</p>
                  <p className="text-xs text-gray-500">School Seal</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>

      {/* Print Settings Modal */}
      <Modal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        title="Print Settings"
        size="md"
        footer={
        <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsSettingsModalOpen(false)}>
              Cancel
            </Button>
            <Button>Save Settings</Button>
          </div>
        }>

        <div className="space-y-6">
          {/* Default Printer */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Default Printer</h4>
            <Select
              label="Select Printer"
              options={[
              { value: 'hp-office', label: 'HP OfficeJet Pro 9015 (Default)' },
              { value: 'canon-office', label: 'Canon imageCLASS MF644' },
              { value: 'pdf', label: 'Print to PDF' }]
              } />

          </div>

          {/* Print Quality */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Print Quality</h4>
            <div className="grid grid-cols-3 gap-3">
              <label className="flex flex-col items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input type="radio" name="quality" className="mb-2" />
                <span className="text-sm font-medium">Draft</span>
                <span className="text-xs text-gray-500">Fast, low ink</span>
              </label>
              <label className="flex flex-col items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 border-blue-500 bg-blue-50">
                <input type="radio" name="quality" className="mb-2" defaultChecked />
                <span className="text-sm font-medium">Normal</span>
                <span className="text-xs text-gray-500">Balanced</span>
              </label>
              <label className="flex flex-col items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input type="radio" name="quality" className="mb-2" />
                <span className="text-sm font-medium">High</span>
                <span className="text-xs text-gray-500">Best quality</span>
              </label>
            </div>
          </div>

          {/* Color Settings */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Color Mode</h4>
            <div className="flex gap-3">
              <label className="flex-1 flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input type="radio" name="color" defaultChecked />
                <div>
                  <span className="font-medium text-sm">Color</span>
                  <p className="text-xs text-gray-500">Full color printing</p>
                </div>
              </label>
              <label className="flex-1 flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input type="radio" name="color" />
                <div>
                  <span className="font-medium text-sm">Grayscale</span>
                  <p className="text-xs text-gray-500">Black & white only</p>
                </div>
              </label>
            </div>
          </div>

          {/* Paper Source */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Paper Source</h4>
            <Select
              options={[
              { value: 'auto', label: 'Auto Select' },
              { value: 'tray1', label: 'Tray 1 - A4 Plain' },
              { value: 'tray2', label: 'Tray 2 - Letter' },
              { value: 'manual', label: 'Manual Feed' }]
              } />

          </div>

          {/* Additional Options */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Additional Options</h4>
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded text-blue-600" defaultChecked />
                <span className="text-sm">Print certificate number on each page</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded text-blue-600" defaultChecked />
                <span className="text-sm">Include QR verification code</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded text-blue-600" />
                <span className="text-sm">Print watermark (COPY) for duplicates</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded text-blue-600" defaultChecked />
                <span className="text-sm">Show print preview before printing</span>
              </label>
            </div>
          </div>
        </div>
      </Modal>

      {/* Version History Modal */}
      <Modal
        isOpen={isVersionHistoryOpen}
        onClose={() => setIsVersionHistoryOpen(false)}
        title={`Version History: ${selectedTemplate?.name || ''}`}
        size="md"
        footer={
        <div className="flex justify-end">
            <Button variant="outline" onClick={() => setIsVersionHistoryOpen(false)}>
              Close
            </Button>
          </div>
        }>

        <div className="space-y-3">
          {[
          { version: '2.1', date: '2024-01-15', author: 'Admin', changes: 'Updated QR code position' },
          { version: '2.0', date: '2024-01-10', author: 'Admin', changes: 'Added digital signature field' },
          { version: '1.5', date: '2023-12-20', author: 'Teacher', changes: 'Fixed header alignment' },
          { version: '1.4', date: '2023-12-01', author: 'Admin', changes: 'Updated school logo' },
          { version: '1.0', date: '2023-10-15', author: 'Admin', changes: 'Initial template creation' }].
          map((v, i) =>
          <div
            key={v.version}
            className={`p-3 border rounded-lg ${i === 0 ? 'border-blue-200 bg-blue-50' : ''}`}>

              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">v{v.version}</span>
                  {i === 0 && <Badge variant="success" size="sm">Current</Badge>}
                </div>
                <span className="text-sm text-gray-500">{v.date}</span>
              </div>
              <p className="text-sm text-gray-600">{v.changes}</p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-gray-500">by {v.author}</span>
                {i !== 0 &&
              <div className="flex gap-2">
                    <Button variant="ghost" size="xs">
                      <Eye className="w-3 h-3 mr-1" />
                      Preview
                    </Button>
                    <Button variant="ghost" size="xs">
                      <RotateCcw className="w-3 h-3 mr-1" />
                      Restore
                    </Button>
                  </div>
              }
              </div>
            </div>
          )}
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Template"
        size="sm"
        footer={
        <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button
            variant="primary"
            className="bg-red-600 hover:bg-red-700"
            onClick={() => {
              console.log('Deleting:', selectedTemplate?.id);
              setIsDeleteModalOpen(false);
              setSelectedTemplate(null);
            }}>

              Delete Template
            </Button>
          </div>
        }>

        <div className="text-center py-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trash2 className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Delete "{selectedTemplate?.name}"?
          </h3>
          <p className="text-gray-500 text-sm">
            This action cannot be undone. This template has been used {selectedTemplate?.usageCount.toLocaleString()} times.
          </p>
        </div>
      </Modal>
    </div>);

}

// Grid View Component
interface TemplateGridProps {
  templates: Template[];
  onPreview: (template: Template) => void;
  onEdit: (template: Template) => void;
  onDuplicate: (template: Template) => void;
  onDelete: (template: Template) => void;
  selectedTemplates: string[];
  onToggleSelect: (id: string) => void;
}

function TemplateGrid({
  templates,
  onPreview,
  onEdit,
  onDuplicate,
  onDelete,
  selectedTemplates,
  onToggleSelect
}: TemplateGridProps) {
  if (templates.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
        <p>No templates found</p>
      </div>);

  }

  return (
    <div className="grid grid-cols-3 gap-4 p-4">
      {templates.map((template) =>
      <div
        key={template.id}
        className={`border rounded-lg overflow-hidden hover:shadow-md transition-shadow ${
        selectedTemplates.includes(template.id) ? 'ring-2 ring-blue-500' : ''}`
        }>

          {/* Thumbnail */}
          <div className="aspect-[3/4] bg-gray-100 relative group">
            <div className="absolute inset-0 flex items-center justify-center">
              <FileText className="w-16 h-16 text-gray-300" />
            </div>
            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <Button size="sm" variant="secondary" onClick={() => onPreview(template)}>
                <Eye className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="secondary" onClick={() => onEdit(template)}>
                <Edit2 className="w-4 h-4" />
              </Button>
            </div>
            {/* Selection checkbox */}
            <div className="absolute top-2 left-2">
              <input
              type="checkbox"
              checked={selectedTemplates.includes(template.id)}
              onChange={() => onToggleSelect(template.id)}
              className="rounded border-gray-300" />

            </div>
            {/* Status badge */}
            <div className="absolute top-2 right-2">
              <Badge
              variant={template.status === 'Active' ? 'success' : template.status === 'Draft' ? 'warning' : 'secondary'}
              size="sm">

                {template.status}
              </Badge>
            </div>
            {/* Default star */}
            {template.isDefault &&
          <div className="absolute bottom-2 right-2">
                <Star className="w-5 h-5 text-yellow-500 fill-current" />
              </div>
          }
          </div>
          {/* Info */}
          <div className="p-3">
            <h4 className="font-medium text-sm truncate">{template.name}</h4>
            <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
              <span>{template.language}</span>
              <span>•</span>
              <span>v{template.version}</span>
              <span>•</span>
              <span>{template.usageCount} uses</span>
            </div>
            <div className="flex gap-1 mt-2">
              {template.hasDigitalSignature &&
            <span className="p-1 bg-green-50 rounded">
                  <Signature className="w-3 h-3 text-green-600" />
                </span>
            }
              {template.hasQrCode &&
            <span className="p-1 bg-blue-50 rounded">
                  <QrCode className="w-3 h-3 text-blue-600" />
                </span>
            }
              {template.hasWatermark &&
            <span className="p-1 bg-purple-50 rounded">
                  <Image className="w-3 h-3 text-purple-600" />
                </span>
            }
            </div>
          </div>
        </div>
      )}
    </div>);

}