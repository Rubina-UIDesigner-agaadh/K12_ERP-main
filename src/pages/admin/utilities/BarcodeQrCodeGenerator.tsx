import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import {
  QrCode,
  Printer,
  Download,
  RefreshCw,
  Copy,
  ChevronLeft,
  ChevronRight,
  Grid,
  List,
  Search,
  Check,
  X,
  Trash2,
  Eye,
  Settings,
  FileText,
  Users,
  Package,
  Barcode,
  Save,
  FolderOpen,
  History,
  Maximize2,
  Minimize2,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Share2,
  Mail,
  Link2,
  CheckCircle,
  AlertCircle,
  Info } from
'lucide-react';

// ==================== TYPES ====================
interface Student {
  id: string;
  admNo: string;
  name: string;
  class: string;
  section: string;
  email: string;
  phone: string;
  dob: string;
  address: string;
  parentName: string;
  parentPhone: string;
  bloodGroup: string;
  rollNo: number;
  house: string;
  photo?: string;
}

interface Employee {
  id: string;
  empNo: string;
  name: string;
  department: string;
  designation: string;
  email: string;
  phone: string;
  doj: string;
  address: string;
  qualification: string;
  experience: number;
  salary: number;
  bankAccount: string;
  panNo: string;
  photo?: string;
}

interface InventoryItem {
  id: string;
  itemCode: string;
  name: string;
  category: string;
  location: string;
  quantity: number;
  unit: string;
  purchaseDate: string;
  warrantyExpiry: string;
  supplier: string;
  price: number;
  condition: string;
  serialNumber: string;
}

interface CodeConfig {
  codeType: 'qr' | 'barcode128' | 'barcode39' | 'ean13' | 'upc';
  targetEntity: 'student' | 'employee' | 'inventory';
  contentTemplate: string;
  size: 'small' | 'medium' | 'large';
  includeLabel: boolean;
  includeSubtitle: boolean;
  errorCorrection: 'L' | 'M' | 'Q' | 'H';
  foregroundColor: string;
  backgroundColor: string;
}

interface GeneratedCode {
  id: string;
  entityId: string;
  entityName: string;
  subtitle: string;
  content: string;
  codeType: string;
  timestamp: Date;
  entity: Student | Employee | InventoryItem;
}

interface SavedTemplate {
  id: string;
  name: string;
  config: CodeConfig;
  createdAt: Date;
}

interface GenerationHistory {
  id: string;
  timestamp: Date;
  config: CodeConfig;
  entityCount: number;
  status: 'success' | 'partial' | 'failed';
}

// ==================== MOCK DATA ====================
const mockStudents: Student[] = [
{
  id: 'STU001',
  admNo: 'ADM-2024-001',
  name: 'Rahul Sharma',
  class: '10',
  section: 'A',
  email: 'rahul.sharma@school.edu',
  phone: '+91-9876543210',
  dob: '2008-05-15',
  address: '123 Main Street, New Delhi',
  parentName: 'Rajesh Sharma',
  parentPhone: '+91-9876543200',
  bloodGroup: 'O+',
  rollNo: 1,
  house: 'Red'
},
{
  id: 'STU002',
  admNo: 'ADM-2024-002',
  name: 'Priya Patel',
  class: '10',
  section: 'A',
  email: 'priya.patel@school.edu',
  phone: '+91-9876543211',
  dob: '2008-03-22',
  address: '456 Park Avenue, Mumbai',
  parentName: 'Amit Patel',
  parentPhone: '+91-9876543201',
  bloodGroup: 'A+',
  rollNo: 2,
  house: 'Blue'
},
{
  id: 'STU003',
  admNo: 'ADM-2024-003',
  name: 'Arjun Singh',
  class: '10',
  section: 'B',
  email: 'arjun.singh@school.edu',
  phone: '+91-9876543212',
  dob: '2008-07-10',
  address: '789 Lake View, Bangalore',
  parentName: 'Vikram Singh',
  parentPhone: '+91-9876543202',
  bloodGroup: 'B+',
  rollNo: 1,
  house: 'Green'
},
{
  id: 'STU004',
  admNo: 'ADM-2024-004',
  name: 'Sneha Reddy',
  class: '9',
  section: 'A',
  email: 'sneha.reddy@school.edu',
  phone: '+91-9876543213',
  dob: '2009-01-18',
  address: '321 Hill Road, Hyderabad',
  parentName: 'Krishna Reddy',
  parentPhone: '+91-9876543203',
  bloodGroup: 'AB+',
  rollNo: 1,
  house: 'Yellow'
},
{
  id: 'STU005',
  admNo: 'ADM-2024-005',
  name: 'Karan Mehta',
  class: '9',
  section: 'B',
  email: 'karan.mehta@school.edu',
  phone: '+91-9876543214',
  dob: '2009-09-25',
  address: '654 Garden Lane, Chennai',
  parentName: 'Suresh Mehta',
  parentPhone: '+91-9876543204',
  bloodGroup: 'O-',
  rollNo: 1,
  house: 'Red'
},
{
  id: 'STU006',
  admNo: 'ADM-2024-006',
  name: 'Ananya Gupta',
  class: '11',
  section: 'A',
  email: 'ananya.gupta@school.edu',
  phone: '+91-9876543215',
  dob: '2007-04-12',
  address: '987 River Side, Pune',
  parentName: 'Rakesh Gupta',
  parentPhone: '+91-9876543205',
  bloodGroup: 'A-',
  rollNo: 1,
  house: 'Blue'
},
{
  id: 'STU007',
  admNo: 'ADM-2024-007',
  name: 'Rohan Joshi',
  class: '11',
  section: 'B',
  email: 'rohan.joshi@school.edu',
  phone: '+91-9876543216',
  dob: '2007-11-30',
  address: '147 Forest Road, Kolkata',
  parentName: 'Deepak Joshi',
  parentPhone: '+91-9876543206',
  bloodGroup: 'B-',
  rollNo: 1,
  house: 'Green'
},
{
  id: 'STU008',
  admNo: 'ADM-2024-008',
  name: 'Meera Nair',
  class: '12',
  section: 'A',
  email: 'meera.nair@school.edu',
  phone: '+91-9876543217',
  dob: '2006-08-20',
  address: '258 Beach Road, Kochi',
  parentName: 'Gopalan Nair',
  parentPhone: '+91-9876543207',
  bloodGroup: 'O+',
  rollNo: 1,
  house: 'Yellow'
}];


