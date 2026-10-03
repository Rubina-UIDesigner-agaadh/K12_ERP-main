import React, { useMemo, useState } from 'react';
import {
  Upload, FileText, CheckCircle2, AlertCircle, ArrowRight, RefreshCw, Eye, Trash2, FileSearch, ChevronRight, ShieldCheck, Smartphone, PlusIcon, XIcon, FilterIcon, SaveIcon, ChevronDownIcon, ChevronUpIcon, InfoIcon, FileCheckIcon, SettingsIcon, BookOpenIcon, Edit2Icon, CopyIcon, UploadCloudIcon, UserIcon, MapPinIcon, PhoneIcon, MailIcon, CalendarIcon, HashIcon } from
'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Modal } from '../../../components/ui/Modal';

// --- Types ---
type Confidence = 'High' | 'Medium' | 'Low';
type TabType = 'upload' | 'configure' | 'templates';

interface ExtractedField {label: string;value: string;confidence: Confidence;docSource: string;}
interface Document {id: string;name: string;description: string;mandatory: boolean;categories: string[];rteRequired: boolean;ewsRequired: boolean;minorityRequired: boolean;admissionTypes: string[];}
interface DocumentTemplate {id: string;name: string;description: string;category: string;rte: boolean;ews: boolean;minority: boolean;admissionType: string;documents: string[];createdAt: string;isDefault: boolean;}
interface AdmissionCriteria {category: string;rte: string;ews: string;minority: string;admissionType: string;}
interface FormField {id: string;label: string;value: string;type: 'text' | 'date' | 'select' | 'textarea';required: boolean;section: string;options?: string[];}

// --- Options ---
const categoryOptions = [{ value: '', label: '-- Select Category --' }, { value: 'General', label: 'General' }, { value: 'OBC', label: 'OBC' }, { value: 'SC', label: 'SC' }, { value: 'ST', label: 'ST' }, { value: 'EBC', label: 'EBC' }, { value: 'NT', label: 'NT' }, { value: 'VJ', label: 'VJ' }, { value: 'SBC', label: 'SBC' }];
const rteOptions = [{ value: '', label: '-- Select RTE --' }, { value: 'Yes', label: 'Yes' }, { value: 'No', label: 'No' }];
const ewsOptions = [{ value: '', label: '-- Select EWS --' }, { value: 'Yes', label: 'Yes' }, { value: 'No', label: 'No' }];
const minorityOptions = [{ value: '', label: '-- Select Minority --' }, { value: 'Yes', label: 'Yes' }, { value: 'No', label: 'No' }];
const admissionTypeOptions = [{ value: '', label: '-- Select Type --' }, { value: 'Fresh', label: 'Fresh' }, { value: 'Transfer', label: 'Transfer' }, { value: 'Lateral', label: 'Lateral' }, { value: 'Re-admission', label: 'Re-admission' }, { value: 'Sports Quota', label: 'Sports Quota' }, { value: 'Management Quota', label: 'Management Quota' }];

// --- Master Documents ---
const MASTER_DOCUMENTS: Document[] = [
{ id: 'birth_cert', name: 'Birth Certificate', description: 'DOB & Name verification', mandatory: true, categories: ['General', 'OBC', 'SC', 'ST', 'EBC', 'NT', 'VJ', 'SBC'], rteRequired: true, ewsRequired: true, minorityRequired: true, admissionTypes: ['Fresh', 'Transfer', 'Lateral', 'Re-admission', 'Sports Quota', 'Management Quota'] },
{ id: 'aadhaar_student', name: 'Aadhaar Card (Student)', description: 'Identity & Address proof', mandatory: true, categories: ['General', 'OBC', 'SC', 'ST', 'EBC', 'NT', 'VJ', 'SBC'], rteRequired: true, ewsRequired: true, minorityRequired: true, admissionTypes: ['Fresh', 'Transfer', 'Lateral', 'Re-admission', 'Sports Quota', 'Management Quota'] },
{ id: 'aadhaar_parent', name: 'Aadhaar Card (Parent)', description: 'Parent identity', mandatory: true, categories: ['General', 'OBC', 'SC', 'ST', 'EBC', 'NT', 'VJ', 'SBC'], rteRequired: true, ewsRequired: true, minorityRequired: true, admissionTypes: ['Fresh', 'Transfer', 'Lateral', 'Re-admission', 'Sports Quota', 'Management Quota'] },
{ id: 'photo_student', name: 'Photo (Student)', description: 'Recent passport photo', mandatory: true, categories: ['General', 'OBC', 'SC', 'ST', 'EBC', 'NT', 'VJ', 'SBC'], rteRequired: true, ewsRequired: true, minorityRequired: true, admissionTypes: ['Fresh', 'Transfer', 'Lateral', 'Re-admission', 'Sports Quota', 'Management Quota'] },
{ id: 'photo_parent', name: 'Photo (Parent)', description: 'Parent passport photo', mandatory: false, categories: ['General', 'OBC', 'SC', 'ST', 'EBC', 'NT', 'VJ', 'SBC'], rteRequired: true, ewsRequired: false, minorityRequired: false, admissionTypes: ['Fresh', 'Transfer', 'Lateral', 'Re-admission', 'Sports Quota', 'Management Quota'] },
{ id: 'tc', name: 'Transfer Certificate', description: 'From previous school', mandatory: false, categories: ['General', 'OBC', 'SC', 'ST', 'EBC', 'NT', 'VJ', 'SBC'], rteRequired: true, ewsRequired: true, minorityRequired: true, admissionTypes: ['Transfer', 'Lateral', 'Re-admission'] },
{ id: 'report_card', name: 'Report Card', description: 'Previous year grades', mandatory: false, categories: ['General', 'OBC', 'SC', 'ST', 'EBC', 'NT', 'VJ', 'SBC'], rteRequired: true, ewsRequired: true, minorityRequired: true, admissionTypes: ['Transfer', 'Lateral', 'Re-admission'] },
{ id: 'caste_cert', name: 'Caste Certificate', description: 'Valid caste certificate', mandatory: true, categories: ['OBC', 'SC', 'ST', 'NT', 'VJ', 'SBC'], rteRequired: true, ewsRequired: false, minorityRequired: false, admissionTypes: ['Fresh', 'Transfer', 'Lateral', 'Re-admission', 'Sports Quota', 'Management Quota'] },
{ id: 'non_creamy_layer', name: 'Non-Creamy Layer', description: 'NCL certificate', mandatory: true, categories: ['OBC', 'SBC'], rteRequired: true, ewsRequired: false, minorityRequired: false, admissionTypes: ['Fresh', 'Transfer', 'Lateral', 'Re-admission', 'Sports Quota', 'Management Quota'] },
{ id: 'income_cert', name: 'Income Certificate', description: 'Family income proof', mandatory: true, categories: ['General', 'OBC', 'SC', 'ST', 'EBC', 'NT', 'VJ', 'SBC'], rteRequired: true, ewsRequired: true, minorityRequired: false, admissionTypes: ['Fresh', 'Transfer', 'Lateral', 'Re-admission', 'Sports Quota', 'Management Quota'] },
{ id: 'ews_cert', name: 'EWS Certificate', description: 'EWS category proof', mandatory: true, categories: ['General'], rteRequired: true, ewsRequired: true, minorityRequired: false, admissionTypes: ['Fresh', 'Transfer', 'Lateral', 'Re-admission', 'Sports Quota', 'Management Quota'] },
{ id: 'minority_cert', name: 'Minority Certificate', description: 'Minority community proof', mandatory: true, categories: ['General', 'OBC', 'SC', 'ST', 'EBC', 'NT', 'VJ', 'SBC'], rteRequired: false, ewsRequired: false, minorityRequired: true, admissionTypes: ['Fresh', 'Transfer', 'Lateral', 'Re-admission', 'Sports Quota', 'Management Quota'] },
{ id: 'residence_proof', name: 'Residence Proof', description: 'Address verification', mandatory: true, categories: ['General', 'OBC', 'SC', 'ST', 'EBC', 'NT', 'VJ', 'SBC'], rteRequired: true, ewsRequired: true, minorityRequired: true, admissionTypes: ['Fresh', 'Transfer', 'Lateral', 'Re-admission', 'Sports Quota', 'Management Quota'] },
{ id: 'sports_cert', name: 'Sports Certificate', description: 'Sports achievement', mandatory: true, categories: ['General', 'OBC', 'SC', 'ST', 'EBC', 'NT', 'VJ', 'SBC'], rteRequired: false, ewsRequired: false, minorityRequired: false, admissionTypes: ['Sports Quota'] },
{ id: 'medical_fitness', name: 'Medical Certificate', description: 'Health fitness', mandatory: false, categories: ['General', 'OBC', 'SC', 'ST', 'EBC', 'NT', 'VJ', 'SBC'], rteRequired: false, ewsRequired: false, minorityRequired: false, admissionTypes: ['Fresh', 'Transfer', 'Lateral', 'Re-admission', 'Sports Quota', 'Management Quota'] },
{ id: 'disability_cert', name: 'Disability Certificate', description: 'PWD certificate', mandatory: false, categories: ['General', 'OBC', 'SC', 'ST', 'EBC', 'NT', 'VJ', 'SBC'], rteRequired: true, ewsRequired: false, minorityRequired: false, admissionTypes: ['Fresh', 'Transfer', 'Lateral', 'Re-admission', 'Sports Quota', 'Management Quota'] }];


