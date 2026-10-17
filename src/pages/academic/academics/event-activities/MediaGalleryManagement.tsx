import React, { useMemo, useState } from 'react';
import { Card } from '../../../../components/ui/Card';
import { Button } from '../../../../components/ui/Button';
import { Input } from '../../../../components/ui/Input';
import { Select } from '../../../../components/ui/Select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../../../components/ui/Tabs';
import { UploadIcon, ImageIcon, FolderIcon, TagIcon, PlusIcon, XIcon, CheckCircleIcon, AlertCircleIcon, TrashIcon, EditIcon, EyeIcon, SearchIcon } from 'lucide-react';

interface Album { id: string; name: string; event: string; photos: number; class: string; access: string; date: string; coverImage?: string; permissions: { parents: boolean; students: boolean; public: boolean; download: boolean } }
interface MediaItem { id: string; albumId: string; name: string; type: 'image'; uploadedAt: string; size: string; tags: string[] }
interface ClassAlbum { id: string; className: string; section: string; photos: number; createdAt: string }
interface Student { id: string; name: string; class: string; section: string; photoCount: number }

const initialAlbums: Album[] = [
  { id: 'ALB-001', name: 'Annual Sports Day 2025', event: 'Sports Day', photos: 124, class: 'All', access: 'Parents + Students', date: '2025-06-25', permissions: { parents: true, students: true, public: false, download: true } },
  { id: 'ALB-002', name: 'Science Exhibition', event: 'Science Expo', photos: 67, class: 'Class 8-10', access: 'All', date: '2025-06-20', permissions: { parents: true, students: true, public: true, download: true } },
  { id: 'ALB-003', name: 'Class 6-A Activities', event: 'Class Activity', photos: 34, class: 'Class 6-A', access: 'Class 6-A Parents', date: '2025-06-15', permissions: { parents: true, students: false, public: false, download: false } },
  { id: 'ALB-004', name: 'Independence Day Celebration', event: 'National Event', photos: 89, class: 'All', access: 'All', date: '2025-08-15', permissions: { parents: true, students: true, public: true, download: true } },
  { id: 'ALB-005', name: 'Art Competition 2025', event: 'Competition', photos: 56, class: 'Class 5-8', access: 'Parents + Students', date: '2025-05-10', permissions: { parents: true, students: true, public: false, download: true } }
];

const initialMediaItems: MediaItem[] = [
  { id: 'IMG-001', albumId: 'ALB-001', name: 'Opening Ceremony', type: 'image', uploadedAt: '2025-06-25 09:00', size: '2.4 MB', tags: ['STU-001', 'STU-002'] },
  { id: 'IMG-002', albumId: 'ALB-001', name: 'Track Event', type: 'image', uploadedAt: '2025-06-25 10:30', size: '3.1 MB', tags: ['STU-003'] },
  { id: 'IMG-003', albumId: 'ALB-001', name: 'Award Ceremony', type: 'image', uploadedAt: '2025-06-25 15:00', size: '2.8 MB', tags: ['STU-001', 'STU-004'] },
  { id: 'IMG-004', albumId: 'ALB-002', name: 'Science Project Display', type: 'image', uploadedAt: '2025-06-20 11:00', size: '1.9 MB', tags: ['STU-002'] },
  { id: 'IMG-005', albumId: 'ALB-002', name: 'Experiment Demo', type: 'image', uploadedAt: '2025-06-20 14:00', size: '2.2 MB', tags: [] },
  { id: 'IMG-006', albumId: 'ALB-003', name: 'Art Activity', type: 'image', uploadedAt: '2025-06-15 10:00', size: '1.5 MB', tags: ['STU-005'] }
];

const initialClassAlbums: ClassAlbum[] = [
  { id: 'CA-001', className: 'Class 6', section: 'A', photos: 45, createdAt: '2025-01-15' },
  { id: 'CA-002', className: 'Class 6', section: 'B', photos: 38, createdAt: '2025-01-15' },
  { id: 'CA-003', className: 'Class 7', section: 'A', photos: 52, createdAt: '2025-01-16' },
  { id: 'CA-004', className: 'Class 8', section: 'A', photos: 61, createdAt: '2025-01-17' },
  { id: 'CA-005', className: 'Class 9', section: 'A', photos: 48, createdAt: '2025-01-18' },
  { id: 'CA-006', className: 'Class 10', section: 'A', photos: 55, createdAt: '2025-01-19' },
  { id: 'CA-007', className: 'Class 10', section: 'B', photos: 42, createdAt: '2025-01-19' },
  { id: 'CA-008', className: 'Class 11', section: 'A', photos: 36, createdAt: '2025-01-20' }
];

