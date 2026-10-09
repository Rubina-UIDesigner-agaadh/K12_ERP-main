import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  FileText,
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  CheckCircle,
  AlertCircle,
  Clock } from
'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Table } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import { Modal } from '../../../components/ui/Modal';
import { Tabs } from '../../../components/ui/Tabs';
interface DocumentType {
  id: string;
  name: string;
  shortCode: string;
  category:
  'Identity' |
  'Address' |
  'Academic' |
  'Reservation' |
  'Medical' |
  'Transport' |
  'Other';
  description: string;
  isActive: boolean;
  isMandatoryAtAdmission: boolean;
  mandatoryForCategories: string[]; // e.g., ['SC', 'ST']
  mandatoryForClasses: string[]; // e.g., ['Class 10', 'Class 12']
  allowedFileTypes: string[];
  maxFileSizeMB: number;
  expiryDateRequired: boolean;
  reminderDays: number;
}
const MOCK_DOCUMENTS: DocumentType[] = [
{
  id: 'DOC001',
  name: 'Birth Certificate',
  shortCode: 'DOB_CERT',
  category: 'Identity',
  description: 'Government issued birth certificate',
  isActive: true,
  isMandatoryAtAdmission: true,
  mandatoryForCategories: [],
  mandatoryForClasses: [],
  allowedFileTypes: ['PDF', 'JPG', 'PNG'],
  maxFileSizeMB: 5,
  expiryDateRequired: false,
  reminderDays: 0
},
{
  id: 'DOC002',
  name: 'Transfer Certificate',
  shortCode: 'TC',
  category: 'Academic',
  description: 'TC from previous school',
  isActive: true,
  isMandatoryAtAdmission: true,
  mandatoryForCategories: [],
  mandatoryForClasses: [
  'Class 2',
  'Class 3',
  'Class 4',
  'Class 5',
  'Class 6',
  'Class 7',
  'Class 8',
  'Class 9',
  'Class 10'],

  allowedFileTypes: ['PDF'],
  maxFileSizeMB: 2,
  expiryDateRequired: false,
  reminderDays: 0
},
{
  id: 'DOC003',
  name: 'Caste Certificate',
  shortCode: 'CASTE_CERT',
  category: 'Reservation',
  description: 'Required for SC/ST/OBC category students',
  isActive: true,
  isMandatoryAtAdmission: false,
  mandatoryForCategories: ['SC', 'ST', 'OBC'],
  mandatoryForClasses: [],
  allowedFileTypes: ['PDF', 'JPG'],
  maxFileSizeMB: 2,
  expiryDateRequired: false,
  reminderDays: 0
},
{
  id: 'DOC004',
  name: 'Passport',
  shortCode: 'PASSPORT',
  category: 'Identity',
  description: 'Required for international students',
  isActive: true,
  isMandatoryAtAdmission: false,
  mandatoryForCategories: ['International'],
  mandatoryForClasses: [],
  allowedFileTypes: ['PDF', 'JPG'],
  maxFileSizeMB: 5,
  expiryDateRequired: true,
  reminderDays: 30
}];

