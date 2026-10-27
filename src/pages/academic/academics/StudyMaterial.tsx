import React, { useRef, useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Table } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import { Modal } from '../../../components/ui/Modal';
import {
  UploadIcon,
  DownloadIcon,
  EditIcon,
  Trash2Icon,
  SearchIcon,
  ArchiveIcon,
  FileTextIcon,
  ImageIcon,
  VideoIcon,
  FileIcon,
  BookOpenIcon,
  ShieldIcon,
  ClockIcon } from
'lucide-react';
interface StudyMaterialItem {
  id: number;
  title: string;
  subject: string;
  class: string;
  fileType: 'PDF' | 'DOC' | 'PPT' | 'Image' | 'Video';
  fileSize: string;
  uploadedBy: string;
  uploadedOn: string;
  status: 'Active' | 'Archived';
  accessRole: string;
  downloads: number;
  fileName?: string;
}
interface AuditItem {
  id: number;
  action: string;
  user: string;
  dateTime: string;
  details: string;
}
const materialsSeed: StudyMaterialItem[] = [
{
  id: 1,
  title: 'Chapter 1 – Introduction to Numbers',
  subject: 'Mathematics',
  class: 'Class 2',
  fileType: 'PDF',
  fileSize: '1.2 MB',
  uploadedBy: 'Mr. Rajesh Patel',
  uploadedOn: '10 Feb 2026',
  status: 'Active',
  accessRole: 'Students & Parents',
  downloads: 45
},
{
  id: 2,
  title: 'English Grammar – Parts of Speech',
  subject: 'English',
  class: 'Class 3',
  fileType: 'DOC',
  fileSize: '856 KB',
  uploadedBy: 'Ms. Priya Sharma',
  uploadedOn: '12 Feb 2026',
  status: 'Active',
  accessRole: 'Students Only',
  downloads: 38
},
{
  id: 3,
  title: 'Plant Life Cycle – Presentation',
  subject: 'Science',
  class: 'Class 3',
  fileType: 'PPT',
  fileSize: '4.5 MB',
  uploadedBy: 'Ms. Anita Verma',
  uploadedOn: '15 Feb 2026',
  status: 'Active',
  accessRole: 'Teachers Only',
  downloads: 12
},
{
  id: 4,
  title: 'Map of India – Political',
  subject: 'Social Studies',
  class: 'Class 4',
  fileType: 'Image',
  fileSize: '2.1 MB',
  uploadedBy: 'Mr. Suresh Kumar',
  uploadedOn: '18 Feb 2026',
  status: 'Active',
  accessRole: 'Students & Parents',
  downloads: 62
},
{
  id: 5,
  title: 'Hindi Vyakaran – Sangya & Sarvanam',
  subject: 'Hindi',
  class: 'Class 2',
  fileType: 'PDF',
  fileSize: '980 KB',
  uploadedBy: 'Ms. Kavita Nair',
  uploadedOn: '20 Feb 2026',
  status: 'Active',
  accessRole: 'Students & Parents',
  downloads: 29
},
{
  id: 6,
  title: 'Multiplication Tables Video',
  subject: 'Mathematics',
  class: 'Class 3',
  fileType: 'Video',
  fileSize: '45 MB',
  uploadedBy: 'Mr. Rajesh Patel',
  uploadedOn: '22 Feb 2026',
  status: 'Active',
  accessRole: 'Students Only',
  downloads: 88
},
{
  id: 7,
  title: 'Chapter 5 – Fractions (Old)',
  subject: 'Mathematics',
  class: 'Class 3',
  fileType: 'PDF',
  fileSize: '1.5 MB',
  uploadedBy: 'Mr. Rajesh Patel',
  uploadedOn: '05 Jan 2026',
  status: 'Archived',
  accessRole: 'Teachers Only',
  downloads: 15
},
{
  id: 8,
  title: 'Science Lab Safety Rules',
  subject: 'Science',
  class: 'Class 4',
  fileType: 'PDF',
  fileSize: '650 KB',
  uploadedBy: 'Ms. Anita Verma',
  uploadedOn: '08 Feb 2026',
  status: 'Active',
  accessRole: 'Students & Parents',
  downloads: 55
}];