const initialStudents: Student[] = [
  { id: 'STU-001', name: 'Arjun Sharma', class: 'Class 8', section: 'A', photoCount: 12 },
  { id: 'STU-002', name: 'Priya Patel', class: 'Class 6', section: 'B', photoCount: 8 },
  { id: 'STU-003', name: 'Rohan Mehta', class: 'Class 9', section: 'A', photoCount: 15 },
  { id: 'STU-004', name: 'Ananya Singh', class: 'Class 10', section: 'A', photoCount: 10 },
  { id: 'STU-005', name: 'Vikram Reddy', class: 'Class 7', section: 'A', photoCount: 6 },
  { id: 'STU-006', name: 'Sneha Gupta', class: 'Class 8', section: 'B', photoCount: 9 },
  { id: 'STU-007', name: 'Rahul Kumar', class: 'Class 11', section: 'A', photoCount: 4 },
  { id: 'STU-008', name: 'Kavya Nair', class: 'Class 6', section: 'A', photoCount: 7 }
];

const eventOptions = [{ value: '', label: 'Select Event Type' }, { value: 'Sports Day', label: 'Sports Day' }, { value: 'Science Expo', label: 'Science Expo' }, { value: 'Class Activity', label: 'Class Activity' }, { value: 'National Event', label: 'National Event' }, { value: 'Competition', label: 'Competition' }, { value: 'Cultural Event', label: 'Cultural Event' }, { value: 'Annual Function', label: 'Annual Function' }];
const classOptions = [{ value: 'All', label: 'All Classes' }, { value: 'Class 6', label: 'Class 6' }, { value: 'Class 7', label: 'Class 7' }, { value: 'Class 8', label: 'Class 8' }, { value: 'Class 9', label: 'Class 9' }, { value: 'Class 10', label: 'Class 10' }, { value: 'Class 11', label: 'Class 11' }, { value: 'Class 12', label: 'Class 12' }];
const sectionOptions = [{ value: 'A', label: 'Section A' }, { value: 'B', label: 'Section B' }, { value: 'C', label: 'Section C' }];
const classFilterOptions = [{ value: 'all', label: 'All Classes' }, { value: '6', label: 'Class 6' }, { value: '7', label: 'Class 7' }, { value: '8', label: 'Class 8' }, { value: '9', label: 'Class 9' }, { value: '10', label: 'Class 10' }, { value: '11', label: 'Class 11' }];

const generateId = (prefix: string) => `${prefix}-${String(Date.now()).slice(-6)}`;
const emptyAlbumForm = { name: '', event: '', class: 'All', date: '' };
const emptyClassAlbumForm = { className: '', section: 'A' };