export function StudentDocType() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [documents, setDocuments] = useState<DocumentType[]>(MOCK_DOCUMENTS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState<DocumentType | null>(null);
  // Filtered documents
  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
    doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.shortCode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
    categoryFilter === 'All' || doc.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });
  // Table columns
  const columns = [
  {
    key: 'name',
    header: 'Document Name',
    render: (row: DocumentType) =>
    <div>
          <div className="font-medium text-gray-900">{row.name}</div>
          <div className="text-xs text-gray-500">{row.shortCode}</div>
        </div>

  },
  {
    key: 'category',
    header: 'Category',
    render: (row: DocumentType) =>
    <Badge variant="secondary">{row.category}</Badge>

  },
  {
    key: 'requirements',
    header: 'Requirements',
    render: (row: DocumentType) =>
    <div className="space-y-1">
          {row.isMandatoryAtAdmission &&
      <div className="flex items-center text-xs text-red-600">
              <AlertCircle className="w-3 h-3 mr-1" /> Mandatory
            </div>
      }
          {row.expiryDateRequired &&
      <div className="flex items-center text-xs text-orange-600">
              <Clock className="w-3 h-3 mr-1" /> Expiry Tracking
            </div>
      }
          {row.mandatoryForCategories.length > 0 &&
      <div className="text-xs text-gray-500">
              For: {row.mandatoryForCategories.join(', ')}
            </div>
      }
        </div>

  },
  {
    key: 'files',
    header: 'File Rules',
    render: (row: DocumentType) =>
    <div className="text-xs text-gray-500">
          <div>{row.allowedFileTypes.join(', ')}</div>
          <div>Max {row.maxFileSizeMB} MB</div>
        </div>

  },
  {
    key: 'status',
    header: 'Status',
    render: (row: DocumentType) =>
    <Badge variant={row.isActive ? 'success' : 'default'}>
          {row.isActive ? 'Active' : 'Inactive'}
        </Badge>

  },
  {
    key: 'actions',
    header: 'Actions',
    render: (row: DocumentType) =>
    <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={() => handleEdit(row)}>
            <Edit className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" className="text-red-600">
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>

  }];

  const handleEdit = (doc: DocumentType) => {
    setEditingDoc(doc);
    setIsModalOpen(true);
  };
  const handleAddNew = () => {
    setEditingDoc(null);
    setIsModalOpen(true);
  };
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Student Document Type Master
            </h1>
            <p className="text-gray-500">
              Manage required document types and validation rules
            </p>
          </div>
        </div>
        <Button onClick={handleAddNew}>
          <Plus className="w-4 h-4 mr-2" />
          Add Document Type
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search documents..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)} />

          </div>
          <div className="w-full md:w-64">
            <Select
              options={[
              {
                value: 'All',
                label: 'All Categories'
              },
              {
                value: 'Identity',
                label: 'Identity'
              },
              {
                value: 'Academic',
                label: 'Academic'
              },
              {
                value: 'Address',
                label: 'Address'
              },
              {
                value: 'Reservation',
                label: 'Reservation'
              },
              {
                value: 'Medical',
                label: 'Medical'
              },
              {
                value: 'Transport',
                label: 'Transport'
              }]
              }
              value={categoryFilter}
              onChange={setCategoryFilter} />

          </div>
        </div>
      </Card>

      {/* Table */}
      <Card className="overflow-hidden">
        <Table
          columns={columns}
          data={filteredDocuments}
          emptyMessage="No document types found matching your criteria." />

      </Card>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingDoc ? 'Edit Document Type' : 'Add New Document Type'}
        size="lg"
        footer={
        <>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button>Save Document Type</Button>
          </>
        }>

        <div className="space-y-6">
          <Tabs
            tabs={[
            {
              id: 'basic',
              label: 'Basic Details',
              content:
              <div className="space-y-4 pt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                    label="Document Name"
                    placeholder="e.g. Birth Certificate"
                    defaultValue={editingDoc?.name} />

                      <Input
                    label="Short Code"
                    placeholder="e.g. DOB_CERT"
                    defaultValue={editingDoc?.shortCode} />

                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <Select
                    label="Category"
                    options={[
                    {
                      value: 'Identity',
                      label: 'Identity'
                    },
                    {
                      value: 'Address',
                      label: 'Address'
                    },
                    {
                      value: 'Academic',
                      label: 'Academic'
                    },
                    {
                      value: 'Reservation',
                      label: 'Reservation'
                    },
                    {
                      value: 'Medical',
                      label: 'Medical'
                    },
                    {
                      value: 'Transport',
                      label: 'Transport'
                    },
                    {
                      value: 'Other',
                      label: 'Other'
                    }]
                    }
                    defaultValue={editingDoc?.category} />

                      <div className="flex items-center h-full pt-6">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                        type="checkbox"
                        className="w-4 h-4 rounded border-gray-300 text-blue-600"
                        defaultChecked={editingDoc?.isActive ?? true} />

                          <span className="text-sm font-medium text-gray-700">
                            Active
                          </span>
                        </label>
                      </div>
                    </div>

                    <Input
                  label="Description"
                  placeholder="Brief description of the document"
                  defaultValue={editingDoc?.description} />

                  </div>

            },
            {
              id: 'rules',
              label: 'Requirement Rules',
              content:
              <div className="space-y-4 pt-4">
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-3">
                      <h4 className="font-medium text-gray-900">
                        Mandatory Settings
                      </h4>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-gray-300 text-blue-600"
                      defaultChecked={editingDoc?.isMandatoryAtAdmission} />

                        <span className="text-sm text-gray-700">
                          Mandatory at Admission time
                        </span>
                      </label>

                      <div className="pt-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Mandatory for specific Student Categories
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {['General', 'SC', 'ST', 'OBC', 'EWS'].map((cat) =>
                      <label
                        key={cat}
                        className="flex items-center gap-1.5 bg-white px-2 py-1 rounded border border-gray-200 text-sm">

                              <input
                          type="checkbox"
                          className="w-3 h-3 rounded border-gray-300 text-blue-600"
                          defaultChecked={editingDoc?.mandatoryForCategories.includes(
                            cat
                          )} />

                              {cat}
                            </label>
                      )}
                        </div>
                      </div>

                      <div className="pt-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Mandatory for specific Classes
                        </label>
                        <div className="h-32 overflow-y-auto border border-gray-200 rounded p-2 bg-white">
                          {Array.from(
                        {
                          length: 12
                        },
                        (_, i) => `Class ${i + 1}`
                      ).map((cls) =>
                      <label
                        key={cls}
                        className="flex items-center gap-2 py-1">

                              <input
                          type="checkbox"
                          className="w-3 h-3 rounded border-gray-300 text-blue-600"
                          defaultChecked={editingDoc?.mandatoryForClasses.includes(
                            cls
                          )} />

                              <span className="text-sm">{cls}</span>
                            </label>
                      )}
                        </div>
                      </div>
                    </div>
                  </div>

            },
            {
              id: 'files',
              label: 'File Handling',
              content:
              <div className="space-y-4 pt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Allowed File Types
                      </label>
                      <div className="flex gap-4">
                        {['PDF', 'JPG', 'PNG', 'DOCX'].map((type) =>
                    <label key={type} className="flex items-center gap-2">
                            <input
                        type="checkbox"
                        className="w-4 h-4 rounded border-gray-300 text-blue-600"
                        defaultChecked={editingDoc?.allowedFileTypes.includes(
                          type
                        )} />

                            <span className="text-sm text-gray-700">
                              {type}
                            </span>
                          </label>
                    )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <Select
                    label="Maximum File Size"
                    options={[
                    {
                      value: '1',
                      label: '1 MB'
                    },
                    {
                      value: '2',
                      label: '2 MB'
                    },
                    {
                      value: '5',
                      label: '5 MB'
                    },
                    {
                      value: '10',
                      label: '10 MB'
                    }]
                    }
                    defaultValue={editingDoc?.maxFileSizeMB.toString()} />

                      <div className="flex items-center h-full pt-6">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                        type="checkbox"
                        className="w-4 h-4 rounded border-gray-300 text-blue-600" />

                          <span className="text-sm font-medium text-gray-700">
                            Allow Multiple Files
                          </span>
                        </label>
                      </div>
                    </div>

                    <div className="bg-orange-50 p-4 rounded-lg border border-orange-200 space-y-3">
                      <h4 className="font-medium text-orange-900 flex items-center gap-2">
                        <Clock className="w-4 h-4" /> Expiry & Renewal
                      </h4>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-gray-300 text-blue-600"
                      defaultChecked={editingDoc?.expiryDateRequired} />

                        <span className="text-sm text-gray-700">
                          Expiry Date is Required
                        </span>
                      </label>

                      <div className="grid grid-cols-2 gap-4">
                        <Input
                      type="number"
                      label="Reminder Days Before Expiry"
                      defaultValue={editingDoc?.reminderDays}
                      min={0} />

                      </div>
                    </div>
                  </div>

            }]
            } />

        </div>
      </Modal>
    </div>);

}