const mockEmployees: Employee[] = [
{
  id: 'EMP001',
  empNo: 'EMP-2024-001',
  name: 'Dr. Anil Kumar',
  department: 'Mathematics',
  designation: 'Senior Teacher',
  email: 'anil.kumar@school.edu',
  phone: '+91-9876543220',
  doj: '2015-06-01',
  address: '101 Faculty Housing, Campus',
  qualification: 'Ph.D. Mathematics',
  experience: 15,
  salary: 85000,
  bankAccount: 'XXXX1234',
  panNo: 'ABCDE1234F'
},
{
  id: 'EMP002',
  empNo: 'EMP-2024-002',
  name: 'Mrs. Sunita Verma',
  department: 'Science',
  designation: 'HOD',
  email: 'sunita.verma@school.edu',
  phone: '+91-9876543221',
  doj: '2010-08-15',
  address: '102 Faculty Housing, Campus',
  qualification: 'M.Sc. Physics',
  experience: 20,
  salary: 95000,
  bankAccount: 'XXXX1235',
  panNo: 'ABCDE1235F'
},
{
  id: 'EMP003',
  empNo: 'EMP-2024-003',
  name: 'Mr. Rajesh Iyer',
  department: 'English',
  designation: 'Teacher',
  email: 'rajesh.iyer@school.edu',
  phone: '+91-9876543222',
  doj: '2018-04-01',
  address: '103 Faculty Housing, Campus',
  qualification: 'M.A. English Literature',
  experience: 8,
  salary: 65000,
  bankAccount: 'XXXX1236',
  panNo: 'ABCDE1236F'
},
{
  id: 'EMP004',
  empNo: 'EMP-2024-004',
  name: 'Ms. Priyanka Das',
  department: 'Computer Science',
  designation: 'Lab Assistant',
  email: 'priyanka.das@school.edu',
  phone: '+91-9876543223',
  doj: '2020-01-15',
  address: '25 Staff Quarters, Campus',
  qualification: 'B.Tech Computer Science',
  experience: 5,
  salary: 45000,
  bankAccount: 'XXXX1237',
  panNo: 'ABCDE1237F'
},
{
  id: 'EMP005',
  empNo: 'EMP-2024-005',
  name: 'Mr. Vikram Malhotra',
  department: 'Administration',
  designation: 'Office Manager',
  email: 'vikram.malhotra@school.edu',
  phone: '+91-9876543224',
  doj: '2012-03-01',
  address: '26 Staff Quarters, Campus',
  qualification: 'MBA Administration',
  experience: 12,
  salary: 75000,
  bankAccount: 'XXXX1238',
  panNo: 'ABCDE1238F'
},
{
  id: 'EMP006',
  empNo: 'EMP-2024-006',
  name: 'Mrs. Lakshmi Krishnan',
  department: 'Library',
  designation: 'Librarian',
  email: 'lakshmi.krishnan@school.edu',
  phone: '+91-9876543225',
  doj: '2014-07-20',
  address: '27 Staff Quarters, Campus',
  qualification: 'M.Lib.Sc.',
  experience: 10,
  salary: 55000,
  bankAccount: 'XXXX1239',
  panNo: 'ABCDE1239F'
}];


const mockInventory: InventoryItem[] = [
{
  id: 'INV001',
  itemCode: 'INV-2024-001',
  name: 'Science Lab Microscope',
  category: 'Lab Equipment',
  location: 'Science Lab 1',
  quantity: 15,
  unit: 'pieces',
  purchaseDate: '2023-01-15',
  warrantyExpiry: '2026-01-15',
  supplier: 'Scientific Instruments Ltd.',
  price: 25000,
  condition: 'Good',
  serialNumber: 'MICRO-2023-001'
},
{
  id: 'INV002',
  itemCode: 'INV-2024-002',
  name: 'Desktop Computer',
  category: 'IT Equipment',
  location: 'Computer Lab 1',
  quantity: 30,
  unit: 'pieces',
  purchaseDate: '2022-08-20',
  warrantyExpiry: '2025-08-20',
  supplier: 'Tech Solutions Pvt. Ltd.',
  price: 45000,
  condition: 'Excellent',
  serialNumber: 'COMP-2022-001'
},
{
  id: 'INV003',
  itemCode: 'INV-2024-003',
  name: 'Projector',
  category: 'Audio Visual',
  location: 'Conference Room',
  quantity: 5,
  unit: 'pieces',
  purchaseDate: '2023-03-10',
  warrantyExpiry: '2025-03-10',
  supplier: 'Visual Systems Inc.',
  price: 75000,
  condition: 'Good',
  serialNumber: 'PROJ-2023-001'
},
{
  id: 'INV004',
  itemCode: 'INV-2024-004',
  name: 'Student Desk',
  category: 'Furniture',
  location: 'Classroom Block A',
  quantity: 200,
  unit: 'pieces',
  purchaseDate: '2021-06-01',
  warrantyExpiry: '2024-06-01',
  supplier: 'Furniture World',
  price: 3500,
  condition: 'Fair',
  serialNumber: 'DESK-2021-001'
},
{
  id: 'INV005',
  itemCode: 'INV-2024-005',
  name: 'Chemistry Lab Kit',
  category: 'Lab Equipment',
  location: 'Chemistry Lab',
  quantity: 25,
  unit: 'sets',
  purchaseDate: '2023-07-15',
  warrantyExpiry: '2025-07-15',
  supplier: 'Lab Supplies Co.',
  price: 15000,
  condition: 'Excellent',
  serialNumber: 'CHEM-2023-001'
},
{
  id: 'INV006',
  itemCode: 'INV-2024-006',
  name: 'Library Bookshelf',
  category: 'Furniture',
  location: 'Main Library',
  quantity: 50,
  unit: 'pieces',
  purchaseDate: '2020-02-10',
  warrantyExpiry: '2030-02-10',
  supplier: 'Furniture World',
  price: 8500,
  condition: 'Good',
  serialNumber: 'SHELF-2020-001'
},
{
  id: 'INV007',
  itemCode: 'INV-2024-007',
  name: 'Sports Equipment Set',
  category: 'Sports',
  location: 'Sports Room',
  quantity: 10,
  unit: 'sets',
  purchaseDate: '2023-09-01',
  warrantyExpiry: '2024-09-01',
  supplier: 'Sports Gear India',
  price: 50000,
  condition: 'Excellent',
  serialNumber: 'SPORT-2023-001'
}];


// ==================== UTILITY FUNCTIONS ====================
const generateQRCodeSVG = (content: string, size: number = 128): string => {
  // Simplified QR code pattern generation for demonstration
  const modules = 21; // QR Version 1 has 21x21 modules
  const moduleSize = size / modules;
  let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">`;
  svg += `<rect width="100%" height="100%" fill="white"/>`;

  // Generate pseudo-random pattern based on content hash
  const hash = content.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);

  // Position patterns (corners)
  const drawPositionPattern = (x: number, y: number) => {
    svg += `<rect x="${x * moduleSize}" y="${y * moduleSize}" width="${7 * moduleSize}" height="${7 * moduleSize}" fill="black"/>`;
    svg += `<rect x="${(x + 1) * moduleSize}" y="${(y + 1) * moduleSize}" width="${5 * moduleSize}" height="${5 * moduleSize}" fill="white"/>`;
    svg += `<rect x="${(x + 2) * moduleSize}" y="${(y + 2) * moduleSize}" width="${3 * moduleSize}" height="${3 * moduleSize}" fill="black"/>`;
  };

  drawPositionPattern(0, 0);
  drawPositionPattern(modules - 7, 0);
  drawPositionPattern(0, modules - 7);

  // Data modules (simplified pseudo-random pattern)
  for (let i = 0; i < modules; i++) {
    for (let j = 0; j < modules; j++) {
      // Skip position patterns
      if (i < 8 && j < 8 || i < 8 && j > modules - 9 || i > modules - 9 && j < 8) continue;
      if ((hash + i * j) % 3 === 0) {
        svg += `<rect x="${j * moduleSize}" y="${i * moduleSize}" width="${moduleSize}" height="${moduleSize}" fill="black"/>`;
      }
    }
  }

  svg += '</svg>';
  return svg;
};

