import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import {
  SearchIcon, SendIcon, PlusIcon, CheckCheckIcon, CheckIcon, PhoneIcon, VideoIcon, MoreVerticalIcon,
  ArrowLeftIcon, UserIcon, UsersIcon, PaperclipIcon, SmileIcon, XIcon, ChevronDownIcon, UploadIcon,
  FileIcon, ImageIcon, FileTextIcon, MegaphoneIcon, RadioIcon, UserPlusIcon, EditIcon, TrashIcon,
  BellIcon, ChevronRightIcon,
} from 'lucide-react';

interface Attachment { id: string; name: string; size: number; type: string }
interface Branch { id: string; name: string }
interface Batch { id: string; name: string; branch: string }
interface Contact {
  id: string; name: string; role: 'parent' | 'staff'; avatar: string; lastMessage: string;
  lastTime: string; unread: number; online: boolean; subtitle: string; branch: string; batch: string;
}
interface Message {
  id: string; senderId: string; senderName?: string; text: string; time: string;
  status: 'sent' | 'delivered' | 'read'; attachments?: Attachment[];
}
interface Group {
  id: string; name: string; description: string; avatar: string; members: string[]; admins: string[];
  createdAt: string; lastMessage: string; lastTime: string; unread: number; type: 'group';
}
interface Broadcast {
  id: string; name: string; description: string; recipients: string[]; createdAt: string;
  lastMessage: string; lastTime: string; messageCount: number; type: 'broadcast';
}
interface Student { id: string; name: string; class: string; branch: string; batch: string }
interface Staff { id: string; name: string; department: string; branch: string; batch: string; role: string }
type ChatItem = Contact | Group | Broadcast;
type ConversationType = 'direct' | 'group' | 'broadcast';

