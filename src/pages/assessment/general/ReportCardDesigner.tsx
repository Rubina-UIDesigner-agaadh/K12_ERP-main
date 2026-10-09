import React, { useState, useRef } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import {
  Search, Save, RefreshCcw, Eye, Edit3, X, Settings, Check, Clock, Loader2,
  Layers, List, Layout, LayoutTemplate, PanelLeft, PanelRight, Image, Type,
  Table, BarChart3, PieChart, Signature, PenLine, StickyNote, BookOpen, Hash,
  AlignLeft, AlignCenter, AlignRight, Bold, Italic, Underline, Move, Maximize2,
  Minimize2, ZoomIn, ZoomOut, RotateCcw, Undo2, Redo2, Copy, Trash2, Plus,
  History, Upload, Download, Share2, Send, FileCheck, Globe, Lock, Unlock,
  Archive, GitBranch, PenTool, Droplet, Palette, Square, Circle, Minus,
  Database, Link2, Filter, Equal, Sparkles, Wand2, Users, Calculator, Calendar,
  Trophy, Target, TrendingUp, Stamp, QrCode, GripVertical, GraduationCap,
  MousePointer2, FileUp, FolderOpen, ChevronRight, ChevronDown, ChevronLeft,
  FileText, School, Award, ClipboardList, Paintbrush, ImagePlus, Grid, ChevronUp } from
'lucide-react';

interface CanvasElement {
  id: string;
  type: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  properties: Record<string, any>;
  style: Record<string, any>;
  locked: boolean;
  visible: boolean;
  zIndex: number;
}

interface ReportTemplate {
  id: string;
  name: string;
  className: string;
  examType: string;
  status: 'draft' | 'published' | 'archived';
  thumbnail: string;
  lastModified: string;
  createdBy: string;
  elements: CanvasElement[];
  background: BackgroundSettings;
}

interface BackgroundSettings {
  type: 'color' | 'gradient' | 'pattern' | 'image';
  color: string;
  gradientStart: string;
  gradientEnd: string;
  gradientDirection: string;
  pattern: string;
  imageUrl: string;
  opacity: number;
}

interface TemplateVersion {
  id: string;
  name: string;
  version: string;
  status: 'draft' | 'published' | 'archived';
  createdAt: string;
  createdBy: string;
  note: string;
}

// Constants
const classOptions = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
const examTypes = [
{ id: 'unit1', name: 'Unit Test 1', short: 'UT1' },
{ id: 'unit2', name: 'Unit Test 2', short: 'UT2' },
{ id: 'halfyearly', name: 'Half Yearly', short: 'HY' },
{ id: 'unit3', name: 'Unit Test 3', short: 'UT3' },
{ id: 'unit4', name: 'Unit Test 4', short: 'UT4' },
{ id: 'final', name: 'Final Examination', short: 'Final' },
{ id: 'semester1', name: 'Semester 1', short: 'Sem1' },
{ id: 'semester2', name: 'Semester 2', short: 'Sem2' }];


const defaultBackground: BackgroundSettings = {
  type: 'color',
  color: '#ffffff',
  gradientStart: '#ffffff',
  gradientEnd: '#f3f4f6',
  gradientDirection: 'to bottom',
  pattern: '',
  imageUrl: '',
  opacity: 100
};

const defaultElements: CanvasElement[] = [
{ id: 'header-1', type: 'header', name: 'Page Header', x: 0, y: 0, width: 794, height: 100, properties: { showLogo: true, showSchoolName: true, showAddress: true }, style: { backgroundColor: '#1e40af', textColor: '#ffffff', fontSize: 18, fontWeight: 'bold' }, locked: true, visible: true, zIndex: 10 },
{ id: 'student-info-1', type: 'student_info', name: 'Student Information', x: 20, y: 120, width: 350, height: 100, properties: {}, style: {}, locked: false, visible: true, zIndex: 5 },
{ id: 'marks-table-1', type: 'marks_table', name: 'Marks Table', x: 20, y: 240, width: 750, height: 300, properties: { showGrade: true, showRank: true, showRemarks: true }, style: {}, locked: false, visible: true, zIndex: 5 },
{ id: 'summary-1', type: 'summary', name: 'Result Summary', x: 420, y: 120, width: 350, height: 100, properties: {}, style: {}, locked: false, visible: true, zIndex: 5 },
{ id: 'graph-1', type: 'barchart', name: 'Performance Graph', x: 20, y: 560, width: 450, height: 180, properties: {}, style: {}, locked: false, visible: true, zIndex: 5 },
{ id: 'remarks-1', type: 'remarks', name: 'Class Teacher Remarks', x: 490, y: 560, width: 280, height: 100, properties: {}, style: {}, locked: false, visible: true, zIndex: 5 },
{ id: 'signatures-1', type: 'signatures', name: 'Signature Block', x: 20, y: 760, width: 750, height: 80, properties: {}, style: {}, locked: false, visible: true, zIndex: 5 }];


const mockTemplates: ReportTemplate[] = [
{ id: '1', name: 'Standard Report Card', className: '10', examType: 'final', status: 'published', thumbnail: '', lastModified: '2025-03-15', createdBy: 'Admin', elements: defaultElements, background: defaultBackground },
{ id: '2', name: 'Detailed Report', className: '10', examType: 'halfyearly', status: 'published', thumbnail: '', lastModified: '2025-03-10', createdBy: 'Admin', elements: defaultElements, background: defaultBackground },
{ id: '3', name: 'Simple Report', className: '9', examType: 'final', status: 'draft', thumbnail: '', lastModified: '2025-03-08', createdBy: 'Designer', elements: defaultElements, background: defaultBackground },
{ id: '4', name: 'Primary Report', className: '5', examType: 'semester1', status: 'published', thumbnail: '', lastModified: '2025-03-05', createdBy: 'Admin', elements: defaultElements, background: defaultBackground },
{ id: '5', name: 'Unit Test Report', className: '10', examType: 'unit1', status: 'archived', thumbnail: '', lastModified: '2025-02-20', createdBy: 'Designer', elements: defaultElements, background: defaultBackground },
{ id: '6', name: 'Semester 2 Report', className: '11', examType: 'semester2', status: 'published', thumbnail: '', lastModified: '2025-02-15', createdBy: 'Admin', elements: defaultElements, background: defaultBackground }];