const auditSeed: AuditItem[] = [
{
  id: 1,
  action: 'Material Uploaded',
  user: 'Mr. Rajesh Patel',
  dateTime: '22 Feb 2026, 10:00',
  details: 'Multiplication Tables Video — Class 3 Mathematics'
},
{
  id: 2,
  action: 'Material Downloaded',
  user: 'Aarav Sharma (Student)',
  dateTime: '22 Feb 2026, 14:30',
  details: 'Chapter 1 – Introduction to Numbers'
},
{
  id: 3,
  action: 'Material Edited',
  user: 'Ms. Priya Sharma',
  dateTime: '20 Feb 2026, 09:15',
  details: 'Updated title and class tag for English Grammar doc'
},
{
  id: 4,
  action: 'Material Archived',
  user: 'Mr. Rajesh Patel',
  dateTime: '15 Feb 2026, 11:00',
  details: 'Chapter 5 – Fractions (Old) archived'
},
{
  id: 5,
  action: 'Access Role Changed',
  user: 'Admin',
  dateTime: '18 Feb 2026, 16:00',
  details: 'Plant Life Cycle PPT changed to Teachers Only'
}];

const fileTypeIcon = (type: string) => {
  switch (type) {
    case 'PDF':
      return <FileTextIcon className="w-4 h-4 text-red-500" />;
    case 'DOC':
      return <FileTextIcon className="w-4 h-4 text-blue-500" />;
    case 'PPT':
      return <FileIcon className="w-4 h-4 text-orange-500" />;
    case 'Image':
      return <ImageIcon className="w-4 h-4 text-green-500" />;
    case 'Video':
      return <VideoIcon className="w-4 h-4 text-purple-500" />;
    default:
      return <FileIcon className="w-4 h-4 text-gray-500" />;
  }
};

const FILE_TYPE_MAP: Record<string, StudyMaterialItem['fileType']> = {
  pdf: 'PDF',
  doc: 'DOC',
  ppt: 'PPT',
  image: 'Image',
  video: 'Video'
};
const ACCESS_MAP: Record<string, string> = {
  all: 'Students & Parents',
  students: 'Students Only',
  teachers: 'Teachers Only',
  admin: 'Admin Only'
};
const CLASS_MAP: Record<string, string> = {
  'class-1': 'Class 1',
  'class-2': 'Class 2',
  'class-3': 'Class 3',
  'class-4': 'Class 4',
  'class-5': 'Class 5'
};
const SUBJECT_MAP: Record<string, string> = {
  mathematics: 'Mathematics',
  english: 'English',
  science: 'Science',
  'social-studies': 'Social Studies',
  hindi: 'Hindi'
};

const nowStamp = () => {
  const d = new Date();
  const date = d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  const time = d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  return { date, dateTime: `${date}, ${time}` };
};

const emptyForm = () => ({
  title: '',
  subject: '',
  className: '',
  accessRole: 'all',
  fileType: 'pdf',
  fileName: ''
});