export function MediaGalleryManagement() {
  const [tab, setTab] = useState('images');
  const [albums, setAlbums] = useState<Album[]>(initialAlbums);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>(initialMediaItems);
  const [classAlbums, setClassAlbums] = useState<ClassAlbum[]>(initialClassAlbums);
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [modal, setModal] = useState<'createAlbum' | 'editAlbum' | 'viewAlbum' | 'uploadMedia' | 'createClassAlbum' | 'tagPhoto' | 'viewClassAlbum' | 'deleteConfirm' | null>(null);
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [selectedClassAlbum, setSelectedClassAlbum] = useState<ClassAlbum | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<MediaItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ type: string; id: string } | null>(null);
  const [albumForm, setAlbumForm] = useState(emptyAlbumForm);
  const [classAlbumForm, setClassAlbumForm] = useState(emptyClassAlbumForm);
  const [uploadAlbumId, setUploadAlbumId] = useState('');
  const [allowDownload, setAllowDownload] = useState(true);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [albumSearch, setAlbumSearch] = useState('');
  const [classFilter, setClassFilter] = useState('all');
  const [taggingAlbumId, setTaggingAlbumId] = useState('');
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [studentSearch, setStudentSearch] = useState('');
  const [notification, setNotification] = useState<{ message: string; type: string } | null>(null);
  const showNotification = (message: string, type = 'success') => { setNotification({ message, type }); window.setTimeout(() => setNotification(null), 3000); };
  const closeModal = () => { setModal(null); setSelectedAlbum(null); setSelectedClassAlbum(null); setSelectedPhoto(null); setDeleteTarget(null); setUploadedFiles([]); setSelectedStudentIds([]); };

  const stats = useMemo(() => ({ totalPhotos: mediaItems.length + albums.reduce((sum, album) => sum + album.photos, 0), totalAlbums: albums.length, classAlbumsCount: classAlbums.length }), [mediaItems, albums, classAlbums]);
  const filteredAlbums = useMemo(() => albums.filter((album) => albumSearch === '' || album.name.toLowerCase().includes(albumSearch.toLowerCase()) || album.event.toLowerCase().includes(albumSearch.toLowerCase())), [albums, albumSearch]);
  const filteredClassAlbums = useMemo(() => classAlbums.filter((album) => classFilter === 'all' || album.className.includes(classFilter)), [classAlbums, classFilter]);
  const filteredStudents = useMemo(() => students.filter((student) => studentSearch === '' || student.name.toLowerCase().includes(studentSearch.toLowerCase())), [students, studentSearch]);
  const albumPhotos = useMemo(() => taggingAlbumId ? mediaItems.filter((item) => item.albumId === taggingAlbumId) : [], [mediaItems, taggingAlbumId]);

  const handleCreateAlbum = () => {
    if (!albumForm.name.trim() || !albumForm.event || !albumForm.date) return showNotification('Please fill all required fields', 'error');
    const newAlbum: Album = { id: generateId('ALB'), name: albumForm.name, event: albumForm.event, photos: 0, class: albumForm.class, access: 'Parents + Students', date: albumForm.date, permissions: { parents: true, students: true, public: false, download: true } };
    setAlbums((prev) => [newAlbum, ...prev]); setAlbumForm(emptyAlbumForm); closeModal(); showNotification('Album created successfully');
  };
  const handleEditAlbum = () => {
    if (!selectedAlbum || !albumForm.name.trim()) return showNotification('Please fill all required fields', 'error');
    setAlbums((prev) => prev.map((album) => album.id === selectedAlbum.id ? { ...album, name: albumForm.name, event: albumForm.event || album.event, class: albumForm.class, date: albumForm.date || album.date } : album));
    closeModal(); showNotification('Album updated successfully');
  };
  const handleDeleteAlbum = () => {
    if (!deleteTarget) return;
    if (deleteTarget.type === 'album') { setAlbums((prev) => prev.filter((album) => album.id !== deleteTarget.id)); setMediaItems((prev) => prev.filter((item) => item.albumId !== deleteTarget.id)); }
    else if (deleteTarget.type === 'classAlbum') setClassAlbums((prev) => prev.filter((album) => album.id !== deleteTarget.id));
    closeModal(); showNotification('Deleted successfully', 'info');
  };
  const handleUploadImages = () => {
    if (!uploadAlbumId) return showNotification('Please select an album', 'error');
    if (uploadedFiles.length === 0) return showNotification('Please select files to upload', 'error');
    const newItems: MediaItem[] = uploadedFiles.map((file) => ({ id: generateId('IMG'), albumId: uploadAlbumId, name: file.name.replace(/\.[^/.]+$/, ''), type: 'image', uploadedAt: new Date().toLocaleString('sv'), size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`, tags: [] }));
    setMediaItems((prev) => [...newItems, ...prev]);
    setAlbums((prev) => prev.map((album) => album.id === uploadAlbumId ? { ...album, photos: album.photos + uploadedFiles.length, permissions: { ...album.permissions, download: allowDownload } } : album));
    setUploadedFiles([]); setUploadAlbumId(''); showNotification(`${uploadedFiles.length} images uploaded successfully`);
  };
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => { if (event.target.files) setUploadedFiles(Array.from(event.target.files).filter((file) => file.type.startsWith('image/'))); };
  const handleFileDrop = (event: React.DragEvent) => { event.preventDefault(); if (event.dataTransfer.files) setUploadedFiles(Array.from(event.dataTransfer.files).filter((file) => file.type.startsWith('image/'))); };
  const handleCreateClassAlbum = () => {
    if (!classAlbumForm.className) return showNotification('Please select a class', 'error');
    if (classAlbums.find((album) => album.className === classAlbumForm.className && album.section === classAlbumForm.section)) return showNotification('Class album already exists', 'error');
    setClassAlbums((prev) => [...prev, { id: generateId('CA'), className: classAlbumForm.className, section: classAlbumForm.section, photos: 0, createdAt: new Date().toISOString().split('T')[0] }]);
    setClassAlbumForm(emptyClassAlbumForm); closeModal(); showNotification('Class album created successfully');
  };
  const handleTagStudent = (studentId: string) => setSelectedStudentIds((prev) => prev.includes(studentId) ? prev.filter((id) => id !== studentId) : [...prev, studentId]);
  const handleSaveTags = () => {
    if (!selectedPhoto) return;
    setMediaItems((prev) => prev.map((item) => item.id === selectedPhoto.id ? { ...item, tags: selectedStudentIds } : item));
    setStudents((prev) => prev.map((student) => ({ ...student, photoCount: mediaItems.filter((item) => item.tags.includes(student.id) || (item.id === selectedPhoto.id && selectedStudentIds.includes(student.id))).length })));
    closeModal(); showNotification('Tags saved successfully');
  };
  const openEditAlbum = (album: Album) => { setSelectedAlbum(album); setAlbumForm({ name: album.name, event: album.event, class: album.class, date: album.date }); setModal('editAlbum'); };
  const openViewAlbum = (album: Album) => { setSelectedAlbum(album); setModal('viewAlbum'); };
  const openDeleteConfirm = (type: string, id: string) => { setDeleteTarget({ type, id }); setModal('deleteConfirm'); };
  const openTagPhoto = (photo: MediaItem) => { setSelectedPhoto(photo); setSelectedStudentIds([...photo.tags]); setModal('tagPhoto'); };
  const openViewClassAlbum = (album: ClassAlbum) => { setSelectedClassAlbum(album); setModal('viewClassAlbum'); };

  return (
    <div className="space-y-6 p-6">
      {notification && <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 ${notification.type === 'success' ? 'bg-green-500 text-white' : notification.type === 'error' ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'}`}>{notification.type === 'success' ? <CheckCircleIcon className="w-4 h-4" /> : <AlertCircleIcon className="w-4 h-4" />}<span className="text-sm font-medium">{notification.message}</span><button type="button" onClick={() => setNotification(null)}><XIcon className="w-4 h-4" /></button></div>}

      <div className="flex items-start justify-between">
        <div><h1 className="text-2xl font-bold text-gray-900">Media & Gallery Management</h1><p className="text-sm text-gray-500 mt-1">Manage event photos, albums and access permissions</p></div>
        <div className="flex gap-2"><Button variant="outline" onClick={() => { setAlbumForm(emptyAlbumForm); setModal('createAlbum'); }}><FolderIcon className="w-4 h-4 mr-2" />New Album</Button><Button variant="primary" onClick={() => setModal('uploadMedia')}><UploadIcon className="w-4 h-4 mr-2" />Upload Media</Button></div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[{ label: 'Total Photos', value: stats.totalPhotos.toLocaleString(), color: 'text-blue-600' }, { label: 'Albums', value: stats.totalAlbums.toString(), color: 'text-green-600' }, { label: 'Class Albums', value: stats.classAlbumsCount.toString(), color: 'text-purple-600' }].map((stat) => (
          <Card key={stat.label}><div className="text-center p-1"><p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p><p className="text-xs text-gray-500 mt-1">{stat.label}</p></div></Card>
        ))}
      </div>

      <Card noPadding>
        <Tabs defaultValue="images" value={tab} onValueChange={setTab}>
          <TabsList className="px-4">
            <TabsTrigger value="images">Image Upload</TabsTrigger>
            <TabsTrigger value="albums">Albums</TabsTrigger>
            <TabsTrigger value="class-albums">Class Albums</TabsTrigger>
            <TabsTrigger value="tagging">Tag Students</TabsTrigger>
          </TabsList>

          <TabsContent value="images" className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card title="Upload Images">
                <div className="space-y-4">
                  <Select label="Select Album" value={uploadAlbumId} onChange={(event) => setUploadAlbumId(event.target.value)} options={[{ value: '', label: 'Choose album...' }, ...albums.map((album) => ({ value: album.id, label: album.name }))]} />
                  <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center cursor-pointer hover:border-blue-300 hover:bg-blue-50/30 transition-all" onDrop={handleFileDrop} onDragOver={(event) => event.preventDefault()}>
                    <ImageIcon className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                    <p className="text-sm font-medium text-gray-600">Drag & drop images here</p>
                    <p className="text-xs text-gray-400 mt-1">or click to browse (JPG, PNG, WEBP — Max 10MB each)</p>
                    <label className="inline-block mt-3"><input type="file" multiple accept="image/*" className="hidden" onChange={handleFileSelect} /><span className="px-4 py-2 text-sm border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">Browse Files</span></label>
                  </div>
                  {uploadedFiles.length > 0 && <div className="p-3 bg-gray-50 rounded-lg"><p className="text-sm font-medium text-gray-700">{uploadedFiles.length} file(s) selected</p><div className="mt-2 space-y-1">{uploadedFiles.slice(0, 3).map((file) => <p key={file.name} className="text-xs text-gray-500 truncate">{file.name}</p>)}{uploadedFiles.length > 3 && <p className="text-xs text-gray-400">+{uploadedFiles.length - 3} more</p>}</div></div>}
                  <div className="flex items-center justify-between"><span className="text-sm text-gray-700">Allow Download</span><button type="button" className={`relative w-9 h-5 rounded-full ${allowDownload ? 'bg-blue-500' : 'bg-gray-300'}`} onClick={() => setAllowDownload(!allowDownload)}><span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${allowDownload ? 'translate-x-4' : 'translate-x-0'}`} /></button></div>
                  <Button variant="primary" className="w-full" onClick={handleUploadImages}><UploadIcon className="w-4 h-4 mr-2" />Upload Images</Button>
                </div>
              </Card>
              <Card title="Recent Uploads">
                <div className="grid grid-cols-3 gap-2">{mediaItems.slice(0, 9).map((item) => (
                  <button type="button" key={item.id} className="relative aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex flex-col items-center justify-center p-2 hover:ring-2 hover:ring-blue-400" onClick={() => openTagPhoto(item)}>
                    <ImageIcon className="w-6 h-6 text-gray-400" />
                    <p className="text-xs text-gray-500 mt-1 truncate w-full text-center">{item.name}</p>
                    {item.tags.length > 0 && <div className="absolute bottom-1 right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center"><span className="text-[10px] text-white">{item.tags.length}</span></div>}
                  </button>
                ))}</div>
                {mediaItems.length === 0 && <div className="text-center py-8 text-gray-500">No uploads yet</div>}
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="albums" className="p-5">
            <div className="flex gap-3 mb-4"><Input placeholder="Search albums..." leftIcon={<SearchIcon className="w-4 h-4 text-gray-400" />} className="flex-1" value={albumSearch} onChange={(event) => setAlbumSearch(event.target.value)} /><Button variant="primary" onClick={() => { setAlbumForm(emptyAlbumForm); setModal('createAlbum'); }}><PlusIcon className="w-4 h-4 mr-2" />Create Album</Button></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">{filteredAlbums.map((album) => (
              <div key={album.id} className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                <div className="h-32 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center"><FolderIcon className="w-12 h-12 text-blue-400" /></div>
                <div className="p-4">
                  <p className="font-semibold text-gray-800 text-sm">{album.name}</p>
                  <p className="text-xs text-gray-500 mt-1">{album.event} • {album.date}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-gray-400"><span className="flex items-center gap-1"><ImageIcon className="w-3 h-3" />{album.photos}</span></div>
                  <div className="flex gap-2 mt-3"><Button variant="outline" className="flex-1 text-xs h-7" onClick={() => openViewAlbum(album)}><EyeIcon className="w-3 h-3 mr-1" />View</Button><Button variant="ghost" className="text-xs h-7 px-2" onClick={() => openEditAlbum(album)}><EditIcon className="w-3 h-3" /></Button><Button variant="ghost" className="text-xs h-7 px-2 text-red-500" onClick={() => openDeleteConfirm('album', album.id)}><TrashIcon className="w-3 h-3" /></Button></div>
                </div>
              </div>
            ))}</div>
            {filteredAlbums.length === 0 && <div className="text-center py-8 text-gray-500">No albums found</div>}
          </TabsContent>

          <TabsContent value="class-albums" className="p-5">
            <div className="flex gap-3 mb-4"><Select value={classFilter} onChange={(event) => setClassFilter(event.target.value)} options={classFilterOptions} className="w-40" /><Button variant="primary" onClick={() => { setClassAlbumForm(emptyClassAlbumForm); setModal('createClassAlbum'); }}><PlusIcon className="w-4 h-4 mr-2" />Create Class Album</Button></div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">{filteredClassAlbums.map((album) => (
              <div key={album.id} className="border border-gray-200 rounded-xl p-4 text-center hover:bg-gray-50 cursor-pointer transition-colors" onClick={() => openViewClassAlbum(album)}>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2"><FolderIcon className="w-6 h-6 text-blue-500" /></div>
                <p className="text-sm font-semibold text-gray-800">{album.className}-{album.section}</p>
                <p className="text-xs text-gray-400 mt-1">{album.photos} photos</p>
                <Button variant="ghost" className="text-xs h-6 px-2 mt-2 text-red-500" onClick={(event) => { event.stopPropagation(); openDeleteConfirm('classAlbum', album.id); }}><TrashIcon className="w-3 h-3" /></Button>
              </div>
            ))}</div>
            {filteredClassAlbums.length === 0 && <div className="text-center py-8 text-gray-500">No class albums found</div>}
          </TabsContent>

          <TabsContent value="tagging" className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card title="Tag Students in Photos">
                <div className="space-y-4">
                  <Select label="Select Album" value={taggingAlbumId} onChange={(event) => setTaggingAlbumId(event.target.value)} options={[{ value: '', label: 'Choose album...' }, ...albums.map((album) => ({ value: album.id, label: album.name }))]} />
                  <div className="grid grid-cols-3 gap-2">{albumPhotos.slice(0, 6).map((item) => (
                    <button type="button" key={item.id} className="relative aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center hover:ring-2 hover:ring-blue-400 transition-all" onClick={() => openTagPhoto(item)}>
                      <ImageIcon className="w-6 h-6 text-gray-400" />
                      {item.tags.length > 0 && <div className="absolute bottom-1 right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center"><TagIcon className="w-3 h-3 text-white" /></div>}
                    </button>
                  ))}</div>
                  {taggingAlbumId && albumPhotos.length === 0 && <p className="text-xs text-gray-500 text-center">No photos in this album</p>}
                  {!taggingAlbumId && <p className="text-xs text-gray-500 text-center">Select an album to view photos</p>}
                </div>
              </Card>
              <Card title="Tagged Students">
                <div className="space-y-2">{students.filter((student) => student.photoCount > 0).map((student) => (
                  <div key={student.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2"><div className="w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center"><span className="text-xs font-bold text-blue-600">{student.name[0]}</span></div><div><p className="text-sm font-medium text-gray-800">{student.name}</p><p className="text-xs text-gray-400">{student.class}-{student.section}</p></div></div>
                    <span className="text-xs text-gray-500">{student.photoCount} photos</span>
                  </div>
                ))}</div>
                {students.filter((student) => student.photoCount > 0).length === 0 && <div className="text-center py-4 text-gray-500 text-sm">No tagged students yet</div>}
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </Card>

      {modal === 'createAlbum' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4"><h2 className="text-lg font-semibold">Create New Album</h2><button type="button" onClick={closeModal}><XIcon className="w-5 h-5" /></button></div>
            <div className="space-y-4">
              <Input label="Album Name *" placeholder="Enter album name" value={albumForm.name} onChange={(event) => setAlbumForm((prev) => ({ ...prev, name: event.target.value }))} />
              <Select label="Event Type *" value={albumForm.event} onChange={(event) => setAlbumForm((prev) => ({ ...prev, event: event.target.value }))} options={eventOptions} />
              <Select label="Target Class" value={albumForm.class} onChange={(event) => setAlbumForm((prev) => ({ ...prev, class: event.target.value }))} options={classOptions} />
              <Input label="Date *" type="date" value={albumForm.date} onChange={(event) => setAlbumForm((prev) => ({ ...prev, date: event.target.value }))} />
            </div>
            <div className="flex gap-2 mt-6"><Button variant="outline" className="flex-1" onClick={closeModal}>Cancel</Button><Button variant="primary" className="flex-1" onClick={handleCreateAlbum}><FolderIcon className="w-4 h-4 mr-2" />Create Album</Button></div>
          </div>
        </div>
      )}

      {modal === 'editAlbum' && selectedAlbum && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4"><h2 className="text-lg font-semibold">Edit Album</h2><button type="button" onClick={closeModal}><XIcon className="w-5 h-5" /></button></div>
            <div className="space-y-4">
              <Input label="Album Name *" placeholder="Enter album name" value={albumForm.name} onChange={(event) => setAlbumForm((prev) => ({ ...prev, name: event.target.value }))} />
              <Select label="Event Type" value={albumForm.event} onChange={(event) => setAlbumForm((prev) => ({ ...prev, event: event.target.value }))} options={eventOptions} />
              <Select label="Target Class" value={albumForm.class} onChange={(event) => setAlbumForm((prev) => ({ ...prev, class: event.target.value }))} options={classOptions} />
              <Input label="Date" type="date" value={albumForm.date} onChange={(event) => setAlbumForm((prev) => ({ ...prev, date: event.target.value }))} />
            </div>
            <div className="flex gap-2 mt-6"><Button variant="outline" className="flex-1" onClick={closeModal}>Cancel</Button><Button variant="primary" className="flex-1" onClick={handleEditAlbum}>Save Changes</Button></div>
          </div>
        </div>
      )}

      {modal === 'viewAlbum' && selectedAlbum && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4"><h2 className="text-lg font-semibold">{selectedAlbum.name}</h2><button type="button" onClick={closeModal}><XIcon className="w-5 h-5" /></button></div>
            <div className="grid grid-cols-2 gap-4 text-sm mb-4"><div><p className="text-gray-500">Event</p><p className="font-medium">{selectedAlbum.event}</p></div><div><p className="text-gray-500">Date</p><p className="font-medium">{selectedAlbum.date}</p></div><div><p className="text-gray-500">Class</p><p className="font-medium">{selectedAlbum.class}</p></div><div><p className="text-gray-500">Photos</p><p className="font-medium">{selectedAlbum.photos}</p></div></div>
            <div className="grid grid-cols-4 gap-2">{mediaItems.filter((item) => item.albumId === selectedAlbum.id).slice(0, 8).map((item) => <div key={item.id} className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center"><ImageIcon className="w-6 h-6 text-gray-400" /></div>)}</div>
            {mediaItems.filter((item) => item.albumId === selectedAlbum.id).length === 0 && <div className="text-center py-8 text-gray-500">No photos in this album</div>}
            <Button variant="outline" className="w-full mt-4" onClick={closeModal}>Close</Button>
          </div>
        </div>
      )}

      {modal === 'uploadMedia' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4"><h2 className="text-lg font-semibold">Upload Media</h2><button type="button" onClick={closeModal}><XIcon className="w-5 h-5" /></button></div>
            <div className="space-y-4">
              <Select label="Select Album *" value={uploadAlbumId} onChange={(event) => setUploadAlbumId(event.target.value)} options={[{ value: '', label: 'Choose album...' }, ...albums.map((album) => ({ value: album.id, label: album.name }))]} />
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center" onDrop={handleFileDrop} onDragOver={(event) => event.preventDefault()}><ImageIcon className="w-8 h-8 text-gray-300 mx-auto mb-2" /><p className="text-sm text-gray-600">Drag & drop or browse</p><label className="inline-block mt-2"><input type="file" multiple accept="image/*" className="hidden" onChange={handleFileSelect} /><span className="px-3 py-1 text-xs border border-gray-300 rounded cursor-pointer">Browse</span></label></div>
              {uploadedFiles.length > 0 && <p className="text-sm text-gray-600">{uploadedFiles.length} file(s) selected</p>}
            </div>
            <div className="flex gap-2 mt-6"><Button variant="outline" className="flex-1" onClick={closeModal}>Cancel</Button><Button variant="primary" className="flex-1" onClick={handleUploadImages}><UploadIcon className="w-4 h-4 mr-2" />Upload</Button></div>
          </div>
        </div>
      )}

      {modal === 'createClassAlbum' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm">
            <div className="flex items-center justify-between mb-4"><h2 className="text-lg font-semibold">Create Class Album</h2><button type="button" onClick={closeModal}><XIcon className="w-5 h-5" /></button></div>
            <div className="space-y-4">
              <Select label="Class *" value={classAlbumForm.className} onChange={(event) => setClassAlbumForm((prev) => ({ ...prev, className: event.target.value }))} options={[{ value: '', label: 'Select class...' }, ...classOptions.slice(1)]} />
              <Select label="Section *" value={classAlbumForm.section} onChange={(event) => setClassAlbumForm((prev) => ({ ...prev, section: event.target.value }))} options={sectionOptions} />
            </div>
            <div className="flex gap-2 mt-6"><Button variant="outline" className="flex-1" onClick={closeModal}>Cancel</Button><Button variant="primary" className="flex-1" onClick={handleCreateClassAlbum}>Create</Button></div>
          </div>
        </div>
      )}

      {modal === 'viewClassAlbum' && selectedClassAlbum && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4"><h2 className="text-lg font-semibold">{selectedClassAlbum.className}-{selectedClassAlbum.section}</h2><button type="button" onClick={closeModal}><XIcon className="w-5 h-5" /></button></div>
            <div className="grid grid-cols-2 gap-4 text-sm mb-4"><div><p className="text-gray-500">Photos</p><p className="font-medium">{selectedClassAlbum.photos}</p></div><div><p className="text-gray-500">Created</p><p className="font-medium">{selectedClassAlbum.createdAt}</p></div></div>
            <div className="grid grid-cols-3 gap-2">{Array.from({ length: Math.min(selectedClassAlbum.photos, 6) }).map((_, index) => <div key={index} className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center"><ImageIcon className="w-5 h-5 text-gray-400" /></div>)}</div>
            <Button variant="outline" className="w-full mt-4" onClick={closeModal}>Close</Button>
          </div>
        </div>
      )}

      {modal === 'tagPhoto' && selectedPhoto && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4"><h2 className="text-lg font-semibold">Tag Students</h2><button type="button" onClick={closeModal}><XIcon className="w-5 h-5" /></button></div>
            <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center mb-4"><ImageIcon className="w-12 h-12 text-gray-400" /></div>
            <p className="text-sm font-medium text-gray-800 mb-2">{selectedPhoto.name}</p>
            <Input placeholder="Search students..." leftIcon={<SearchIcon className="w-4 h-4 text-gray-400" />} value={studentSearch} onChange={(event) => setStudentSearch(event.target.value)} className="mb-3" />
            <div className="space-y-2 max-h-48 overflow-y-auto">{filteredStudents.map((student) => (
              <button type="button" key={student.id} className={`w-full flex items-center justify-between p-2 rounded-lg ${selectedStudentIds.includes(student.id) ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50 hover:bg-gray-100'}`} onClick={() => handleTagStudent(student.id)}>
                <div className="flex items-center gap-2"><div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center"><span className="text-xs font-bold text-blue-600">{student.name[0]}</span></div><div className="text-left"><p className="text-sm font-medium text-gray-800">{student.name}</p><p className="text-xs text-gray-400">{student.class}-{student.section}</p></div></div>
                {selectedStudentIds.includes(student.id) && <CheckCircleIcon className="w-4 h-4 text-blue-500" />}
              </button>
            ))}</div>
            <p className="text-xs text-gray-500 mt-2">{selectedStudentIds.length} student(s) selected</p>
            <div className="flex gap-2 mt-4"><Button variant="outline" className="flex-1" onClick={closeModal}>Cancel</Button><Button variant="primary" className="flex-1" onClick={handleSaveTags}><TagIcon className="w-4 h-4 mr-2" />Save Tags</Button></div>
          </div>
        </div>
      )}

      {modal === 'deleteConfirm' && deleteTarget && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4"><TrashIcon className="w-6 h-6 text-red-600" /></div>
            <h2 className="text-lg font-semibold text-gray-900">Delete {deleteTarget.type === 'album' ? 'Album' : 'Class Album'}</h2>
            <p className="text-sm text-gray-500 mt-2">Are you sure? This action cannot be undone.</p>
            <div className="flex gap-2 mt-6"><Button variant="outline" className="flex-1" onClick={closeModal}>Cancel</Button><Button variant="danger" className="flex-1" onClick={handleDeleteAlbum}>Delete</Button></div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MediaGalleryManagement;