const generateBarcodeSVG = (content: string, type: string, width: number = 200, height: number = 80): string => {
  const barWidth = type === 'barcode128' ? 2 : 3;
  const numBars = Math.floor(width / barWidth);
  let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">`;
  svg += `<rect width="100%" height="100%" fill="white"/>`;

  // Generate barcode pattern based on content
  const hash = content.split('').reduce((acc, char, idx) => acc + char.charCodeAt(0) * (idx + 1), 0);

  for (let i = 0; i < numBars; i++) {
    if ((hash + i * 7) % 2 === 0) {
      const w = (hash + i) % 2 === 0 ? barWidth : barWidth * 2;
      svg += `<rect x="${i * barWidth}" y="0" width="${Math.min(w, barWidth)}" height="${height * 0.85}" fill="black"/>`;
    }
  }

  svg += '</svg>';
  return svg;
};

// ==================== MAIN COMPONENT ====================
export function BarcodeQrCodeGenerator() {
  // State management
  const [config, setConfig] = useState<CodeConfig>({
    codeType: 'qr',
    targetEntity: 'student',
    contentTemplate: 'adm_no',
    size: 'medium',
    includeLabel: true,
    includeSubtitle: true,
    errorCorrection: 'M',
    foregroundColor: '#000000',
    backgroundColor: '#FFFFFF'
  });

  const [generatedCodes, setGeneratedCodes] = useState<GeneratedCode[]>([]);
  const [selectedCodes, setSelectedCodes] = useState<string[]>([]);
  const [currentPreviewIndex, setCurrentPreviewIndex] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'single' | 'grid'>('single');
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  const [copiedContent, setCopiedContent] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [savedTemplates, setSavedTemplates] = useState<SavedTemplate[]>([]);
  const [generationHistory, setGenerationHistory] = useState<GenerationHistory[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [notification, setNotification] = useState<{type: 'success' | 'error' | 'info';message: string;} | null>(null);
  const [filterClass, setFilterClass] = useState<string>('');
  const [filterDepartment, setFilterDepartment] = useState<string>('');
  const [filterCategory, setFilterCategory] = useState<string>('');
  const [selectedEntityIds, setSelectedEntityIds] = useState<string[]>([]);
  const [showEntitySelector, setShowEntitySelector] = useState(false);

  const previewRef = useRef<HTMLDivElement>(null);

  // Show notification helper
  const showNotification = useCallback((type: 'success' | 'error' | 'info', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  }, []);

  // Get content template options based on target entity
  const getContentTemplateOptions = useCallback(() => {
    switch (config.targetEntity) {
      case 'student':
        return [
        { value: 'adm_no', label: 'Admission Number' },
        { value: 'profile_url', label: 'Profile URL' },
        { value: 'vcard', label: 'vCard (Contact Info)' },
        { value: 'student_id', label: 'Student ID' },
        { value: 'full_details', label: 'Full Details JSON' }];

      case 'employee':
        return [
        { value: 'emp_no', label: 'Employee Number' },
        { value: 'profile_url', label: 'Profile URL' },
        { value: 'vcard', label: 'vCard (Contact Info)' },
        { value: 'emp_id', label: 'Employee ID' },
        { value: 'full_details', label: 'Full Details JSON' }];

      case 'inventory':
        return [
        { value: 'item_code', label: 'Item Code' },
        { value: 'profile_url', label: 'Item Details URL' },
        { value: 'serial_number', label: 'Serial Number' },
        { value: 'full_details', label: 'Full Details JSON' }];

      default:
        return [];
    }
  }, [config.targetEntity]);

  // Generate content based on template
  const generateContent = useCallback((entity: any, template: string): string => {
    switch (template) {
      case 'adm_no':
        return entity.admNo;
      case 'emp_no':
        return entity.empNo;
      case 'item_code':
        return entity.itemCode;
      case 'student_id':
        return entity.id;
      case 'emp_id':
        return entity.id;
      case 'serial_number':
        return entity.serialNumber;
      case 'profile_url':
        return `https://school.edu/${config.targetEntity}/${entity.id}`;
      case 'vcard':
        return `BEGIN:VCARD\nVERSION:3.0\nFN:${entity.name}\nTEL:${entity.phone || ''}\nEMAIL:${entity.email || ''}\nADR:${entity.address || ''}\nEND:VCARD`;
      case 'full_details':
        return JSON.stringify(entity);
      default:
        return entity.id;
    }
  }, [config.targetEntity]);

  // Get entities based on target with filters
  const getEntities = useCallback(() => {
    let entities: any[] = [];
    switch (config.targetEntity) {
      case 'student':
        entities = mockStudents;
        if (filterClass) {
          entities = entities.filter((s) => s.class === filterClass);
        }
        break;
      case 'employee':
        entities = mockEmployees;
        if (filterDepartment) {
          entities = entities.filter((e) => e.department === filterDepartment);
        }
        break;
      case 'inventory':
        entities = mockInventory;
        if (filterCategory) {
          entities = entities.filter((i) => i.category === filterCategory);
        }
        break;
    }

    // Filter by selected entity IDs if any
    if (selectedEntityIds.length > 0) {
      entities = entities.filter((e) => selectedEntityIds.includes(e.id));
    }

    return entities;
  }, [config.targetEntity, filterClass, filterDepartment, filterCategory, selectedEntityIds]);

  // Get all entities without filters (for entity selector)
  const getAllEntities = useCallback(() => {
    switch (config.targetEntity) {
      case 'student':
        return mockStudents;
      case 'employee':
        return mockEmployees;
      case 'inventory':
        return mockInventory;
      default:
        return [];
    }
  }, [config.targetEntity]);

  // Get unique filter values
  const getFilterOptions = useCallback(() => {
    switch (config.targetEntity) {
      case 'student':
        return [...new Set(mockStudents.map((s) => s.class))].sort();
      case 'employee':
        return [...new Set(mockEmployees.map((e) => e.department))].sort();
      case 'inventory':
        return [...new Set(mockInventory.map((i) => i.category))].sort();
      default:
        return [];
    }
  }, [config.targetEntity]);

  // Generate preview
  const handleGeneratePreview = async () => {
    setIsGenerating(true);

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    const entities = getEntities();

    if (entities.length === 0) {
      showNotification('error', 'No entities found with current filters');
      setIsGenerating(false);
      return;
    }

    const codes = entities.map((entity) => ({
      id: `code-${entity.id}-${Date.now()}`,
      entityId: entity.id,
      entityName: entity.name,
      subtitle:
      config.targetEntity === 'student' ?
      `Class ${(entity as Student).class}-${(entity as Student).section}` :
      config.targetEntity === 'employee' ?
      (entity as Employee).department :
      (entity as InventoryItem).category,
      content: generateContent(entity, config.contentTemplate),
      codeType: config.codeType,
      timestamp: new Date(),
      entity
    }));

    setGeneratedCodes(codes);
    setCurrentPreviewIndex(0);
    setSelectedCodes([]);

    // Add to history
    const historyEntry: GenerationHistory = {
      id: `history-${Date.now()}`,
      timestamp: new Date(),
      config: { ...config },
      entityCount: codes.length,
      status: 'success'
    };
    setGenerationHistory((prev) => [historyEntry, ...prev].slice(0, 20));

    showNotification('success', `Generated ${codes.length} codes successfully`);
    setIsGenerating(false);
  };

  // Download PNG
  const handleDownloadPNG = async (code?: GeneratedCode) => {
    const codeToDownload = code || generatedCodes[currentPreviewIndex];
    if (!codeToDownload) return;

    const canvas = document.createElement('canvas');
    const sizeMap = { small: 300, medium: 400, large: 500 };
    const size = sizeMap[config.size];
    canvas.width = size;
    canvas.height = size + 100;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      // Background
      ctx.fillStyle = config.backgroundColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw code
      ctx.fillStyle = config.foregroundColor;
      const codeSize = size * 0.7;
      const codeX = (size - codeSize) / 2;

      if (config.codeType === 'qr') {
        // Draw QR-like pattern
        const moduleSize = codeSize / 21;
        for (let i = 0; i < 21; i++) {
          for (let j = 0; j < 21; j++) {
            const hash = codeToDownload.content.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
            if ((hash + i * j) % 3 === 0 || i < 7 && j < 7 || i < 7 && j > 13 || i > 13 && j < 7) {
              ctx.fillRect(codeX + j * moduleSize, 30 + i * moduleSize, moduleSize - 1, moduleSize - 1);
            }
          }
        }
      } else {
        // Draw barcode pattern
        const barWidth = config.codeType === 'barcode128' ? 3 : 4;
        const numBars = Math.floor(codeSize / barWidth);
        const hash = codeToDownload.content.split('').reduce((acc, char, idx) => acc + char.charCodeAt(0) * (idx + 1), 0);
        for (let i = 0; i < numBars; i++) {
          if ((hash + i * 7) % 2 === 0) {
            ctx.fillRect(codeX + i * barWidth, 30, barWidth - 1, codeSize * 0.6);
          }
        }
      }

      // Text
      if (config.includeLabel) {
        ctx.font = 'bold 20px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(codeToDownload.content, size / 2, size * 0.85);
      }

      if (config.includeSubtitle) {
        ctx.font = '16px sans-serif';
        ctx.fillText(codeToDownload.entityName, size / 2, size * 0.92);
        ctx.fillStyle = '#666666';
        ctx.font = '14px sans-serif';
        ctx.fillText(codeToDownload.subtitle, size / 2, size * 0.98);
      }

      // Download
      const link = document.createElement('a');
      link.download = `${codeToDownload.content.replace(/[^a-zA-Z0-9]/g, '_')}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();

      showNotification('success', `Downloaded ${codeToDownload.content}.png`);
    }
  };

  // Download SVG
  const handleDownloadSVG = (code?: GeneratedCode) => {
    const codeToDownload = code || generatedCodes[currentPreviewIndex];
    if (!codeToDownload) return;

    const sizeMap = { small: 150, medium: 200, large: 250 };
    const size = sizeMap[config.size];

    let svgContent = '';
    if (config.codeType === 'qr') {
      svgContent = generateQRCodeSVG(codeToDownload.content, size);
    } else {
      svgContent = generateBarcodeSVG(codeToDownload.content, config.codeType, size * 1.5, size * 0.6);
    }

    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const link = document.createElement('a');
    link.download = `${codeToDownload.content.replace(/[^a-zA-Z0-9]/g, '_')}.svg`;
    link.href = URL.createObjectURL(blob);
    link.click();

    showNotification('success', `Downloaded ${codeToDownload.content}.svg`);
  };

  // Print functionality
  const handlePrint = (codes?: GeneratedCode[]) => {
    const codesToPrint = codes || [generatedCodes[currentPreviewIndex]];
    if (codesToPrint.length === 0) return;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      const sizeMap = { small: 100, medium: 150, large: 200 };
      const codeSize = sizeMap[config.size];

      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Print Codes - ${new Date().toLocaleDateString()}</title>
            <style>
              * { margin: 0; padding: 0; box-sizing: border-box; }
              body { font-family: Arial, sans-serif; padding: 20px; }
              .print-header { 
                text-align: center; 
                margin-bottom: 20px; 
                padding-bottom: 10px;
                border-bottom: 2px solid #333;
              }
              .print-header h1 { font-size: 18px; }
              .print-header p { font-size: 12px; color: #666; }
              .codes-container {
                display: flex;
                flex-wrap: wrap;
                justify-content: center;
                gap: 15px;
              }
              .code-container { 
                display: inline-block; 
                text-align: center; 
                padding: 15px; 
                border: 1px solid #ccc;
                page-break-inside: avoid;
                background: white;
              }
              .qr-placeholder {
                width: ${codeSize}px;
                height: ${codeSize}px;
                background: 
                  linear-gradient(90deg, #000 2px, transparent 2px),
                  linear-gradient(#000 2px, transparent 2px);
                background-size: 8px 8px;
                margin: 0 auto 10px;
                border: 2px solid #000;
              }
              .barcode-placeholder {
                width: ${codeSize * 1.5}px;
                height: ${codeSize * 0.5}px;
                background: repeating-linear-gradient(
                  90deg,
                  #000 0px,
                  #000 2px,
                  #fff 2px,
                  #fff 4px
                );
                margin: 0 auto 10px;
              }
              .content { font-family: monospace; font-weight: bold; font-size: 14px; }
              .name { font-size: 13px; margin-top: 5px; }
              .subtitle { font-size: 11px; color: #666; }
              .timestamp { font-size: 10px; color: #999; margin-top: 5px; }
              @media print {
                .code-container { border: 1px dashed #ccc; }
                body { padding: 10px; }
              }
            </style>
          </head>
          <body>
            <div class="print-header">
              <h1>Generated ${config.codeType === 'qr' ? 'QR Codes' : 'Barcodes'}</h1>
              <p>Printed on: ${new Date().toLocaleString()} | Total: ${codesToPrint.length} codes</p>
            </div>
            <div class="codes-container">
              ${codesToPrint.map((code) => `
                <div class="code-container">
                  <div class="${code.codeType === 'qr' ? 'qr-placeholder' : 'barcode-placeholder'}"></div>
                  ${config.includeLabel ? `<div class="content">${code.content}</div>` : ''}
                  ${config.includeSubtitle ? `
                    <div class="name">${code.entityName}</div>
                    <div class="subtitle">${code.subtitle}</div>
                  ` : ''}
                  <div class="timestamp">${new Date(code.timestamp).toLocaleDateString()}</div>
                </div>
              `).join('')}
            </div>
            <script>
              window.onload = function() {
                setTimeout(function() {
                  window.print();
                }, 500);
              }
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();

      showNotification('info', `Printing ${codesToPrint.length} codes...`);
    }
  };

  // Copy content to clipboard
  const handleCopyContent = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedContent(content);
      setTimeout(() => setCopiedContent(null), 2000);
      showNotification('success', 'Content copied to clipboard');
    } catch (err) {
      showNotification('error', 'Failed to copy content');
    }
  };

  // Share via email
  const handleShareEmail = (code?: GeneratedCode) => {
    const codeToShare = code || generatedCodes[currentPreviewIndex];
    if (!codeToShare) return;

    const subject = encodeURIComponent(`Code for ${codeToShare.entityName}`);
    const body = encodeURIComponent(
      `Here is the ${config.codeType === 'qr' ? 'QR Code' : 'Barcode'} content for ${codeToShare.entityName}:\n\n` +
      `Content: ${codeToShare.content}\n` +
      `Entity: ${codeToShare.entityName}\n` +
      `Details: ${codeToShare.subtitle}\n\n` +
      `Generated on: ${new Date(codeToShare.timestamp).toLocaleString()}`
    );

    window.open(`mailto:?subject=${subject}&body=${body}`);
    showNotification('info', 'Opening email client...');
  };

  // Copy shareable link
  const handleCopyLink = async (code?: GeneratedCode) => {
    const codeToShare = code || generatedCodes[currentPreviewIndex];
    if (!codeToShare) return;

    const link = `https://school.edu/codes/${codeToShare.id}`;
    await navigator.clipboard.writeText(link);
    showNotification('success', 'Shareable link copied to clipboard');
  };

  // Navigation
  const handlePrevious = () => {
    setCurrentPreviewIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentPreviewIndex((prev) => Math.min(generatedCodes.length - 1, prev + 1));
  };

  const handleGoToIndex = (index: number) => {
    setCurrentPreviewIndex(index);
    setViewMode('single');
  };

  // Selection
  const toggleCodeSelection = (codeId: string) => {
    setSelectedCodes((prev) =>
    prev.includes(codeId) ?
    prev.filter((id) => id !== codeId) :
    [...prev, codeId]
    );
  };

  const selectAllCodes = () => {
    if (selectedCodes.length === filteredCodes.length) {
      setSelectedCodes([]);
    } else {
      setSelectedCodes(filteredCodes.map((c) => c.id));
    }
  };

  // Entity selection
  const toggleEntitySelection = (entityId: string) => {
    setSelectedEntityIds((prev) =>
    prev.includes(entityId) ?
    prev.filter((id) => id !== entityId) :
    [...prev, entityId]
    );
  };

  const selectAllEntities = () => {
    const allEntities = getAllEntities();
    if (selectedEntityIds.length === allEntities.length) {
      setSelectedEntityIds([]);
    } else {
      setSelectedEntityIds(allEntities.map((e) => e.id));
    }
  };

  // Bulk actions
  const handleBulkDownload = async () => {
    const selectedCodeObjects = generatedCodes.filter((c) => selectedCodes.includes(c.id));
    showNotification('info', `Downloading ${selectedCodeObjects.length} codes...`);

    for (const code of selectedCodeObjects) {
      await handleDownloadPNG(code);
      await new Promise((resolve) => setTimeout(resolve, 300));
    }

    showNotification('success', `Downloaded ${selectedCodeObjects.length} codes`);
  };

  const handleBulkPrint = () => {
    const selectedCodeObjects = generatedCodes.filter((c) => selectedCodes.includes(c.id));
    handlePrint(selectedCodeObjects);
  };

  const handleDeleteSelected = () => {
    setGeneratedCodes((prev) => prev.filter((c) => !selectedCodes.includes(c.id)));
    setSelectedCodes([]);
    setCurrentPreviewIndex(0);
    showNotification('success', 'Deleted selected codes');
  };

  // Template management
  const handleSaveTemplate = () => {
    if (!templateName.trim()) {
      showNotification('error', 'Please enter a template name');
      return;
    }

    const newTemplate: SavedTemplate = {
      id: `template-${Date.now()}`,
      name: templateName,
      config: { ...config },
      createdAt: new Date()
    };

    setSavedTemplates((prev) => [...prev, newTemplate]);
    setTemplateName('');
    showNotification('success', `Template "${templateName}" saved`);
  };

  const handleLoadTemplate = (template: SavedTemplate) => {
    setConfig(template.config);
    setShowTemplates(false);
    showNotification('info', `Loaded template "${template.name}"`);
  };

  const handleDeleteTemplate = (templateId: string) => {
    setSavedTemplates((prev) => prev.filter((t) => t.id !== templateId));
    showNotification('success', 'Template deleted');
  };

  // Zoom
  const handleZoomIn = () => setZoomLevel((prev) => Math.min(200, prev + 25));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(50, prev - 25));
  const handleResetZoom = () => setZoomLevel(100);

  // Reset all
  const handleResetAll = () => {
    setConfig({
      codeType: 'qr',
      targetEntity: 'student',
      contentTemplate: 'adm_no',
      size: 'medium',
      includeLabel: true,
      includeSubtitle: true,
      errorCorrection: 'M',
      foregroundColor: '#000000',
      backgroundColor: '#FFFFFF'
    });
    setGeneratedCodes([]);
    setSelectedCodes([]);
    setCurrentPreviewIndex(0);
    setFilterClass('');
    setFilterDepartment('');
    setFilterCategory('');
    setSelectedEntityIds([]);
    showNotification('info', 'All settings reset');
  };

  // Regenerate from history
  const handleRegenerateFromHistory = async (historyEntry: GenerationHistory) => {
    setConfig(historyEntry.config);
    setShowHistory(false);
    // Wait for state update then generate
    setTimeout(() => handleGeneratePreview(), 100);
  };

  // Filter codes by search
  const filteredCodes = generatedCodes.filter((code) =>
  code.entityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
  code.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
  code.subtitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentCode = generatedCodes[currentPreviewIndex];

  // Get size dimensions
  const getSizePixels = () => {
    const sizeMap = { small: 100, medium: 150, large: 200 };
    return sizeMap[config.size];
  };

  return (
    <div className="space-y-6 p-6">
      {/* Notification */}
      {notification &&
      <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center gap-2 ${
      notification.type === 'success' ? 'bg-green-100 text-green-800' :
      notification.type === 'error' ? 'bg-red-100 text-red-800' :
      'bg-blue-100 text-blue-800'}`
      }>
          {notification.type === 'success' && <CheckCircle className="w-5 h-5" />}
          {notification.type === 'error' && <AlertCircle className="w-5 h-5" />}
          {notification.type === 'info' && <Info className="w-5 h-5" />}
          <span>{notification.message}</span>
          <button onClick={() => setNotification(null)} className="ml-2">
            <X className="w-4 h-4" />
          </button>
        </div>
      }

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Barcode & QR Generator
          </h1>
          <p className="text-sm text-gray-500">
            Generate codes for ID cards and inventory
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowHistory(!showHistory)}
            title="Generation History">

            <History className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowTemplates(!showTemplates)}
            title="Saved Templates">

            <FolderOpen className="w-4 h-4" />
          </Button>
          {generatedCodes.length > 0 &&
          <>
              <Button
              variant="outline"
              onClick={() => setViewMode(viewMode === 'single' ? 'grid' : 'single')}
              title={viewMode === 'single' ? 'Grid View' : 'Single View'}>

                {viewMode === 'single' ? <Grid className="w-4 h-4" /> : <List className="w-4 h-4" />}
              </Button>
              <Button
              variant="outline"
              onClick={() => setShowBulkActions(!showBulkActions)}>

                Bulk Actions
              </Button>
            </>
          }
          <Button
            variant="outline"
            onClick={handleResetAll}
            title="Reset All">

            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* History Panel */}
      {showHistory &&
      <Card title="Generation History">
          <div className="max-h-60 overflow-y-auto">
            {generationHistory.length === 0 ?
          <p className="text-gray-500 text-center py-4">No generation history yet</p> :

          <div className="space-y-2">
                {generationHistory.map((entry) =>
            <div
              key={entry.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded hover:bg-gray-100">

                    <div>
                      <p className="font-medium">
                        {entry.config.codeType.toUpperCase()} - {entry.config.targetEntity}s
                      </p>
                      <p className="text-sm text-gray-500">
                        {entry.entityCount} codes | {new Date(entry.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <Button
                variant="outline"
                onClick={() => handleRegenerateFromHistory(entry)}>

                      <RefreshCw className="w-4 h-4 mr-2" />
                      Regenerate
                    </Button>
                  </div>
            )}
              </div>
          }
          </div>
        </Card>
      }

      {/* Templates Panel */}
      {showTemplates &&
      <Card title="Saved Templates">
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
              placeholder="Template name..."
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              className="flex-1" />

              <Button onClick={handleSaveTemplate}>
                <Save className="w-4 h-4 mr-2" />
                Save Current
              </Button>
            </div>
            <div className="max-h-40 overflow-y-auto">
              {savedTemplates.length === 0 ?
            <p className="text-gray-500 text-center py-4">No saved templates</p> :

            <div className="space-y-2">
                  {savedTemplates.map((template) =>
              <div
                key={template.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded">

                      <div>
                        <p className="font-medium">{template.name}</p>
                        <p className="text-sm text-gray-500">
                          {template.config.codeType} | {template.config.targetEntity}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                    variant="outline"
                    onClick={() => handleLoadTemplate(template)}>

                          Load
                        </Button>
                        <Button
                    variant="outline"
                    onClick={() => handleDeleteTemplate(template.id)}>

                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
              )}
                </div>
            }
            </div>
          </div>
        </Card>
      }

      {/* Bulk Actions Bar */}
      {showBulkActions && generatedCodes.length > 0 &&
      <Card>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                type="checkbox"
                checked={selectedCodes.length === filteredCodes.length && filteredCodes.length > 0}
                onChange={selectAllCodes}
                className="rounded" />

                <span>Select All ({selectedCodes.length}/{filteredCodes.length})</span>
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                placeholder="Search codes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64" />

              </div>
            </div>
            <div className="flex gap-2">
              <Button
              variant="outline"
              onClick={handleBulkPrint}
              disabled={selectedCodes.length === 0}>

                <Printer className="w-4 h-4 mr-2" />
                Print ({selectedCodes.length})
              </Button>
              <Button
              variant="outline"
              onClick={handleBulkDownload}
              disabled={selectedCodes.length === 0}>

                <Download className="w-4 h-4 mr-2" />
                Download ({selectedCodes.length})
              </Button>
              <Button
              variant="outline"
              onClick={handleDeleteSelected}
              disabled={selectedCodes.length === 0}>

                <Trash2 className="w-4 h-4 mr-2" />
                Delete ({selectedCodes.length})
              </Button>
            </div>
          </div>
        </Card>
      }

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Configuration Card */}
        <Card title="Configuration" className="lg:col-span-1">
          <div className="space-y-4">
            <Select
              label="Code Type"
              value={config.codeType}
              onChange={(e) => setConfig((prev) => ({ ...prev, codeType: e.target.value as any }))}
              options={[
              { value: 'qr', label: 'QR Code' },
              { value: 'barcode128', label: 'Barcode (Code 128)' },
              { value: 'barcode39', label: 'Barcode (Code 39)' },
              { value: 'ean13', label: 'EAN-13' },
              { value: 'upc', label: 'UPC-A' }]
              } />


            <Select
              label="Target Entity"
              value={config.targetEntity}
              onChange={(e) => {
                const newEntity = e.target.value as any;
                setConfig((prev) => ({
                  ...prev,
                  targetEntity: newEntity,
                  contentTemplate: newEntity === 'student' ? 'adm_no' :
                  newEntity === 'employee' ? 'emp_no' : 'item_code'
                }));
                setGeneratedCodes([]);
                setSelectedCodes([]);
                setFilterClass('');
                setFilterDepartment('');
                setFilterCategory('');
                setSelectedEntityIds([]);
              }}
              options={[
              { value: 'student', label: 'Students' },
              { value: 'employee', label: 'Employees' },
              { value: 'inventory', label: 'Inventory Items' }]
              } />


            <Select
              label="Content Template"
              value={config.contentTemplate}
              onChange={(e) => setConfig((prev) => ({ ...prev, contentTemplate: e.target.value }))}
              options={getContentTemplateOptions()} />


            {/* Entity Filter */}
            {config.targetEntity === 'student' &&
            <Select
              label="Filter by Class"
              value={filterClass}
              onChange={(e) => setFilterClass(e.target.value)}
              options={[
              { value: '', label: 'All Classes' },
              ...getFilterOptions().map((c) => ({ value: c, label: `Class ${c}` }))]
              } />

            }

            {config.targetEntity === 'employee' &&
            <Select
              label="Filter by Department"
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
              options={[
              { value: '', label: 'All Departments' },
              ...getFilterOptions().map((d) => ({ value: d, label: d }))]
              } />

            }

            {config.targetEntity === 'inventory' &&
            <Select
              label="Filter by Category"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              options={[
              { value: '', label: 'All Categories' },
              ...getFilterOptions().map((c) => ({ value: c, label: c }))]
              } />

            }

            {/* Entity Selector Button */}
            <div>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setShowEntitySelector(!showEntitySelector)}>

                <Users className="w-4 h-4 mr-2" />
                Select Specific {config.targetEntity === 'student' ? 'Students' :
                config.targetEntity === 'employee' ? 'Employees' : 'Items'}
                {selectedEntityIds.length > 0 && ` (${selectedEntityIds.length})`}
              </Button>
            </div>

            {/* Entity Selector Panel */}
            {showEntitySelector &&
            <div className="border rounded p-3 max-h-48 overflow-y-auto">
                <div className="flex justify-between items-center mb-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                    type="checkbox"
                    checked={selectedEntityIds.length === getAllEntities().length}
                    onChange={selectAllEntities}
                    className="rounded" />

                    <span className="text-sm">Select All</span>
                  </label>
                  <button
                  className="text-sm text-blue-600"
                  onClick={() => setSelectedEntityIds([])}>

                    Clear
                  </button>
                </div>
                <div className="space-y-1">
                  {getAllEntities().map((entity) =>
                <label
                  key={entity.id}
                  className="flex items-center gap-2 p-1 hover:bg-gray-50 rounded cursor-pointer">

                      <input
                    type="checkbox"
                    checked={selectedEntityIds.includes(entity.id)}
                    onChange={() => toggleEntitySelection(entity.id)}
                    className="rounded" />

                      <span className="text-sm">{entity.name}</span>
                    </label>
                )}
                </div>
              </div>
            }

            {/* Advanced Settings Toggle */}
            <button
              className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800"
              onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}>

              <Settings className="w-4 h-4" />
              {showAdvancedSettings ? 'Hide' : 'Show'} Advanced Settings
            </button>

            {/* Advanced Settings */}
            {showAdvancedSettings &&
            <div className="space-y-4 pt-2 border-t">
                <Select
                label="Size"
                value={config.size}
                onChange={(e) => setConfig((prev) => ({ ...prev, size: e.target.value as any }))}
                options={[
                { value: 'small', label: 'Small (100px)' },
                { value: 'medium', label: 'Medium (150px)' },
                { value: 'large', label: 'Large (200px)' }]
                } />


                {config.codeType === 'qr' &&
              <Select
                label="Error Correction"
                value={config.errorCorrection}
                onChange={(e) => setConfig((prev) => ({ ...prev, errorCorrection: e.target.value as any }))}
                options={[
                { value: 'L', label: 'Low (7%)' },
                { value: 'M', label: 'Medium (15%)' },
                { value: 'Q', label: 'Quartile (25%)' },
                { value: 'H', label: 'High (30%)' }]
                } />

              }

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                  type="checkbox"
                  checked={config.includeLabel}
                  onChange={(e) => setConfig((prev) => ({ ...prev, includeLabel: e.target.checked }))}
                  className="rounded" />

                  <span className="text-sm">Include Code Label</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                  type="checkbox"
                  checked={config.includeSubtitle}
                  onChange={(e) => setConfig((prev) => ({ ...prev, includeSubtitle: e.target.checked }))}
                  className="rounded" />

                  <span className="text-sm">Include Entity Name & Details</span>
                </label>
              </div>
            }

            {/* Entity count display */}
            <div className="text-sm text-gray-500 bg-gray-50 p-3 rounded">
              <div className="flex items-center gap-2">
                {config.targetEntity === 'student' && <Users className="w-4 h-4" />}
                {config.targetEntity === 'employee' && <Users className="w-4 h-4" />}
                {config.targetEntity === 'inventory' && <Package className="w-4 h-4" />}
                <span>
                  Available: {getEntities().length} {config.targetEntity}
                  {getEntities().length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>

            <div className="pt-4">
              <Button
                className="w-full"
                onClick={handleGeneratePreview}
                disabled={isGenerating || getEntities().length === 0}>

                {isGenerating ?
                <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </> :

                <>
                    <QrCode className="w-4 h-4 mr-2" />
                    Generate Preview
                  </>
                }
              </Button>
            </div>
          </div>
        </Card>

        {/* Preview Card */}
        <Card
          title={
          <div className="flex items-center justify-between w-full">
              <span>Preview</span>
              {generatedCodes.length > 0 &&
            <div className="flex items-center gap-2">
                  <button onClick={handleZoomOut} className="p-1 hover:bg-gray-100 rounded" title="Zoom Out">
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <span className="text-sm">{zoomLevel}%</span>
                  <button onClick={handleZoomIn} className="p-1 hover:bg-gray-100 rounded" title="Zoom In">
                    <ZoomIn className="w-4 h-4" />
                  </button>
                  <button onClick={handleResetZoom} className="p-1 hover:bg-gray-100 rounded" title="Reset Zoom">
                    <RotateCcw className="w-3 h-3" />
                  </button>
                  <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-1 hover:bg-gray-100 rounded"
                title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}>

                    {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                  </button>
                </div>
            }
            </div>
          }
          className={`lg:col-span-2 ${isFullscreen ? 'fixed inset-4 z-50 bg-white' : ''}`}>

          {generatedCodes.length === 0 ?
          <div className="flex flex-col items-center justify-center min-h-[300px] bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
              {config.codeType === 'qr' ?
            <QrCode className="w-16 h-16 text-gray-300 mb-4" /> :

            <Barcode className="w-16 h-16 text-gray-300 mb-4" />
            }
              <p className="text-gray-500 text-center">
                Configure settings and click "Generate Preview"<br />
                to see your codes here
              </p>
            </div> :
          viewMode === 'single' ? (
          /* Single View */
          <div className="flex flex-col items-center justify-center min-h-[300px] bg-gray-50 rounded-lg border-2 border-dashed border-gray-200 p-4">
              <div
              ref={previewRef}
              className="bg-white p-6 rounded shadow-sm text-center transition-transform"
              style={{ transform: `scale(${zoomLevel / 100})` }}>

                {config.codeType === 'qr' ?
              <div
                className="mx-auto mb-4 flex items-center justify-center border-2 border-gray-800"
                style={{
                  width: getSizePixels(),
                  height: getSizePixels(),
                  background: `
                        linear-gradient(90deg, #000 2px, transparent 2px),
                        linear-gradient(#000 2px, transparent 2px)
                      `,
                  backgroundSize: '8px 8px'
                }} /> :


              <div
                className="mx-auto mb-4 flex items-center justify-center"
                style={{
                  width: getSizePixels() * 1.5,
                  height: getSizePixels() * 0.5,
                  background: `repeating-linear-gradient(
                        90deg,
                        #000 0px,
                        #000 ${config.codeType === 'barcode128' ? '2' : '3'}px,
                        #fff ${config.codeType === 'barcode128' ? '2' : '3'}px,
                        #fff ${config.codeType === 'barcode128' ? '4' : '6'}px
                      )`
                }} />

              }

                {config.includeLabel &&
              <p className="font-mono font-bold text-lg flex items-center justify-center gap-2">
                    {currentCode?.content}
                    <button
                  onClick={() => handleCopyContent(currentCode?.content || '')}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  title="Copy to clipboard">

                      {copiedContent === currentCode?.content ?
                  <Check className="w-4 h-4 text-green-500" /> :

                  <Copy className="w-4 h-4" />
                  }
                    </button>
                  </p>
              }

                {config.includeSubtitle &&
              <>
                    <p className="text-sm text-gray-700 mt-1">{currentCode?.entityName}</p>
                    <p className="text-sm text-gray-500">{currentCode?.subtitle}</p>
                  </>
              }

                <p className="text-xs text-gray-400 mt-2">
                  Generated: {currentCode && new Date(currentCode.timestamp).toLocaleString()}
                </p>
              </div>

              {/* Navigation */}
              <div className="flex items-center gap-4 mt-4">
                <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentPreviewIndex === 0}>

                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <div className="flex items-center gap-2">
                  <Input
                  type="number"
                  min={1}
                  max={generatedCodes.length}
                  value={currentPreviewIndex + 1}
                  onChange={(e) => {
                    const idx = parseInt(e.target.value) - 1;
                    if (idx >= 0 && idx < generatedCodes.length) {
                      setCurrentPreviewIndex(idx);
                    }
                  }}
                  className="w-16 text-center" />

                  <span className="text-sm text-gray-600">of {generatedCodes.length}</span>
                </div>
                <Button
                variant="outline"
                onClick={handleNext}
                disabled={currentPreviewIndex === generatedCodes.length - 1}>

                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 mt-6 justify-center">
                <Button variant="outline" onClick={() => handlePrint()}>
                  <Printer className="w-4 h-4 mr-2" />
                  Print
                </Button>
                <Button variant="outline" onClick={() => handleDownloadPNG()}>
                  <Download className="w-4 h-4 mr-2" />
                  Download PNG
                </Button>
                <Button variant="outline" onClick={() => handleDownloadSVG()}>
                  <FileText className="w-4 h-4 mr-2" />
                  Download SVG
                </Button>
                <Button variant="outline" onClick={() => handleShareEmail()}>
                  <Mail className="w-4 h-4 mr-2" />
                  Email
                </Button>
                <Button variant="outline" onClick={() => handleCopyLink()}>
                  <Link2 className="w-4 h-4 mr-2" />
                  Copy Link
                </Button>
              </div>
            </div>) : (

          /* Grid View */
          <div className="max-h-[500px] overflow-y-auto p-4">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredCodes.map((code, index) =>
              <div
                key={code.id}
                className={`bg-white p-4 rounded shadow-sm text-center cursor-pointer border-2 transition-all hover:shadow-md ${
                selectedCodes.includes(code.id) ?
                'border-blue-500 bg-blue-50' :
                'border-transparent hover:border-gray-300'}`
                }
                onClick={() => {
                  if (showBulkActions) {
                    toggleCodeSelection(code.id);
                  } else {
                    handleGoToIndex(index);
                  }
                }}>

                    {showBulkActions &&
                <div className="flex justify-end mb-2">
                        <input
                    type="checkbox"
                    checked={selectedCodes.includes(code.id)}
                    onChange={() => toggleCodeSelection(code.id)}
                    className="rounded"
                    onClick={(e) => e.stopPropagation()} />

                      </div>
                }
                    {config.codeType === 'qr' ?
                <div
                  className="w-16 h-16 mx-auto mb-2 border border-gray-300"
                  style={{
                    background: `
                            linear-gradient(90deg, #000 1px, transparent 1px),
                            linear-gradient(#000 1px, transparent 1px)
                          `,
                    backgroundSize: '4px 4px'
                  }} /> :


                <div
                  className="w-20 h-8 mx-auto mb-2"
                  style={{
                    background: `repeating-linear-gradient(90deg, #000 0px, #000 1px, #fff 1px, #fff 2px)`
                  }} />

                }
                    <p className="font-mono font-bold text-xs truncate">{code.content}</p>
                    <p className="text-xs text-gray-700 truncate">{code.entityName}</p>
                    <p className="text-xs text-gray-500 truncate">{code.subtitle}</p>
                  </div>
              )}
              </div>
            </div>)
          }
        </Card>
      </div>

      {/* Generated Codes Table */}
      {generatedCodes.length > 0 &&
      <Card title={`Generated Codes (${generatedCodes.length})`}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  {showBulkActions &&
                <th className="text-left p-3 w-10">
                      <input
                    type="checkbox"
                    checked={selectedCodes.length === filteredCodes.length && filteredCodes.length > 0}
                    onChange={selectAllCodes}
                    className="rounded" />

                    </th>
                }
                  <th className="text-left p-3">Entity</th>
                  <th className="text-left p-3">Code Content</th>
                  <th className="text-left p-3">Type</th>
                  <th className="text-left p-3">Generated</th>
                  <th className="text-left p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCodes.map((code, index) =>
              <tr key={code.id} className="border-b hover:bg-gray-50">
                    {showBulkActions &&
                <td className="p-3">
                        <input
                    type="checkbox"
                    checked={selectedCodes.includes(code.id)}
                    onChange={() => toggleCodeSelection(code.id)}
                    className="rounded" />

                      </td>
                }
                    <td className="p-3">
                      <div>
                        <p className="font-medium">{code.entityName}</p>
                        <p className="text-sm text-gray-500">{code.subtitle}</p>
                      </div>
                    </td>
                    <td className="p-3">
                      <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                        {code.content}
                      </code>
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-1 bg-gray-100 rounded text-sm">
                        {code.codeType === 'qr' ? 'QR Code' :
                    code.codeType === 'barcode128' ? 'Code 128' :
                    code.codeType === 'barcode39' ? 'Code 39' :
                    code.codeType === 'ean13' ? 'EAN-13' : 'UPC-A'}
                      </span>
                    </td>
                    <td className="p-3 text-sm text-gray-500">
                      {new Date(code.timestamp).toLocaleTimeString()}
                    </td>
                    <td className="p-3">
                      <div className="flex gap-1">
                        <button
                      onClick={() => handleGoToIndex(index)}
                      className="p-2 hover:bg-gray-100 rounded"
                      title="View">

                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                      onClick={() => handlePrint([code])}
                      className="p-2 hover:bg-gray-100 rounded"
                      title="Print">

                          <Printer className="w-4 h-4" />
                        </button>
                        <button
                      onClick={() => handleDownloadPNG(code)}
                      className="p-2 hover:bg-gray-100 rounded"
                      title="Download PNG">

                          <Download className="w-4 h-4" />
                        </button>
                        <button
                      onClick={() => handleDownloadSVG(code)}
                      className="p-2 hover:bg-gray-100 rounded"
                      title="Download SVG">

                          <FileText className="w-4 h-4" />
                        </button>
                        <button
                      onClick={() => handleCopyContent(code.content)}
                      className="p-2 hover:bg-gray-100 rounded"
                      title="Copy content">

                          {copiedContent === code.content ?
                      <Check className="w-4 h-4 text-green-500" /> :

                      <Copy className="w-4 h-4" />
                      }
                        </button>
                        <button
                      onClick={() => handleShareEmail(code)}
                      className="p-2 hover:bg-gray-100 rounded"
                      title="Share via Email">

                          <Mail className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
              )}
              </tbody>
            </table>
          </div>

          {/* Table Footer with Summary */}
          <div className="flex justify-between items-center mt-4 pt-4 border-t text-sm text-gray-500">
            <div>
              Showing {filteredCodes.length} of {generatedCodes.length} codes
              {searchTerm && ` (filtered by "${searchTerm}")`}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => handlePrint(filteredCodes)}>
                <Printer className="w-4 h-4 mr-2" />
                Print All
              </Button>
              <Button variant="outline" onClick={async () => {
              showNotification('info', `Downloading ${filteredCodes.length} codes...`);
              for (const code of filteredCodes) {
                await handleDownloadPNG(code);
                await new Promise((resolve) => setTimeout(resolve, 300));
              }
              showNotification('success', `Downloaded ${filteredCodes.length} codes`);
            }}>
                <Download className="w-4 h-4 mr-2" />
                Download All
              </Button>
            </div>
          </div>
        </Card>
      }

      {/* Quick Stats */}
      {generatedCodes.length > 0 &&
      <Card title="Generation Summary">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded">
              <p className="text-2xl font-bold">{generatedCodes.length}</p>
              <p className="text-sm text-gray-500">Total Codes</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded">
              <p className="text-2xl font-bold">{config.codeType === 'qr' ? 'QR' : 'Barcode'}</p>
              <p className="text-sm text-gray-500">Code Type</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded">
              <p className="text-2xl font-bold capitalize">{config.targetEntity}</p>
              <p className="text-sm text-gray-500">Entity Type</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded">
              <p className="text-2xl font-bold">{selectedCodes.length}</p>
              <p className="text-sm text-gray-500">Selected</p>
            </div>
          </div>
        </Card>
      }
    </div>);

}