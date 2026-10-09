import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Table } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import {
  Book,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  AlertCircle,
  Save,
  RotateCcw,
  Star } from
'lucide-react';
// --- Types ---
interface ReceiptBook {
  id: string;
  bookName: string;
  prefix: string;
  startNo: number;
  endNo: number | null;
  currentNo: number;
  isActive: boolean;
  isDefault: boolean;
}
// --- Mock Data ---
const INITIAL_BOOKS: ReceiptBook[] = [
{
  id: '1',
  bookName: 'General Receipts 2024',
  prefix: 'REC/24/',
  startNo: 1001,
  endNo: 5000,
  currentNo: 1245,
  isActive: true,
  isDefault: true
},
{
  id: '2',
  bookName: 'Hostel Fines',
  prefix: 'HST/FN/',
  startNo: 1,
  endNo: null,
  currentNo: 56,
  isActive: true,
  isDefault: false
},
{
  id: '3',
  bookName: 'Old Receipts 2023',
  prefix: 'REC/23/',
  startNo: 1,
  endNo: 2000,
  currentNo: 1988,
  isActive: false,
  isDefault: false
}];

export function ChargeReceiptBookMaster() {
  const [books, setBooks] = useState<ReceiptBook[]>(INITIAL_BOOKS);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  // Form State
  const [formData, setFormData] = useState<Omit<ReceiptBook, 'id'>>({
    bookName: '',
    prefix: '',
    startNo: 1,
    endNo: null,
    currentNo: 1,
    isActive: true,
    isDefault: false
  });
  // --- Handlers ---
  const handleAddNew = () => {
    setFormData({
      bookName: '',
      prefix: '',
      startNo: 1,
      endNo: null,
      currentNo: 1,
      isActive: true,
      isDefault: false
    });
    setEditingId(null);
    setIsFormOpen(true);
  };
  const handleEdit = (book: ReceiptBook) => {
    setFormData({
      bookName: book.bookName,
      prefix: book.prefix,
      startNo: book.startNo,
      endNo: book.endNo,
      currentNo: book.currentNo,
      isActive: book.isActive,
      isDefault: book.isDefault
    });
    setEditingId(book.id);
    setIsFormOpen(true);
  };
  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this receipt book?')) {
      setBooks(books.filter((b) => b.id !== id));
    }
  };
  const handleSave = () => {
    // Validation
    if (!formData.bookName || !formData.prefix) {
      alert('Book Name and Prefix are required.');
      return;
    }
    let updatedBooks = [...books];
    // Logic: If setting as default, unset others
    if (formData.isDefault) {
      updatedBooks = updatedBooks.map((b) => ({
        ...b,
        isDefault: false
      }));
    }
    if (editingId) {
      // Update existing
      updatedBooks = updatedBooks.map((b) =>
      b.id === editingId ?
      {
        ...formData,
        id: editingId
      } :
      b
      );
    } else {
      // Create new
      const newBook: ReceiptBook = {
        ...formData,
        id: Math.random().toString(36).substr(2, 9)
      };
      updatedBooks.push(newBook);
    }
    setBooks(updatedBooks);
    setIsFormOpen(false);
    setEditingId(null);
  };
  const handleCancel = () => {
    setIsFormOpen(false);
    setEditingId(null);
  };
  // --- Columns Configuration ---
  const columns = [
  {
    key: 'name',
    header: 'Book Name',
    render: (row: ReceiptBook) =>
    <div>
          <div className="font-medium text-gray-900 flex items-center gap-2">
            {row.bookName}
            {row.isDefault &&
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                <Star className="w-3 h-3 mr-1 fill-yellow-500" /> Default
              </span>
        }
          </div>
          <div className="text-xs text-gray-500">{row.prefix}</div>
        </div>

  },
  {
    key: 'range',
    header: 'Numbering Range',
    render: (row: ReceiptBook) =>
    <div className="text-sm text-gray-600">
          {row.startNo} - {row.endNo ? row.endNo : '∞'}
        </div>

  },
  {
    key: 'current',
    header: 'Current No',
    render: (row: ReceiptBook) =>
    <div className="flex items-center gap-2">
          <span className="font-mono bg-gray-100 px-2 py-1 rounded text-gray-800 font-bold">
            {row.currentNo}
          </span>
          <span className="text-xs text-gray-400">Next</span>
        </div>

  },
  {
    key: 'status',
    header: 'Status',
    render: (row: ReceiptBook) =>
    <Badge variant={row.isActive ? 'success' : 'secondary'}>
          {row.isActive ? 'Active' : 'Inactive'}
        </Badge>

  },
  {
    key: 'actions',
    header: 'Actions',
    render: (row: ReceiptBook) =>
    <div className="flex gap-1">
          <Button variant="ghost" size="sm" onClick={() => handleEdit(row)}>
            <Edit className="w-4 h-4 text-blue-600" />
          </Button>
          {!row.isDefault &&
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleDelete(row.id)}>

              <Trash2 className="w-4 h-4 text-red-600" />
            </Button>
      }
        </div>

  }];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Receipt Book Master
          </h1>
          <p className="text-sm text-gray-500">
            Configure receipt numbering series and prefixes
          </p>
        </div>
        {!isFormOpen &&
        <Button variant="primary" onClick={handleAddNew}>
            <Plus className="w-4 h-4 mr-2" />
            Add New Book
          </Button>
        }
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main List Column */}
        <div className={isFormOpen ? 'lg:col-span-2' : 'lg:col-span-3'}>
          <Card className="p-0">
            <Table columns={columns} data={books} />
          </Card>
        </div>

        {/* Add/Edit Form Column */}
        {isFormOpen &&
        <div className="lg:col-span-1 animate-in slide-in-from-right-4 duration-300">
            <Card title={editingId ? 'Edit Receipt Book' : 'New Receipt Book'}>
              <div className="space-y-4">
                <Input
                label="Book Name"
                placeholder="e.g. General Receipts 2024"
                value={formData.bookName}
                onChange={(e) =>
                setFormData({
                  ...formData,
                  bookName: e.target.value
                })
                } />

                <Input
                label="Prefix"
                placeholder="e.g. REC/24/"
                value={formData.prefix}
                onChange={(e) =>
                setFormData({
                  ...formData,
                  prefix: e.target.value
                })
                } />


                <div className="grid grid-cols-2 gap-4">
                  <Input
                  type="number"
                  label="Start Number"
                  value={formData.startNo}
                  onChange={(e) =>
                  setFormData({
                    ...formData,
                    startNo: Number(e.target.value)
                  })
                  } />

                  <Input
                  type="number"
                  label="End Number (Opt)"
                  placeholder="∞"
                  value={formData.endNo || ''}
                  onChange={(e) =>
                  setFormData({
                    ...formData,
                    endNo: e.target.value ? Number(e.target.value) : null
                  })
                  } />

                </div>

                <div className="p-3 bg-gray-50 rounded border border-gray-200">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Current Running Number
                  </label>
                  <div className="flex gap-2">
                    <input
                    type="number"
                    className="flex-1 rounded border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    value={formData.currentNo}
                    onChange={(e) =>
                    setFormData({
                      ...formData,
                      currentNo: Number(e.target.value)
                    })
                    } />

                    <Button variant="outline" size="sm" title="Reset to Start">
                      <RotateCcw className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Caution: Changing this affects the next generated receipt.
                  </p>
                </div>

                <div className="flex flex-col gap-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                    type="checkbox"
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    checked={formData.isActive}
                    onChange={(e) =>
                    setFormData({
                      ...formData,
                      isActive: e.target.checked
                    })
                    } />

                    <span className="text-sm font-medium text-gray-700">
                      Is Active?
                    </span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer p-2 bg-yellow-50 rounded border border-yellow-100">
                    <input
                    type="checkbox"
                    className="rounded border-gray-300 text-yellow-600 focus:ring-yellow-500"
                    checked={formData.isDefault}
                    onChange={(e) =>
                    setFormData({
                      ...formData,
                      isDefault: e.target.checked
                    })
                    } />

                    <div>
                      <span className="text-sm font-bold text-gray-800 block">
                        Set as Default Book
                      </span>
                      <span className="text-xs text-gray-500">
                        Only one book can be default at a time.
                      </span>
                    </div>
                  </label>
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
                  <Button variant="ghost" onClick={handleCancel}>
                    Cancel
                  </Button>
                  <Button variant="primary" onClick={handleSave}>
                    <Save className="w-4 h-4 mr-2" />
                    {editingId ? 'Update' : 'Save Book'}
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        }
      </div>
    </div>);

}