export function StudyMaterial() {
  const [filterSubject, setFilterSubject] = useState('');
  const [filterClass, setFilterClass] = useState('');
  const [filterStatus, setFilterStatus] = useState('Active');
  const [searchTitle, setSearchTitle] = useState('');
  const [showUpload, setShowUpload] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [tab, setTab] = useState('materials');
  const [materials, setMaterials] = useState<StudyMaterialItem[]>(materialsSeed);
  const [auditLog, setAuditLog] = useState<AuditItem[]>(auditSeed);
  const [form, setForm] = useState(emptyForm);
  const [notice, setNotice] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const flash = (text: string) => {
    setNotice(text);
    window.setTimeout(() => setNotice(''), 3500);
  };

  const addAudit = (action: string, details: string) => {
    const stamp = nowStamp();
    setAuditLog((current) => [{ id: Date.now(), action, user: 'You', dateTime: stamp.dateTime, details }, ...current]);
  };

  const filteredMaterials = materials.filter((m) => {
    if (filterSubject && m.subject !== filterSubject) return false;
    if (filterClass && !m.class.toLowerCase().includes(filterClass)) return false;
    if (filterStatus && m.status !== filterStatus) return false;
    if (searchTitle && !m.title.toLowerCase().includes(searchTitle.toLowerCase())) return false;
    return true;
  });

  const openUpload = () => {
    setEditingId(null);
    setForm(emptyForm());
    setShowUpload(true);
  };

  const openEdit = (row: StudyMaterialItem) => {
    setEditingId(row.id);
    setForm({
      title: row.title,
      subject: Object.keys(SUBJECT_MAP).find((key) => SUBJECT_MAP[key] === row.subject) || '',
      className: Object.keys(CLASS_MAP).find((key) => CLASS_MAP[key] === row.class) || '',
      accessRole: Object.keys(ACCESS_MAP).find((key) => ACCESS_MAP[key] === row.accessRole) || 'all',
      fileType: Object.keys(FILE_TYPE_MAP).find((key) => FILE_TYPE_MAP[key] === row.fileType) || 'pdf',
      fileName: row.fileName || ''
    });
    setShowUpload(true);
  };

  const downloadMaterial = (row: StudyMaterialItem) => {
    const blob = new Blob([`${row.title}\n${row.subject} · ${row.class}\n${row.fileType} · ${row.fileSize}\n`], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${row.title.replace(/[^\w.-]+/g, '_')}.${row.fileType === 'PDF' ? 'pdf' : row.fileType === 'DOC' ? 'doc' : row.fileType === 'PPT' ? 'ppt' : row.fileType === 'Image' ? 'png' : 'mp4'}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setMaterials((current) => current.map((item) => item.id === row.id ? { ...item, downloads: item.downloads + 1 } : item));
    addAudit('Material Downloaded', row.title);
    flash(`Downloaded “${row.title}”.`);
  };

  const archiveMaterial = (row: StudyMaterialItem) => {
    setMaterials((current) => current.map((item) => item.id === row.id ? { ...item, status: 'Archived' } : item));
    addAudit('Material Archived', `${row.title} archived`);
    flash(`Archived “${row.title}”.`);
  };

  const deleteMaterial = (row: StudyMaterialItem) => {
    if (typeof window !== 'undefined' && !window.confirm(`Delete “${row.title}”?`)) return;
    setMaterials((current) => current.filter((item) => item.id !== row.id));
    addAudit('Material Deleted', row.title);
    flash(`Deleted “${row.title}”.`);
  };

  const saveMaterial = () => {
    if (!form.title.trim()) {
      flash('Enter a material title.');
      return;
    }
    const stamp = nowStamp();
    const nextItem: StudyMaterialItem = {
      id: editingId ?? Date.now(),
      title: form.title.trim(),
      subject: SUBJECT_MAP[form.subject] || form.subject || 'General',
      class: CLASS_MAP[form.className] || form.className || 'Class 1',
      fileType: FILE_TYPE_MAP[form.fileType] || 'PDF',
      fileSize: form.fileName ? 'Uploaded' : '—',
      uploadedBy: 'You',
      uploadedOn: stamp.date,
      status: 'Active',
      accessRole: ACCESS_MAP[form.accessRole] || 'Students & Parents',
      downloads: editingId ? materials.find((item) => item.id === editingId)?.downloads || 0 : 0,
      fileName: form.fileName
    };
    setMaterials((current) => editingId ? current.map((item) => item.id === editingId ? { ...item, ...nextItem, uploadedOn: item.uploadedOn, uploadedBy: item.uploadedBy } : item) : [nextItem, ...current]);
    addAudit(editingId ? 'Material Edited' : 'Material Uploaded', `${nextItem.title} — ${nextItem.class} ${nextItem.subject}`);
    setShowUpload(false);
    setEditingId(null);
    setForm(emptyForm());
    flash(editingId ? `Updated “${nextItem.title}”.` : `Uploaded “${nextItem.title}”.`);
  };

  return (
    <div className="space-y-6 p-6">
      {notice && <div className="rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm text-indigo-800">{notice}</div>}
      <div className="flex flex-wrap justify-between items-start gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Study Material</h1>
          <p className="text-sm text-gray-500 mt-1">
            Upload, manage and share study materials with role-based access
            control
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="primary"
            size="sm"
            leftIcon={<UploadIcon className="w-4 h-4" />}
            onClick={openUpload}>
            Upload Material
          </Button>
        </div>
      </div>

      <Card noPadding>
        <div className="px-5 pt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setTab('materials')}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold ${tab === 'materials' ? 'bg-indigo-600 text-white' : 'border border-gray-200 bg-white text-gray-700'}`}>
            <BookOpenIcon className="w-3.5 h-3.5" /> Materials Library
          </button>
          <button
            type="button"
            onClick={() => setTab('audit')}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold ${tab === 'audit' ? 'bg-indigo-600 text-white' : 'border border-gray-200 bg-white text-gray-700'}`}>
            <ClockIcon className="w-3.5 h-3.5" /> Audit Log
          </button>
        </div>

        {tab === 'materials' && (
          <div className="p-5">
            <div className="flex flex-wrap gap-3 items-end mb-4">
              <Input
                label="Search"
                placeholder="Search by title..."
                value={searchTitle}
                onChange={(e) => setSearchTitle(e.target.value)}
                leftIcon={<SearchIcon className="w-4 h-4 text-gray-400" />}
                className="w-56" />

              <Select
                label="Subject"
                options={[
                { value: '', label: 'All Subjects' },
                { value: 'Mathematics', label: 'Mathematics' },
                { value: 'English', label: 'English' },
                { value: 'Science', label: 'Science' },
                { value: 'Social Studies', label: 'Social Studies' },
                { value: 'Hindi', label: 'Hindi' }]
                }
                value={filterSubject}
                onChange={setFilterSubject}
                className="w-40" />

              <Select
                label="Class"
                options={[
                { value: '', label: 'All Classes' },
                { value: 'class 2', label: 'Class 2' },
                { value: 'class 3', label: 'Class 3' },
                { value: 'class 4', label: 'Class 4' }]
                }
                value={filterClass}
                onChange={setFilterClass}
                className="w-36" />

              <Select
                label="Status"
                options={[
                { value: '', label: 'All Status' },
                { value: 'Active', label: 'Active' },
                { value: 'Archived', label: 'Archived' }]
                }
                value={filterStatus}
                onChange={setFilterStatus}
                className="w-36" />
            </div>

            <Table
              columns={[
              {
                key: 'title',
                header: 'Title',
                render: (row) =>
                <div className="flex items-center gap-2">
                      {fileTypeIcon(row.fileType)}
                      <div>
                        <p className="font-medium text-gray-900 text-sm">
                          {row.title}
                        </p>
                        <p className="text-xs text-gray-400">{row.fileSize}</p>
                      </div>
                    </div>

              },
              {
                key: 'subject',
                header: 'Subject / Class',
                render: (row) =>
                <div>
                      <p className="text-sm font-medium text-gray-800">
                        {row.subject}
                      </p>
                      <p className="text-xs text-gray-500">{row.class}</p>
                    </div>

              },
              {
                key: 'fileType',
                header: 'Type',
                render: (row) =>
                <Badge
                  variant={
                  row.fileType === 'PDF' ?
                  'danger' :
                  row.fileType === 'Video' ?
                  'info' :
                  row.fileType === 'Image' ?
                  'success' :
                  'default'
                  }>

                      {row.fileType}
                    </Badge>

              },
              {
                key: 'accessRole',
                header: 'Access',
                render: (row) =>
                <div className="flex items-center gap-1">
                      <ShieldIcon className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-600">
                        {row.accessRole}
                      </span>
                    </div>

              },
              {
                key: 'uploadedBy',
                header: 'Uploaded By',
                render: (row) =>
                <span className="text-sm text-gray-600">
                      {row.uploadedBy}
                    </span>

              },
              {
                key: 'uploadedOn',
                header: 'Date',
                render: (row) =>
                <span className="text-xs text-gray-500">
                      {row.uploadedOn}
                    </span>

              },
              {
                key: 'downloads',
                header: 'Downloads',
                render: (row) =>
                <span className="font-medium text-gray-700">
                      {row.downloads}
                    </span>

              },
              {
                key: 'status',
                header: 'Status',
                render: (row) =>
                <Badge
                  variant={
                  row.status === 'Active' ? 'success' : 'secondary'
                  }>

                      {row.status}
                    </Badge>

              },
              {
                key: 'actions',
                header: 'Actions',
                render: (row) =>
                <div className="flex gap-1">
                      <Button
                    variant="ghost"
                    size="xs"
                    leftIcon={<DownloadIcon className="w-3 h-3" />}
                    onClick={() => downloadMaterial(row)}>

                        Download
                      </Button>
                      <Button
                    variant="ghost"
                    size="xs"
                    leftIcon={<EditIcon className="w-3 h-3" />}
                    onClick={() => openEdit(row)}>

                        Edit
                      </Button>
                      {row.status === 'Active' ?
                  <Button
                    variant="ghost"
                    size="xs"
                    leftIcon={<ArchiveIcon className="w-3 h-3" />}
                    onClick={() => archiveMaterial(row)}>

                          Archive
                        </Button> :

                  <Button
                    variant="ghost"
                    size="xs"
                    leftIcon={<Trash2Icon className="w-3 h-3" />}
                    className="text-red-500"
                    onClick={() => deleteMaterial(row)}>

                          Delete
                        </Button>
                  }
                    </div>

              }]
              }
              data={filteredMaterials} />

            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
              <span className="text-sm text-gray-500">
                Showing 1–{filteredMaterials.length} of {materials.length}{' '}
                materials
              </span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled>
                  Previous
                </Button>
                <Button variant="outline" size="sm" disabled>
                  Next
                </Button>
              </div>
            </div>
          </div>
        )}

        {tab === 'audit' && (
          <div className="p-5">
            <Table
              columns={[
              {
                key: 'action',
                header: 'Action',
                render: (row) =>
                <span className="font-medium text-gray-800">
                      {row.action}
                    </span>

              },
              {
                key: 'user',
                header: 'User'
              },
              {
                key: 'dateTime',
                header: 'Date & Time',
                render: (row) =>
                <span className="text-xs text-gray-500">
                      {row.dateTime}
                    </span>

              },
              {
                key: 'details',
                header: 'Details',
                render: (row) =>
                <span className="text-sm text-gray-600">{row.details}</span>

              }]
              }
              data={auditLog} />
          </div>
        )}
      </Card>

      <Modal isOpen={showUpload} onClose={() => setShowUpload(false)} title={editingId ? 'Edit Study Material' : 'Upload New Study Material'} size="lg">
        <div className="max-w-2xl space-y-5">
              <h3 className="text-base font-semibold text-gray-900">
                {editingId ? 'Edit Study Material' : 'Upload New Study Material'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Material Title"
                  placeholder="e.g. Chapter 1 – Introduction to Numbers"
                  className="md:col-span-2"
                  value={form.title}
                  onChange={(e) => setForm((current) => ({ ...current, title: e.target.value }))} />

                <Select
                  label="Subject"
                  options={[
                  { value: '', label: 'Select Subject' },
                  { value: 'mathematics', label: 'Mathematics' },
                  { value: 'english', label: 'English' },
                  { value: 'science', label: 'Science' },
                  { value: 'social-studies', label: 'Social Studies' },
                  { value: 'hindi', label: 'Hindi' }]
                  }
                  placeholder="Select Subject"
                  value={form.subject}
                  onChange={(value) => setForm((current) => ({ ...current, subject: value }))} />

                <Select
                  label="Class"
                  options={[
                  { value: '', label: 'Select Class' },
                  { value: 'class-1', label: 'Class 1' },
                  { value: 'class-2', label: 'Class 2' },
                  { value: 'class-3', label: 'Class 3' },
                  { value: 'class-4', label: 'Class 4' },
                  { value: 'class-5', label: 'Class 5' }]
                  }
                  placeholder="Select Class"
                  value={form.className}
                  onChange={(value) => setForm((current) => ({ ...current, className: value }))} />

                <Select
                  label="Role-based Access"
                  options={[
                  { value: 'all', label: 'Students & Parents' },
                  { value: 'students', label: 'Students Only' },
                  { value: 'teachers', label: 'Teachers Only' },
                  { value: 'admin', label: 'Admin Only' }]
                  }
                  value={form.accessRole}
                  onChange={(value) => setForm((current) => ({ ...current, accessRole: value }))} />

                <Select
                  label="File Type"
                  options={[
                  { value: 'pdf', label: 'PDF Document' },
                  { value: 'doc', label: 'Word Document' },
                  { value: 'ppt', label: 'PowerPoint' },
                  { value: 'image', label: 'Image' },
                  { value: 'video', label: 'Video' }]
                  }
                  value={form.fileType}
                  onChange={(value) => setForm((current) => ({ ...current, fileType: value }))} />

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Upload File
                  </label>
                  <input
                    ref={fileRef}
                    type="file"
                    className="hidden"
                    accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png,.mp4"
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      if (!file) return;
                      setForm((current) => ({ ...current, fileName: file.name }));
                    }}
                  />
                  <button
                    type="button"
                    className="w-full border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer"
                    onClick={() => fileRef.current?.click()}>
                    <UploadIcon className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                    <p className="text-sm font-medium text-gray-700">
                      {form.fileName || 'Click to upload or drag and drop'}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      PDF, DOC, DOCX, PPT, JPG, PNG, MP4 up to 100MB
                    </p>
                    <p className="text-xs text-red-500 mt-2">
                      File validation: Only allowed formats will be accepted
                    </p>
                  </button>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <Button
                  variant="primary"
                  leftIcon={<UploadIcon className="w-4 h-4" />}
                  onClick={saveMaterial}>

                  {editingId ? 'Save Changes' : 'Upload Material'}
                </Button>
                <Button variant="outline" onClick={() => setShowUpload(false)}>Cancel</Button>
              </div>
            </div>
      </Modal>
    </div>);

}