const elementLibrary = [
{ category: 'Basic', items: [
  { id: 'header', name: 'Header', icon: AlignLeft, description: 'Page header section' },
  { id: 'text', name: 'Text Block', icon: Type, description: 'Custom text' },
  { id: 'image', name: 'Image', icon: Image, description: 'Image / Logo' },
  { id: 'line', name: 'Divider Line', icon: Minus, description: 'Horizontal line' },
  { id: 'rectangle', name: 'Box', icon: Square, description: 'Rectangle shape' }]
},
{ category: 'Data Blocks', items: [
  { id: 'student_info', name: 'Student Information', icon: Users, description: 'Student name, class, roll no' },
  { id: 'marks_table', name: 'Marks Table', icon: Table, description: 'Subject wise marks' },
  { id: 'summary', name: 'Result Summary', icon: Calculator, description: 'Total, percentage, grade' },
  { id: 'attendance', name: 'Attendance', icon: Calendar, description: 'Attendance summary' },
  { id: 'rank', name: 'Class Rank', icon: Trophy, description: 'Rank and position' }]
},
{ category: 'Visualization', items: [
  { id: 'barchart', name: 'Bar Chart', icon: BarChart3, description: 'Subject performance' },
  { id: 'piechart', name: 'Pie Chart', icon: PieChart, description: 'Grade distribution' },
  { id: 'radarchart', name: 'Radar Chart', icon: Target, description: 'Skills comparison' },
  { id: 'trend', name: 'Progress Graph', icon: TrendingUp, description: 'Historical comparison' }]
},
{ category: 'Footer', items: [
  { id: 'remarks', name: 'Remarks', icon: StickyNote, description: 'Teacher comments' },
  { id: 'signatures', name: 'Signatures', icon: Signature, description: 'Signature block' },
  { id: 'stamp', name: 'Official Stamp', icon: Stamp, description: 'School stamp' },
  { id: 'qr', name: 'QR Code', icon: QrCode, description: 'Verification QR code' }]
}];


const patterns = ['dots', 'lines', 'grid', 'diagonal', 'waves', 'circles'];
const gradientDirections = ['to right', 'to bottom', 'to bottom right', 'to bottom left', 'to top right'];