const INITIAL_TEMPLATES: DocumentTemplate[] = [
{ id: '1', name: 'General Fresh Admission', description: 'Standard documents for general category', category: 'General', rte: false, ews: false, minority: false, admissionType: 'Fresh', documents: ['birth_cert', 'aadhaar_student', 'aadhaar_parent', 'photo_student', 'residence_proof'], createdAt: '2024-01-15', isDefault: true },
{ id: '2', name: 'RTE Admission - SC/ST', description: 'RTE admission under SC/ST', category: 'SC', rte: true, ews: false, minority: false, admissionType: 'Fresh', documents: ['birth_cert', 'aadhaar_student', 'aadhaar_parent', 'photo_student', 'photo_parent', 'caste_cert', 'income_cert', 'residence_proof'], createdAt: '2024-01-20', isDefault: false },
{ id: '3', name: 'OBC Transfer', description: 'OBC category transfer', category: 'OBC', rte: false, ews: false, minority: false, admissionType: 'Transfer', documents: ['birth_cert', 'aadhaar_student', 'aadhaar_parent', 'photo_student', 'tc', 'report_card', 'caste_cert', 'non_creamy_layer', 'residence_proof'], createdAt: '2024-02-01', isDefault: false }];


// --- Admission Form Fields ---
const ADMISSION_FORM_FIELDS: FormField[] = [
// Personal Information
{ id: 'student_name', label: 'Student Full Name', value: '', type: 'text', required: true, section: 'Personal Information' },
{ id: 'dob', label: 'Date of Birth', value: '', type: 'date', required: true, section: 'Personal Information' },
{ id: 'gender', label: 'Gender', value: '', type: 'select', required: true, section: 'Personal Information', options: ['Male', 'Female', 'Other'] },
{ id: 'blood_group', label: 'Blood Group', value: '', type: 'select', required: false, section: 'Personal Information', options: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'] },
{ id: 'religion', label: 'Religion', value: '', type: 'text', required: false, section: 'Personal Information' },
{ id: 'nationality', label: 'Nationality', value: '', type: 'text', required: true, section: 'Personal Information' },
{ id: 'mother_tongue', label: 'Mother Tongue', value: '', type: 'text', required: false, section: 'Personal Information' },
{ id: 'aadhaar_no', label: 'Aadhaar Number', value: '', type: 'text', required: true, section: 'Personal Information' },
// Parent/Guardian Information
{ id: 'father_name', label: "Father's Name", value: '', type: 'text', required: true, section: 'Parent/Guardian Information' },
{ id: 'father_occupation', label: "Father's Occupation", value: '', type: 'text', required: false, section: 'Parent/Guardian Information' },
{ id: 'father_mobile', label: "Father's Mobile", value: '', type: 'text', required: true, section: 'Parent/Guardian Information' },
{ id: 'father_email', label: "Father's Email", value: '', type: 'text', required: false, section: 'Parent/Guardian Information' },
{ id: 'mother_name', label: "Mother's Name", value: '', type: 'text', required: true, section: 'Parent/Guardian Information' },
{ id: 'mother_occupation', label: "Mother's Occupation", value: '', type: 'text', required: false, section: 'Parent/Guardian Information' },
{ id: 'mother_mobile', label: "Mother's Mobile", value: '', type: 'text', required: false, section: 'Parent/Guardian Information' },
{ id: 'annual_income', label: 'Annual Family Income', value: '', type: 'text', required: false, section: 'Parent/Guardian Information' },
// Address Information
{ id: 'address_line1', label: 'Address Line 1', value: '', type: 'text', required: true, section: 'Address Information' },
{ id: 'address_line2', label: 'Address Line 2', value: '', type: 'text', required: false, section: 'Address Information' },
{ id: 'city', label: 'City', value: '', type: 'text', required: true, section: 'Address Information' },
{ id: 'state', label: 'State', value: '', type: 'text', required: true, section: 'Address Information' },
{ id: 'pincode', label: 'Pincode', value: '', type: 'text', required: true, section: 'Address Information' },
// Academic Information
{ id: 'class_applying', label: 'Class Applying For', value: '', type: 'select', required: true, section: 'Academic Information', options: ['Nursery', 'LKG', 'UKG', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'] },
{ id: 'previous_school', label: 'Previous School Name', value: '', type: 'text', required: false, section: 'Academic Information' },
{ id: 'previous_class', label: 'Previous Class', value: '', type: 'text', required: false, section: 'Academic Information' },
{ id: 'tc_number', label: 'TC Number', value: '', type: 'text', required: false, section: 'Academic Information' },
// Category Information
{ id: 'category', label: 'Category', value: '', type: 'select', required: true, section: 'Category Information', options: ['General', 'OBC', 'SC', 'ST', 'EBC', 'NT', 'VJ', 'SBC'] },
{ id: 'caste', label: 'Caste', value: '', type: 'text', required: false, section: 'Category Information' },
{ id: 'sub_caste', label: 'Sub-Caste', value: '', type: 'text', required: false, section: 'Category Information' }];


// --- Main Component ---
export function AdmissionExamQpSetup() {
  const [activeTab, setActiveTab] = useState<TabType>('upload');
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [criteria, setCriteria] = useState<AdmissionCriteria>({ category: '', rte: '', ews: '', minority: '', admissionType: '' });
  const [showCriteriaPanel, setShowCriteriaPanel] = useState(true);
  const [uploadedDocs, setUploadedDocs] = useState<Record<string, {fileName: string;status: string;}>>({});
  const [templates, setTemplates] = useState<DocumentTemplate[]>(INITIAL_TEMPLATES);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [newTemplate, setNewTemplate] = useState({ name: '', description: '', documents: [] as string[] });
  const [customDocuments, setCustomDocuments] = useState<Document[]>(MASTER_DOCUMENTS);
  const [showAddDocModal, setShowAddDocModal] = useState(false);
  const [newDocument, setNewDocument] = useState<Partial<Document>>({ name: '', description: '', mandatory: false, categories: [], rteRequired: false, ewsRequired: false, minorityRequired: false, admissionTypes: [] });
  const [extractedData, setExtractedData] = useState<ExtractedField[]>([
  { label: 'Student Full Name', value: 'Aarav Sharma', confidence: 'High', docSource: 'Aadhaar Card' },
  { label: 'Date of Birth', value: '2014-05-12', confidence: 'High', docSource: 'Birth Certificate' },
  { label: "Father's Name", value: 'Rajesh Sharma', confidence: 'Medium', docSource: 'Aadhaar Card' },
  { label: 'Gender', value: 'Male', confidence: 'High', docSource: 'Aadhaar Card' },
  { label: 'Address', value: 'Flat 402, Nilgiri Apartments, Sector 12, Dwarka, Delhi', confidence: 'Medium', docSource: 'Aadhaar Card' },
  { label: 'Pincode', value: '110075', confidence: 'High', docSource: 'Aadhaar Card' },
  { label: 'Aadhaar Number', value: '1234 5678 9012', confidence: 'High', docSource: 'Aadhaar Card' }]
  );
  const [formFields, setFormFields] = useState<FormField[]>(ADMISSION_FORM_FIELDS);
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [bulkFiles, setBulkFiles] = useState<File[]>([]);
  const [bulkUploadProgress, setBulkUploadProgress] = useState(0);
  const [isBulkUploading, setIsBulkUploading] = useState(false);
  const [expandedSections, setExpandedSections] = useState<string[]>(['Personal Information', 'Parent/Guardian Information', 'Address Information', 'Academic Information', 'Category Information']);

  const requiredDocuments = useMemo(() => {
    return customDocuments.filter((doc) => {
      if (criteria.category && !doc.categories.includes(criteria.category)) return false;
      if (criteria.admissionType && !doc.admissionTypes.includes(criteria.admissionType)) return false;
      if (doc.mandatory) return true;
      if (criteria.rte === 'Yes' && doc.rteRequired) return true;
      if (criteria.ews === 'Yes' && doc.ewsRequired) return true;
      if (criteria.minority === 'Yes' && doc.minorityRequired) return true;
      if (criteria.category && ['OBC', 'SC', 'ST', 'NT', 'VJ', 'SBC', 'EBC'].includes(criteria.category) && ['caste_cert', 'non_creamy_layer'].includes(doc.id) && doc.categories.includes(criteria.category)) return true;
      if (['Transfer', 'Lateral'].includes(criteria.admissionType) && ['tc', 'report_card'].includes(doc.id)) return true;
      if (criteria.admissionType === 'Sports Quota' && doc.id === 'sports_cert') return true;
      return false;
    });
  }, [criteria, customDocuments]);

  const handleCriteriaChange = (field: keyof AdmissionCriteria, value: string) => setCriteria((prev) => ({ ...prev, [field]: value }));

  const handleStartExtraction = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      // Auto-fill form fields from extracted data
      const updatedFields = formFields.map((field) => {
        const extracted = extractedData.find((e) => e.label.toLowerCase().includes(field.label.toLowerCase().split(' ')[0]));
        if (extracted) return { ...field, value: extracted.value };
        if (field.id === 'student_name') return { ...field, value: extractedData.find((e) => e.label === 'Student Full Name')?.value || '' };
        if (field.id === 'dob') return { ...field, value: extractedData.find((e) => e.label === 'Date of Birth')?.value || '' };
        if (field.id === 'father_name') return { ...field, value: extractedData.find((e) => e.label === "Father's Name")?.value || '' };
        if (field.id === 'gender') return { ...field, value: extractedData.find((e) => e.label === 'Gender')?.value || '' };
        if (field.id === 'address_line1') return { ...field, value: extractedData.find((e) => e.label === 'Address')?.value || '' };
        if (field.id === 'pincode') return { ...field, value: extractedData.find((e) => e.label === 'Pincode')?.value || '' };
        if (field.id === 'aadhaar_no') return { ...field, value: extractedData.find((e) => e.label === 'Aadhaar Number')?.value || '' };
        if (field.id === 'category') return { ...field, value: criteria.category };
        return field;
      });
      setFormFields(updatedFields);
      setStep(2);
    }, 2000);
  };

  const handleUploadDoc = (docId: string) => setUploadedDocs((prev) => ({ ...prev, [docId]: { fileName: `${docId}_document.pdf`, status: 'uploaded' } }));
  const handleRemoveDoc = (docId: string) => setUploadedDocs((prev) => {const n = { ...prev };delete n[docId];return n;});

  const handleApplyTemplate = (template: DocumentTemplate) => {
    setCriteria({ category: template.category, rte: template.rte ? 'Yes' : 'No', ews: template.ews ? 'Yes' : 'No', minority: template.minority ? 'Yes' : 'No', admissionType: template.admissionType });
    setActiveTab('upload');
  };

  const handleSaveTemplate = () => {
    if (!newTemplate.name || newTemplate.documents.length === 0) return;
    setTemplates((prev) => [...prev, { id: String(Date.now()), name: newTemplate.name, description: newTemplate.description, category: criteria.category, rte: criteria.rte === 'Yes', ews: criteria.ews === 'Yes', minority: criteria.minority === 'Yes', admissionType: criteria.admissionType, documents: newTemplate.documents, createdAt: new Date().toISOString().split('T')[0], isDefault: false }]);
    setShowTemplateModal(false);
    setNewTemplate({ name: '', description: '', documents: [] });
  };

  const handleDeleteTemplate = (id: string) => setTemplates((prev) => prev.filter((t) => t.id !== id));

  const handleAddCustomDocument = () => {
    if (!newDocument.name) return;
    setCustomDocuments((prev) => [...prev, { id: `custom_${Date.now()}`, name: newDocument.name || '', description: newDocument.description || '', mandatory: newDocument.mandatory || false, categories: newDocument.categories || [], rteRequired: newDocument.rteRequired || false, ewsRequired: newDocument.ewsRequired || false, minorityRequired: newDocument.minorityRequired || false, admissionTypes: newDocument.admissionTypes || [] }]);
    setShowAddDocModal(false);
    setNewDocument({ name: '', description: '', mandatory: false, categories: [], rteRequired: false, ewsRequired: false, minorityRequired: false, admissionTypes: [] });
  };

  const handleToggleDocMandatory = (docId: string) => setCustomDocuments((prev) => prev.map((doc) => doc.id === docId ? { ...doc, mandatory: !doc.mandatory } : doc));
  const handleFormFieldChange = (fieldId: string, value: string) => setFormFields((prev) => prev.map((f) => f.id === fieldId ? { ...f, value } : f));
  const toggleSection = (section: string) => setExpandedSections((prev) => prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]);
  const toggleTemplateDoc = (docId: string) => setNewTemplate((prev) => ({ ...prev, documents: prev.documents.includes(docId) ? prev.documents.filter((d) => d !== docId) : [...prev.documents, docId] }));

  const getConfidenceColor = (level: Confidence) => level === 'High' ? 'success' : level === 'Medium' ? 'warning' : 'danger';
  const uploadProgress = useMemo(() => {const total = requiredDocuments.filter((d) => d.mandatory).length;const uploaded = Object.keys(uploadedDocs).filter((id) => requiredDocuments.find((d) => d.id === id && d.mandatory)).length;return { total, uploaded, percentage: total > 0 ? Math.round(uploaded / total * 100) : 0 };}, [requiredDocuments, uploadedDocs]);
  const formSections = useMemo(() => [...new Set(formFields.map((f) => f.section))], [formFields]);
  const emptyRequiredFields = useMemo(() => formFields.filter((f) => f.required && !f.value).length, [formFields]);

  const handleBulkUploadStart = () => {
    setIsBulkUploading(true);setBulkUploadProgress(0);
    const interval = setInterval(() => {
      setBulkUploadProgress((prev) => {
        if (prev >= 100) {clearInterval(interval);setIsBulkUploading(false);bulkFiles.forEach((_, i) => {setTimeout(() => {const docId = requiredDocuments[i % requiredDocuments.length]?.id;if (docId) handleUploadDoc(docId);}, i * 200);});setShowBulkUpload(false);setBulkFiles([]);return 100;}
        return prev + 10;
      });
    }, 300);
  };

  // Render Functions
  const renderCriteriaPanel = () =>
  <Card className="p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2"><FilterIcon className="w-5 h-5 text-blue-600" /><h3 className="text-lg font-semibold">Admission Criteria</h3></div>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={() => setShowCriteriaPanel(!showCriteriaPanel)}>{showCriteriaPanel ? <><ChevronUpIcon className="w-4 h-4 mr-1" />Hide</> : <><ChevronDownIcon className="w-4 h-4 mr-1" />Show</>}</Button>
          <Button variant="outline" size="sm" onClick={() => setShowTemplateModal(true)} disabled={!criteria.category}><SaveIcon className="w-4 h-4 mr-1" />Save Template</Button>
        </div>
      </div>
      {showCriteriaPanel &&
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Select label="Category" value={criteria.category} onChange={(e) => handleCriteriaChange('category', e.target.value)} options={categoryOptions} />
          <Select label="RTE" value={criteria.rte} onChange={(e) => handleCriteriaChange('rte', e.target.value)} options={rteOptions} />
          <Select label="EWS" value={criteria.ews} onChange={(e) => handleCriteriaChange('ews', e.target.value)} options={ewsOptions} />
          <Select label="Minority" value={criteria.minority} onChange={(e) => handleCriteriaChange('minority', e.target.value)} options={minorityOptions} />
          <Select label="Admission Type" value={criteria.admissionType} onChange={(e) => handleCriteriaChange('admissionType', e.target.value)} options={admissionTypeOptions} />
        </div>
    }
      {criteria.category &&
    <div className="mt-4 pt-4 border-t flex flex-wrap gap-4">
          <div className="flex items-center gap-2 text-sm"><FileText className="w-4 h-4 text-blue-600" /><span className="text-gray-600">Required:</span><Badge variant="info">{requiredDocuments.filter((d) => d.mandatory).length} Mandatory</Badge><Badge variant="secondary">{requiredDocuments.filter((d) => !d.mandatory).length} Optional</Badge></div>
          <div className="flex items-center gap-2 text-sm"><CheckCircle2 className="w-4 h-4 text-green-600" /><span className="text-gray-600">Uploaded:</span><Badge variant="success">{Object.keys(uploadedDocs).length} / {requiredDocuments.length}</Badge></div>
        </div>
    }
    </Card>;


  const renderDocumentList = (docs: Document[], isMandatory: boolean) =>
  <div className="space-y-2">
      {docs.map((doc) =>
    <div key={doc.id} className={`flex items-center justify-between p-4 border rounded-xl transition-colors ${uploadedDocs[doc.id] ? 'bg-green-50 border-green-200' : isMandatory ? 'hover:border-blue-300' : 'hover:border-blue-300 bg-gray-50'}`}>
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-lg ${uploadedDocs[doc.id] ? 'bg-green-100 text-green-600' : isMandatory ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-500'}`}>
              {uploadedDocs[doc.id] ? <CheckCircle2 className="w-6 h-6" /> : <FileText className="w-6 h-6" />}
            </div>
            <div>
              <p className="font-medium text-gray-900 flex items-center gap-2">{doc.name}<Badge variant={isMandatory ? "danger" : "secondary"} className="text-xs">{isMandatory ? 'Required' : 'Optional'}</Badge></p>
              <p className="text-sm text-gray-500">{doc.description}</p>
              {uploadedDocs[doc.id] && <p className="text-xs text-green-600 mt-1">✓ {uploadedDocs[doc.id].fileName}</p>}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {uploadedDocs[doc.id] ? <><Button variant="ghost" size="sm"><Eye className="w-4 h-4" /></Button><Button variant="ghost" size="sm" onClick={() => handleRemoveDoc(doc.id)} className="text-red-500"><Trash2 className="w-4 h-4" /></Button></> : <><Button variant={isMandatory ? "outline" : "ghost"} size="sm" onClick={() => handleUploadDoc(doc.id)}><Upload className="w-4 h-4 mr-2" />Upload</Button><Smartphone className="w-5 h-5 text-gray-400 hover:text-blue-500 cursor-pointer hidden md:block" title="Upload via Mobile" /></>}
          </div>
        </div>
    )}
    </div>;


  const renderFormSection = (section: string) => {
    const sectionFields = formFields.filter((f) => f.section === section);
    const isExpanded = expandedSections.includes(section);
    const emptyRequired = sectionFields.filter((f) => f.required && !f.value).length;
    const sectionIcons: Record<string, React.ElementType> = { 'Personal Information': UserIcon, 'Parent/Guardian Information': UserIcon, 'Address Information': MapPinIcon, 'Academic Information': BookOpenIcon, 'Category Information': HashIcon };
    const Icon = sectionIcons[section] || FileText;

    return (
      <div key={section} className="border rounded-xl overflow-hidden">
        <button onClick={() => toggleSection(section)} className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors">
          <div className="flex items-center gap-3"><Icon className="w-5 h-5 text-blue-600" /><h4 className="font-semibold text-gray-900">{section}</h4>{emptyRequired > 0 && <Badge variant="warning" className="text-xs">{emptyRequired} empty</Badge>}</div>
          {isExpanded ? <ChevronUpIcon className="w-5 h-5 text-gray-500" /> : <ChevronDownIcon className="w-5 h-5 text-gray-500" />}
        </button>
        {isExpanded &&
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sectionFields.map((field) =>
          <div key={field.id} className={`${field.type === 'textarea' ? 'md:col-span-2 lg:col-span-3' : ''}`}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}{field.required && <span className="text-red-500 ml-1">*</span>}</label>
                {field.type === 'select' ?
            <select value={field.value} onChange={(e) => handleFormFieldChange(field.id, e.target.value)} className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${!field.value && field.required ? 'border-red-300 bg-red-50' : 'border-gray-300'}`}>
                    <option value="">Select {field.label}</option>
                    {field.options?.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                  </select> :
            field.type === 'textarea' ?
            <textarea value={field.value} onChange={(e) => handleFormFieldChange(field.id, e.target.value)} rows={3} className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${!field.value && field.required ? 'border-red-300 bg-red-50' : 'border-gray-300'}`} /> :

            <input type={field.type} value={field.value} onChange={(e) => handleFormFieldChange(field.id, e.target.value)} className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${!field.value && field.required ? 'border-red-300 bg-red-50' : 'border-gray-300'}`} />
            }
              </div>
          )}
          </div>
        }
      </div>);

  };

  const renderUploadTab = () =>
  <div className="space-y-6">
      {renderCriteriaPanel()}
      {step === 1 &&
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Required Documents</h2>
              {criteria.category &&
          <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => setShowBulkUpload(true)} className="text-blue-600"><UploadCloudIcon className="w-4 h-4 mr-2" />Bulk Upload</Button>
                  <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden"><div className="h-full bg-green-500 transition-all" style={{ width: `${uploadProgress.percentage}%` }} /></div>
                  <span className="text-sm text-gray-600">{uploadProgress.uploaded}/{uploadProgress.total}</span>
                </div>
          }
            </div>
            {!criteria.category ?
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed"><FilterIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" /><h3 className="text-lg font-medium text-gray-700">Select Admission Criteria</h3><p className="text-gray-500 mt-2">Please select criteria above to see required documents</p></div> :

        <div className="space-y-4">
                {requiredDocuments.filter((d) => d.mandatory).length > 0 && <div><h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2"><span className="w-2 h-2 bg-red-500 rounded-full" />Mandatory Documents</h4>{renderDocumentList(requiredDocuments.filter((d) => d.mandatory), true)}</div>}
                {requiredDocuments.filter((d) => !d.mandatory).length > 0 && <div><h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2"><span className="w-2 h-2 bg-gray-400 rounded-full" />Optional Documents</h4>{renderDocumentList(requiredDocuments.filter((d) => !d.mandatory), false)}</div>}
              </div>
        }
            {criteria.category &&
        <div className="mt-8 border-2 border-dashed border-gray-200 rounded-2xl p-10 text-center bg-gray-50">
                <Upload className="w-12 h-12 text-gray-300 mx-auto mb-4" /><h3 className="text-lg font-medium">Bulk Drag & Drop</h3><p className="text-gray-500 mb-6">AI will auto-categorize documents</p>
                <Button onClick={handleStartExtraction} disabled={isProcessing || Object.keys(uploadedDocs).length === 0}>{isProcessing ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <FileSearch className="w-4 h-4 mr-2" />}{isProcessing ? 'Processing...' : 'Scan & Extract Data'}</Button>
              </div>
        }
          </Card>
          <div className="space-y-6">
            <Card className="p-6 bg-blue-900 text-white">
              <ShieldCheck className="w-10 h-10 mb-4 text-blue-300" /><h3 className="text-xl font-bold mb-2">Secure AI Processing</h3>
              <ul className="space-y-3 text-sm text-blue-100">{['OCR supports Aadhaar, Birth Certificates, TC', 'Encrypted & secure processing', 'Saves ~15 minutes per form', 'Auto category-based validation'].map((text, i) => <li key={i} className="flex items-start gap-2"><div className="mt-1 w-1.5 h-1.5 bg-blue-300 rounded-full shrink-0" />{text}</li>)}</ul>
            </Card>
            <Card className="p-4">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2"><BookOpenIcon className="w-4 h-4 text-blue-600" />Quick Templates</h3>
              <div className="space-y-2">
                {templates.slice(0, 3).map((t) => <button key={t.id} onClick={() => handleApplyTemplate(t)} className="w-full text-left p-3 rounded-lg border hover:border-blue-300 hover:bg-blue-50 transition-colors"><p className="font-medium text-sm text-gray-900">{t.name}</p><p className="text-xs text-gray-500">{t.documents.length} documents</p></button>)}
                <Button variant="ghost" size="sm" className="w-full" onClick={() => setActiveTab('templates')}>View All <ChevronRight className="w-4 h-4 ml-1" /></Button>
              </div>
            </Card>
          </div>
        </div>
    }

      {/* STEP 2: REVIEW EXTRACTED DATA */}
      {step === 2 &&
    <div className="space-y-4">
          <div className="flex justify-between items-center bg-amber-50 border border-amber-200 p-4 rounded-lg">
            <div className="flex items-center gap-3 text-amber-800"><AlertCircle className="w-5 h-5" /><p className="text-sm font-medium">Verify extracted data against documents</p></div>
            <div className="flex gap-2"><Button variant="outline" size="sm" onClick={() => setStep(1)}>Back</Button><Button size="sm" onClick={() => setStep(3)}>Continue to Form</Button></div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[700px]">
            <Card className="flex flex-col overflow-hidden">
              <div className="p-4 border-b flex justify-between items-center bg-gray-50">
                <select className="bg-transparent font-semibold outline-none"><option>Preview: Student Aadhaar Card.pdf</option><option>Preview: Birth Certificate.jpg</option></select>
                <div className="flex gap-2"><Button variant="ghost" size="sm"><RefreshCw className="w-4 h-4" /></Button><Button variant="ghost" size="sm" className="text-red-500"><Trash2 className="w-4 h-4" /></Button></div>
              </div>
              <div className="flex-1 bg-gray-800 flex items-center justify-center relative"><div className="w-3/4 h-1/2 bg-white/10 border border-white/20 rounded flex items-center justify-center text-white/30 text-center p-8 italic">[ Document Preview with OCR Highlighting ]</div><div className="absolute top-1/3 left-1/4 w-32 h-8 border-2 border-yellow-400 bg-yellow-400/20 rounded animate-pulse" /></div>
            </Card>
            <Card className="flex flex-col overflow-hidden">
              <div className="p-4 border-b bg-gray-50 flex justify-between items-center"><h3 className="font-semibold">Extracted Data</h3><Badge variant="secondary">{extractedData.length} Fields</Badge></div>
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {extractedData.map((field, idx) =>
            <div key={idx} className={`p-4 rounded-xl border ${field.confidence === 'Low' ? 'border-red-200 bg-red-50' : 'bg-white'}`}>
                    <div className="flex justify-between items-start mb-2"><label className="text-xs font-bold uppercase tracking-wider text-gray-500">{field.label}</label><div className="flex items-center gap-2"><span className="text-[10px] text-gray-400">{field.docSource}</span><Badge variant={getConfidenceColor(field.confidence)} className="text-[10px]">{field.confidence}</Badge></div></div>
                    <div className="flex gap-2"><Input value={field.value} onChange={(e) => {const n = [...extractedData];n[idx].value = e.target.value;setExtractedData(n);}} className="flex-1" /><Button variant="outline" size="sm" title="Re-scan"><RefreshCw className="w-4 h-4" /></Button></div>
                  </div>
            )}
              </div>
            </Card>
          </div>
        </div>
    }

      {/* STEP 3: MANUAL FORM REVIEW & EDIT */}
      {step === 3 &&
    <div className="space-y-4">
          <div className="flex justify-between items-center bg-blue-50 border border-blue-200 p-4 rounded-lg">
            <div className="flex items-center gap-3 text-blue-800"><Edit2Icon className="w-5 h-5" /><div><p className="text-sm font-medium">Review & Edit Admission Form</p><p className="text-xs">Fill any empty required fields and verify all information</p></div></div>
            <div className="flex items-center gap-4">
              {emptyRequiredFields > 0 && <Badge variant="warning">{emptyRequiredFields} required fields empty</Badge>}
              <div className="flex gap-2"><Button variant="outline" size="sm" onClick={() => setStep(2)}>Back</Button><Button size="sm" onClick={() => setStep(4)} disabled={emptyRequiredFields > 0}>Submit Application</Button></div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3 space-y-4">{formSections.map((section) => renderFormSection(section))}</div>
            <div className="space-y-4">
              <Card className="p-4">
                <h4 className="font-semibold text-gray-900 mb-3">Form Progress</h4>
                <div className="space-y-3">
                  {formSections.map((section) => {
                const fields = formFields.filter((f) => f.section === section);
                const filled = fields.filter((f) => f.value).length;
                const required = fields.filter((f) => f.required);
                const reqFilled = required.filter((f) => f.value).length;
                return (
                  <div key={section}>
                        <div className="flex justify-between text-xs text-gray-600 mb-1"><span>{section.split(' ')[0]}</span><span>{filled}/{fields.length}</span></div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden"><div className={`h-full rounded-full ${reqFilled === required.length ? 'bg-green-500' : 'bg-yellow-500'}`} style={{ width: `${filled / fields.length * 100}%` }} /></div>
                      </div>);

              })}
                </div>
              </Card>
              <Card className="p-4 bg-amber-50 border-amber-200">
                <h4 className="font-semibold text-amber-800 mb-2 flex items-center gap-2"><AlertCircle className="w-4 h-4" />Required Fields</h4>
                <div className="space-y-1 max-h-48 overflow-y-auto">
                  {formFields.filter((f) => f.required && !f.value).map((f) => <p key={f.id} className="text-xs text-amber-700 flex items-center gap-1"><XIcon className="w-3 h-3" />{f.label}</p>)}
                  {emptyRequiredFields === 0 && <p className="text-xs text-green-700 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" />All required fields filled!</p>}
                </div>
              </Card>
              <Card className="p-4">
                <h4 className="font-semibold text-gray-900 mb-3">Uploaded Documents</h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {Object.entries(uploadedDocs).map(([id, doc]) => <div key={id} className="flex items-center gap-2 text-xs text-gray-600"><CheckCircle2 className="w-3 h-3 text-green-600" />{customDocuments.find((d) => d.id === id)?.name || id}</div>)}
                </div>
              </Card>
            </div>
          </div>
        </div>
    }

      {/* STEP 4: SUCCESS */}
      {step === 4 &&
    <Card className="max-w-2xl mx-auto p-12 text-center">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6"><CheckCircle2 className="w-12 h-12" /></div>
          <h2 className="text-2xl font-bold mb-2">Application Submitted!</h2>
          <p className="text-gray-500 mb-8">Admission form has been submitted successfully. All documents are securely stored.</p>
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="p-4 bg-gray-50 rounded-lg border"><p className="text-xs text-gray-500 uppercase font-bold">Fields Filled</p><p className="text-2xl font-bold">{formFields.filter((f) => f.value).length}</p></div>
            <div className="p-4 bg-gray-50 rounded-lg border"><p className="text-xs text-gray-500 uppercase font-bold">Docs Uploaded</p><p className="text-2xl font-bold">{Object.keys(uploadedDocs).length}</p></div>
            <div className="p-4 bg-gray-50 rounded-lg border"><p className="text-xs text-gray-500 uppercase font-bold">Application ID</p><p className="text-2xl font-bold">#2024-089</p></div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={() => {setStep(1);setUploadedDocs({});setFormFields(ADMISSION_FORM_FIELDS);}} variant="outline">New Application</Button>
            <Button>View Application <ChevronRight className="w-4 h-4 ml-2" /></Button>
          </div>
        </Card>
    }
    </div>;


  const renderConfigureTab = () =>
  <div className="space-y-6">
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div><h3 className="text-lg font-semibold">Document Configuration</h3><p className="text-sm text-gray-500">Manage document requirements</p></div>
          <Button onClick={() => setShowAddDocModal(true)}><PlusIcon className="w-4 h-4 mr-2" />Add Document</Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
          <Select label="Category" value={criteria.category} onChange={(e) => handleCriteriaChange('category', e.target.value)} options={categoryOptions} />
          <Select label="RTE" value={criteria.rte} onChange={(e) => handleCriteriaChange('rte', e.target.value)} options={[{ value: '', label: 'All' }, { value: 'Yes', label: 'Yes' }, { value: 'No', label: 'No' }]} />
          <Select label="EWS" value={criteria.ews} onChange={(e) => handleCriteriaChange('ews', e.target.value)} options={[{ value: '', label: 'All' }, { value: 'Yes', label: 'Yes' }, { value: 'No', label: 'No' }]} />
          <Select label="Minority" value={criteria.minority} onChange={(e) => handleCriteriaChange('minority', e.target.value)} options={[{ value: '', label: 'All' }, { value: 'Yes', label: 'Yes' }, { value: 'No', label: 'No' }]} />
          <Select label="Admission Type" value={criteria.admissionType} onChange={(e) => handleCriteriaChange('admissionType', e.target.value)} options={admissionTypeOptions} />
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>{['Document', 'Categories', 'RTE', 'EWS', 'Minority', 'Types', 'Mandatory', 'Actions'].map((h) => <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y">
              {customDocuments.map((doc) =>
            <tr key={doc.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3"><p className="font-medium text-gray-900">{doc.name}</p><p className="text-xs text-gray-500">{doc.description}</p></td>
                  <td className="px-4 py-3"><div className="flex flex-wrap gap-1">{doc.categories.slice(0, 3).map((cat) => <Badge key={cat} variant="secondary" className="text-xs">{cat}</Badge>)}{doc.categories.length > 3 && <Badge variant="secondary" className="text-xs">+{doc.categories.length - 3}</Badge>}</div></td>
                  <td className="px-4 py-3 text-center">{doc.rteRequired ? <CheckCircle2 className="w-4 h-4 text-green-600 mx-auto" /> : <XIcon className="w-4 h-4 text-gray-300 mx-auto" />}</td>
                  <td className="px-4 py-3 text-center">{doc.ewsRequired ? <CheckCircle2 className="w-4 h-4 text-green-600 mx-auto" /> : <XIcon className="w-4 h-4 text-gray-300 mx-auto" />}</td>
                  <td className="px-4 py-3 text-center">{doc.minorityRequired ? <CheckCircle2 className="w-4 h-4 text-green-600 mx-auto" /> : <XIcon className="w-4 h-4 text-gray-300 mx-auto" />}</td>
                  <td className="px-4 py-3"><div className="flex flex-wrap gap-1">{doc.admissionTypes.slice(0, 2).map((t) => <Badge key={t} variant="info" className="text-xs">{t}</Badge>)}{doc.admissionTypes.length > 2 && <Badge variant="info" className="text-xs">+{doc.admissionTypes.length - 2}</Badge>}</div></td>
                  <td className="px-4 py-3 text-center"><button onClick={() => handleToggleDocMandatory(doc.id)} className={`w-6 h-6 rounded ${doc.mandatory ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-400'}`}>{doc.mandatory ? <CheckCircle2 className="w-4 h-4 mx-auto" /> : <XIcon className="w-4 h-4 mx-auto" />}</button></td>
                  <td className="px-4 py-3 text-center"><div className="flex justify-center gap-1"><Button variant="ghost" size="sm"><Edit2Icon className="w-4 h-4" /></Button><Button variant="ghost" size="sm" className="text-red-500"><Trash2 className="w-4 h-4" /></Button></div></td>
                </tr>
            )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>;


  const renderTemplatesTab = () =>
  <div className="space-y-6">
      <Card className="p-4">
        <div className="flex items-center justify-between mb-6">
          <div><h3 className="text-lg font-semibold">Document Templates</h3><p className="text-sm text-gray-500">Pre-configured document sets</p></div>
          <Button onClick={() => setShowTemplateModal(true)}><PlusIcon className="w-4 h-4 mr-2" />Create Template</Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map((t) =>
        <Card key={t.id} className="p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div><h4 className="font-semibold text-gray-900 flex items-center gap-2">{t.name}{t.isDefault && <Badge variant="success" className="text-xs">Default</Badge>}</h4><p className="text-sm text-gray-500 mt-1">{t.description}</p></div>
              </div>
              <div className="space-y-2 mb-4">
                <div className="flex flex-wrap gap-2"><Badge variant="info">{t.category}</Badge>{t.rte && <Badge variant="warning">RTE</Badge>}{t.ews && <Badge variant="secondary">EWS</Badge>}{t.minority && <Badge variant="secondary">Minority</Badge>}<Badge variant="secondary">{t.admissionType}</Badge></div>
                <p className="text-xs text-gray-500">{t.documents.length} documents · {t.createdAt}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="primary" size="sm" className="flex-1" onClick={() => handleApplyTemplate(t)}>Apply</Button>
                <Button variant="outline" size="sm"><Eye className="w-4 h-4" /></Button>
                <Button variant="outline" size="sm"><CopyIcon className="w-4 h-4" /></Button>
                {!t.isDefault && <Button variant="outline" size="sm" className="text-red-500" onClick={() => handleDeleteTemplate(t.id)}><Trash2 className="w-4 h-4" /></Button>}
              </div>
            </Card>
        )}
        </div>
      </Card>
    </div>;


  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div><h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2"><FileCheckIcon className="w-7 h-7" />Document Upload & Auto-Fill</h1><p className="text-gray-500">Upload documents to auto-populate admission form</p></div>
        {activeTab === 'upload' && step > 1 &&
        <div className="flex items-center gap-2 bg-white p-2 rounded-lg border shadow-sm">
            {[1, 2, 3, 4].map((s) => <React.Fragment key={s}><div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step === s ? 'bg-blue-600 text-white' : step > s ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-400'}`}>{step > s ? <CheckCircle2 className="w-5 h-5" /> : s}</div>{s < 4 && <div className={`w-6 h-1 mx-1 ${step > s ? 'bg-green-500' : 'bg-gray-100'}`} />}</React.Fragment>)}
          </div>
        }
      </div>

      <div className="border-b border-gray-200">
        <nav className="flex gap-4">
          {[{ id: 'upload' as TabType, icon: Upload, label: 'Upload Documents' }, { id: 'configure' as TabType, icon: SettingsIcon, label: 'Configure Documents' }, { id: 'templates' as TabType, icon: BookOpenIcon, label: 'Templates', badge: templates.length }].map((tab) =>
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.id ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
              <tab.icon className="w-4 h-4" />{tab.label}{tab.badge && <Badge variant="secondary" className="ml-1">{tab.badge}</Badge>}
            </button>
          )}
        </nav>
      </div>

      <div>{activeTab === 'upload' && renderUploadTab()}{activeTab === 'configure' && renderConfigureTab()}{activeTab === 'templates' && renderTemplatesTab()}</div>

      {/* Save Template Modal */}
      <Modal isOpen={showTemplateModal} onClose={() => {setShowTemplateModal(false);setNewTemplate({ name: '', description: '', documents: [] });}} title="Create Template" size="lg">
        <div className="space-y-4">
          <Input label="Template Name" placeholder="e.g., OBC Fresh Admission" value={newTemplate.name} onChange={(e) => setNewTemplate((prev) => ({ ...prev, name: e.target.value }))} />
          <Input label="Description" placeholder="Brief description" value={newTemplate.description} onChange={(e) => setNewTemplate((prev) => ({ ...prev, description: e.target.value }))} />
          
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-700 mb-2">Current Criteria:</h4>
            <div className="flex flex-wrap gap-2">{criteria.category && <Badge variant="info">{criteria.category}</Badge>}{criteria.rte === 'Yes' && <Badge variant="warning">RTE</Badge>}{criteria.ews === 'Yes' && <Badge variant="secondary">EWS</Badge>}{criteria.minority === 'Yes' && <Badge variant="secondary">Minority</Badge>}{criteria.admissionType && <Badge variant="secondary">{criteria.admissionType}</Badge>}</div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Documents for Template</label>
            <div className="max-h-64 overflow-y-auto border rounded-lg p-3 space-y-2">
              {MASTER_DOCUMENTS.map((doc) =>
              <label key={doc.id} className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${newTemplate.documents.includes(doc.id) ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50 border border-transparent'}`}>
                  <input type="checkbox" checked={newTemplate.documents.includes(doc.id)} onChange={() => toggleTemplateDoc(doc.id)} className="rounded border-gray-300 text-blue-600" />
                  <div className="flex-1"><p className="text-sm font-medium text-gray-900">{doc.name}</p><p className="text-xs text-gray-500">{doc.description}</p></div>
                  {doc.mandatory && <Badge variant="danger" className="text-xs">Required</Badge>}
                </label>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-2">{newTemplate.documents.length} documents selected</p>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => {setShowTemplateModal(false);setNewTemplate({ name: '', description: '', documents: [] });}}>Cancel</Button>
            <Button onClick={handleSaveTemplate} disabled={!newTemplate.name || newTemplate.documents.length === 0}><SaveIcon className="w-4 h-4 mr-2" />Save Template</Button>
          </div>
        </div>
      </Modal>

      {/* Add Document Modal */}
      <Modal isOpen={showAddDocModal} onClose={() => setShowAddDocModal(false)} title="Add New Document" size="lg">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Document Name" placeholder="e.g., Migration Certificate" value={newDocument.name} onChange={(e) => setNewDocument((prev) => ({ ...prev, name: e.target.value }))} />
            <Input label="Description" placeholder="Brief description" value={newDocument.description} onChange={(e) => setNewDocument((prev) => ({ ...prev, description: e.target.value }))} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Applicable Categories</label>
            <div className="flex flex-wrap gap-2">{['General', 'OBC', 'SC', 'ST', 'EBC', 'NT', 'VJ', 'SBC'].map((cat) => <button key={cat} onClick={() => setNewDocument((prev) => ({ ...prev, categories: prev.categories?.includes(cat) ? prev.categories.filter((c) => c !== cat) : [...(prev.categories || []), cat] }))} className={`px-3 py-1 rounded-full text-sm border ${newDocument.categories?.includes(cat) ? 'bg-blue-100 border-blue-300 text-blue-700' : 'bg-gray-50 border-gray-200'}`}>{cat}</button>)}</div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Admission Types</label>
            <div className="flex flex-wrap gap-2">{['Fresh', 'Transfer', 'Lateral', 'Re-admission', 'Sports Quota', 'Management Quota'].map((type) => <button key={type} onClick={() => setNewDocument((prev) => ({ ...prev, admissionTypes: prev.admissionTypes?.includes(type) ? prev.admissionTypes.filter((t) => t !== type) : [...(prev.admissionTypes || []), type] }))} className={`px-3 py-1 rounded-full text-sm border ${newDocument.admissionTypes?.includes(type) ? 'bg-green-100 border-green-300 text-green-700' : 'bg-gray-50 border-gray-200'}`}>{type}</button>)}</div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
            {[{ key: 'mandatory', label: 'Mandatory' }, { key: 'rteRequired', label: 'RTE Required' }, { key: 'ewsRequired', label: 'EWS Required' }, { key: 'minorityRequired', label: 'Minority Required' }].map((item) =>
            <label key={item.key} className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={newDocument[item.key as keyof typeof newDocument] as boolean} onChange={(e) => setNewDocument((prev) => ({ ...prev, [item.key]: e.target.checked }))} className="rounded border-gray-300 text-blue-600" /><span className="text-sm">{item.label}</span></label>
            )}
          </div>
          <div className="flex justify-end gap-2 pt-4"><Button variant="outline" onClick={() => setShowAddDocModal(false)}>Cancel</Button><Button onClick={handleAddCustomDocument} disabled={!newDocument.name}><PlusIcon className="w-4 h-4 mr-2" />Add</Button></div>
        </div>
      </Modal>

      {/* Bulk Upload Modal */}
      <Modal isOpen={showBulkUpload} onClose={() => {setShowBulkUpload(false);setBulkFiles([]);}} title="Bulk Document Upload" size="lg">
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg"><div className="flex items-start gap-3"><InfoIcon className="w-5 h-5 text-blue-600 mt-0.5" /><div className="text-sm text-blue-800"><p className="font-medium mb-1">AI Auto-Categorization</p><p>Upload multiple files. AI will identify and categorize them.</p></div></div></div>
          <div onDrop={(e) => {e.preventDefault();setBulkFiles(Array.from(e.dataTransfer.files));}} onDragOver={(e) => e.preventDefault()} className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-blue-400 hover:bg-blue-50/50 transition-all cursor-pointer">
            <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => setBulkFiles(Array.from(e.target.files || []))} className="hidden" id="bulk-upload-input" />
            <label htmlFor="bulk-upload-input" className="cursor-pointer"><UploadCloudIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" /><h3 className="text-lg font-medium mb-2">Drag & Drop Files Here</h3><p className="text-sm text-gray-500 mb-4">or click to browse</p><p className="text-xs text-gray-400">PDF, JPG, PNG (Max 5MB)</p></label>
          </div>
          {bulkFiles.length > 0 &&
          <div className="space-y-2">
              <div className="flex items-center justify-between"><h4 className="font-medium">Selected ({bulkFiles.length})</h4><Button variant="ghost" size="sm" onClick={() => setBulkFiles([])} className="text-red-500">Clear</Button></div>
              <div className="max-h-48 overflow-y-auto space-y-2">{bulkFiles.map((file, i) => <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"><div className="flex items-center gap-3"><FileText className="w-5 h-5 text-blue-600" /><div><p className="text-sm font-medium">{file.name}</p><p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p></div></div><Button variant="ghost" size="sm" onClick={() => setBulkFiles((prev) => prev.filter((_, idx) => idx !== i))} className="text-red-500"><Trash2 className="w-4 h-4" /></Button></div>)}</div>
            </div>
          }
          {isBulkUploading && <div className="space-y-2"><div className="flex items-center justify-between text-sm"><span>Uploading...</span><span className="font-medium text-blue-600">{bulkUploadProgress}%</span></div><div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden"><div className="h-full bg-blue-600 transition-all" style={{ width: `${bulkUploadProgress}%` }} /></div></div>}
          <div className="flex justify-end gap-3 pt-4"><Button variant="outline" onClick={() => {setShowBulkUpload(false);setBulkFiles([]);}} disabled={isBulkUploading}>Cancel</Button><Button variant="primary" onClick={handleBulkUploadStart} disabled={bulkFiles.length === 0 || isBulkUploading}>{isBulkUploading ? <><RefreshCw className="w-4 h-4 mr-2 animate-spin" />Uploading...</> : <><UploadCloudIcon className="w-4 h-4 mr-2" />Upload {bulkFiles.length} File{bulkFiles.length !== 1 ? 's' : ''}</>}</Button></div>
        </div>
      </Modal>
    </div>);

}

export default AdmissionExamQpSetup;