const branches: Branch[] = [
  { id: 'BR001', name: 'Main Campus' }, { id: 'BR002', name: 'North Branch' },
  { id: 'BR003', name: 'South Branch' }, { id: 'BR004', name: 'East Wing' }, { id: 'BR005', name: 'West Campus' },
];
const batches: Batch[] = [
  { id: 'BT001', name: 'Morning Batch A', branch: 'BR001' }, { id: 'BT002', name: 'Morning Batch B', branch: 'BR001' },
  { id: 'BT003', name: 'Afternoon Batch', branch: 'BR001' }, { id: 'BT004', name: 'Evening Batch', branch: 'BR001' },
  { id: 'BT005', name: 'Morning Batch', branch: 'BR002' }, { id: 'BT006', name: 'Afternoon Batch', branch: 'BR002' },
  { id: 'BT007', name: 'Morning Batch', branch: 'BR003' }, { id: 'BT008', name: 'Evening Batch', branch: 'BR003' },
  { id: 'BT009', name: 'Full Day Batch', branch: 'BR004' }, { id: 'BT010', name: 'Weekend Batch', branch: 'BR005' },
];
const students: Student[] = [
  { id: 'STU001', name: 'Arjun Sharma', class: 'Class 10', branch: 'BR001', batch: 'BT001' },
  { id: 'STU002', name: 'Priya Patel', class: 'Class 10', branch: 'BR001', batch: 'BT001' },
  { id: 'STU003', name: 'Rohan Mehta', class: 'Class 9', branch: 'BR001', batch: 'BT002' },
  { id: 'STU004', name: 'Ananya Singh', class: 'Class 9', branch: 'BR001', batch: 'BT002' },
  { id: 'STU005', name: 'Vikram Kumar', class: 'Class 8', branch: 'BR001', batch: 'BT003' },
  { id: 'STU006', name: 'Sneha Gupta', class: 'Class 8', branch: 'BR001', batch: 'BT003' },
  { id: 'STU007', name: 'Rahul Verma', class: 'Class 7', branch: 'BR001', batch: 'BT004' },
  { id: 'STU008', name: 'Kavya Reddy', class: 'Class 10', branch: 'BR002', batch: 'BT005' },
  { id: 'STU009', name: 'Aditya Nair', class: 'Class 9', branch: 'BR002', batch: 'BT005' },
  { id: 'STU010', name: 'Meera Iyer', class: 'Class 8', branch: 'BR002', batch: 'BT006' },
  { id: 'STU011', name: 'Sanjay Rao', class: 'Class 10', branch: 'BR003', batch: 'BT007' },
  { id: 'STU012', name: 'Divya Menon', class: 'Class 9', branch: 'BR003', batch: 'BT007' },
  { id: 'STU013', name: 'Karthik Pillai', class: 'Class 8', branch: 'BR003', batch: 'BT008' },
  { id: 'STU014', name: 'Lakshmi Das', class: 'Class 10', branch: 'BR004', batch: 'BT009' },
  { id: 'STU015', name: 'Nikhil Joshi', class: 'Class 9', branch: 'BR005', batch: 'BT010' },
];
const staffMembers: Staff[] = [
  { id: 'EMP001', name: 'Dr. Rajesh Kumar', department: 'Mathematics', branch: 'BR001', batch: 'BT001', role: 'HOD' },
  { id: 'EMP002', name: 'Mrs. Priya Sharma', department: 'English', branch: 'BR001', batch: 'BT001', role: 'Teacher' },
  { id: 'EMP003', name: 'Mr. Amit Singh', department: 'Science', branch: 'BR001', batch: 'BT002', role: 'Teacher' },
  { id: 'EMP004', name: 'Ms. Sunita Verma', department: 'Hindi', branch: 'BR001', batch: 'BT002', role: 'Teacher' },
  { id: 'EMP005', name: 'Mr. Ravi Patel', department: 'Social Studies', branch: 'BR001', batch: 'BT003', role: 'Teacher' },
  { id: 'EMP006', name: 'Mrs. Anita Gupta', department: 'Computer Science', branch: 'BR001', batch: 'BT004', role: 'Teacher' },
  { id: 'EMP007', name: 'Dr. Sanjay Mehta', department: 'Physics', branch: 'BR002', batch: 'BT005', role: 'HOD' },
  { id: 'EMP008', name: 'Ms. Kavitha Nair', department: 'Chemistry', branch: 'BR002', batch: 'BT006', role: 'Teacher' },
  { id: 'EMP009', name: 'Mr. Suresh Reddy', department: 'Biology', branch: 'BR003', batch: 'BT007', role: 'Teacher' },
  { id: 'EMP010', name: 'Mrs. Lakshmi Iyer', department: 'Mathematics', branch: 'BR003', batch: 'BT008', role: 'Teacher' },
  { id: 'EMP011', name: 'Mr. Vikram Rao', department: 'Administration', branch: 'BR004', batch: 'BT009', role: 'Admin' },
  { id: 'EMP012', name: 'Ms. Divya Menon', department: 'Physical Education', branch: 'BR005', batch: 'BT010', role: 'Teacher' },
];
const contacts: Contact[] = [
  { id: 'c1', name: 'Mrs. Priya Sharma', role: 'parent', avatar: 'PS', lastMessage: "Thank you for the update on Rahul's progress.", lastTime: '10:32 AM', unread: 2, online: true, subtitle: 'Parent of Rahul Sharma (Class 8-A)', branch: 'BR001', batch: 'BT001' },
  { id: 'c2', name: 'Mr. Anil Patel', role: 'parent', avatar: 'AP', lastMessage: 'Can we schedule a meeting this week?', lastTime: '9:15 AM', unread: 1, online: false, subtitle: 'Parent of Sneha Patel (Class 10-B)', branch: 'BR001', batch: 'BT002' },
  { id: 'c3', name: 'Mrs. Kavita Verma', role: 'parent', avatar: 'KV', lastMessage: 'Noted, I will ensure she submits the form.', lastTime: 'Yesterday', unread: 0, online: false, subtitle: 'Parent of Anjali Verma (Class 7-C)', branch: 'BR001', batch: 'BT003' },
  { id: 'c4', name: 'Mr. Suresh Kumar', role: 'staff', avatar: 'SK', lastMessage: 'The lab is booked for Thursday.', lastTime: 'Yesterday', unread: 0, online: true, subtitle: 'Physical Education Teacher', branch: 'BR001', batch: 'BT001' },
  { id: 'c5', name: 'Ms. Deepa Nair', role: 'staff', avatar: 'DN', lastMessage: "I've updated the attendance sheet.", lastTime: 'Mon', unread: 0, online: true, subtitle: 'Hindi Teacher', branch: 'BR002', batch: 'BT005' },
  { id: 'c6', name: 'Mr. Rajesh Mehta', role: 'parent', avatar: 'RM', lastMessage: 'Please share the exam schedule.', lastTime: 'Mon', unread: 0, online: false, subtitle: 'Parent of Arjun Mehta (Class 9-A)', branch: 'BR002', batch: 'BT005' },
  { id: 'c7', name: 'Mrs. Anita Joshi', role: 'staff', avatar: 'AJ', lastMessage: 'The art supplies have arrived.', lastTime: 'Sun', unread: 0, online: false, subtitle: 'Art & Craft Teacher', branch: 'BR003', batch: 'BT007' },
  { id: 'c8', name: 'Mr. Vikram Singh', role: 'parent', avatar: 'VS', lastMessage: 'Thank you for the clarification.', lastTime: 'Fri', unread: 0, online: false, subtitle: 'Parent of Pooja Singh (Class 11-A)', branch: 'BR003', batch: 'BT008' },
  { id: 'c9', name: 'Dr. Sanjay Mehta', role: 'staff', avatar: 'SM', lastMessage: 'Physics lab schedule updated.', lastTime: 'Thu', unread: 0, online: true, subtitle: 'Physics HOD', branch: 'BR002', batch: 'BT006' },
  { id: 'c10', name: 'Mrs. Lakshmi Das', role: 'parent', avatar: 'LD', lastMessage: 'Thank you for the information.', lastTime: 'Wed', unread: 0, online: false, subtitle: 'Parent of Kiran Das (Class 10)', branch: 'BR004', batch: 'BT009' },
  { id: 'c11', name: 'Mr. Nikhil Joshi', role: 'parent', avatar: 'NJ', lastMessage: 'Will send the documents tomorrow.', lastTime: 'Tue', unread: 0, online: false, subtitle: 'Parent of Rahul Joshi (Class 9)', branch: 'BR005', batch: 'BT010' },
];
const initialGroups: Group[] = [
  { id: 'g1', name: 'Class 10-A Parents', description: 'Group for all Class 10-A parents', avatar: 'CX', members: ['c1', 'c2', 'c4'], admins: ['me'], createdAt: '2024-01-15', lastMessage: 'Exam schedule has been shared.', lastTime: '11:00 AM', unread: 3, type: 'group' },
  { id: 'g2', name: 'Science Department', description: 'Science department staff coordination', avatar: 'SD', members: ['c4', 'c5', 'c9'], admins: ['me', 'c9'], createdAt: '2024-01-10', lastMessage: 'Lab equipment maintenance scheduled.', lastTime: 'Yesterday', unread: 0, type: 'group' },
];
const initialBroadcasts: Broadcast[] = [
  { id: 'br1', name: 'All Parents - Main Campus', description: 'Broadcast list for all Main Campus parents', recipients: ['c1', 'c2', 'c3', 'c6'], createdAt: '2024-01-20', lastMessage: 'PTM scheduled for next Saturday.', lastTime: '2:00 PM', messageCount: 12, type: 'broadcast' },
  { id: 'br2', name: 'All Staff', description: 'Broadcast list for all staff members', recipients: ['c4', 'c5', 'c7', 'c9'], createdAt: '2024-01-18', lastMessage: 'Staff meeting tomorrow at 9 AM.', lastTime: 'Yesterday', messageCount: 8, type: 'broadcast' },
];
const initialMessages: Record<string, Message[]> = {
  c1: [
    { id: 'm1', senderId: 'c1', text: "Hello, I wanted to check on Rahul's recent test performance.", time: '10:15 AM', status: 'read' },
    { id: 'm2', senderId: 'me', text: 'Hi Mrs. Sharma! Rahul scored 78% in the recent Math test.', time: '10:18 AM', status: 'read' },
    { id: 'm3', senderId: 'c1', text: "That's wonderful to hear! We have been practicing at home.", time: '10:20 AM', status: 'read' },
    { id: 'm4', senderId: 'me', text: 'It definitely shows. Please encourage him to focus on geometry.', time: '10:25 AM', status: 'read' },
    { id: 'm5', senderId: 'c1', text: "Thank you for the update on Rahul's progress.", time: '10:32 AM', status: 'read' },
    { id: 'm6', senderId: 'c1', text: 'Also, can you share the study material for the next chapter?', time: '10:32 AM', status: 'delivered' },
  ],
  c2: [
    { id: 'm1', senderId: 'c2', text: "Good morning! I wanted to discuss Sneha's attendance.", time: '9:00 AM', status: 'read' },
    { id: 'm2', senderId: 'me', text: 'Good morning Mr. Patel. Sneha has been absent for 3 days this month.', time: '9:05 AM', status: 'read' },
    { id: 'm3', senderId: 'c2', text: 'She was unwell. I have the medical certificate.', time: '9:10 AM', status: 'read' },
    { id: 'm4', senderId: 'c2', text: 'Can we schedule a meeting this week?', time: '9:15 AM', status: 'delivered' },
  ],
  c4: [
    { id: 'm1', senderId: 'me', text: 'Hi Suresh, is the sports ground available on Wednesday?', time: 'Yesterday 2:00 PM', status: 'read' },
    { id: 'm2', senderId: 'c4', text: "Wednesday is occupied till 3 PM. After that it's free.", time: 'Yesterday 2:15 PM', status: 'read' },
    { id: 'm3', senderId: 'me', text: "Perfect. We'll schedule it from 3:30 PM then.", time: 'Yesterday 2:20 PM', status: 'read' },
    { id: 'm4', senderId: 'c4', text: 'The lab is booked for Thursday.', time: 'Yesterday 3:00 PM', status: 'read' },
  ],
  g1: [
    { id: 'gm1', senderId: 'c1', senderName: 'Mrs. Priya Sharma', text: 'Hello everyone! When is the next PTM?', time: '10:00 AM', status: 'read' },
    { id: 'gm2', senderId: 'me', senderName: 'You', text: 'PTM is scheduled for next Saturday, 9 AM to 1 PM.', time: '10:05 AM', status: 'read' },
    { id: 'gm3', senderId: 'c2', senderName: 'Mr. Anil Patel', text: 'Thank you for the info!', time: '10:10 AM', status: 'read' },
    { id: 'gm4', senderId: 'me', senderName: 'You', text: 'Exam schedule has been shared.', time: '11:00 AM', status: 'delivered' },
  ],
  g2: [
    { id: 'gm1', senderId: 'c9', senderName: 'Dr. Sanjay Mehta', text: 'Team, please update the lab inventory by Friday.', time: 'Yesterday 9:00 AM', status: 'read' },
    { id: 'gm2', senderId: 'me', senderName: 'You', text: 'Sure, will do it by Thursday.', time: 'Yesterday 9:30 AM', status: 'read' },
    { id: 'gm3', senderId: 'c4', senderName: 'Mr. Suresh Kumar', text: 'Lab equipment maintenance scheduled.', time: 'Yesterday 11:00 AM', status: 'read' },
  ],
  br1: [
    { id: 'brm1', senderId: 'me', text: 'Dear Parents, PTM is scheduled for next Saturday.', time: '2:00 PM', status: 'read' },
    { id: 'brm2', senderId: 'me', text: "Please carry your ward's report card.", time: '2:01 PM', status: 'delivered' },
  ],
  br2: [
    { id: 'brm1', senderId: 'me', text: 'Staff meeting tomorrow at 9 AM in the conference room.', time: 'Yesterday 4:00 PM', status: 'read' },
    { id: 'brm2', senderId: 'me', text: 'Please bring your performance reports.', time: 'Yesterday 4:01 PM', status: 'read' },
  ],
};
const avatarColors: Record<string, string> = {
  PS: 'bg-pink-500', AP: 'bg-blue-500', KV: 'bg-purple-500', SK: 'bg-teal-500', DN: 'bg-orange-500',
  RM: 'bg-indigo-500', AJ: 'bg-rose-500', VS: 'bg-green-500', SM: 'bg-cyan-500', LD: 'bg-amber-500',
  NJ: 'bg-lime-500', CX: 'bg-violet-500', SD: 'bg-emerald-500',
};
const groupAvatarBg = 'bg-gradient-to-br from-violet-500 to-purple-600';
const broadcastAvatarBg = 'bg-gradient-to-br from-orange-500 to-amber-600';

interface MultiSelectDropdownProps {
  label: string;
  options: Array<{ value: string; label: string; subtitle?: string }>;
  selectedValues: string[];
  onChange: (values: string[]) => void;
  placeholder: string;
  disabled?: boolean;
  searchable?: boolean;
}