export function ReportCardDesigner() {
  // Main View State
  const [currentView, setCurrentView] = useState<'selector' | 'designer'>('selector');

  // Template Selection States
  const [templates, setTemplates] = useState<ReportTemplate[]>(mockTemplates);
  const [selectedClassFilter, setSelectedClassFilter] = useState<string>('');
  const [selectedExamFilter, setSelectedExamFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showImportModal, setShowImportModal] = useState(false);
  const [importForm, setImportForm] = useState({ name: '', className: '', examType: '' });

  // Designer States
  const [activeTemplate, setActiveTemplate] = useState<ReportTemplate | null>(null);
  const [viewMode, setViewMode] = useState<'design' | 'preview' | 'settings'>('design');
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [draggedElement, setDraggedElement] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [showGrid, setShowGrid] = useState(true);
  const [showRulers, setShowRulers] = useState(true);
  const [snapToGrid, setSnapToGrid] = useState(true);
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [activeTab, setActiveTab] = useState<'elements' | 'properties' | 'background' | 'data'>('elements');
  const [gridSize, setGridSize] = useState(10);

  // Element States
  const [elements, setElements] = useState<CanvasElement[]>([]);
  const [background, setBackground] = useState<BackgroundSettings>(defaultBackground);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [editingElement, setEditingElement] = useState<CanvasElement | null>(null);
  const [showElementEditor, setShowElementEditor] = useState(false);

  const canvasRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Template Versions
  const versions: TemplateVersion[] = [
  { id: 'v3.1', name: 'Version 3.1', version: '3.1', status: 'published', createdAt: '15 Mar 2025, 10:30 AM', createdBy: 'Admin', note: 'Major design update' },
  { id: 'v3.0', name: 'Version 3.0', version: '3.0', status: 'archived', createdAt: '01 Mar 2025, 09:00 AM', createdBy: 'Designer', note: 'Initial release' },
  { id: 'v2.5', name: 'Version 2.5', version: '2.5', status: 'archived', createdAt: '15 Feb 2025, 11:45 AM', createdBy: 'Admin', note: 'Old design' }];


  // Filtered Templates
  const filteredTemplates = templates.filter((t) => {
    if (selectedClassFilter && t.className !== selectedClassFilter) return false;
    if (selectedExamFilter && t.examType !== selectedExamFilter) return false;
    if (statusFilter && t.status !== statusFilter) return false;
    if (searchQuery && !t.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  // Handlers - Template Selection
  const handleSelectTemplate = (template: ReportTemplate) => {
    setActiveTemplate(template);
    setElements([...template.elements]);
    setBackground({ ...template.background });
    setCurrentView('designer');
    setSelectedElement(null);
    setIsDirty(false);
  };

  const handleCreateNew = () => {
    if (!selectedClassFilter || !selectedExamFilter) {
      alert('Please select a class and exam type first');
      return;
    }
    const examName = examTypes.find((e) => e.id === selectedExamFilter)?.name || '';
    const newTemplate: ReportTemplate = {
      id: Date.now().toString(),
      name: `New Report Card - Class ${selectedClassFilter} ${examName}`,
      className: selectedClassFilter,
      examType: selectedExamFilter,
      status: 'draft',
      thumbnail: '',
      lastModified: new Date().toISOString().split('T')[0],
      createdBy: 'Admin',
      elements: [...defaultElements],
      background: { ...defaultBackground }
    };
    setActiveTemplate(newTemplate);
    setElements([...defaultElements]);
    setBackground({ ...defaultBackground });
    setCurrentView('designer');
    setIsDirty(true);
  };

  const handleImportTemplate = () => {
    if (!importForm.name || !importForm.className || !importForm.examType) {
      alert('Please fill all fields');
      return;
    }
    fileInputRef.current?.click();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        const newTemplate: ReportTemplate = {
          id: Date.now().toString(),
          name: importForm.name,
          className: importForm.className,
          examType: importForm.examType,
          status: 'draft',
          thumbnail: '',
          lastModified: new Date().toISOString().split('T')[0],
          createdBy: 'Admin',
          elements: data.elements || defaultElements,
          background: data.background || defaultBackground
        };
        setTemplates((prev) => [...prev, newTemplate]);
        setShowImportModal(false);
        setImportForm({ name: '', className: '', examType: '' });
        alert('Template imported successfully!');
      } catch {
        alert('Invalid template file');
      }
    };
    reader.readAsText(file);
  };

  const handleExportTemplate = () => {
    if (!activeTemplate) return;
    const data = JSON.stringify({ elements, background }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeTemplate.name.replace(/\s+/g, '_')}.json`;
    a.click();
  };

  const handleDeleteTemplate = (templateId: string) => {
    if (confirm('Are you sure you want to delete this template?')) {
      setTemplates((prev) => prev.filter((t) => t.id !== templateId));
    }
  };

  // Handlers - Designer
  const handleDragStart = (elementId: string) => setDraggedElement(elementId);
  const handleDragEnd = () => setDraggedElement(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (!draggedElement || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const snappedX = snapToGrid ? Math.round(x / gridSize) * gridSize : x;
    const snappedY = snapToGrid ? Math.round(y / gridSize) * gridSize : y;

    const newElement: CanvasElement = {
      id: `${draggedElement}-${Date.now()}`,
      type: draggedElement,
      name: `New ${draggedElement}`,
      x: snappedX,
      y: snappedY,
      width: 200,
      height: 100,
      properties: {},
      style: {},
      locked: false,
      visible: true,
      zIndex: elements.length + 1
    };

    setElements([...elements, newElement]);
    setSelectedElement(newElement.id);
    setDraggedElement(null);
    setIsDirty(true);
  };

  const handleDeleteElement = () => {
    if (!selectedElement) return;
    const el = elements.find((e) => e.id === selectedElement);
    if (el?.locked) {
      alert('This element is locked and cannot be deleted');
      return;
    }
    setElements(elements.filter((e) => e.id !== selectedElement));
    setSelectedElement(null);
    setShowDeleteConfirm(false);
    setIsDirty(true);
  };

  const handleDuplicateElement = () => {
    if (!selectedElement) return;
    const el = elements.find((e) => e.id === selectedElement);
    if (!el) return;
    const newElement: CanvasElement = {
      ...el,
      id: `${el.type}-${Date.now()}`,
      x: el.x + 20,
      y: el.y + 20,
      locked: false
    };
    setElements([...elements, newElement]);
    setSelectedElement(newElement.id);
    setIsDirty(true);
  };

  const handleEditElement = () => {
    if (!selectedElement) return;
    const el = elements.find((e) => e.id === selectedElement);
    if (el) {
      setEditingElement({ ...el });
      setShowElementEditor(true);
    }
  };

  const handleSaveElementEdit = () => {
    if (!editingElement) return;
    setElements(elements.map((e) => e.id === editingElement.id ? editingElement : e));
    setShowElementEditor(false);
    setEditingElement(null);
    setIsDirty(true);
  };

  const handleToggleLock = () => {
    if (!selectedElement) return;
    setElements(elements.map((e) => e.id === selectedElement ? { ...e, locked: !e.locked } : e));
    setIsDirty(true);
  };

  const handleToggleVisibility = () => {
    if (!selectedElement) return;
    setElements(elements.map((e) => e.id === selectedElement ? { ...e, visible: !e.visible } : e));
    setIsDirty(true);
  };

  const getSelectedElementData = () => elements.find((e) => e.id === selectedElement);

  const updateElementProperty = (property: string, value: any) => {
    if (!selectedElement) return;
    setElements(elements.map((e) => e.id === selectedElement ? { ...e, [property]: value } : e));
    setIsDirty(true);
  };

  const handleSaveTemplate = () => {
    if (!activeTemplate) return;
    const updated: ReportTemplate = {
      ...activeTemplate,
      elements,
      background,
      lastModified: new Date().toISOString().split('T')[0]
    };
    setTemplates((prev) => {
      const exists = prev.find((t) => t.id === updated.id);
      if (exists) return prev.map((t) => t.id === updated.id ? updated : t);
      return [...prev, updated];
    });
    setActiveTemplate(updated);
    setIsDirty(false);
    alert('Template saved successfully!');
  };

  const handlePublishTemplate = () => {
    if (!activeTemplate) return;
    const updated: ReportTemplate = {
      ...activeTemplate,
      elements,
      background,
      status: 'published',
      lastModified: new Date().toISOString().split('T')[0]
    };
    setTemplates((prev) => prev.map((t) => t.id === updated.id ? updated : t));
    setActiveTemplate(updated);
    setIsDirty(false);
    alert('Template published successfully!');
  };

  const getBackgroundStyle = (): React.CSSProperties => {
    const { type, color, gradientStart, gradientEnd, gradientDirection, pattern, imageUrl, opacity } = background;
    let style: React.CSSProperties = {};

    switch (type) {
      case 'color':
        style.backgroundColor = color;
        break;
      case 'gradient':
        style.background = `linear-gradient(${gradientDirection}, ${gradientStart}, ${gradientEnd})`;
        break;
      case 'pattern':
        style.backgroundColor = color;
        if (pattern === 'dots') style.backgroundImage = 'radial-gradient(circle, #e5e7eb 1px, transparent 1px)';else
        if (pattern === 'lines') style.backgroundImage = 'repeating-linear-gradient(0deg, transparent, transparent 9px, #e5e7eb 9px, #e5e7eb 10px)';else
        if (pattern === 'grid') style.backgroundImage = 'linear-gradient(#e5e7eb 1px, transparent 1px), linear-gradient(90deg, #e5e7eb 1px, transparent 1px)';else
        if (pattern === 'diagonal') style.backgroundImage = 'repeating-linear-gradient(45deg, transparent, transparent 9px, #e5e7eb 9px, #e5e7eb 10px)';
        style.backgroundSize = '20px 20px';
        break;
      case 'image':
        if (imageUrl) {
          style.backgroundImage = `url(${imageUrl})`;
          style.backgroundSize = 'cover';
          style.backgroundPosition = 'center';
        }
        break;
    }

    style.opacity = opacity / 100;
    return style;
  };

  // Render Template Selector
  if (currentView === 'selector') {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        {/* Header */}
        <div className="mb-6 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-600 rounded-xl shadow-lg">
              <LayoutTemplate className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Report Card Designer</h1>
              <p className="text-sm text-gray-500">Select or create report card templates</p>
            </div>
          </div>
          <Button variant="outline" onClick={() => setShowImportModal(true)}>
            <Upload className="w-4 h-4 mr-2" />
            Import Template
          </Button>
        </div>

        {/* Filters */}
        <Card className="p-4 mb-6">
          <div className="grid grid-cols-5 gap-4">
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">Class</label>
              <select value={selectedClassFilter} onChange={(e) => setSelectedClassFilter(e.target.value)} className="w-full rounded-lg border border-gray-300 p-2 text-sm">
                <option value="">All Classes</option>
                {classOptions.map((c) => <option key={c} value={c}>Class {c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">Exam Type</label>
              <select value={selectedExamFilter} onChange={(e) => setSelectedExamFilter(e.target.value)} className="w-full rounded-lg border border-gray-300 p-2 text-sm">
                <option value="">All Exam Types</option>
                {examTypes.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">Status</label>
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full rounded-lg border border-gray-300 p-2 text-sm">
                <option value="">All Status</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="text" placeholder="Search templates..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-9 rounded-lg border border-gray-300 p-2 text-sm" />
              </div>
            </div>
            <div className="flex items-end">
              <Button variant="outline" className="w-full" onClick={() => {setSelectedClassFilter('');setSelectedExamFilter('');setStatusFilter('');setSearchQuery('');}}>
                <RefreshCcw className="w-4 h-4 mr-2" />Reset
              </Button>
            </div>
          </div>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
          { label: 'Total Templates', value: templates.length, icon: FileText, color: 'blue' },
          { label: 'Published', value: templates.filter((t) => t.status === 'published').length, icon: Globe, color: 'green' },
          { label: 'Drafts', value: templates.filter((t) => t.status === 'draft').length, icon: Edit3, color: 'yellow' },
          { label: 'Archived', value: templates.filter((t) => t.status === 'archived').length, icon: Archive, color: 'gray' }].
          map((stat, i) =>
          <Card key={i} className={`p-4 border-l-4 border-l-${stat.color}-500`}>
              <div className="flex items-center justify-between">
                <div><p className="text-xs text-gray-500">{stat.label}</p><p className="text-2xl font-bold">{stat.value}</p></div>
                <stat.icon className={`w-8 h-8 text-${stat.color}-500 opacity-50`} />
              </div>
            </Card>
          )}
        </div>

        {/* Create New */}
        {selectedClassFilter && selectedExamFilter &&
        <Card className="p-4 mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-lg"><Plus className="w-6 h-6 text-blue-600" /></div>
                <div>
                  <h3 className="font-semibold text-gray-900">Create New Template</h3>
                  <p className="text-sm text-gray-500">Class {selectedClassFilter} • {examTypes.find((e) => e.id === selectedExamFilter)?.name}</p>
                </div>
              </div>
              <Button variant="primary" onClick={handleCreateNew}><Plus className="w-4 h-4 mr-2" />Create New</Button>
            </div>
          </Card>
        }

        {/* Templates Grid */}
        <div className="grid grid-cols-4 gap-4">
          {filteredTemplates.map((template) =>
          <Card key={template.id} className="overflow-hidden hover:shadow-lg transition-all cursor-pointer group">
              <div className="h-40 bg-gradient-to-br from-gray-100 to-gray-200 relative flex items-center justify-center" onClick={() => handleSelectTemplate(template)}>
                <FileText className="w-16 h-16 text-gray-400" />
                <Badge className={`absolute top-2 right-2 ${template.status === 'published' ? 'bg-green-100 text-green-700' : template.status === 'draft' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600'}`}>
                  {template.status}
                </Badge>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 truncate">{template.name}</h3>
                <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                  <School className="w-4 h-4" /><span>Class {template.className}</span><span>•</span>
                  <span>{examTypes.find((e) => e.id === template.examType)?.short}</span>
                </div>
                <p className="text-xs text-gray-400 mt-2">Modified: {template.lastModified}</p>
                <div className="flex gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="primary" size="sm" className="flex-1" onClick={() => handleSelectTemplate(template)}><Edit3 className="w-4 h-4 mr-1" />Edit</Button>
                  <Button variant="outline" size="sm" onClick={() => handleSelectTemplate(template)}><Eye className="w-4 h-4" /></Button>
                  <Button variant="outline" size="sm" className="text-red-600" onClick={() => handleDeleteTemplate(template.id)}><Trash2 className="w-4 h-4" /></Button>
                </div>
              </div>
            </Card>
          )}

          {filteredTemplates.length === 0 &&
          <div className="col-span-4 py-12 text-center text-gray-500">
              <FileText className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p className="font-medium">No templates found</p>
              <p className="text-sm">Create a new template or adjust your filters</p>
            </div>
          }
        </div>

        {/* Import Modal */}
        {showImportModal &&
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Import Template</h2>
                <Button variant="ghost" size="sm" onClick={() => setShowImportModal(false)}><X className="w-5 h-5" /></Button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Template Name *</label>
                  <input type="text" value={importForm.name} onChange={(e) => setImportForm((p) => ({ ...p, name: e.target.value }))} placeholder="Enter template name" className="w-full mt-1 rounded-lg border border-gray-300 p-2" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Class *</label>
                    <select value={importForm.className} onChange={(e) => setImportForm((p) => ({ ...p, className: e.target.value }))} className="w-full mt-1 rounded-lg border border-gray-300 p-2">
                      <option value="">Select Class</option>
                      {classOptions.map((c) => <option key={c} value={c}>Class {c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Exam Type *</label>
                    <select value={importForm.examType} onChange={(e) => setImportForm((p) => ({ ...p, examType: e.target.value }))} className="w-full mt-1 rounded-lg border border-gray-300 p-2">
                      <option value="">Select Type</option>
                      {examTypes.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}
                    </select>
                  </div>
                </div>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="w-10 h-10 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                  <p className="text-xs text-gray-400 mt-1">JSON files only</p>
                </div>
                <input type="file" ref={fileInputRef} accept=".json" onChange={handleFileUpload} className="hidden" />
              </div>
              <div className="flex gap-3 mt-6">
                <Button variant="outline" className="flex-1" onClick={() => setShowImportModal(false)}>Cancel</Button>
                <Button variant="primary" className="flex-1" onClick={handleImportTemplate}><Upload className="w-4 h-4 mr-2" />Import</Button>
              </div>
            </Card>
          </div>
        }
      </div>);

  }

  // Render Designer
  return (
    <div className="h-screen flex flex-col bg-gray-100 overflow-hidden">
      {/* Top Toolbar */}
      <div className="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => setCurrentView('selector')}>
            <ChevronLeft className="w-4 h-4 mr-1" />Back
          </Button>
          <div className="w-px h-6 bg-gray-200" />
          <LayoutTemplate className="w-6 h-6 text-blue-600" />
          <div>
            <h1 className="text-lg font-bold text-gray-900">{activeTemplate?.name}</h1>
            <div className="flex items-center gap-2">
              <Badge className="text-xs">Class {activeTemplate?.className}</Badge>
              <Badge className="text-xs">{examTypes.find((e) => e.id === activeTemplate?.examType)?.name}</Badge>
              <Badge variant={activeTemplate?.status === 'published' ? 'success' : activeTemplate?.status === 'draft' ? 'warning' : 'secondary'} className="text-xs">{activeTemplate?.status}</Badge>
              {isDirty && <Badge variant="warning" className="px-2 py-1">Unsaved Changes</Badge>}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" disabled><Undo2 className="w-4 h-4" /></Button>
          <Button variant="ghost" size="sm" disabled><Redo2 className="w-4 h-4" /></Button>
          <div className="w-px h-6 bg-gray-200 mx-2" />
          <Button variant="ghost" size="sm" onClick={() => setZoomLevel(Math.max(50, zoomLevel - 10))}><ZoomOut className="w-4 h-4" /></Button>
          <span className="text-sm text-gray-600 w-12 text-center">{zoomLevel}%</span>
          <Button variant="ghost" size="sm" onClick={() => setZoomLevel(Math.min(200, zoomLevel + 10))}><ZoomIn className="w-4 h-4" /></Button>
          <div className="w-px h-6 bg-gray-200 mx-2" />
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <button onClick={() => setViewMode('design')} className={`p-2 rounded ${viewMode === 'design' ? 'bg-white shadow-sm' : 'text-gray-500'}`}><PenTool className="w-4 h-4" /></button>
            <button onClick={() => setViewMode('preview')} className={`p-2 rounded ${viewMode === 'preview' ? 'bg-white shadow-sm' : 'text-gray-500'}`}><Eye className="w-4 h-4" /></button>
            <button onClick={() => setViewMode('settings')} className={`p-2 rounded ${viewMode === 'settings' ? 'bg-white shadow-sm' : 'text-gray-500'}`}><Settings className="w-4 h-4" /></button>
          </div>
          <div className="w-px h-6 bg-gray-200 mx-2" />
          <Button variant="ghost" size="sm" onClick={handleExportTemplate}><Download className="w-4 h-4 mr-2" />Export</Button>
          <Button variant="ghost" size="sm" onClick={() => setShowVersionHistory(true)}><GitBranch className="w-4 h-4 mr-2" />Versions</Button>
          <Button variant="outline" size="sm" disabled={!isDirty} onClick={handleSaveTemplate}><Save className="w-4 h-4 mr-2" />Save Draft</Button>
          <Button variant="primary" size="sm" onClick={handlePublishTemplate}><Globe className="w-4 h-4 mr-2" />Publish</Button>
        </div>
      </div>

      {/* Main Designer Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200 flex flex-col shrink-0">
          <div className="flex border-b border-gray-200">
            {['elements', 'properties', 'background', 'data'].map((tab) =>
            <button key={tab} className={`flex-1 py-3 text-xs font-medium border-b-2 capitalize ${activeTab === tab ? 'text-blue-600 border-blue-600' : 'text-gray-500 border-transparent'}`} onClick={() => setActiveTab(tab as any)}>{tab}</button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-3">
            {/* Elements Tab */}
            {activeTab === 'elements' &&
            <div className="space-y-5">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2"><Settings className="w-4 h-4 text-gray-500" /><span className="text-sm font-medium text-gray-700">Canvas Settings</span></div>
                </div>
                <div className="space-y-2 pl-2 text-sm">
                  <label className="flex items-center justify-between cursor-pointer"><span>Show Grid</span><input type="checkbox" checked={showGrid} onChange={() => setShowGrid(!showGrid)} className="rounded" /></label>
                  <label className="flex items-center justify-between cursor-pointer"><span>Snap to Grid</span><input type="checkbox" checked={snapToGrid} onChange={() => setSnapToGrid(!snapToGrid)} className="rounded" /></label>
                  <label className="flex items-center justify-between cursor-pointer"><span>Show Rulers</span><input type="checkbox" checked={showRulers} onChange={() => setShowRulers(!showRulers)} className="rounded" /></label>
                  <div>
                    <span className="text-gray-500 text-xs">Grid Size</span>
                    <select value={gridSize} onChange={(e) => setGridSize(Number(e.target.value))} className="w-full mt-1 rounded border border-gray-300 text-sm px-2 py-1">
                      <option value={5}>5px</option><option value={10}>10px</option><option value={20}>20px</option>
                    </select>
                  </div>
                </div>
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase mb-3">Drag & Drop Elements</h3>
                  <div className="space-y-4">
                    {elementLibrary.map((category) =>
                  <div key={category.category}>
                        <p className="text-xs font-medium text-gray-600 mb-2">{category.category}</p>
                        <div className="space-y-1">
                          {category.items.map((element) =>
                      <div key={element.id} draggable onDragStart={() => handleDragStart(element.id)} onDragEnd={handleDragEnd} className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 border border-gray-200 cursor-grab hover:border-gray-300 transition-all">
                              <div className="p-1 bg-gray-100 rounded"><element.icon className="w-4 h-4 text-gray-600" /></div>
                              <span className="text-sm text-gray-700">{element.name}</span>
                              <GripVertical className="w-4 h-4 text-gray-400 ml-auto" />
                            </div>
                      )}
                        </div>
                      </div>
                  )}
                  </div>
                </div>
              </div>
            }

            {/* Properties Tab */}
            {activeTab === 'properties' && selectedElement &&
            <div className="space-y-4">
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm font-medium text-blue-800">{getSelectedElementData()?.name}</p>
                  <p className="text-xs text-blue-600">{getSelectedElementData()?.type}</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div><label className="text-xs text-gray-500">X Position</label><input type="number" className="w-full rounded border border-gray-300 text-sm px-2 py-1" value={getSelectedElementData()?.x || 0} onChange={(e) => updateElementProperty('x', Number(e.target.value))} /></div>
                  <div><label className="text-xs text-gray-500">Y Position</label><input type="number" className="w-full rounded border border-gray-300 text-sm px-2 py-1" value={getSelectedElementData()?.y || 0} onChange={(e) => updateElementProperty('y', Number(e.target.value))} /></div>
                  <div><label className="text-xs text-gray-500">Width</label><input type="number" className="w-full rounded border border-gray-300 text-sm px-2 py-1" value={getSelectedElementData()?.width || 0} onChange={(e) => updateElementProperty('width', Number(e.target.value))} /></div>
                  <div><label className="text-xs text-gray-500">Height</label><input type="number" className="w-full rounded border border-gray-300 text-sm px-2 py-1" value={getSelectedElementData()?.height || 0} onChange={(e) => updateElementProperty('height', Number(e.target.value))} /></div>
                </div>
                <div className="space-y-2">
                  <label className="flex items-center justify-between text-sm cursor-pointer"><span>Locked</span><input type="checkbox" checked={getSelectedElementData()?.locked || false} onChange={handleToggleLock} className="rounded" /></label>
                  <label className="flex items-center justify-between text-sm cursor-pointer"><span>Visible</span><input type="checkbox" checked={getSelectedElementData()?.visible || false} onChange={handleToggleVisibility} className="rounded" /></label>
                </div>
                <div className="border-t border-gray-200 pt-3 space-y-2">
                  <Button variant="outline" size="sm" className="w-full" onClick={handleEditElement}><Edit3 className="w-4 h-4 mr-1" />Edit Element</Button>
                  <Button variant="ghost" size="sm" className="w-full" onClick={handleDuplicateElement}><Copy className="w-4 h-4 mr-1" />Duplicate</Button>
                  <Button variant="ghost" size="sm" className="w-full text-red-600 hover:bg-red-50" onClick={() => setShowDeleteConfirm(true)}><Trash2 className="w-4 h-4 mr-1" />Delete</Button>
                </div>
              </div>
            }

            {activeTab === 'properties' && !selectedElement &&
            <div className="text-center py-12 text-gray-500"><MousePointer2 className="w-12 h-12 mx-auto mb-2 opacity-30" /><p className="text-sm">Select an element to edit its properties</p></div>
            }

            {/* Background Tab */}
            {activeTab === 'background' &&
            <div className="space-y-4">
                <div><label className="text-xs font-medium text-gray-600 mb-2 block">Background Type</label>
                  <div className="grid grid-cols-2 gap-2">
                    {(['color', 'gradient', 'pattern', 'image'] as const).map((type) =>
                  <button key={type} onClick={() => setBackground((p) => ({ ...p, type }))} className={`p-2 rounded-lg border text-xs capitalize ${background.type === type ? 'bg-blue-50 border-blue-300 text-blue-700' : 'border-gray-200 hover:bg-gray-50'}`}>{type}</button>
                  )}
                  </div>
                </div>

                {background.type === 'color' &&
              <div><label className="text-xs text-gray-500">Background Color</label><input type="color" value={background.color} onChange={(e) => setBackground((p) => ({ ...p, color: e.target.value }))} className="w-full h-10 rounded cursor-pointer border-0 p-0" /></div>
              }

                {background.type === 'gradient' &&
              <>
                    <div className="grid grid-cols-2 gap-2">
                      <div><label className="text-xs text-gray-500">Start Color</label><input type="color" value={background.gradientStart} onChange={(e) => setBackground((p) => ({ ...p, gradientStart: e.target.value }))} className="w-full h-8 rounded cursor-pointer" /></div>
                      <div><label className="text-xs text-gray-500">End Color</label><input type="color" value={background.gradientEnd} onChange={(e) => setBackground((p) => ({ ...p, gradientEnd: e.target.value }))} className="w-full h-8 rounded cursor-pointer" /></div>
                    </div>
                    <div><label className="text-xs text-gray-500">Direction</label>
                      <select value={background.gradientDirection} onChange={(e) => setBackground((p) => ({ ...p, gradientDirection: e.target.value }))} className="w-full rounded border border-gray-300 p-2 text-sm">
                        {gradientDirections.map((d) => <option key={d} value={d}>{d}</option>)}
                      </select>
                    </div>
                  </>
              }

                {background.type === 'pattern' &&
              <>
                    <div><label className="text-xs text-gray-500">Pattern</label>
                      <select value={background.pattern} onChange={(e) => setBackground((p) => ({ ...p, pattern: e.target.value }))} className="w-full rounded border border-gray-300 p-2 text-sm">
                        <option value="">Select Pattern</option>
                        {patterns.map((p) => <option key={p} value={p}>{p}</option>)}
                      </select>
                    </div>
                    <div><label className="text-xs text-gray-500">Base Color</label><input type="color" value={background.color} onChange={(e) => setBackground((p) => ({ ...p, color: e.target.value }))} className="w-full h-8 rounded cursor-pointer" /></div>
                  </>
              }

                {background.type === 'image' &&
              <div><label className="text-xs text-gray-500">Image URL</label><input type="text" value={background.imageUrl} onChange={(e) => setBackground((p) => ({ ...p, imageUrl: e.target.value }))} placeholder="https://example.com/image.jpg" className="w-full rounded border border-gray-300 p-2 text-sm" /></div>
              }

                <div><label className="text-xs text-gray-500">Opacity ({background.opacity}%)</label><input type="range" min={0} max={100} value={background.opacity} onChange={(e) => setBackground((p) => ({ ...p, opacity: Number(e.target.value) }))} className="w-full" /></div>

                <div className="p-4 rounded-lg border border-gray-200" style={getBackgroundStyle()}><p className="text-xs text-center text-gray-500">Preview</p></div>
              </div>
            }

            {/* Data Tab */}
            {activeTab === 'data' &&
            <div className="space-y-4">
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200"><h3 className="text-sm font-medium text-gray-700 mb-2">Data Bindings</h3><p className="text-xs text-gray-500">Configure data sources and field mappings for dynamic content.</p></div>
                <div className="space-y-2">
                  <div className="p-3 border border-gray-200 rounded-lg"><div className="flex items-center gap-2 mb-2"><Database className="w-4 h-4 text-blue-600" /><span className="text-sm font-medium text-gray-700">Student Data</span></div><p className="text-xs text-gray-500">Connected to student database</p></div>
                  <div className="p-3 border border-gray-200 rounded-lg"><div className="flex items-center gap-2 mb-2"><Table className="w-4 h-4 text-green-600" /><span className="text-sm font-medium text-gray-700">Marks Data</span></div><p className="text-xs text-gray-500">Connected to examination results</p></div>
                  <div className="p-3 border border-gray-200 rounded-lg"><div className="flex items-center gap-2 mb-2"><Calendar className="w-4 h-4 text-orange-600" /><span className="text-sm font-medium text-gray-700">Attendance Data</span></div><p className="text-xs text-gray-500">Connected to attendance records</p></div>
                </div>
                <Button variant="outline" size="sm" className="w-full"><Plus className="w-4 h-4 mr-2" />Add Data Source</Button>
              </div>
            }
          </div>
        </div>

        {/* Center Canvas */}
        <div className="flex-1 bg-gray-300 overflow-auto p-8 relative">
          <div ref={canvasRef} className="shadow-2xl mx-auto relative" style={{ width: '794px', minHeight: '1123px', transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center', ...getBackgroundStyle() }} onDragOver={(e) => e.preventDefault()} onDrop={handleDrop}>
            {showGrid && <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'linear-gradient(to right, #e5e7eb 1px, transparent 1px), linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)', backgroundSize: `${gridSize}px ${gridSize}px` }} />}

            {elements.filter((e) => e.visible).map((element) =>
            <div key={element.id} className={`absolute border transition-all ${selectedElement === element.id ? 'border-2 border-blue-500 z-50' : 'border border-transparent hover:border-gray-300'}`} style={{ left: element.x, top: element.y, width: element.width, height: element.height }} onClick={() => setSelectedElement(element.id)}>
                {selectedElement === element.id &&
              <>
                    <div className="absolute -right-1 -bottom-1 w-3 h-3 bg-blue-500 rounded-full cursor-se-resize" />
                    <div className="absolute -left-1 -bottom-1 w-3 h-3 bg-blue-500 rounded-full cursor-sw-resize" />
                    <div className="absolute -right-1 -top-1 w-3 h-3 bg-blue-500 rounded-full cursor-ne-resize" />
                    <div className="absolute -left-1 -top-1 w-3 h-3 bg-blue-500 rounded-full cursor-nw-resize" />
                    {/* Quick Actions */}
                    <div className="absolute -top-8 left-0 flex gap-1 bg-white rounded shadow-lg p-1">
                      <button className="p-1 hover:bg-gray-100 rounded" onClick={handleEditElement} title="Edit"><Edit3 className="w-3 h-3" /></button>
                      <button className="p-1 hover:bg-gray-100 rounded" onClick={handleDuplicateElement} title="Duplicate"><Copy className="w-3 h-3" /></button>
                      <button className="p-1 hover:bg-gray-100 rounded" onClick={handleToggleLock} title={element.locked ? 'Unlock' : 'Lock'}>{element.locked ? <Lock className="w-3 h-3 text-orange-500" /> : <Unlock className="w-3 h-3" />}</button>
                      <button className="p-1 hover:bg-red-50 rounded text-red-600" onClick={() => setShowDeleteConfirm(true)} title="Delete"><Trash2 className="w-3 h-3" /></button>
                    </div>
                  </>
              }

                {/* Element Preview - Header */}
                {element.type === 'header' && <div className="w-full h-full bg-blue-600 text-white flex items-center p-4"><div className="w-16 h-16 bg-white rounded-full flex items-center justify-center"><GraduationCap className="w-8 h-8 text-blue-600" /></div><div className="ml-4"><h2 className="text-2xl font-bold">School Name</h2><p className="text-sm opacity-90">Report Card 2024-25</p></div></div>}
                {/* Element Preview - Student Info */}
                {element.type === 'student_info' && <div className="w-full h-full border border-gray-200 rounded-lg p-3 bg-white"><div className="grid grid-cols-2 gap-2 text-sm"><div><span className="text-gray-500">Name:</span> Student Name</div><div><span className="text-gray-500">Roll No:</span> 001</div><div><span className="text-gray-500">Class:</span> X - A</div><div><span className="text-gray-500">Attendance:</span> 95.4%</div></div></div>}
                {/* Element Preview - Marks Table */}
                {element.type === 'marks_table' && <div className="w-full h-full overflow-auto bg-white"><table className="w-full text-sm border-collapse"><thead><tr className="bg-gray-100"><th className="border p-1 text-left">Subject</th><th className="border p-1 text-center">Marks</th><th className="border p-1 text-center">Grade</th></tr></thead><tbody><tr><td className="border p-1">English</td><td className="border p-1 text-center">92</td><td className="border p-1 text-center">A+</td></tr><tr><td className="border p-1">Mathematics</td><td className="border p-1 text-center">87</td><td className="border p-1 text-center">A</td></tr><tr><td className="border p-1">Science</td><td className="border p-1 text-center">95</td><td className="border p-1 text-center">A+</td></tr></tbody></table></div>}
                {/* Element Preview - Summary */}
                {element.type === 'summary' && <div className="w-full h-full border border-gray-200 rounded-lg p-3 bg-white"><h3 className="text-sm font-semibold text-gray-700 mb-2">Result Summary</h3><div className="grid grid-cols-2 gap-2 text-sm"><div><span className="text-gray-500">Total:</span> 456/500</div><div><span className="text-gray-500">Percentage:</span> 91.2%</div><div><span className="text-gray-500">Grade:</span> A+</div><div><span className="text-gray-500">Rank:</span> 3</div></div></div>}
                {/* Element Preview - Bar Chart */}
                {element.type === 'barchart' && <div className="w-full h-full border border-gray-200 rounded-lg p-3 bg-white"><h3 className="text-sm font-semibold text-gray-700 mb-2">Performance Graph</h3><div className="flex items-end gap-2 h-24"><div className="flex-1 bg-blue-500 rounded-t" style={{ height: '80%' }}></div><div className="flex-1 bg-green-500 rounded-t" style={{ height: '90%' }}></div><div className="flex-1 bg-yellow-500 rounded-t" style={{ height: '70%' }}></div><div className="flex-1 bg-purple-500 rounded-t" style={{ height: '85%' }}></div><div className="flex-1 bg-red-500 rounded-t" style={{ height: '75%' }}></div></div></div>}
                {/* Element Preview - Remarks */}
                {element.type === 'remarks' && <div className="w-full h-full border border-gray-200 rounded-lg p-3 bg-white"><h3 className="text-sm font-semibold text-gray-700 mb-2">Teacher Remarks</h3><p className="text-xs text-gray-500 italic">Excellent performance. Keep up the good work!</p></div>}
                {/* Element Preview - Signatures */}
                {element.type === 'signatures' && <div className="w-full h-full p-3 bg-white"><div className="grid grid-cols-3 gap-8 pt-4"><div className="text-center"><div className="border-t border-gray-400 pt-1"><p className="text-xs text-gray-500">Class Teacher</p></div></div><div className="text-center"><div className="border-t border-gray-400 pt-1"><p className="text-xs text-gray-500">Principal</p></div></div><div className="text-center"><div className="border-t border-gray-400 pt-1"><p className="text-xs text-gray-500">Parent/Guardian</p></div></div></div></div>}
                {/* Generic Preview */}
                {!['header', 'student_info', 'marks_table', 'summary', 'barchart', 'remarks', 'signatures'].includes(element.type) && <div className="w-full h-full border border-gray-200 rounded-lg flex items-center justify-center bg-white text-gray-400 text-xs">{element.name}</div>}
              </div>
            )}

            {draggedElement && <div className="absolute inset-0 bg-blue-50 bg-opacity-30 border-2 border-dashed border-blue-400 flex items-center justify-center pointer-events-none z-50"><p className="text-blue-600 font-medium">Drop element here</p></div>}
          </div>
        </div>

        {/* Right Panel - Layers */}
        <div className="w-56 bg-white border-l border-gray-200 flex flex-col shrink-0">
          <div className="p-3 border-b border-gray-200"><h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2"><Layers className="w-4 h-4" />Layers</h3></div>
          <div className="flex-1 overflow-y-auto p-2">
            {elements.slice().reverse().map((element) =>
            <div key={element.id} onClick={() => setSelectedElement(element.id)} className={`flex items-center gap-2 p-2 rounded cursor-pointer ${selectedElement === element.id ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50'} ${!element.visible ? 'opacity-50' : ''}`}>
                {element.locked ? <Lock className="w-3 h-3 text-orange-500" /> : <Unlock className="w-3 h-3 text-gray-400" />}
                <span className="text-sm text-gray-700 truncate flex-1">{element.name}</span>
                <Eye className={`w-3 h-3 ${element.visible ? 'text-gray-400' : 'text-gray-300'}`} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm &&
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-sm p-6">
            <div className="text-center"><Trash2 className="w-12 h-12 text-red-500 mx-auto mb-4" /><h2 className="text-lg font-semibold mb-2">Delete Element?</h2><p className="text-gray-500 text-sm mb-4">This action cannot be undone.</p></div>
            <div className="flex gap-3"><Button variant="outline" className="flex-1" onClick={() => setShowDeleteConfirm(false)}>Cancel</Button><Button variant="primary" className="flex-1 bg-red-600" onClick={handleDeleteElement}>Delete</Button></div>
          </Card>
        </div>
      }

      {/* Element Editor Modal */}
      {showElementEditor && editingElement &&
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-4"><h2 className="text-lg font-semibold">Edit Element</h2><Button variant="ghost" size="sm" onClick={() => setShowElementEditor(false)}><X className="w-5 h-5" /></Button></div>
            <div className="space-y-4">
              <div><label className="text-sm font-medium text-gray-700">Name</label><input type="text" value={editingElement.name} onChange={(e) => setEditingElement({ ...editingElement, name: e.target.value })} className="w-full mt-1 rounded-lg border border-gray-300 p-2" /></div>
              <div className="grid grid-cols-4 gap-2">
                <div><label className="text-xs text-gray-500">X</label><input type="number" value={editingElement.x} onChange={(e) => setEditingElement({ ...editingElement, x: Number(e.target.value) })} className="w-full rounded border border-gray-300 p-2 text-sm" /></div>
                <div><label className="text-xs text-gray-500">Y</label><input type="number" value={editingElement.y} onChange={(e) => setEditingElement({ ...editingElement, y: Number(e.target.value) })} className="w-full rounded border border-gray-300 p-2 text-sm" /></div>
                <div><label className="text-xs text-gray-500">Width</label><input type="number" value={editingElement.width} onChange={(e) => setEditingElement({ ...editingElement, width: Number(e.target.value) })} className="w-full rounded border border-gray-300 p-2 text-sm" /></div>
                <div><label className="text-xs text-gray-500">Height</label><input type="number" value={editingElement.height} onChange={(e) => setEditingElement({ ...editingElement, height: Number(e.target.value) })} className="w-full rounded border border-gray-300 p-2 text-sm" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={editingElement.locked} onChange={(e) => setEditingElement({ ...editingElement, locked: e.target.checked })} className="rounded" />Locked</label>
                <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={editingElement.visible} onChange={(e) => setEditingElement({ ...editingElement, visible: e.target.checked })} className="rounded" />Visible</label>
              </div>
            </div>
            <div className="flex gap-3 mt-6"><Button variant="outline" className="flex-1" onClick={() => setShowElementEditor(false)}>Cancel</Button><Button variant="primary" className="flex-1" onClick={handleSaveElementEdit}>Save Changes</Button></div>
          </Card>
        </div>
      }

      {/* Version History Modal */}
      {showVersionHistory &&
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-6"><h2 className="text-xl font-semibold flex items-center gap-2"><GitBranch className="w-5 h-5 text-gray-600" />Template Versions</h2><Button variant="ghost" size="sm" onClick={() => setShowVersionHistory(false)}><X className="w-5 h-5" /></Button></div>
            <div className="space-y-3">
              {versions.map((version) =>
            <div key={version.id} className="p-4 bg-gray-50 rounded-lg border">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Badge variant={version.status === 'published' ? 'success' : version.status === 'draft' ? 'warning' : 'secondary'}>{version.status}</Badge>
                      <div><p className="font-medium">{version.name}</p><p className="text-xs text-gray-500">{version.createdAt} by {version.createdBy}</p></div>
                    </div>
                    <Button variant="outline" size="sm">Restore</Button>
                  </div>
                </div>
            )}
            </div>
            <div className="mt-6 flex justify-end gap-3"><Button variant="outline" onClick={() => setShowVersionHistory(false)}>Cancel</Button><Button variant="primary" onClick={() => setShowVersionHistory(false)}>Close</Button></div>
          </Card>
        </div>
      }
    </div>);

}

export default ReportCardDesigner;