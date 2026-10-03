import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import {
  Plus,
  Edit,
  Trash2,
  Save,
  Search,
  FileText,
  Calendar } from
'lucide-react';
interface DocumentType {
  id: string;
  code: string;
  name: string;
  category: string;
  mandatoryAtJoining: boolean;
  mandatoryForStaffTypes: string[];
  hasExpiry: boolean;
  reminderDaysBefore: number;
  allowMultiple: boolean;
  status: 'Active' | 'Inactive';
}
const mockDocuments: DocumentType[] = [
{
  id: 'DT001',
  code: 'PAN',
  name: 'PAN Card',
  category: 'ID Proof',
  mandatoryAtJoining: true,
  mandatoryForStaffTypes: ['Teaching', 'Administrative', 'Support'],
  hasExpiry: false,
  reminderDaysBefore: 0,
  allowMultiple: false,
  status: 'Active'
},
{
  id: 'DT002',
  code: 'AADHAAR',
  name: 'Aadhaar Card',
  category: 'ID Proof',
  mandatoryAtJoining: true,
  mandatoryForStaffTypes: ['Teaching', 'Administrative', 'Support'],
  hasExpiry: false,
  reminderDaysBefore: 0,
  allowMultiple: false,
  status: 'Active'
},
{
  id: 'DT003',
  code: 'DEGREE',
  name: 'Degree Certificate',
  category: 'Qualification',
  mandatoryAtJoining: true,
  mandatoryForStaffTypes: ['Teaching'],
  hasExpiry: false,
  reminderDaysBefore: 0,
  allowMultiple: true,
  status: 'Active'
},
{
  id: 'DT004',
  code: 'EXP',
  name: 'Experience Letter',
  category: 'Experience',
  mandatoryAtJoining: false,
  mandatoryForStaffTypes: [],
  hasExpiry: false,
  reminderDaysBefore: 0,
  allowMultiple: true,
  status: 'Active'
},
{
  id: 'DT005',
  code: 'CONTRACT',
  name: 'Employment Contract',
  category: 'Contract',
  mandatoryAtJoining: true,
  mandatoryForStaffTypes: ['Teaching', 'Administrative'],
  hasExpiry: true,
  reminderDaysBefore: 30,
  allowMultiple: false,
  status: 'Active'
},
{
  id: 'DT006',
  code: 'PASSPORT',
  name: 'Passport',
  category: 'ID Proof',
  mandatoryAtJoining: false,
  mandatoryForStaffTypes: [],
  hasExpiry: true,
  reminderDaysBefore: 60,
  allowMultiple: false,
  status: 'Active'
},
{
  id: 'DT007',
  code: 'VISA',
  name: 'Work Visa',
  category: 'Other',
  mandatoryAtJoining: false,
  mandatoryForStaffTypes: [],
  hasExpiry: true,
  reminderDaysBefore: 90,
  allowMultiple: false,
  status: 'Active'
}];