const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({
  label, options, selectedValues, onChange, placeholder, disabled = false, searchable = true,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const filtered = options.filter((o) =>
    o.label.toLowerCase().includes(search.toLowerCase()) ||
    (o.subtitle && o.subtitle.toLowerCase().includes(search.toLowerCase())),
  );
  const toggle = (val: string) => {
    onChange(selectedValues.includes(val) ? selectedValues.filter((v) => v !== val) : [...selectedValues, val]);
  };
  return (
    <div className="relative">
      {label && <label className="mb-1 block text-sm font-medium text-gray-700">{label}</label>}
      <div
        className={`flex min-h-[42px] w-full cursor-pointer items-center justify-between rounded-lg border bg-white px-3 py-2 hover:border-gray-400 ${disabled ? 'cursor-not-allowed bg-gray-100 opacity-60' : ''}`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <div className="flex flex-1 flex-wrap items-center gap-1">
          {selectedValues.length > 0 ? (
            selectedValues.length <= 2 ? selectedValues.map((val) => (
              <span key={val} className="inline-flex items-center rounded bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
                {options.find((o) => o.value === val)?.label}
                <XIcon className="ml-1 h-3 w-3 cursor-pointer hover:text-blue-600" onClick={(e) => { e.stopPropagation(); toggle(val); }} />
              </span>
            )) : <span className="text-sm text-gray-700">{selectedValues.length} selected</span>
          ) : <span className="text-sm text-gray-500">{placeholder}</span>}
        </div>
        <ChevronDownIcon className={`h-4 w-4 flex-shrink-0 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>
      {isOpen && !disabled && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute z-20 mt-1 max-h-64 w-full overflow-hidden rounded-lg border bg-white shadow-lg">
            {searchable && (
              <div className="border-b p-2">
                <input type="text" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded border px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500" onClick={(e) => e.stopPropagation()} />
              </div>
            )}
            <div className="flex justify-between border-b bg-gray-50 px-3 py-2 text-xs">
              <button type="button" className="font-medium text-blue-600 hover:underline" onClick={() => onChange(options.map((o) => o.value))}>Select All</button>
              <button type="button" className="font-medium text-gray-500 hover:underline" onClick={() => onChange([])}>Clear All</button>
            </div>
            <div className="max-h-44 overflow-y-auto">
              {filtered.length === 0 ? (
                <div className="px-3 py-4 text-center text-sm text-gray-500">No options found</div>
              ) : filtered.map((o) => (
                <label key={o.value} className="flex cursor-pointer items-center gap-3 px-3 py-2 hover:bg-gray-50">
                  <input type="checkbox" checked={selectedValues.includes(o.value)} onChange={() => toggle(o.value)} className="h-4 w-4 rounded text-blue-600" />
                  <div>
                    <span className="text-sm text-gray-700">{o.label}</span>
                    {o.subtitle && <span className="ml-2 text-xs text-gray-400">{o.subtitle}</span>}
                  </div>
                </label>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const AttachmentUploader: React.FC<{
  attachments: Attachment[]; onAdd: (files: Attachment[]) => void; onRemove: (id: string) => void; maxFiles?: number; maxSizeMB?: number;
}> = ({ attachments, onAdd, onRemove, maxFiles = 5, maxSizeMB = 10 }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const next: Attachment[] = [];
    Array.from(files).forEach((file) => {
      if (attachments.length + next.length >= maxFiles) return;
      if (file.size > maxSizeMB * 1024 * 1024) return;
      next.push({ id: `ATT-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`, name: file.name, size: file.size, type: file.type });
    });
    if (next.length > 0) onAdd(next);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };
  const formatSize = (bytes: number) => bytes < 1024 ? `${bytes} B` : bytes < 1024 * 1024 ? `${(bytes / 1024).toFixed(1)} KB` : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  const getFileIcon = (type: string) => type.startsWith('image/') ? <ImageIcon className="h-4 w-4 text-green-500" /> : type.includes('pdf') ? <FileTextIcon className="h-4 w-4 text-red-500" /> : <FileIcon className="h-4 w-4 text-blue-500" />;
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">Attachments</label>
      <div className="rounded-lg border-2 border-dashed border-gray-300 p-4 transition-colors hover:border-blue-400">
        <input ref={fileInputRef} type="file" multiple onChange={handleFileSelect} className="hidden" accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.gif" />
        <div className="text-center">
          <UploadIcon className="mx-auto mb-2 h-8 w-8 text-gray-400" />
          <button type="button" onClick={() => fileInputRef.current?.click()} className="text-sm font-medium text-blue-600 hover:text-blue-800">Click to upload</button>
          <p className="mt-1 text-xs text-gray-400">Max {maxFiles} files, up to {maxSizeMB}MB each</p>
        </div>
      </div>
      {attachments.length > 0 && (
        <div className="space-y-2">
          {attachments.map((att) => (
            <div key={att.id} className="flex items-center justify-between rounded-lg bg-gray-50 p-2">
              <div className="flex items-center gap-2">{getFileIcon(att.type)}<div><p className="max-w-[200px] truncate text-sm font-medium text-gray-700">{att.name}</p><p className="text-xs text-gray-400">{formatSize(att.size)}</p></div></div>
              <button type="button" onClick={() => onRemove(att.id)} className="rounded p-1 hover:bg-gray-200"><XIcon className="h-4 w-4 text-gray-500" /></button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const CreateGroupModal: React.FC<{ onClose: () => void; onCreateGroup: (group: Group) => void }> = ({ onClose, onCreateGroup }) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [selectedAdmins, setSelectedAdmins] = useState<string[]>([]);
  const [memberBranches, setMemberBranches] = useState<string[]>([]);
  const [memberBatches, setMemberBatches] = useState<string[]>([]);
  const [memberRoleFilter, setMemberRoleFilter] = useState<'all' | 'parents' | 'staff'>('all');
  const filteredBatchesForGroup = useMemo(() => memberBranches.length === 0 ? batches : batches.filter((b) => memberBranches.includes(b.branch)), [memberBranches]);
  const filteredMemberOptions = useMemo(() => {
    let filtered = contacts;
    if (memberBranches.length > 0) filtered = filtered.filter((c) => memberBranches.includes(c.branch));
    if (memberBatches.length > 0) filtered = filtered.filter((c) => memberBatches.includes(c.batch));
    if (memberRoleFilter === 'parents') filtered = filtered.filter((c) => c.role === 'parent');
    if (memberRoleFilter === 'staff') filtered = filtered.filter((c) => c.role === 'staff');
    return filtered.map((c) => ({ value: c.id, label: c.name, subtitle: `${c.role === 'parent' ? 'Parent' : 'Staff'} • ${branches.find((b) => b.id === c.branch)?.name}` }));
  }, [memberBranches, memberBatches, memberRoleFilter]);
  const adminOptions = contacts.filter((c) => selectedMembers.includes(c.id)).map((c) => ({ value: c.id, label: c.name, subtitle: c.role }));
  const handleCreate = () => {
    if (!groupName.trim() || selectedMembers.length === 0) return;
    onCreateGroup({
      id: `g${Date.now()}`, name: groupName.trim(), description: groupDescription.trim(),
      avatar: groupName.slice(0, 2).toUpperCase(), members: selectedMembers, admins: ['me', ...selectedAdmins],
      createdAt: new Date().toISOString().split('T')[0], lastMessage: 'Group created',
      lastTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), unread: 0, type: 'group',
    });
    onClose();
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-100 p-5">
          <div className="flex items-center gap-2"><UsersIcon className="h-5 w-5 text-violet-600" /><h3 className="text-lg font-semibold text-gray-900">Create New Group</h3></div>
          <button type="button" onClick={onClose} className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100"><XIcon className="h-5 w-5" /></button>
        </div>
        <div className="flex items-center border-b border-gray-100 bg-gray-50 px-5 py-3">
          {[1, 2].map((s) => (
            <React.Fragment key={s}>
              <div className={`flex items-center gap-2 ${step >= s ? 'text-violet-600' : 'text-gray-400'}`}>
                <div className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${step >= s ? 'bg-violet-600 text-white' : 'bg-gray-200 text-gray-500'}`}>{s}</div>
                <span className="text-sm font-medium">{s === 1 ? 'Group Details' : 'Add Members'}</span>
              </div>
              {s < 2 && <ChevronRightIcon className="mx-3 h-4 w-4 text-gray-300" />}
            </React.Fragment>
          ))}
        </div>
        <div className="space-y-4 p-5">
          {step === 1 ? (
            <>
              <div className="flex justify-center">
                <div className={`flex h-16 w-16 items-center justify-center rounded-full text-xl font-bold text-white ${groupAvatarBg}`}>
                  {groupName ? groupName.slice(0, 2).toUpperCase() : <UsersIcon className="h-7 w-7" />}
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Group Name *</label>
                <input type="text" value={groupName} onChange={(e) => setGroupName(e.target.value)} placeholder="Enter group name..." maxLength={50} className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Description</label>
                <textarea value={groupDescription} onChange={(e) => setGroupDescription(e.target.value)} placeholder="What is this group about?" rows={3} maxLength={200} className="w-full resize-none rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
              </div>
            </>
          ) : (
            <>
              <div className="space-y-3 rounded-xl border border-violet-100 bg-violet-50 p-4">
                <p className="flex items-center gap-2 text-sm font-semibold text-violet-700"><UsersIcon className="h-4 w-4" /> Filter Members</p>
                <div className="flex gap-2">
                  {[{ value: 'all', label: 'All' }, { value: 'parents', label: 'Parents' }, { value: 'staff', label: 'Staff' }].map((opt) => (
                    <button key={opt.value} type="button" onClick={() => setMemberRoleFilter(opt.value as 'all' | 'parents' | 'staff')}
                      className={`rounded-lg px-3 py-1.5 text-xs font-medium ${memberRoleFilter === opt.value ? 'bg-violet-600 text-white' : 'border border-gray-200 bg-white text-gray-600'}`}>{opt.label}</button>
                  ))}
                </div>
                <MultiSelectDropdown label="Filter by Branch" options={branches.map((b) => ({ value: b.id, label: b.name }))} selectedValues={memberBranches} onChange={(vals) => { setMemberBranches(vals); setMemberBatches([]); }} placeholder="All branches..." />
                <MultiSelectDropdown label="Filter by Batch" options={filteredBatchesForGroup.map((b) => ({ value: b.id, label: b.name, subtitle: branches.find((br) => br.id === b.branch)?.name }))} selectedValues={memberBatches} onChange={setMemberBatches} placeholder="All batches..." disabled={memberBranches.length === 0} />
              </div>
              <MultiSelectDropdown label={`Add Members * (${filteredMemberOptions.length} available)`} options={filteredMemberOptions} selectedValues={selectedMembers} onChange={(vals) => { setSelectedMembers(vals); setSelectedAdmins((prev) => prev.filter((a) => vals.includes(a))); }} placeholder="Search and select members..." />
              {selectedMembers.length > 0 && (
                <MultiSelectDropdown label="Assign Admins (Optional)" options={adminOptions} selectedValues={selectedAdmins} onChange={setSelectedAdmins} placeholder="Select admins from members..." />
              )}
            </>
          )}
          <div className="flex justify-between border-t border-gray-100 pt-4">
            {step === 1 ? (
              <>
                <button type="button" onClick={onClose} className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50">Cancel</button>
                <button type="button" disabled={!groupName.trim()} onClick={() => setStep(2)} className={`rounded-lg px-4 py-2 text-sm font-medium ${groupName.trim() ? 'bg-violet-600 text-white hover:bg-violet-700' : 'cursor-not-allowed bg-gray-200 text-gray-400'}`}>Next: Add Members</button>
              </>
            ) : (
              <>
                <button type="button" onClick={() => setStep(1)} className="flex items-center gap-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50"><ArrowLeftIcon className="h-4 w-4" /> Back</button>
                <button type="button" disabled={selectedMembers.length === 0} onClick={handleCreate} className={`flex items-center rounded-lg px-4 py-2 text-sm font-medium ${selectedMembers.length > 0 ? 'bg-violet-600 text-white hover:bg-violet-700' : 'cursor-not-allowed bg-gray-200 text-gray-400'}`}><UsersIcon className="mr-2 h-4 w-4" />Create Group</button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const CreateBroadcastModal: React.FC<{ onClose: () => void; onCreateBroadcast: (broadcast: Broadcast) => void }> = ({ onClose, onCreateBroadcast }) => {
  const [broadcastName, setBroadcastName] = useState('');
  const [broadcastDescription, setBroadcastDescription] = useState('');
  const [selectedRecipients, setSelectedRecipients] = useState<string[]>([]);
  const [filterMode, setFilterMode] = useState<'manual' | 'auto'>('manual');
  const [manualBranches, setManualBranches] = useState<string[]>([]);
  const [manualBatches, setManualBatches] = useState<string[]>([]);
  const [manualRoleFilter, setManualRoleFilter] = useState<'all' | 'parents' | 'staff'>('all');
  const [autoBranches, setAutoBranches] = useState<string[]>([]);
  const [autoBatches, setAutoBatches] = useState<string[]>([]);
  const [recipientType, setRecipientType] = useState<'all' | 'parents' | 'staff'>('all');
  const filteredBatchesForManual = useMemo(() => manualBranches.length === 0 ? batches : batches.filter((b) => manualBranches.includes(b.branch)), [manualBranches]);
  const filteredBatchesForAuto = useMemo(() => autoBranches.length === 0 ? batches : batches.filter((b) => autoBranches.includes(b.branch)), [autoBranches]);
  const manualFilteredContacts = useMemo(() => {
    let filtered = contacts;
    if (manualBranches.length > 0) filtered = filtered.filter((c) => manualBranches.includes(c.branch));
    if (manualBatches.length > 0) filtered = filtered.filter((c) => manualBatches.includes(c.batch));
    if (manualRoleFilter === 'parents') filtered = filtered.filter((c) => c.role === 'parent');
    if (manualRoleFilter === 'staff') filtered = filtered.filter((c) => c.role === 'staff');
    return filtered.map((c) => ({ value: c.id, label: c.name, subtitle: `${c.role === 'parent' ? 'Parent' : 'Staff'} • ${branches.find((b) => b.id === c.branch)?.name}` }));
  }, [manualBranches, manualBatches, manualRoleFilter]);
  const computedAutoRecipients = useMemo(() => {
    let filtered = contacts;
    if (autoBranches.length > 0) filtered = filtered.filter((c) => autoBranches.includes(c.branch));
    if (autoBatches.length > 0) filtered = filtered.filter((c) => autoBatches.includes(c.batch));
    if (recipientType === 'parents') filtered = filtered.filter((c) => c.role === 'parent');
    if (recipientType === 'staff') filtered = filtered.filter((c) => c.role === 'staff');
    return filtered.map((c) => c.id);
  }, [autoBranches, autoBatches, recipientType]);
  const finalRecipients = filterMode === 'manual' ? selectedRecipients : computedAutoRecipients;
  const handleCreate = () => {
    if (!broadcastName.trim() || finalRecipients.length === 0) return;
    onCreateBroadcast({
      id: `br${Date.now()}`, name: broadcastName.trim(), description: broadcastDescription.trim(),
      recipients: finalRecipients, createdAt: new Date().toISOString().split('T')[0], lastMessage: '', lastTime: '', messageCount: 0, type: 'broadcast',
    });
    onClose();
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-100 p-5">
          <div className="flex items-center gap-2"><RadioIcon className="h-5 w-5 text-orange-500" /><h3 className="text-lg font-semibold text-gray-900">Create Broadcast List</h3></div>
          <button type="button" onClick={onClose} className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100"><XIcon className="h-5 w-5" /></button>
        </div>
        <div className="space-y-4 p-5">
          <div className="flex gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3"><BellIcon className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-600" /><p className="text-xs text-amber-700">Messages sent to a broadcast list are delivered individually. Recipients cannot see each other.</p></div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Broadcast Name *</label>
            <input type="text" value={broadcastName} onChange={(e) => setBroadcastName(e.target.value)} placeholder="e.g., All Class 10 Parents" maxLength={50} className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Description</label>
            <input type="text" value={broadcastDescription} onChange={(e) => setBroadcastDescription(e.target.value)} placeholder="Brief description of this broadcast list..." maxLength={100} className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            {[{ value: 'manual', label: 'Manual Selection', desc: 'Pick contacts individually with filters' }, { value: 'auto', label: 'Filter-based', desc: 'Auto-select by branch/batch/role' }].map((opt) => (
              <button key={opt.value} type="button" onClick={() => setFilterMode(opt.value as 'manual' | 'auto')} className={`rounded-xl border-2 p-3 text-left ${filterMode === opt.value ? 'border-orange-500 bg-orange-50' : 'border-gray-200'}`}>
                <p className={`text-sm font-medium ${filterMode === opt.value ? 'text-orange-700' : 'text-gray-700'}`}>{opt.label}</p>
                <p className="mt-0.5 text-xs text-gray-500">{opt.desc}</p>
              </button>
            ))}
          </div>
          {filterMode === 'manual' ? (
            <div className="space-y-3">
              <div className="space-y-3 rounded-xl border border-orange-100 bg-orange-50 p-4">
                <div className="flex gap-2">
                  {[{ value: 'all', label: 'All' }, { value: 'parents', label: 'Parents' }, { value: 'staff', label: 'Staff' }].map((opt) => (
                    <button key={opt.value} type="button" onClick={() => setManualRoleFilter(opt.value as 'all' | 'parents' | 'staff')} className={`rounded-lg px-3 py-1.5 text-xs font-medium ${manualRoleFilter === opt.value ? 'bg-orange-500 text-white' : 'border border-gray-200 bg-white text-gray-600'}`}>{opt.label}</button>
                  ))}
                </div>
                <MultiSelectDropdown label="Filter by Branch" options={branches.map((b) => ({ value: b.id, label: b.name }))} selectedValues={manualBranches} onChange={(vals) => { setManualBranches(vals); setManualBatches([]); setSelectedRecipients([]); }} placeholder="All branches..." />
                <MultiSelectDropdown label="Filter by Batch" options={filteredBatchesForManual.map((b) => ({ value: b.id, label: b.name, subtitle: branches.find((br) => br.id === b.branch)?.name }))} selectedValues={manualBatches} onChange={(vals) => { setManualBatches(vals); setSelectedRecipients([]); }} placeholder="All batches..." disabled={manualBranches.length === 0} />
              </div>
              <MultiSelectDropdown label={`Select Recipients * (${manualFilteredContacts.length} available)`} options={manualFilteredContacts} selectedValues={selectedRecipients} onChange={setSelectedRecipients} placeholder="Search and select contacts..." />
            </div>
          ) : (
            <div className="space-y-3 rounded-lg bg-gray-50 p-3">
              <div className="flex gap-2">
                {[{ value: 'all', label: 'All' }, { value: 'parents', label: 'Parents Only' }, { value: 'staff', label: 'Staff Only' }].map((opt) => (
                  <button key={opt.value} type="button" onClick={() => setRecipientType(opt.value as 'all' | 'parents' | 'staff')} className={`rounded-lg px-3 py-1.5 text-xs font-medium ${recipientType === opt.value ? 'bg-orange-500 text-white' : 'border border-gray-200 bg-white text-gray-600'}`}>{opt.label}</button>
                ))}
              </div>
              <MultiSelectDropdown label="Filter by Branch" options={branches.map((b) => ({ value: b.id, label: b.name }))} selectedValues={autoBranches} onChange={(vals) => { setAutoBranches(vals); setAutoBatches([]); }} placeholder="All branches..." />
              <MultiSelectDropdown label="Filter by Batch" options={filteredBatchesForAuto.map((b) => ({ value: b.id, label: b.name, subtitle: branches.find((br) => br.id === b.branch)?.name }))} selectedValues={autoBatches} onChange={setAutoBatches} placeholder="All batches..." disabled={autoBranches.length === 0} />
            </div>
          )}
          {finalRecipients.length > 0 && (
            <div className="rounded-lg border border-orange-100 bg-orange-50 p-3">
              <p className="flex items-center gap-2 text-sm font-medium text-orange-700"><RadioIcon className="h-4 w-4" />{finalRecipients.length} recipient{finalRecipients.length > 1 ? 's' : ''} will receive this broadcast</p>
            </div>
          )}
          <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">
            <button type="button" onClick={onClose} className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50">Cancel</button>
            <button type="button" onClick={handleCreate} disabled={!broadcastName.trim() || finalRecipients.length === 0} className={`flex items-center rounded-lg px-4 py-2 text-sm font-medium ${broadcastName.trim() && finalRecipients.length > 0 ? 'bg-orange-500 text-white hover:bg-orange-600' : 'cursor-not-allowed bg-gray-200 text-gray-400'}`}><RadioIcon className="mr-2 h-4 w-4" />Create Broadcast</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const BulkMessageModal: React.FC<{
  onClose: () => void;
  getFilteredBatches: (branches: string[]) => Batch[];
  getFilteredStudents: (branches: string[], batches: string[]) => Student[];
  getFilteredStaff: (branches: string[], batches: string[]) => Staff[];
}> = ({ onClose, getFilteredBatches, getFilteredStudents, getFilteredStaff }) => {
  const [form, setForm] = useState({ selectedBranches: [] as string[], selectedBatches: [] as string[], selectedStudents: [] as string[], selectedStaff: [] as string[], attachments: [] as Attachment[], message: '' });
  const filteredBatches = getFilteredBatches(form.selectedBranches);
  const filteredStudents = getFilteredStudents(form.selectedBranches, form.selectedBatches);
  const filteredStaff = getFilteredStaff(form.selectedBranches, form.selectedBatches);
  const recipientCount = form.selectedStudents.length > 0 || form.selectedStaff.length > 0
    ? form.selectedStudents.length + form.selectedStaff.length
    : filteredStudents.length + filteredStaff.length;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-100 p-5">
          <div className="flex items-center gap-2"><MegaphoneIcon className="h-5 w-5 text-blue-600" /><h3 className="text-lg font-semibold text-gray-900">Send Bulk Message</h3></div>
          <button type="button" onClick={onClose} className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100"><XIcon className="h-5 w-5" /></button>
        </div>
        <div className="space-y-4 p-5">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Message *</label>
            <textarea className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Type your message here..." rows={4} value={form.message} onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))} />
          </div>
          <div className="space-y-4 rounded-lg bg-gray-50 p-4">
            <h4 className="flex items-center gap-2 text-sm font-semibold text-gray-700"><UsersIcon className="h-4 w-4" /> Select Recipients</h4>
            <MultiSelectDropdown label="Branch" placeholder="Select branches..." options={branches.map((b) => ({ value: b.id, label: b.name }))} selectedValues={form.selectedBranches} onChange={(vals) => setForm((p) => ({ ...p, selectedBranches: vals, selectedBatches: p.selectedBatches.filter((id) => { const b = batches.find((x) => x.id === id); return b && vals.includes(b.branch); }), selectedStudents: [], selectedStaff: [] }))} />
            <MultiSelectDropdown label="Batch" placeholder="Select batches..." options={filteredBatches.map((b) => ({ value: b.id, label: b.name, subtitle: branches.find((br) => br.id === b.branch)?.name }))} selectedValues={form.selectedBatches} onChange={(vals) => setForm((p) => ({ ...p, selectedBatches: vals, selectedStudents: [], selectedStaff: [] }))} disabled={form.selectedBranches.length === 0} />
            <MultiSelectDropdown label="Students (Parents)" placeholder="Select students (optional)..." options={filteredStudents.map((s) => ({ value: s.id, label: s.name, subtitle: `${s.class} • ${branches.find((b) => b.id === s.branch)?.name}` }))} selectedValues={form.selectedStudents} onChange={(vals) => setForm((p) => ({ ...p, selectedStudents: vals }))} disabled={form.selectedBranches.length === 0} />
            <MultiSelectDropdown label="Staff" placeholder="Select staff (optional)..." options={filteredStaff.map((s) => ({ value: s.id, label: s.name, subtitle: `${s.department} • ${s.role}` }))} selectedValues={form.selectedStaff} onChange={(vals) => setForm((p) => ({ ...p, selectedStaff: vals }))} disabled={form.selectedBranches.length === 0} />
            <div className="rounded-lg border border-blue-100 bg-blue-50 p-3"><p className="flex items-center gap-2 text-sm text-blue-700"><UsersIcon className="h-4 w-4" />Estimated recipients: <strong>{recipientCount}</strong></p></div>
          </div>
          <AttachmentUploader attachments={form.attachments} onAdd={(files) => setForm((p) => ({ ...p, attachments: [...p.attachments, ...files] }))} onRemove={(id) => setForm((p) => ({ ...p, attachments: p.attachments.filter((a) => a.id !== id) }))} />
          <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">
            <button type="button" onClick={onClose} className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50">Cancel</button>
            <button type="button" onClick={onClose} disabled={!form.message.trim() || recipientCount === 0} className={`flex items-center rounded-lg px-4 py-2 text-sm font-medium ${form.message.trim() && recipientCount > 0 ? 'bg-blue-600 text-white hover:bg-blue-700' : 'cursor-not-allowed bg-gray-200 text-gray-400'}`}><SendIcon className="mr-2 h-4 w-4" />Send to {recipientCount} Recipients</button>
          </div>
        </div>
      </div>
    </div>
  );
};

type FilterTab = 'all' | 'groups' | 'broadcasts';
type ActiveModal = 'none' | 'newChat' | 'createGroup' | 'createBroadcast' | 'bulkMessage';

export function PrivateChats(): JSX.Element {
  const [filter, setFilter] = useState<FilterTab>('all');
  const [search, setSearch] = useState('');
  const [selectedItem, setSelectedItem] = useState<ChatItem | null>(null);
  const [conversationType, setConversationType] = useState<ConversationType>('direct');
  const [messages, setMessages] = useState<Record<string, Message[]>>(initialMessages);
  const [newMessage, setNewMessage] = useState('');
  const [activeModal, setActiveModal] = useState<ActiveModal>('none');
  const [newChatSelectedContacts, setNewChatSelectedContacts] = useState<string[]>([]);
  const [mobileShowChat, setMobileShowChat] = useState(false);
  const [messageAttachments, setMessageAttachments] = useState<Attachment[]>([]);
  const [groups, setGroups] = useState<Group[]>(initialGroups);
  const [broadcasts, setBroadcasts] = useState<Broadcast[]>(initialBroadcasts);
  const [showGroupInfo, setShowGroupInfo] = useState(false);
  const [showBroadcastInfo, setShowBroadcastInfo] = useState(false);
  const [selectedBranchFilter, setSelectedBranchFilter] = useState('');
  const [selectedBatchFilter, setSelectedBatchFilter] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const getFilteredBatches = useCallback((selectedBranches: string[]) => selectedBranches.length === 0 ? batches : batches.filter((b) => selectedBranches.includes(b.branch)), []);
  const getFilteredStudents = useCallback((selectedBranches: string[], selectedBatches: string[]) => {
    let filtered = students;
    if (selectedBranches.length > 0) filtered = filtered.filter((s) => selectedBranches.includes(s.branch));
    if (selectedBatches.length > 0) filtered = filtered.filter((s) => selectedBatches.includes(s.batch));
    return filtered;
  }, []);
  const getFilteredStaff = useCallback((selectedBranches: string[], selectedBatches: string[]) => {
    let filtered = staffMembers;
    if (selectedBranches.length > 0) filtered = filtered.filter((s) => selectedBranches.includes(s.branch));
    if (selectedBatches.length > 0) filtered = filtered.filter((s) => selectedBatches.includes(s.batch));
    return filtered;
  }, []);
  const filteredBatchesForFilter = useMemo(() => selectedBranchFilter ? batches.filter((b) => b.branch === selectedBranchFilter) : batches, [selectedBranchFilter]);
  const allListItems = useMemo(() => {
    const contactItems = contacts.filter((c) => {
      const matchSearch = !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.subtitle.toLowerCase().includes(search.toLowerCase());
      const matchBranch = !selectedBranchFilter || c.branch === selectedBranchFilter;
      const matchBatch = !selectedBatchFilter || c.batch === selectedBatchFilter;
      return filter === 'all' && matchSearch && matchBranch && matchBatch;
    });
    const groupItems = (filter === 'all' || filter === 'groups') ? groups.filter((g) => !search || g.name.toLowerCase().includes(search.toLowerCase())) : [];
    const broadcastItems = (filter === 'all' || filter === 'broadcasts') ? broadcasts.filter((b) => !search || b.name.toLowerCase().includes(search.toLowerCase())) : [];
    return { contacts: contactItems, groups: groupItems, broadcasts: broadcastItems };
  }, [filter, search, selectedBranchFilter, selectedBatchFilter, groups, broadcasts]);
  const currentMessages = useMemo(() => selectedItem ? messages[selectedItem.id] || [] : [], [selectedItem, messages]);
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [currentMessages]);

  const handleSend = () => {
    if ((!newMessage.trim() && messageAttachments.length === 0) || !selectedItem) return;
    const msg: Message = {
      id: `m${Date.now()}`, senderId: 'me', senderName: 'You', text: newMessage.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), status: 'sent',
      attachments: messageAttachments.length > 0 ? [...messageAttachments] : undefined,
    };
    setMessages((prev) => ({ ...prev, [selectedItem.id]: [...(prev[selectedItem.id] || []), msg] }));
    if (conversationType === 'group') setGroups((prev) => prev.map((g) => g.id === selectedItem.id ? { ...g, lastMessage: msg.text || 'Attachment', lastTime: msg.time } : g));
    if (conversationType === 'broadcast') setBroadcasts((prev) => prev.map((b) => b.id === selectedItem.id ? { ...b, lastMessage: msg.text || 'Attachment', lastTime: msg.time, messageCount: b.messageCount + 1 } : b));
    setNewMessage('');
    setMessageAttachments([]);
  };
  const handleSelectContact = (contact: Contact) => { setSelectedItem(contact); setConversationType('direct'); setMobileShowChat(true); setShowGroupInfo(false); setShowBroadcastInfo(false); };
  const handleSelectGroup = (group: Group) => { setSelectedItem(group); setConversationType('group'); setMobileShowChat(true); setShowBroadcastInfo(false); };
  const handleSelectBroadcast = (broadcast: Broadcast) => { setSelectedItem(broadcast); setConversationType('broadcast'); setMobileShowChat(true); setShowGroupInfo(false); };
  const handleCreateGroup = (group: Group) => {
    setGroups((prev) => [group, ...prev]);
    setMessages((prev) => ({ ...prev, [group.id]: [{ id: `sys${Date.now()}`, senderId: 'system', text: `Group "${group.name}" created with ${group.members.length} members`, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), status: 'read' }] }));
    handleSelectGroup(group);
  };
  const handleCreateBroadcast = (broadcast: Broadcast) => {
    setBroadcasts((prev) => [broadcast, ...prev]);
    setMessages((prev) => ({ ...prev, [broadcast.id]: [] }));
    handleSelectBroadcast(broadcast);
  };
  const totalUnread = contacts.reduce((sum, c) => sum + c.unread, 0) + groups.reduce((sum, g) => sum + g.unread, 0);

  return (
    <div className="flex h-[calc(100vh-6.5rem)] flex-col overflow-hidden bg-gray-50">
      <div className="flex-shrink-0 space-y-3 border-b border-gray-100 bg-gray-50 px-6 pb-3 pt-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Private Chats</h1>
            <p className="mt-0.5 text-xs text-gray-500">Direct conversations, groups & broadcast messaging</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => setActiveModal('bulkMessage')} className="flex items-center rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium hover:bg-gray-50"><MegaphoneIcon className="mr-1.5 h-3.5 w-3.5" /> Bulk Message</button>
            <button type="button" onClick={() => setActiveModal('createBroadcast')} className="flex items-center rounded-lg border border-orange-300 bg-orange-50 px-3 py-1.5 text-xs font-medium text-orange-600 hover:bg-orange-100"><RadioIcon className="mr-1.5 h-3.5 w-3.5" /> New Broadcast</button>
            <button type="button" onClick={() => setActiveModal('createGroup')} className="flex items-center rounded-lg border border-violet-300 bg-violet-50 px-3 py-1.5 text-xs font-medium text-violet-600 hover:bg-violet-100"><UsersIcon className="mr-1.5 h-3.5 w-3.5" /> New Group</button>
            <button type="button" onClick={() => setActiveModal('newChat')} className="flex items-center rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700"><PlusIcon className="mr-1.5 h-3.5 w-3.5" /> New Chat</button>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-1.5 rounded-md border border-blue-100 bg-blue-50 px-2.5 py-1"><UsersIcon className="h-3.5 w-3.5 text-blue-600" /><span className="text-xs font-medium text-blue-700">{contacts.filter((c) => c.role === 'parent').length} Parents</span></div>
          <div className="flex items-center gap-1.5 rounded-md border border-purple-100 bg-purple-50 px-2.5 py-1"><UserIcon className="h-3.5 w-3.5 text-purple-600" /><span className="text-xs font-medium text-purple-700">{contacts.filter((c) => c.role === 'staff').length} Staff</span></div>
          <div className="flex items-center gap-1.5 rounded-md border border-violet-100 bg-violet-50 px-2.5 py-1"><UsersIcon className="h-3.5 w-3.5 text-violet-600" /><span className="text-xs font-medium text-violet-700">{groups.length} Groups</span></div>
          <div className="flex items-center gap-1.5 rounded-md border border-orange-100 bg-orange-50 px-2.5 py-1"><RadioIcon className="h-3.5 w-3.5 text-orange-500" /><span className="text-xs font-medium text-orange-700">{broadcasts.length} Broadcasts</span></div>
          {totalUnread > 0 && <div className="flex items-center gap-1.5 rounded-md border border-red-100 bg-red-50 px-2.5 py-1"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" /><span className="text-xs font-medium text-red-700">{totalUnread} Unread</span></div>}
        </div>
      </div>

      <div className="min-h-0 flex-1 px-6 py-4">
        <div className="flex h-full min-h-0 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className={`flex h-full min-h-0 w-full flex-shrink-0 flex-col border-r border-gray-200 md:w-80 ${mobileShowChat ? 'hidden md:flex' : 'flex'}`}>
            <div className="flex-shrink-0 space-y-2 border-b border-gray-100 p-3">
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input type="text" placeholder="Search chats, groups..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <select className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm" value={selectedBranchFilter} onChange={(e) => { setSelectedBranchFilter(e.target.value); setSelectedBatchFilter(''); }}>
                  <option value="">All Branches</option>
                  {branches.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
                <select className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm" value={selectedBatchFilter} onChange={(e) => setSelectedBatchFilter(e.target.value)} disabled={!selectedBranchFilter}>
                  <option value="">All Batches</option>
                  {filteredBatchesForFilter.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
              </div>
              <div className="flex gap-1 rounded-lg bg-gray-100 p-1">
                {([{ value: 'all', label: 'All' }, { value: 'groups', label: 'Groups' }, { value: 'broadcasts', label: 'Broadcast' }] as { value: FilterTab; label: string }[]).map((f) => (
                  <button key={f.value} type="button" onClick={() => setFilter(f.value)} className={`flex-1 whitespace-nowrap rounded-md px-2 py-1.5 text-xs font-medium ${filter === f.value ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}>{f.label}</button>
                ))}
              </div>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto">
              {allListItems.broadcasts.map((broadcast) => (
                <button key={broadcast.id} type="button" onClick={() => handleSelectBroadcast(broadcast)} className={`flex w-full items-start gap-3 border-b border-gray-50 px-4 py-3 text-left hover:bg-gray-50 ${selectedItem?.id === broadcast.id ? 'border-l-2 border-l-orange-500 bg-orange-50' : ''}`}>
                  <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${broadcastAvatarBg}`}><RadioIcon className="h-4 w-4 text-white" /></div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1"><span className="truncate text-sm font-semibold text-gray-900">{broadcast.name}</span>{broadcast.lastTime && <span className="flex-shrink-0 text-[10px] text-gray-400">{broadcast.lastTime}</span>}</div>
                    <p className="mt-0.5 truncate text-xs text-gray-500">{broadcast.lastMessage || 'No messages yet'}</p>
                  </div>
                </button>
              ))}
              {allListItems.groups.map((group) => (
                <button key={group.id} type="button" onClick={() => handleSelectGroup(group)} className={`flex w-full items-start gap-3 border-b border-gray-50 px-4 py-3 text-left hover:bg-gray-50 ${selectedItem?.id === group.id ? 'border-l-2 border-l-violet-500 bg-violet-50' : ''}`}>
                  <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold text-white ${groupAvatarBg}`}>{group.name.slice(0, 2).toUpperCase()}</div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1"><span className="truncate text-sm font-semibold text-gray-900">{group.name}</span><span className="flex-shrink-0 text-[10px] text-gray-400">{group.lastTime}</span></div>
                    <p className="mt-0.5 truncate text-xs text-gray-500">{group.lastMessage}</p>
                  </div>
                </button>
              ))}
              {allListItems.contacts.map((contact) => (
                <button key={contact.id} type="button" onClick={() => handleSelectContact(contact)} className={`flex w-full items-start gap-3 border-b border-gray-50 px-4 py-3 text-left hover:bg-gray-50 ${selectedItem?.id === contact.id && conversationType === 'direct' ? 'border-l-2 border-l-blue-500 bg-blue-50' : ''}`}>
                  <div className="relative flex-shrink-0">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold text-white ${avatarColors[contact.avatar] || 'bg-gray-400'}`}>{contact.avatar}</div>
                    {contact.online && <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-green-500" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1"><span className="truncate text-sm font-semibold text-gray-900">{contact.name}</span><span className="flex-shrink-0 text-[10px] text-gray-400">{contact.lastTime}</span></div>
                    <div className="mt-0.5 flex items-center justify-between gap-1">
                      <p className="truncate text-xs text-gray-500">{contact.lastMessage}</p>
                      {contact.unread > 0 && <span className="flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">{contact.unread}</span>}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className={`flex h-full min-h-0 min-w-0 flex-1 ${!mobileShowChat ? 'hidden md:flex' : 'flex'}`}>
            <div className="flex h-full min-h-0 min-w-0 flex-1 flex-col">
              {selectedItem ? (
                <>
                  <div className="flex flex-shrink-0 items-center gap-3 border-b border-gray-200 bg-white px-4 py-3">
                    <button type="button" className="rounded-lg p-1 hover:bg-gray-100 md:hidden" onClick={() => setMobileShowChat(false)}><ArrowLeftIcon className="h-4 w-4 text-gray-600" /></button>
                    {conversationType === 'direct' && (
                      <>
                        <div className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold text-white ${avatarColors[(selectedItem as Contact).avatar] || 'bg-gray-400'}`}>{(selectedItem as Contact).avatar}</div>
                        <div className="min-w-0 flex-1"><p className="text-sm font-semibold text-gray-900">{selectedItem.name}</p><p className="truncate text-xs text-gray-500">{(selectedItem as Contact).subtitle}</p></div>
                        <button type="button" className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"><PhoneIcon className="h-4 w-4" /></button>
                        <button type="button" className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"><VideoIcon className="h-4 w-4" /></button>
                      </>
                    )}
                    {conversationType === 'group' && (
                      <>
                        <div className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold text-white ${groupAvatarBg}`}>{selectedItem.name.slice(0, 2).toUpperCase()}</div>
                        <div className="min-w-0 flex-1"><p className="text-sm font-semibold text-gray-900">{selectedItem.name}</p><p className="text-xs text-gray-500">{(selectedItem as Group).members.length + 1} members</p></div>
                        <button type="button" onClick={() => setShowGroupInfo(!showGroupInfo)} className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"><MoreVerticalIcon className="h-4 w-4" /></button>
                      </>
                    )}
                    {conversationType === 'broadcast' && (
                      <>
                        <div className={`flex h-9 w-9 items-center justify-center rounded-full ${broadcastAvatarBg}`}><RadioIcon className="h-4 w-4 text-white" /></div>
                        <div className="min-w-0 flex-1"><p className="text-sm font-semibold text-gray-900">{selectedItem.name}</p><p className="text-xs text-gray-500">{(selectedItem as Broadcast).recipients.length} recipients</p></div>
                        <button type="button" onClick={() => setShowBroadcastInfo(!showBroadcastInfo)} className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"><MoreVerticalIcon className="h-4 w-4" /></button>
                      </>
                    )}
                  </div>
                  <div className="min-h-0 flex-1 space-y-3 overflow-y-auto bg-gray-50/50 px-4 py-4">
                    {currentMessages.map((msg) => {
                      const isMe = msg.senderId === 'me';
                      if (msg.senderId === 'system') return <div key={msg.id} className="flex justify-center"><span className="rounded-full bg-gray-200 px-3 py-1 text-xs text-gray-600">{msg.text}</span></div>;
                      return (
                        <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                          <div className="max-w-xs lg:max-w-md">
                            {!isMe && conversationType !== 'direct' && msg.senderName && <p className="mb-1 ml-1 text-[10px] text-gray-500">{msg.senderName}</p>}
                            <div className={`rounded-2xl px-3 py-2 text-sm leading-relaxed ${isMe ? 'rounded-br-sm bg-blue-600 text-white' : 'rounded-bl-sm border border-gray-200 bg-white text-gray-800 shadow-sm'}`}>{msg.text}</div>
                            <div className={`mt-1 flex items-center gap-1 ${isMe ? 'justify-end' : 'justify-start'}`}>
                              <span className="text-[10px] text-gray-400">{msg.time}</span>
                              {isMe && (msg.status === 'read' ? <CheckCheckIcon className="h-3 w-3 text-blue-500" /> : msg.status === 'delivered' ? <CheckCheckIcon className="h-3 w-3 text-gray-400" /> : <CheckIcon className="h-3 w-3 text-gray-400" />)}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </div>
                  <div className="flex-shrink-0 border-t border-gray-200 bg-white px-4 py-3">
                    <div className="flex items-end gap-2">
                      <input type="file" id="msg-file-input" className="hidden" multiple onChange={(e) => {
                        const files = e.target.files; if (!files) return;
                        setMessageAttachments((prev) => [...prev, ...Array.from(files).map((f) => ({ id: `ATT-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`, name: f.name, size: f.size, type: f.type }))]);
                        e.target.value = '';
                      }} />
                      <button type="button" onClick={() => document.getElementById('msg-file-input')?.click()} className="flex-shrink-0 p-2 text-gray-400 hover:text-gray-600"><PaperclipIcon className="h-5 w-5" /></button>
                      <textarea value={newMessage} onChange={(e) => setNewMessage(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }} placeholder={`Message ${selectedItem.name}...`} rows={1} className="w-full resize-none rounded-2xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      <button type="button" className="flex-shrink-0 p-2 text-gray-400"><SmileIcon className="h-5 w-5" /></button>
                      <button type="button" onClick={handleSend} disabled={!newMessage.trim() && messageAttachments.length === 0} className={`flex-shrink-0 rounded-full p-2.5 ${(newMessage.trim() || messageAttachments.length > 0) ? 'bg-blue-600 text-white hover:bg-blue-700' : 'cursor-not-allowed bg-gray-200 text-gray-400'}`}><SendIcon className="h-4 w-4" /></button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex flex-1 items-center justify-center text-gray-400">
                  <div className="text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100"><SendIcon className="h-7 w-7 text-gray-300" /></div>
                    <p className="text-base font-medium text-gray-500">Select a conversation</p>
                    <p className="mt-1 text-sm">Choose a contact, group or broadcast to start</p>
                  </div>
                </div>
              )}
            </div>
            {showGroupInfo && conversationType === 'group' && selectedItem && (
              <div className="flex h-full w-72 flex-shrink-0 flex-col border-l border-gray-200 bg-white">
                <div className="flex items-center justify-between border-b border-gray-100 p-4"><h4 className="text-sm font-semibold text-gray-900">Group Info</h4><button type="button" onClick={() => setShowGroupInfo(false)}><XIcon className="h-4 w-4 text-gray-500" /></button></div>
                <div className="flex flex-col items-center border-b border-gray-100 py-5">
                  <div className={`mb-2 flex h-16 w-16 items-center justify-center rounded-full text-xl font-bold text-white ${groupAvatarBg}`}>{selectedItem.name.slice(0, 2).toUpperCase()}</div>
                  <p className="font-semibold text-gray-900">{selectedItem.name}</p>
                  <p className="mt-1 px-4 text-center text-xs text-gray-500">{(selectedItem as Group).description || 'No description'}</p>
                </div>
                <div className="min-h-0 flex-1 overflow-y-auto p-4">
                  <p className="mb-3 text-sm font-semibold text-gray-700">{(selectedItem as Group).members.length} Members</p>
                  {(selectedItem as Group).members.map((memberId) => {
                    const contact = contacts.find((c) => c.id === memberId);
                    if (!contact) return null;
                    return (
                      <div key={memberId} className="flex items-center gap-2 rounded-lg p-2 hover:bg-gray-50">
                        <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold text-white ${avatarColors[contact.avatar] || 'bg-gray-400'}`}>{contact.avatar}</div>
                        <p className="truncate text-xs font-medium text-gray-800">{contact.name}</p>
                      </div>
                    );
                  })}
                </div>
                <div className="border-t border-gray-100 p-4">
                  <button type="button" onClick={() => { setGroups((prev) => prev.filter((g) => g.id !== selectedItem.id)); setSelectedItem(null); setShowGroupInfo(false); }} className="flex w-full items-center justify-center gap-2 rounded-lg border border-red-200 py-2 text-sm font-medium text-red-600 hover:bg-red-50"><TrashIcon className="h-4 w-4" /> Delete Group</button>
                </div>
              </div>
            )}
            {showBroadcastInfo && conversationType === 'broadcast' && selectedItem && (
              <div className="flex h-full w-72 flex-shrink-0 flex-col border-l border-gray-200 bg-white">
                <div className="flex items-center justify-between border-b border-gray-100 p-4"><h4 className="text-sm font-semibold text-gray-900">Broadcast Info</h4><button type="button" onClick={() => setShowBroadcastInfo(false)}><XIcon className="h-4 w-4 text-gray-500" /></button></div>
                <div className="flex flex-col items-center border-b border-gray-100 py-5">
                  <div className={`mb-2 flex h-16 w-16 items-center justify-center rounded-full ${broadcastAvatarBg}`}><RadioIcon className="h-7 w-7 text-white" /></div>
                  <p className="px-4 text-center font-semibold text-gray-900">{selectedItem.name}</p>
                </div>
                <div className="min-h-0 flex-1 overflow-y-auto p-4">
                  <p className="mb-3 text-sm font-semibold text-gray-700">Recipients ({(selectedItem as Broadcast).recipients.length})</p>
                  {(selectedItem as Broadcast).recipients.map((recipientId) => {
                    const contact = contacts.find((c) => c.id === recipientId);
                    if (!contact) return null;
                    return (
                      <div key={recipientId} className="flex items-center gap-2 rounded-lg p-2 hover:bg-gray-50">
                        <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold text-white ${avatarColors[contact.avatar] || 'bg-gray-400'}`}>{contact.avatar}</div>
                        <p className="truncate text-xs font-medium text-gray-800">{contact.name}</p>
                      </div>
                    );
                  })}
                </div>
                <div className="border-t border-gray-100 p-4">
                  <button type="button" onClick={() => { setBroadcasts((prev) => prev.filter((b) => b.id !== selectedItem.id)); setSelectedItem(null); setShowBroadcastInfo(false); }} className="flex w-full items-center justify-center gap-2 rounded-lg border border-red-200 py-2 text-sm font-medium text-red-600 hover:bg-red-50"><TrashIcon className="h-4 w-4" /> Delete Broadcast List</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {activeModal === 'newChat' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 p-5">
              <h3 className="text-base font-semibold text-gray-900">Start New Chat</h3>
              <button type="button" onClick={() => { setActiveModal('none'); setNewChatSelectedContacts([]); }} className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100"><XIcon className="h-4 w-4" /></button>
            </div>
            <div className="space-y-4 p-5">
              <MultiSelectDropdown label="Select Contact" placeholder="Search parents or staff..." options={contacts.map((c) => ({ value: c.id, label: `${c.name} (${c.role === 'parent' ? 'Parent' : 'Staff'})`, subtitle: branches.find((b) => b.id === c.branch)?.name }))} selectedValues={newChatSelectedContacts} onChange={setNewChatSelectedContacts} />
              <div className="flex justify-end border-t border-gray-100 pt-4">
                <button type="button" disabled={newChatSelectedContacts.length === 0} onClick={() => {
                  const contact = contacts.find((c) => c.id === newChatSelectedContacts[0]);
                  if (contact) handleSelectContact(contact);
                  setActiveModal('none'); setNewChatSelectedContacts([]);
                }} className={`rounded-lg px-4 py-2 text-sm font-medium ${newChatSelectedContacts.length > 0 ? 'bg-blue-600 text-white hover:bg-blue-700' : 'cursor-not-allowed bg-gray-200 text-gray-400'}`}>Start Chat</button>
              </div>
            </div>
          </div>
        </div>
      )}
      {activeModal === 'createGroup' && <CreateGroupModal onClose={() => setActiveModal('none')} onCreateGroup={handleCreateGroup} />}
      {activeModal === 'createBroadcast' && <CreateBroadcastModal onClose={() => setActiveModal('none')} onCreateBroadcast={handleCreateBroadcast} />}
      {activeModal === 'bulkMessage' && <BulkMessageModal onClose={() => setActiveModal('none')} getFilteredBatches={getFilteredBatches} getFilteredStudents={getFilteredStudents} getFilteredStaff={getFilteredStaff} />}
    </div>
  );
}

export default PrivateChats;
