// FILE: ReportCardProgressTemplates.jsx
// PURPOSE: Manage imported report card templates with assignment to classes and viewing capabilities

import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Select } from '../../../components/ui/Select';
import { Input } from '../../../components/ui/Input';
import { Upload, Eye, Trash2, FileText, Download, Filter, Search } from 'lucide-react';

export function ReportCardProgressTemplates() {
  const [templates, setTemplates] = useState([
  {
    id: 1,
    name: 'CBSE Standard Report Card',
    type: 'Report Card',
    assignedClass: 'Class 10-A',
    uploadedDate: '2024-01-15',
    fileUrl: '/templates/cbse-report.pdf',
    status: 'Active'
  },
  {
    id: 2,
    name: 'Quarterly Progress Card',
    type: 'Progress Card',
    assignedClass: 'Class 8-B',
    uploadedDate: '2024-01-10',
    fileUrl: '/templates/progress-q1.pdf',
    status: 'Active'
  }]
  );

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [viewTemplate, setViewTemplate] = useState(null);
  const [filterType, setFilterType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Upload new template
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    type: 'Report Card',
    assignedClass: '',
    file: null
  });

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewTemplate({ ...newTemplate, file });
    }
  };

  const handleSaveTemplate = () => {
    if (newTemplate.name && newTemplate.assignedClass && newTemplate.file) {
      const template = {
        id: templates.length + 1,
        name: newTemplate.name,
        type: newTemplate.type,
        assignedClass: newTemplate.assignedClass,
        uploadedDate: new Date().toISOString().split('T')[0],
        fileUrl: URL.createObjectURL(newTemplate.file),
        status: 'Active'
      };
      setTemplates([...templates, template]);
      setShowUploadModal(false);
      setNewTemplate({ name: '', type: 'Report Card', assignedClass: '', file: null });
    }
  };

  const handleDeleteTemplate = (id) => {
    if (confirm('Are you sure you want to delete this template?')) {
      setTemplates(templates.filter((t) => t.id !== id));
    }
  };

  // Filter and search
  const filteredTemplates = templates.filter((template) => {
    const matchesType = filterType === 'all' || template.type === filterType;
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    template.assignedClass.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Report & Progress Card Templates</h1>
          <p className="text-sm text-gray-500">Import, assign and manage templates for different classes</p>
        </div>
        <Button variant="primary" onClick={() => setShowUploadModal(true)}>
          <Upload className="w-4 h-4 mr-2" />
          Import Template
        </Button>
      </div>

      {/* Filters and Search */}
      <Card>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search by template name or class..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10" />

            </div>
          </div>
          <div className="flex gap-2">
            <Select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              options={[
              { value: 'all', label: 'All Templates' },
              { value: 'Report Card', label: 'Report Cards' },
              { value: 'Progress Card', label: 'Progress Cards' }]
              } />

          </div>
        </div>
      </Card>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) =>
        <Card key={template.id} className="hover:shadow-lg transition-shadow">
            <div className="space-y-4">
              {/* Template Icon */}
              <div className="flex items-center justify-center h-32 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
                <FileText className="w-16 h-16 text-blue-500" />
              </div>

              {/* Template Info */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">{template.name}</h3>
                <div className="space-y-1 text-sm text-gray-600">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Type:</span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                  template.type === 'Report Card' ?
                  'bg-blue-100 text-blue-700' :
                  'bg-green-100 text-green-700'}`
                  }>
                      {template.type}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Assigned:</span>
                    <span className="font-medium">{template.assignedClass}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Uploaded:</span>
                    <span>{template.uploadedDate}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Status:</span>
                    <span className="px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-700">
                      {template.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2 border-t">
                <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => setViewTemplate(template)}>

                  <Eye className="w-4 h-4 mr-1" />
                  View
                </Button>
                <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(template.fileUrl, '_blank')}>

                  <Download className="w-4 h-4" />
                </Button>
                <Button
                variant="outline"
                size="sm"
                onClick={() => handleDeleteTemplate(template.id)}>

                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Empty State */}
      {filteredTemplates.length === 0 &&
      <Card>
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Templates Found</h3>
            <p className="text-gray-500 mb-4">
              {searchQuery || filterType !== 'all' ?
            'Try adjusting your filters or search terms' :
            'Import your first template to get started'}
            </p>
            {!searchQuery && filterType === 'all' &&
          <Button variant="primary" onClick={() => setShowUploadModal(true)}>
                <Upload className="w-4 h-4 mr-2" />
                Import Template
              </Button>
          }
          </div>
        </Card>
      }

      {/* Upload Modal */}
      {showUploadModal &&
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Import New Template</h2>
              
              <div className="space-y-4">
                <Input
                label="Template Name"
                placeholder="e.g., CBSE Standard Report Card"
                value={newTemplate.name}
                onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })} />


                <Select
                label="Template Type"
                value={newTemplate.type}
                onChange={(e) => setNewTemplate({ ...newTemplate, type: e.target.value })}
                options={[
                { value: 'Report Card', label: 'Report Card' },
                { value: 'Progress Card', label: 'Progress Card' }]
                } />


                <Select
                label="Assign to Class"
                value={newTemplate.assignedClass}
                onChange={(e) => setNewTemplate({ ...newTemplate, assignedClass: e.target.value })}
                options={[
                { value: '', label: 'Select Class' },
                { value: 'Class 1-A', label: 'Class 1-A' },
                { value: 'Class 2-A', label: 'Class 2-A' },
                { value: 'Class 3-A', label: 'Class 3-A' },
                { value: 'Class 4-A', label: 'Class 4-A' },
                { value: 'Class 5-A', label: 'Class 5-A' },
                { value: 'Class 6-A', label: 'Class 6-A' },
                { value: 'Class 7-A', label: 'Class 7-A' },
                { value: 'Class 8-A', label: 'Class 8-A' },
                { value: 'Class 8-B', label: 'Class 8-B' },
                { value: 'Class 9-A', label: 'Class 9-A' },
                { value: 'Class 10-A', label: 'Class 10-A' },
                { value: 'Class 11-A', label: 'Class 11-A' },
                { value: 'Class 12-A', label: 'Class 12-A' }]
                } />


                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Template File (PDF/Image)
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition">
                    {newTemplate.file ?
                  <div>
                        <FileText className="w-12 h-12 mx-auto text-blue-500 mb-2" />
                        <p className="text-sm text-gray-700 font-medium">{newTemplate.file.name}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {(newTemplate.file.size / 1024).toFixed(2)} KB
                        </p>
                      </div> :

                  <>
                        <Upload className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                        <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                        <p className="text-xs text-gray-500 mt-1">PDF, PNG, JPG up to 10MB</p>
                      </>
                  }
                    <input
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="template-upload" />

                    <label
                    htmlFor="template-upload"
                    className="mt-3 inline-block text-sm text-blue-600 cursor-pointer hover:underline">

                      {newTemplate.file ? 'Change File' : 'Choose File'}
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setShowUploadModal(false);
                  setNewTemplate({ name: '', type: 'Report Card', assignedClass: '', file: null });
                }}>

                  Cancel
                </Button>
                <Button
                variant="primary"
                className="flex-1"
                onClick={handleSaveTemplate}
                disabled={!newTemplate.name || !newTemplate.assignedClass || !newTemplate.file}>

                  Save Template
                </Button>
              </div>
            </div>
          </div>
        </div>
      }

      {/* View Template Modal */}
      {viewTemplate &&
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-4 border-b flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-gray-900">{viewTemplate.name}</h2>
                <p className="text-sm text-gray-500">
                  {viewTemplate.type} • {viewTemplate.assignedClass}
                </p>
              </div>
              <Button variant="outline" onClick={() => setViewTemplate(null)}>
                Close
              </Button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="bg-gray-100 rounded-lg p-8 min-h-[600px] flex items-center justify-center">
                <div className="text-center">
                  <FileText className="w-24 h-24 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">Template Preview</p>
                  <Button variant="primary" onClick={() => window.open(viewTemplate.fileUrl, '_blank')}>
                    <Download className="w-4 h-4 mr-2" />
                    Download Template
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      }
    </div>);

}