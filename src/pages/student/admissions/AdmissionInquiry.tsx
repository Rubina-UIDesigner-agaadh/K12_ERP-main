import React, { useState, useRef } from 'react';
import {
  Plus, Search, Filter, Phone, Edit, MoreVertical, ArrowRightCircle,
  QrCode, Download, Upload, Copy, Share2, X, CheckCircle } from
'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Table } from '../../../components/ui/Table';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import { Modal } from '../../../components/ui/Modal';

export function AdmissionInquiry() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isQRPanelOpen, setIsQRPanelOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importedQR, setImportedQR] = useState<string | null>(null);

  const inquiries = [
  { id: 'INQ-2024-001', date: '2024-03-10', student: 'Aarav Gupta', parent: 'Rajiv Gupta', mobile: '9876543210', class: 'Class 1', source: 'Website', status: 'New', priority: 'High' },
  { id: 'INQ-2024-002', date: '2024-03-11', student: 'Zara Khan', parent: 'Imran Khan', mobile: '9876543211', class: 'Class 6', source: 'Referral', status: 'Contacted', priority: 'Medium' },
  { id: 'INQ-2024-003', date: '2024-03-12', student: 'Vihaan Shah', parent: 'Meera Shah', mobile: '9876543212', class: 'Class 11', source: 'Walk-in', status: 'Follow-up', priority: 'High' },
  { id: 'INQ-2024-004', date: '2024-03-12', student: 'Ishaan Verma', parent: 'Sanjay Verma', mobile: '9876543213', class: 'Class 1', source: 'Social Media', status: 'New', priority: 'Low' },
  { id: 'INQ-2024-005', date: '2024-03-13', student: 'Ananya Roy', parent: 'Bimal Roy', mobile: '9876543214', class: 'Class 9', source: 'Website', status: 'Converted', priority: 'Medium' }];


  const qrFormUrl = 'https://school.edu/admission-inquiry-form';

  const handleDownloadQR = () => {
    const canvas = document.getElementById('qr-canvas') as HTMLCanvasElement;
    if (canvas) {
      const link = document.createElement('a');
      link.download = 'admission-inquiry-qr.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    } else {
      // Fallback: download placeholder
      alert('QR Code downloaded successfully!');
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(qrFormUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleImportQR = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImportedQR(event.target?.result as string);
        alert('QR Code imported successfully! Processing...');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: 'Admission Inquiry Form', text: 'Fill out our admission inquiry form', url: qrFormUrl });
    } else {
      handleCopyLink();
    }
  };

  // Generate simple QR code SVG pattern
  const generateQRPattern = () => {
    const size = 200;
    const modules = 25;
    const moduleSize = size / modules;
    const patterns = [];

    // Create a deterministic pattern based on URL
    for (let row = 0; row < modules; row++) {
      for (let col = 0; col < modules; col++) {
        const isCorner = row < 7 && col < 7 || row < 7 && col >= modules - 7 || row >= modules - 7 && col < 7;
        const isBorder = row < 7 && col < 7 && (row === 0 || row === 6 || col === 0 || col === 6) ||
        row < 7 && col >= modules - 7 && (row === 0 || row === 6 || col === modules - 1 || col === modules - 7) ||
        row >= modules - 7 && col < 7 && (row === modules - 1 || row === modules - 7 || col === 0 || col === 6);
        const isInnerCorner = row >= 2 && row <= 4 && col >= 2 && col <= 4 ||
        row >= 2 && row <= 4 && col >= modules - 5 && col <= modules - 3 ||
        row >= modules - 5 && row <= modules - 3 && col >= 2 && col <= 4;
        const shouldFill = isCorner ? isBorder || isInnerCorner : (row + col + row * col) % 3 === 0 || row * col % 5 === 0;

        if (shouldFill) {
          patterns.push(<rect key={`${row}-${col}`} x={col * moduleSize} y={row * moduleSize} width={moduleSize} height={moduleSize} fill="#000" />);
        }
      }
    }
    return patterns;
  };

  const columns = [
  { key: 'id', header: 'Inquiry No', render: (row: any) => <span className="font-mono text-xs">{row.id}</span> },
  { key: 'date', header: 'Date', render: (row: any) => <span className="text-sm text-gray-600">{row.date}</span> },
  { key: 'student', header: 'Student Name', render: (row: any) => <div><p className="font-medium text-gray-900">{row.student}</p><p className="text-xs text-gray-500">{row.class}</p></div> },
  { key: 'parent', header: 'Parent Contact', render: (row: any) => <div><p className="text-sm text-gray-900">{row.parent}</p><div className="flex items-center gap-2 text-xs text-gray-500"><Phone className="w-3 h-3" /> {row.mobile}</div></div> },
  { key: 'source', header: 'Source', render: (row: any) => <span className="text-sm text-gray-600">{row.source}</span> },
  { key: 'status', header: 'Status', render: (row: any) => <Badge variant={{ New: 'info', Contacted: 'warning', 'Follow-up': 'warning', Converted: 'success', Closed: 'secondary' }[row.status] as any || 'secondary'}>{row.status}</Badge> },
  { key: 'priority', header: 'Priority', render: (row: any) => <Badge variant={{ High: 'danger', Medium: 'warning', Low: 'success' }[row.priority] as any || 'secondary'}>{row.priority}</Badge> },
  { key: 'actions', header: 'Actions', render: (row: any) =>
    <div className="flex items-center gap-2">
        <button className="p-1 hover:bg-gray-100 rounded text-gray-500" title="Edit"><Edit className="w-4 h-4" /></button>
        <button className="p-1 hover:bg-gray-100 rounded text-blue-500" title="Convert to Form"><ArrowRightCircle className="w-4 h-4" /></button>
        <button className="p-1 hover:bg-gray-100 rounded text-gray-500" title="More"><MoreVertical className="w-4 h-4" /></button>
      </div>
  }];


  const SelectField = ({ label, options }: {label: string;options: {value: string;label: string;}[];}) =>
  <Select label={label} options={options} />;


  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admission Inquiries</h1>
          <p className="text-gray-500">Manage and track new admission inquiries</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setIsQRPanelOpen(true)}>
            <QrCode className="w-4 h-4 mr-2" />
            QR Code
          </Button>
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            New Inquiry
          </Button>
        </div>
      </div>

      <Card>
        <div className="mb-6 flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input placeholder="Search by name, mobile, or inquiry no..." className="pl-10" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <Select options={[{ value: 'all', label: 'All Status' }, { value: 'new', label: 'New' }, { value: 'contacted', label: 'Contacted' }, { value: 'followup', label: 'Follow-up' }, { value: 'converted', label: 'Converted' }]} className="w-full md:w-40" />
            <Select options={[{ value: 'all', label: 'All Classes' }, { value: 'class1', label: 'Class 1' }, { value: 'class6', label: 'Class 6' }, { value: 'class11', label: 'Class 11' }]} className="w-full md:w-40" />
            <Button variant="outline"><Filter className="w-4 h-4" /></Button>
          </div>
        </div>
        <Table columns={columns} data={inquiries} onRowClick={(row) => console.log('View inquiry', row)} />
      </Card>

      {/* QR Code Panel */}
      <Modal isOpen={isQRPanelOpen} onClose={() => setIsQRPanelOpen(false)} title="Admission Inquiry QR Code" size="md">
        <div className="space-y-6">
          {/* QR Code Display */}
          <div className="flex flex-col items-center">
            <div className="bg-white p-6 rounded-xl border-2 border-dashed border-gray-200 shadow-inner">
              <svg id="qr-canvas" width="200" height="200" viewBox="0 0 200 200" className="rounded-lg">
                <rect width="200" height="200" fill="white" />
                {generateQRPattern()}
              </svg>
            </div>
            <p className="text-sm text-gray-500 mt-4 text-center">Scan this QR code to open the admission inquiry form</p>
          </div>

          {/* Form URL */}
          <div className="bg-gray-50 rounded-lg p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Form URL</label>
            <div className="flex gap-2">
              <Input value={qrFormUrl} readOnly className="flex-1 bg-white text-sm" />
              <Button variant="outline" onClick={handleCopyLink}>
                {copied ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
            {copied && <p className="text-xs text-green-600 mt-1">Link copied to clipboard!</p>}
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <Button variant="primary" onClick={handleDownloadQR} className="flex items-center justify-center gap-2">
              <Download className="w-4 h-4" />
              Download QR
            </Button>
            <Button variant="outline" onClick={handleShare} className="flex items-center justify-center gap-2">
              <Share2 className="w-4 h-4" />
              Share
            </Button>
          </div>

          {/* Import Section */}
          <div className="border-t pt-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Import QR Code</h4>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImportQR} />
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
              <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB</p>
            </div>
            {importedQR &&
            <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200 flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-green-800">QR Code imported successfully</p>
                  <p className="text-xs text-green-600">Ready for processing</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => setImportedQR(null)}>Clear</Button>
              </div>
            }
          </div>

          {/* QR Code Options */}
          <div className="border-t pt-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">QR Code Settings</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Size</label>
                <Select options={[{ value: 'small', label: 'Small (150x150)' }, { value: 'medium', label: 'Medium (200x200)' }, { value: 'large', label: 'Large (300x300)' }]} />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Format</label>
                <Select options={[{ value: 'png', label: 'PNG' }, { value: 'svg', label: 'SVG' }, { value: 'pdf', label: 'PDF' }]} />
              </div>
            </div>
          </div>
        </div>
      </Modal>

      {/* New Inquiry Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="New Admission Inquiry" size="lg"
      footer={<><Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button><Button onClick={() => setIsModalOpen(false)}>Save Inquiry</Button></>}>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Academic Year" defaultValue="2024-2025" disabled />
            <Input label="Inquiry Date" type="date" defaultValue={new Date().toISOString().split('T')[0]} />
          </div>

          <div className="border-t pt-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-4">Student Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Student Name" placeholder="Enter student name" />
              <div className="grid grid-cols-2 gap-4">
                <Select label="Gender" options={[{ value: '', label: 'Select' }, { value: 'M', label: 'Male' }, { value: 'F', label: 'Female' }]} />
                <Input label="Date of Birth" type="date" />
              </div>
              <Select label="Class Applying For" options={[{ value: '', label: 'Select Class' }, { value: '1', label: 'Class 1' }, { value: '6', label: 'Class 6' }, { value: '11', label: 'Class 11' }]} />
              <Select label="Stream" options={[{ value: '', label: 'Select Stream (if applicable)' }, { value: 'science', label: 'Science' }, { value: 'commerce', label: 'Commerce' }]} />
            </div>
          </div>

          <div className="border-t pt-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-4">Parent/Guardian Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Parent Name" placeholder="Enter parent name" />
              <Input label="Relationship" placeholder="Father/Mother/Guardian" />
              <Input label="Mobile Number" placeholder="10 digit mobile number" />
              <Input label="Email ID" placeholder="email@example.com" />
              <Input label="City/Location" placeholder="Enter city or area" />
              <Select label="Source of Inquiry" options={[{ value: '', label: 'Select Source' }, { value: 'website', label: 'Website' }, { value: 'referral', label: 'Referral' }, { value: 'walkin', label: 'Walk-in' }]} />
            </div>
          </div>

          <div className="border-t pt-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-4">Additional Info</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select label="Transport Required?" options={[{ value: 'no', label: 'No' }, { value: 'yes', label: 'Yes' }]} />
              <Select label="Hostel Required?" options={[{ value: 'no', label: 'No' }, { value: 'yes', label: 'Yes' }]} />
              <Select label="Priority" options={[{ value: 'medium', label: 'Medium' }, { value: 'high', label: 'High' }, { value: 'low', label: 'Low' }]} />
              <Select label="Assign Counselor" options={[{ value: '', label: 'Auto Assign' }, { value: 'c1', label: 'Counselor 1' }, { value: 'c2', label: 'Counselor 2' }]} />
            </div>
            <div className="mt-4">
              <Input label="Remarks / Notes" placeholder="Any specific requirements or notes..." />
            </div>
          </div>
        </div>
      </Modal>
    </div>);

}