export function EmployeeDocumentTypeMaster() {
  const [documents, setDocuments] = useState(mockDocuments);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [form, setForm] = useState({
    code: '',
    name: '',
    category: 'ID Proof',
    mandatoryAtJoining: false,
    mandatoryForStaffTypes: [] as string[],
    hasExpiry: false,
    reminderDaysBefore: 0,
    allowMultiple: false
  });
  const filtered = documents.filter((d) => {
    const matchSearch =
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.code.toLowerCase().includes(search.toLowerCase());
    const matchCategory = !categoryFilter || d.category === categoryFilter;
    return matchSearch && matchCategory;
  });
  const resetForm = () => {
    setForm({
      code: '',
      name: '',
      category: 'ID Proof',
      mandatoryAtJoining: false,
      mandatoryForStaffTypes: [],
      hasExpiry: false,
      reminderDaysBefore: 0,
      allowMultiple: false
    });
    setShowForm(false);
    setEditId(null);
  };
  const handleSave = () => {
    if (editId) {
      setDocuments((prev) =>
      prev.map((d) =>
      d.id === editId ?
      {
        ...d,
        ...form
      } :
      d
      )
      );
    } else {
      setDocuments((prev) => [
      ...prev,
      {
        ...form,
        id: `DT${Date.now()}`,
        status: 'Active' as const
      }]
      );
    }
    resetForm();
  };
  const handleEdit = (doc: DocumentType) => {
    setForm({
      code: doc.code,
      name: doc.name,
      category: doc.category,
      mandatoryAtJoining: doc.mandatoryAtJoining,
      mandatoryForStaffTypes: doc.mandatoryForStaffTypes,
      hasExpiry: doc.hasExpiry,
      reminderDaysBefore: doc.reminderDaysBefore,
      allowMultiple: doc.allowMultiple
    });
    setEditId(doc.id);
    setShowForm(true);
  };
  const mandatoryCount = documents.filter((d) => d.mandatoryAtJoining).length;
  const expiryCount = documents.filter((d) => d.hasExpiry).length;
  const categories = new Set(documents.map((d) => d.category)).size;
  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Employee Document Type Master
          </h1>
          <p className="text-sm text-gray-500">
            Configure document types required during recruitment and employment
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}>

          <Plus className="w-4 h-4 mr-2" />
          Add Document Type
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
            <FileText className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-xl font-bold">{documents.length}</p>
            <p className="text-xs text-gray-500">Total Document Types</p>
          </div>
        </div>
        <div className="bg-white rounded-lg border p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
            <FileText className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="text-xl font-bold">{mandatoryCount}</p>
            <p className="text-xs text-gray-500">Mandatory at Joining</p>
          </div>
        </div>
        <div className="bg-white rounded-lg border p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
            <Calendar className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <p className="text-xl font-bold">{expiryCount}</p>
            <p className="text-xs text-gray-500">Expiry-Based</p>
          </div>
        </div>
        <div className="bg-white rounded-lg border p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
            <FileText className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <p className="text-xl font-bold">{categories}</p>
            <p className="text-xs text-gray-500">Categories</p>
          </div>
        </div>
      </div>

      {showForm &&
      <Card title={editId ? 'Edit Document Type' : 'Add New Document Type'}>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <Input
            label="Document Code *"
            value={form.code}
            onChange={(e) =>
            setForm({
              ...form,
              code: e.target.value
            })
            }
            placeholder="e.g., PAN" />

            <Input
            label="Document Name *"
            value={form.name}
            onChange={(e) =>
            setForm({
              ...form,
              name: e.target.value
            })
            }
            placeholder="e.g., PAN Card" />

            <Select
            label="Category *"
            options={[
            {
              value: 'ID Proof',
              label: 'ID Proof'
            },
            {
              value: 'Address Proof',
              label: 'Address Proof'
            },
            {
              value: 'Qualification',
              label: 'Qualification'
            },
            {
              value: 'Experience',
              label: 'Experience'
            },
            {
              value: 'Contract',
              label: 'Contract'
            },
            {
              value: 'Other',
              label: 'Other'
            }]
            }
            value={form.category}
            onChange={(e) =>
            setForm({
              ...form,
              category: e.target.value
            })
            } />

            <div />
            <div className="col-span-2 space-y-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                type="checkbox"
                checked={form.mandatoryAtJoining}
                onChange={(e) =>
                setForm({
                  ...form,
                  mandatoryAtJoining: e.target.checked
                })
                }
                className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500" />

                <span className="text-sm text-gray-700">
                  Mandatory at Joining
                </span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                type="checkbox"
                checked={form.hasExpiry}
                onChange={(e) =>
                setForm({
                  ...form,
                  hasExpiry: e.target.checked
                })
                }
                className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500" />

                <span className="text-sm text-gray-700">Has Expiry Date</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                type="checkbox"
                checked={form.allowMultiple}
                onChange={(e) =>
                setForm({
                  ...form,
                  allowMultiple: e.target.checked
                })
                }
                className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500" />

                <span className="text-sm text-gray-700">
                  Allow Multiple Attachments
                </span>
              </label>
            </div>
            {form.hasExpiry &&
          <Input
            label="Reminder Days Before Expiry"
            type="number"
            value={form.reminderDaysBefore}
            onChange={(e) =>
            setForm({
              ...form,
              reminderDaysBefore: parseInt(e.target.value) || 0
            })
            } />

          }
          </div>
          <div className="flex gap-2">
            <Button variant="primary" onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              {editId ? 'Update' : 'Create'} Document Type
            </Button>
            <Button variant="outline" onClick={resetForm}>
              Cancel
            </Button>
          </div>
        </Card>
      }

      <Card>
        <div className="flex items-center gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search document types..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />

          </div>
          <Select
            options={[
            {
              value: '',
              label: 'All Categories'
            },
            {
              value: 'ID Proof',
              label: 'ID Proof'
            },
            {
              value: 'Address Proof',
              label: 'Address Proof'
            },
            {
              value: 'Qualification',
              label: 'Qualification'
            },
            {
              value: 'Experience',
              label: 'Experience'
            },
            {
              value: 'Contract',
              label: 'Contract'
            },
            {
              value: 'Other',
              label: 'Other'
            }]
            }
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)} />

        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200 bg-gray-50">
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                  Document
                </th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                  Category
                </th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                  Mandatory
                </th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                  Expiry
                </th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                  Reminder
                </th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                  Multiple
                </th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                  Status
                </th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((doc, i) =>
              <tr
                key={doc.id}
                className={`border-b border-gray-100 hover:bg-gray-50 ${i % 2 ? 'bg-gray-50/30' : ''}`}>

                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-blue-500" />
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {doc.name}
                        </p>
                        <p className="text-xs text-gray-500">{doc.code}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <Badge variant="secondary">{doc.category}</Badge>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <Badge
                    variant={doc.mandatoryAtJoining ? 'warning' : 'secondary'}>

                      {doc.mandatoryAtJoining ? 'Yes' : 'No'}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <Badge variant={doc.hasExpiry ? 'info' : 'secondary'}>
                      {doc.hasExpiry ? 'Yes' : 'No'}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-center text-sm text-gray-600">
                    {doc.hasExpiry ? `${doc.reminderDaysBefore}d` : '-'}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <Badge
                    variant={doc.allowMultiple ? 'success' : 'secondary'}>

                      {doc.allowMultiple ? 'Yes' : 'No'}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <Badge
                    variant={
                    doc.status === 'Active' ? 'success' : 'secondary'
                    }>

                      {doc.status}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button
                      onClick={() => handleEdit(doc)}
                      className="p-1.5 hover:bg-blue-100 rounded-lg"
                      title="Edit">

                        <Edit className="w-4 h-4 text-blue-600" />
                      </button>
                      <button
                      className="p-1.5 hover:bg-red-100 rounded-lg"
                      title="Delete">

                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>);

}