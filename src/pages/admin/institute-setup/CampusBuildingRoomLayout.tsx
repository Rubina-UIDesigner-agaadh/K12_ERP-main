import React, { useMemo, useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Table } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import {
  Activity,
  AlertTriangle,
  BarChart3,
  BedDouble,
  Building2,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Download,
  DoorOpen,
  Edit2,
  Eye,
  FileText,
  Grid3X3,
  LayoutDashboard,
  Map as MapIcon,
  MapPin,
  Plus,
  Printer,
  RotateCcw,
  Save,
  Search,
  Trash2,
  Users,
  Wrench,
  X
} from 'lucide-react';

type BuildingType = 'Academic' | 'Hostel — Boys' | 'Hostel — Girls' | 'Administration' | 'Laboratory Block' | 'Sports Complex' | 'Auditorium' | 'Canteen' | 'Store' | 'Medical' | 'Other';
type BuildingCondition = 'Good' | 'Needs Minor Repair' | 'Needs Major Repair' | 'Under Renovation' | 'Condemned';
type RoomType = 'Classroom' | 'Lab' | 'Computer Lab' | 'Library' | 'Auditorium' | 'Hostel Room' | 'Staff Room' | 'Principal Office' | 'Office' | 'Store Room' | 'Washroom' | 'Medical Room' | 'Sports Hall' | 'Drawing Room' | 'Music Room' | 'Art Room' | 'Swimming Pool' | 'Playground' | 'Canteen' | 'Conference Room' | 'Server Room' | 'Parking' | 'Other';
type RoomStatus = 'Active' | 'Under Maintenance' | 'Inactive' | 'Under Construction';
type CampusTab = 'Dashboard' | 'Buildings' | 'Rooms' | 'Layout Map' | 'Room Allocation' | 'Reports';

interface CampusBuilding {
  id: number;
  campus: string;
  name: string;
  shortName: string;
  code: string;
  type: BuildingType;
  upperFloors: number;
  groundFloor: boolean;
  floorNaming?: string;
  builtUpArea: number;
  constructionType: string;
  yearBuilt: number;
  renovationYear: number;
  condition: BuildingCondition;
  status: 'Active' | 'Inactive';
  location: string;
  facilities: string[];
  fireExit: string;
  assemblyPoint: string;
  emergencyDescription: string;
  inchargeName: string;
  inchargePhone: string;
  remarks: string;
  photo: string;
  floorPlan: string;
  initialRoomCount: number;
}

interface CampusRoom {
  id: number;
  campus: string;
  buildingId: number;
  roomNumber: string;
  name: string;
  type: RoomType;
  floorLevel: number;
  capacity: number;
  examCapacity: number;
  examEligible: boolean;
  beds: number;
  bedType: string;
  feeCategory?: string;
  annualFee?: number;
  emergencyExit?: string;
  area: number;
  length: number;
  width: number;
  condition: BuildingCondition;
  status: RoomStatus;
  currentStrength: number;
  allocatedTo: string;
  department: string;
  amenities: string[];
  maintainedOn: string;
  nextMaintenance: string;
  maintenanceRemarks: string;
  bookable: boolean;
  assetsCount: number;
  biometricId: string;
  cameraId: string;
  smartBoardId: string;
  projectorAssetId: string;
  photo: string;
  remarks: string;
}

interface BuildingSeed extends CampusBuilding {}
interface ClassroomAllocation {
  id: number;
  className: string;
  section: string;
  roomId: number | null;
  strength: number;
}
interface StaffAllocation {
  id: number;
  department: string;
  role: string;
  roomId: number | null;
}
interface ReportSpec { title: string; description: string; group: 'Government & Compliance' | 'Internal Management' }

const ROOM_TYPES: RoomType[] = ['Classroom', 'Lab', 'Computer Lab', 'Library', 'Auditorium', 'Hostel Room', 'Staff Room', 'Principal Office', 'Office', 'Store Room', 'Washroom', 'Medical Room', 'Sports Hall', 'Drawing Room', 'Music Room', 'Art Room', 'Swimming Pool', 'Playground', 'Canteen', 'Conference Room', 'Server Room', 'Parking', 'Other'];
const ROOM_STATUSES: RoomStatus[] = ['Active', 'Under Maintenance', 'Inactive', 'Under Construction'];
const BUILDING_TYPES: BuildingType[] = ['Academic', 'Hostel — Boys', 'Hostel — Girls', 'Administration', 'Laboratory Block', 'Sports Complex', 'Auditorium', 'Canteen', 'Store', 'Medical', 'Other'];
const CONDITIONS: BuildingCondition[] = ['Good', 'Needs Minor Repair', 'Needs Major Repair', 'Under Renovation', 'Condemned'];
const BUILDING_FACILITIES = ['Elevator / Lift', 'Ramp for Disabled', 'CCTV Coverage', 'Fire Extinguishers', 'Fire Alarm System', 'Sprinkler System', '24x7 Electricity', 'Generator Backup', 'Water Supply', 'Wi-Fi Coverage', 'Solar Panels', 'PA System', 'Air Conditioning', 'Adequate Lighting', 'Drinking Water'];
const ROOM_FACILITIES = ['Electric Lights', 'Fans', 'Air Conditioning', 'Ventilation', 'Drinking Water', 'Attached Bathroom', 'Windows', 'Ramp / Wheelchair', 'Projector / LCD', 'Smart Board', 'Interactive Panel', 'Whiteboard', 'Blackboard', 'Speakers / PA', 'Wi-Fi', 'LAN Points', 'Computers', 'Biometric Device', 'CCTV Camera', 'RFID Reader', 'Fire Extinguisher', 'Fire Sprinkler', 'First Aid Kit'];
const CAMPUS_OPTIONS = ['Main Campus', 'City Centre Branch', 'North Zone Campus'];

const buildingSeeds: BuildingSeed[] = [
  { id: 1, campus: 'Main Campus', name: 'Main Block', shortName: 'Main Block', code: 'BLD-A', type: 'Academic', upperFloors: 3, groundFloor: true, builtUpArea: 15000, constructionType: 'Pucca (RCC)', yearBuilt: 1999, renovationYear: 2018, condition: 'Good', status: 'Active', location: 'North side — near main gate', facilities: ['Elevator / Lift', 'Ramp for Disabled', 'CCTV Coverage', 'Fire Extinguishers', 'Fire Alarm System', 'Generator Backup', 'Water Supply', 'Wi-Fi Coverage', 'Adequate Lighting'], fireExit: 'East and west staircases', assemblyPoint: 'Ground A — near main gate', emergencyDescription: 'Two staircases on east and west sides', inchargeName: 'Mr. Ramesh Kumar', inchargePhone: '+91 98765 43010', remarks: 'Primary teaching block.', photo: '', floorPlan: '', initialRoomCount: 45 },
  { id: 2, campus: 'Main Campus', name: 'Science Block', shortName: 'Science Block', code: 'BLD-B', type: 'Laboratory Block', upperFloors: 2, groundFloor: true, builtUpArea: 9800, constructionType: 'Pucca (RCC)', yearBuilt: 2005, renovationYear: 2021, condition: 'Good', status: 'Active', location: 'East of main block', facilities: ['Ramp for Disabled', 'CCTV Coverage', 'Fire Extinguishers', 'Fire Alarm System', 'Water Supply', 'Wi-Fi Coverage', 'Adequate Lighting'], fireExit: 'North stairwell', assemblyPoint: 'Science lawn', emergencyDescription: 'External fire stairs on north side', inchargeName: 'Dr. M. Shah', inchargePhone: '+91 98765 43011', remarks: 'Physics, chemistry, and biology laboratories.', photo: '', floorPlan: '', initialRoomCount: 38 },
  { id: 3, campus: 'Main Campus', name: 'Computer Block', shortName: 'Computer Block', code: 'BLD-C', type: 'Academic', upperFloors: 1, groundFloor: true, builtUpArea: 7200, constructionType: 'Pucca (RCC)', yearBuilt: 2010, renovationYear: 2022, condition: 'Needs Minor Repair', status: 'Active', location: 'Behind the library', facilities: ['CCTV Coverage', 'Fire Extinguishers', 'Generator Backup', 'Water Supply', 'Wi-Fi Coverage', 'Adequate Lighting'], fireExit: 'West exit', assemblyPoint: 'Main quad', emergencyDescription: 'West exit leads to open assembly area', inchargeName: 'Mr. J. Patel', inchargePhone: '+91 98765 43012', remarks: 'One lab is awaiting a maintenance update.', photo: '', floorPlan: '', initialRoomCount: 18 },
  { id: 4, campus: 'Main Campus', name: 'Boys Hostel', shortName: 'Boys Hostel', code: 'HSTL-B', type: 'Hostel — Boys', upperFloors: 2, groundFloor: true, builtUpArea: 11000, constructionType: 'Pucca (RCC)', yearBuilt: 2002, renovationYear: 2020, condition: 'Good', status: 'Active', location: 'South campus', facilities: ['Elevator / Lift', 'CCTV Coverage', 'Fire Extinguishers', 'Fire Alarm System', 'Water Supply', 'Wi-Fi Coverage'], fireExit: 'East stairway', assemblyPoint: 'Hostel courtyard', emergencyDescription: 'Two marked emergency exits', inchargeName: 'Mr. H. Solanki', inchargePhone: '+91 98765 43013', remarks: 'Residential building; room count includes dorms.', photo: '', floorPlan: '', initialRoomCount: 30 },
  { id: 5, campus: 'Main Campus', name: 'Girls Hostel', shortName: 'Girls Hostel', code: 'HSTL-G', type: 'Hostel — Girls', upperFloors: 2, groundFloor: true, builtUpArea: 10500, constructionType: 'Pucca (RCC)', yearBuilt: 2004, renovationYear: 2021, condition: 'Good', status: 'Active', location: 'South-east campus', facilities: ['Elevator / Lift', 'CCTV Coverage', 'Fire Extinguishers', 'Fire Alarm System', 'Water Supply', 'Wi-Fi Coverage'], fireExit: 'North and south stairways', assemblyPoint: 'Girls hostel garden', emergencyDescription: 'Two marked emergency exits', inchargeName: 'Ms. P. Desai', inchargePhone: '+91 98765 43014', remarks: 'Residential building.', photo: '', floorPlan: '', initialRoomCount: 30 },
  { id: 6, campus: 'Main Campus', name: 'Admin Block', shortName: 'Admin Block', code: 'BLD-ADM', type: 'Administration', upperFloors: 1, groundFloor: true, builtUpArea: 6400, constructionType: 'Pucca (RCC)', yearBuilt: 1999, renovationYear: 2019, condition: 'Good', status: 'Active', location: 'Near the main entrance', facilities: ['Ramp for Disabled', 'CCTV Coverage', 'Fire Extinguishers', 'Generator Backup', 'Wi-Fi Coverage', 'Adequate Lighting'], fireExit: 'Rear corridor exit', assemblyPoint: 'Visitor parking', emergencyDescription: 'Rear corridor connects to the open court', inchargeName: 'Ms. N. Shah', inchargePhone: '+91 98765 43015', remarks: 'Administrative offices and auditorium.', photo: '', floorPlan: '', initialRoomCount: 16 },
  { id: 7, campus: 'Main Campus', name: 'Sports Complex', shortName: 'Sports Complex', code: 'SPORTS', type: 'Sports Complex', upperFloors: 0, groundFloor: true, builtUpArea: 5200, constructionType: 'Pucca (RCC)', yearBuilt: 2012, renovationYear: 2023, condition: 'Good', status: 'Active', location: 'West field', facilities: ['CCTV Coverage', 'First Aid Kit', 'Water Supply', 'Adequate Lighting'], fireExit: 'South gate', assemblyPoint: 'Athletics field', emergencyDescription: 'South gate opens directly onto the field', inchargeName: 'Mr. V. Singh', inchargePhone: '+91 98765 43016', remarks: 'Indoor and outdoor activity areas.', photo: '', floorPlan: '', initialRoomCount: 8 },
  { id: 8, campus: 'City Centre Branch', name: 'East Academic Block', shortName: 'East Block', code: 'CITY-A', type: 'Academic', upperFloors: 2, groundFloor: true, builtUpArea: 9000, constructionType: 'Pucca (RCC)', yearBuilt: 2005, renovationYear: 2021, condition: 'Good', status: 'Active', location: 'City Centre campus', facilities: ['Ramp for Disabled', 'CCTV Coverage', 'Fire Extinguishers', 'Water Supply', 'Wi-Fi Coverage'], fireExit: 'West staircase', assemblyPoint: 'Assembly court', emergencyDescription: 'West staircase exits to the assembly court', inchargeName: 'Mrs. S. Patel', inchargePhone: '+91 98765 43020', remarks: '', photo: '', floorPlan: '', initialRoomCount: 12 },
  { id: 9, campus: 'North Zone Campus', name: 'North Teaching Block', shortName: 'North Block', code: 'NORTH-A', type: 'Academic', upperFloors: 1, groundFloor: true, builtUpArea: 6800, constructionType: 'Pucca (RCC)', yearBuilt: 2018, renovationYear: 2023, condition: 'Good', status: 'Active', location: 'North Zone campus', facilities: ['Ramp for Disabled', 'CCTV Coverage', 'Fire Extinguishers', 'Water Supply', 'Wi-Fi Coverage'], fireExit: 'East exit', assemblyPoint: 'North quad', emergencyDescription: 'Marked east-side emergency route', inchargeName: 'Mr. A. Singh', inchargePhone: '+91 98765 43021', remarks: '', photo: '', floorPlan: '', initialRoomCount: 10 }
];

const roomTypeFor = (building: CampusBuilding, index: number): RoomType => {
  if (building.type === 'Hostel — Boys' || building.type === 'Hostel — Girls') return 'Hostel Room';
  if (building.type === 'Sports Complex') return index < 5 ? 'Sports Hall' : 'Playground';
  if (building.type === 'Administration') return index < 6 ? 'Office' : index === 6 ? 'Auditorium' : index === 7 ? 'Medical Room' : 'Office';
  if (building.code === 'BLD-A') return index < 30 ? 'Classroom' : index < 35 ? 'Lab' : index === 35 ? 'Library' : index < 41 ? 'Office' : index < 43 ? 'Washroom' : 'Store Room';
  if (building.code === 'BLD-B') return index < 20 ? 'Lab' : index < 30 ? 'Classroom' : index < 33 ? 'Computer Lab' : index < 36 ? 'Washroom' : 'Store Room';
  if (building.code === 'BLD-C') return index < 12 ? 'Computer Lab' : index < 16 ? 'Classroom' : 'Server Room';
  return index < Math.ceil(building.initialRoomCount * 0.65) ? 'Classroom' : 'Office';
};

function roomFloorName(level: number) { return level === 0 ? 'Ground Floor' : `${level}${level === 1 ? 'st' : level === 2 ? 'nd' : level === 3 ? 'rd' : 'th'} Floor`; }

function makeInitialRooms(buildings: CampusBuilding[]): CampusRoom[] {
  const rooms: CampusRoom[] = [];
  let nextId = 1;
  buildings.forEach((building) => {
    for (let index = 0; index < building.initialRoomCount; index += 1) {
      const type = roomTypeFor(building, index);
      const hostel = type === 'Hostel Room';
      const prefix = building.code === 'BLD-A' ? 'CR' : building.code === 'BLD-B' ? 'LAB' : building.code === 'BLD-C' ? 'COMP' : building.code === 'HSTL-B' || building.code === 'HSTL-G' ? 'GF' : building.code === 'SPORTS' ? 'SP' : type === 'Auditorium' ? 'AUD' : 'ADM';
      const level = building.upperFloors ? index % (building.upperFloors + 1) : 0;
      const floorSequence = Math.floor(index / (building.upperFloors + 1)) + 1;
      const roomNumber = prefix === 'CR'
        ? `${prefix}-${(level + 1) * 100 + floorSequence}`
        : prefix === 'GF'
          ? building.code === 'HSTL-B' && index === 0 ? 'GF-101' : building.code === 'HSTL-B' && index === 7 ? 'GF-08' : `${prefix}-${String((building.code === 'HSTL-G' ? 201 : 1) + index).padStart(2, '0')}`
          : `${prefix}-${String(index + 1).padStart(2, '0')}`;
      const capacity = hostel ? 2 : type === 'Classroom' ? 45 : type === 'Lab' ? 30 : type === 'Computer Lab' ? 40 : type === 'Library' ? 100 : type === 'Auditorium' ? 300 : type === 'Sports Hall' || type === 'Playground' ? 100 : type === 'Washroom' ? 0 : 12;
      let status: RoomStatus = 'Active';
      if (building.code === 'BLD-C' && index === 2) status = 'Under Maintenance';
      else if (building.code === 'HSTL-B' && index === 7) status = 'Inactive';
      else if (building.code === 'BLD-A' && index === 20) status = 'Under Maintenance';
      else if (building.code === 'BLD-B' && index === 12) status = 'Under Maintenance';
      else if (building.code === 'HSTL-G' && index === 18) status = 'Under Maintenance';
      else if (building.code === 'BLD-A' && index === 21) status = 'Inactive';
      else if (building.code === 'BLD-B' && index === 13) status = 'Inactive';
      const assignedTo = type === 'Classroom' && index % 3 !== 1 ? `Class ${6 + index % 7}-${String.fromCharCode(65 + index % 3)}` : type === 'Office' ? ['Principal Office', 'Accounts Department', 'Admissions Office'][index % 3] : '';
      const occupancy = hostel ? (index % 4 === 0 ? 2 : index % 4 === 1 ? 1 : 0) : type === 'Classroom' && assignedTo ? Math.max(12, capacity - (index % 9) * 3) : 0;
      const condition: BuildingCondition = status === 'Under Maintenance' ? 'Needs Major Repair' : building.condition === 'Needs Minor Repair' && index < 3 ? 'Needs Minor Repair' : 'Good';
      const roomName = hostel ? `Hostel Room ${String(index + 1).padStart(2, '0')}` : type === 'Classroom' ? `Classroom ${String(index + 1).padStart(2, '0')}` : type === 'Lab' ? `${['Physics', 'Chemistry', 'Biology', 'General'][index % 4]} Lab ${String(index + 1).padStart(2, '0')}` : type === 'Computer Lab' ? `Computer Lab ${index + 1}` : type === 'Office' ? `${['Admin', 'Accounts', 'Admissions', 'Staff'][index % 4]} Office ${index + 1}` : `${type} ${String(index + 1).padStart(2, '0')}`;
      rooms.push({
        id: nextId++, campus: building.campus, buildingId: building.id, roomNumber, name: roomName, type, floorLevel: level,
        capacity, examCapacity: type === 'Classroom' ? Math.round(capacity * 0.67) : 0, examEligible: type === 'Classroom' || type === 'Auditorium', beds: hostel ? 2 : 0,
        bedType: hostel ? 'Double Sharing' : '', feeCategory: hostel ? 'Double Sharing — Non-AC' : '', annualFee: hostel ? 48000 : 0, emergencyExit: 'Via main corridor / stairwell', area: hostel ? 300 : type === 'Classroom' ? 700 : type === 'Lab' || type === 'Computer Lab' ? 900 : 450,
        length: 30, width: 24, condition, status, currentStrength: occupancy, allocatedTo: assignedTo, department: type === 'Lab' ? 'Science Department' : type === 'Computer Lab' ? 'Computer Science' : type === 'Office' ? 'Administration' : '',
        amenities: ['Electric Lights', 'Fans', 'Whiteboard', 'Wi-Fi', ...(index % 3 === 0 ? ['Projector / LCD'] : []), ...(index % 4 === 0 ? ['CCTV Camera'] : []), ...(status === 'Under Maintenance' ? [] : ['Fire Extinguisher'])],
        maintainedOn: '2025-03-15', nextMaintenance: '2026-03-15', maintenanceRemarks: status === 'Under Maintenance' ? 'Repair request open; follow-up required.' : 'Routine inspection completed.',
        bookable: type === 'Auditorium' || type === 'Sports Hall' || type === 'Conference Room', assetsCount: index % 11 === 0 ? 0 : 2,
        biometricId: '', cameraId: index % 4 === 0 ? `CAM-${String(nextId).padStart(3, '0')}` : '', smartBoardId: index % 5 === 0 ? `SB-${String(nextId).padStart(3, '0')}` : '', projectorAssetId: index % 3 === 0 ? `ASSET-${String(nextId).padStart(4, '0')}` : '', photo: '', remarks: ''
      });
    }
  });
  return rooms;
}

const initialRooms = makeInitialRooms(buildingSeeds);
const getInitialClassroomAllocations = (rooms: CampusRoom[]): ClassroomAllocation[] => [
  ['Class 6', 'A', 'CR-101', 42], ['Class 6', 'B', 'CR-102', 40], ['Class 6', 'C', 'CR-103', 38], ['Class 7', 'A', 'CR-104', 44], ['Class 8', 'A', 'CR-201', 43], ['Class 9', 'A', 'CR-202', 45], ['Class 10', 'A', 'CR-205', 40], ['Class 11 Science (PCM)', '', 'CR-301', 35], ['Class 11 Science (PCB)', '', 'CR-302', 30], ['Class 11 Commerce', '', 'CR-401', 40], ['Class 12 Science (PCM)', '', 'CR-402', 32]
].map((row, index) => ({ id: index + 1, className: row[0] as string, section: row[1] as string, roomId: rooms.find((room) => room.roomNumber === row[2])?.id || null, strength: row[3] as number }));

const reportSpecs: ReportSpec[] = [
  { title: 'UDISE Infrastructure Data Report', description: 'Buildings, rooms, construction type, toilets, water, and infrastructure indicators for annual UDISE submission.', group: 'Government & Compliance' },
  { title: 'CBSE Affiliation Infrastructure Report', description: 'Classrooms, labs, library, playground, and per-student area for affiliation and renewal.', group: 'Government & Compliance' },
  { title: 'State Government Inspection Report', description: 'Campus physical infrastructure summary for a state education inspection.', group: 'Government & Compliance' },
  { title: 'Complete Campus Layout Report', description: 'All buildings, floors, rooms, conditions, and capacities in one layout report.', group: 'Internal Management' },
  { title: 'Room Utilization Report', description: 'Usage and allocation status with utilization percentage by room.', group: 'Internal Management' },
  { title: 'Room Capacity vs Strength Report', description: 'Room capacity compared with current class/student strength; flags rooms near capacity.', group: 'Internal Management' },
  { title: 'Room Condition Report', description: 'Room condition, last maintenance date, next due date, and current status.', group: 'Internal Management' },
  { title: 'Hostel Occupancy Report', description: 'Hostel bed capacity, occupied beds, vacant beds, and occupancy rate.', group: 'Internal Management' },
  { title: 'Unallocated Rooms Report', description: 'Active rooms without class, student, staff, or event allocation.', group: 'Internal Management' },
  { title: 'Asset Location Report', description: 'Room-linked asset counts and device references for inventory reconciliation.', group: 'Internal Management' },
  { title: 'Room Maintenance History Report', description: 'Maintenance notes, completed dates, and next scheduled service by room.', group: 'Internal Management' },
  { title: 'Building-wise Room Summary', description: 'Room counts by type and combined capacity for each building.', group: 'Internal Management' },
  { title: 'Exam Hall Availability Report', description: 'Exam-eligible rooms and their alternate exam seating capacities.', group: 'Internal Management' },
  { title: 'Facility Availability Report', description: 'Rooms that have projector, smart board, AC, Wi-Fi, CCTV, and safety facilities.', group: 'Internal Management' }
];

function createEmptyBuilding(campus: string): Omit<CampusBuilding, 'id' | 'initialRoomCount'> {
  return { campus, name: '', shortName: '', code: '', type: 'Academic', upperFloors: 1, groundFloor: true, floorNaming: 'Ground, 1st, 2nd…', builtUpArea: 0, constructionType: 'Pucca (RCC)', yearBuilt: new Date().getFullYear(), renovationYear: 0, condition: 'Good', status: 'Active', location: '', facilities: [], fireExit: '', assemblyPoint: '', emergencyDescription: '', inchargeName: '', inchargePhone: '', remarks: '', photo: '', floorPlan: '' };
}

function createEmptyRoom(buildingId: number, campus: string): Omit<CampusRoom, 'id'> {
  return { campus, buildingId, roomNumber: '', name: '', type: 'Classroom', floorLevel: 0, capacity: 45, examCapacity: 30, examEligible: true, beds: 0, bedType: '', feeCategory: '', annualFee: 0, emergencyExit: '', area: 700, length: 30, width: 24, condition: 'Good', status: 'Active', currentStrength: 0, allocatedTo: '', department: '', amenities: [], maintainedOn: '', nextMaintenance: '', maintenanceRemarks: '', bookable: false, assetsCount: 0, biometricId: '', cameraId: '', smartBoardId: '', projectorAssetId: '', photo: '', remarks: '' };
}

function exportFile(name: string, text: string, mime = 'application/json') {
  const blob = new Blob([text], { type: mime });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = name;
  link.click();
  URL.revokeObjectURL(url);
}

function StatCard({ title, value, detail, icon, tone }: { title: string; value: string; detail?: string; icon: React.ReactNode; tone: string }) {
  return <Card noPadding className="min-h-[108px]"><div className="flex items-start gap-3 p-5"><span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${tone}`}>{icon}</span><div className="min-w-0"><p className="text-xs font-medium text-gray-500">{title}</p><p className="mt-1 truncate text-2xl font-bold text-gray-900">{value}</p>{detail && <p className="mt-1 text-xs text-gray-500">{detail}</p>}</div></div></Card>;
}

function RoomStatusBadge({ status }: { status: RoomStatus }) {
  const variant = status === 'Active' ? 'success' : status === 'Under Maintenance' ? 'warning' : status === 'Inactive' ? 'secondary' : 'info';
  return <Badge variant={variant}>{status}</Badge>;
}

export function CampusBuildingRoomLayout() {
  const [buildings, setBuildings] = useState<CampusBuilding[]>(buildingSeeds);
  const [rooms, setRooms] = useState<CampusRoom[]>(initialRooms);
  const [selectedCampus, setSelectedCampus] = useState('Main Campus');
  const [activeTab, setActiveTab] = useState<CampusTab>('Dashboard');
  const [toast, setToast] = useState('');
  const [buildingSearch, setBuildingSearch] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [buildingFilter, setBuildingFilter] = useState('All');
  const [floorFilter, setFloorFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [allocatedFilter, setAllocatedFilter] = useState('All');
  const [conditionFilter, setConditionFilter] = useState('All');
  const [rowsPerPage, setRowsPerPage] = useState(14);
  const [page, setPage] = useState(1);
  const [selectedRoomIds, setSelectedRoomIds] = useState<number[]>([]);
  const [bulkStatus, setBulkStatus] = useState<RoomStatus>('Active');
  const [bulkCondition, setBulkCondition] = useState<BuildingCondition>('Good');
  const [showBuildingModal, setShowBuildingModal] = useState(false);
  const [showRoomModal, setShowRoomModal] = useState(false);
  const [editingBuildingId, setEditingBuildingId] = useState<number | null>(null);
  const [editingRoomId, setEditingRoomId] = useState<number | null>(null);
  const [buildingForm, setBuildingForm] = useState(createEmptyBuilding('Main Campus'));
  const [roomForm, setRoomForm] = useState(createEmptyRoom(1, 'Main Campus'));
  const [roomDetail, setRoomDetail] = useState<CampusRoom | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{ kind: 'building' | 'room'; id: number } | null>(null);
  const [selectedMapBuilding, setSelectedMapBuilding] = useState<number | null>(null);
  const [mapFloor, setMapFloor] = useState(0);
  const [mapZoom, setMapZoom] = useState(100);
  const [allocationView, setAllocationView] = useState<'Classroom Allocation' | 'Hostel Allocation' | 'Staff / Office Allocation'>('Classroom Allocation');
  const [academicYear, setAcademicYear] = useState('2025-26');
  const [classAllocations, setClassAllocations] = useState<ClassroomAllocation[]>(() => getInitialClassroomAllocations(initialRooms));
  const [staffAllocations, setStaffAllocations] = useState<StaffAllocation[]>([
    { id: 1, department: 'School Leadership', role: 'Principal', roomId: initialRooms.find((room) => room.roomNumber === 'ADM-01')?.id || null },
    { id: 2, department: 'Finance', role: 'Accounts Team', roomId: initialRooms.find((room) => room.roomNumber === 'ADM-02')?.id || null },
    { id: 3, department: 'Admissions', role: 'Admission Office', roomId: initialRooms.find((room) => room.roomNumber === 'ADM-03')?.id || null },
    { id: 4, department: 'Teaching Staff', role: 'Staff Room', roomId: initialRooms.find((room) => room.roomNumber === 'ADM-04')?.id || null }
  ]);
  const [hostelFilter, setHostelFilter] = useState('HSTL-B');
  const [reportPreview, setReportPreview] = useState<ReportSpec | null>(null);

  const notify = (message: string) => { setToast(message); window.setTimeout(() => setToast(''), 3200); };
  const campusBuildings = useMemo(() => buildings.filter((building) => building.campus === selectedCampus), [buildings, selectedCampus]);
  const campusRooms = useMemo(() => rooms.filter((room) => room.campus === selectedCampus), [rooms, selectedCampus]);
  const totalRooms = campusRooms.length;
  const activeRooms = campusRooms.filter((room) => room.status === 'Active').length;
  const unavailableRooms = totalRooms - activeRooms;
  const totalCapacity = campusRooms.reduce((sum, room) => sum + room.capacity, 0);
  const totalStrength = campusRooms.reduce((sum, room) => sum + room.currentStrength, 0);
  const utilization = totalCapacity ? Math.min(100, Math.round(totalStrength / totalCapacity * 1000) / 10) : 0;
  const allBuildingOptions = campusBuildings.map((building) => ({ value: String(building.id), label: `${building.name} (${building.code})` }));

  const filteredRooms = useMemo(() => campusRooms.filter((room) => {
    const building = campusBuildings.find((item) => item.id === room.buildingId);
    const matchesSearch = `${room.roomNumber} ${room.name} ${building?.name || ''} ${room.type} ${room.allocatedTo}`.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBuilding = buildingFilter === 'All' || String(room.buildingId) === buildingFilter;
    const matchesFloor = floorFilter === 'All' || String(room.floorLevel) === floorFilter;
    const matchesType = typeFilter === 'All' || room.type === typeFilter;
    const matchesStatus = statusFilter === 'All' || room.status === statusFilter;
    const matchesAllocation = allocatedFilter === 'All' || (allocatedFilter === 'Allocated' ? Boolean(room.allocatedTo || room.currentStrength) : !room.allocatedTo && !room.currentStrength);
    const matchesCondition = conditionFilter === 'All' || room.condition === conditionFilter;
    return matchesSearch && matchesBuilding && matchesFloor && matchesType && matchesStatus && matchesAllocation && matchesCondition;
  }), [campusRooms, campusBuildings, searchTerm, buildingFilter, floorFilter, typeFilter, statusFilter, allocatedFilter, conditionFilter]);
  const maxPage = Math.max(1, Math.ceil(filteredRooms.length / rowsPerPage));
  const pageRooms = filteredRooms.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  const resetRoomFilters = () => { setSearchTerm(''); setBuildingFilter('All'); setFloorFilter('All'); setTypeFilter('All'); setStatusFilter('All'); setAllocatedFilter('All'); setConditionFilter('All'); setPage(1); };
  const switchTab = (tab: CampusTab) => { setActiveTab(tab); setPage(1); };

  const openAddBuilding = () => { setEditingBuildingId(null); setBuildingForm(createEmptyBuilding(selectedCampus)); setShowBuildingModal(true); };
  const openEditBuilding = (building: CampusBuilding) => {
    setEditingBuildingId(building.id);
    setBuildingForm({ ...building, facilities: [...building.facilities] });
    setShowBuildingModal(true);
  };
  const saveBuilding = (addRooms = false) => {
    if (!buildingForm.name.trim() || !buildingForm.code.trim()) { notify('Building name and code are required.'); return; }
    const normalized = { ...buildingForm, code: buildingForm.code.trim().toUpperCase(), name: buildingForm.name.trim(), shortName: buildingForm.shortName.trim() || buildingForm.name.trim() };
    if (normalized.code.length > 8) { notify('Building code must be no longer than 8 characters.'); return; }
    if (buildings.some((building) => building.campus === selectedCampus && building.id !== editingBuildingId && building.code.toUpperCase() === normalized.code)) { notify('Building code must be unique within this campus.'); return; }
    const originalBuilding = editingBuildingId === null ? undefined : buildings.find((building) => building.id === editingBuildingId);
    if (originalBuilding && originalBuilding.code !== normalized.code && rooms.some((room) => room.buildingId === editingBuildingId)) { notify('Building code cannot change after rooms have been added.'); return; }
    if (editingBuildingId !== null) {
      setBuildings((previous) => previous.map((building) => building.id === editingBuildingId ? { ...building, ...normalized } : building));
      setShowBuildingModal(false);
      notify('Building details updated.');
    } else {
      const id = Math.max(0, ...buildings.map((building) => building.id)) + 1;
      const newBuilding: CampusBuilding = { id, ...normalized, initialRoomCount: 0 };
      setBuildings((previous) => [...previous, newBuilding]);
      setShowBuildingModal(false);
      if (addRooms) {
        const newRoomForm = createEmptyRoom(id, selectedCampus);
        setRoomForm({ ...newRoomForm, roomNumber: `${normalized.code}-F0-01` });
        setEditingRoomId(null);
        setShowRoomModal(true);
      }
      notify(addRooms ? 'Building saved. Add its first room.' : 'Building added successfully.');
    }
  };

  const openAddRoom = (buildingId?: number) => {
    const targetBuildingId = buildingId || (buildingFilter !== 'All' ? Number(buildingFilter) : campusBuildings[0]?.id) || 0;
    const building = campusBuildings.find((item) => item.id === targetBuildingId);
    const nextNumber = campusRooms.filter((room) => room.buildingId === targetBuildingId).length + 1;
    const prefix = building?.code || 'ROOM';
    setRoomForm({ ...createEmptyRoom(targetBuildingId, selectedCampus), roomNumber: `${prefix}-F0-${String(nextNumber).padStart(2, '0')}` });
    setEditingRoomId(null);
    setShowRoomModal(true);
  };
  const openEditRoom = (room: CampusRoom) => { setRoomForm({ ...room, amenities: [...room.amenities] }); setEditingRoomId(room.id); setShowRoomModal(true); };
  const saveRoom = (addAnother = false) => {
    if (!roomForm.roomNumber.trim() || !roomForm.name.trim() || !roomForm.buildingId) { notify('Building, room number, and room name are required.'); return; }
    const roomNumber = roomForm.roomNumber.trim().toUpperCase();
    if (rooms.some((room) => room.campus === selectedCampus && room.buildingId === roomForm.buildingId && room.roomNumber === roomNumber && room.id !== editingRoomId)) { notify('That room number already exists in this building.'); return; }
    const updated = { ...roomForm, roomNumber, name: roomForm.name.trim() };
    if (editingRoomId !== null) setRooms((previous) => previous.map((room) => room.id === editingRoomId ? { ...room, ...updated } : room));
    else setRooms((previous) => [...previous, { id: Math.max(0, ...previous.map((room) => room.id)) + 1, ...updated }]);
    if (addAnother && editingRoomId === null) {
      const building = campusBuildings.find((item) => item.id === roomForm.buildingId);
      const nextNumber = campusRooms.filter((room) => room.buildingId === roomForm.buildingId).length + 2;
      const prefix = building?.code || 'ROOM';
      setRoomForm({ ...createEmptyRoom(roomForm.buildingId, selectedCampus), roomNumber: `${prefix}-F${roomForm.floorLevel}-${String(nextNumber).padStart(2, '0')}`, floorLevel: roomForm.floorLevel });
      setShowRoomModal(true);
    } else setShowRoomModal(false);
    notify(editingRoomId !== null ? 'Room details updated.' : addAnother ? 'Room saved. Add the next room.' : 'Room added successfully.');
  };
  const confirmDeleteItem = () => {
    if (!confirmDelete) return;
    if (confirmDelete.kind === 'room') {
      const room = rooms.find((item) => item.id === confirmDelete.id);
      if (room?.allocatedTo || room?.currentStrength) { notify('Clear the room allocation before removing this room.'); setConfirmDelete(null); return; }
      setRooms((previous) => previous.filter((item) => item.id !== confirmDelete.id));
      notify('Room removed from the layout.');
    } else {
      if (rooms.some((room) => room.buildingId === confirmDelete.id)) { notify('A building can only be deleted when it has no rooms.'); setConfirmDelete(null); return; }
      setBuildings((previous) => previous.filter((building) => building.id !== confirmDelete.id));
      notify('Building removed from the layout.');
    }
    setConfirmDelete(null);
  };

  const getBuilding = (id: number) => buildings.find((building) => building.id === id);
  const getRoom = (id: number | null) => id === null ? undefined : rooms.find((room) => room.id === id);
  const selectedFilterBuilding = campusBuildings.find((building) => String(building.id) === buildingFilter);
  const floorOptions = Array.from({ length: (selectedFilterBuilding?.upperFloors ?? 3) + 1 }, (_, index) => index);

  const exportLayout = () => {
    const payload = { campus: selectedCampus, exportedAt: new Date().toISOString(), buildings: campusBuildings, rooms: campusRooms };
    exportFile(`campus-layout-${selectedCampus.toLowerCase().replace(/\s+/g, '-')}.json`, JSON.stringify(payload, null, 2));
    notify('Campus layout exported as JSON.');
  };
  const exportRoomsCsv = () => {
    const rows = [['Room No.', 'Room Name', 'Building', 'Floor', 'Type', 'Capacity', 'Condition', 'Status', 'Allocation'], ...filteredRooms.map((room) => [room.roomNumber, room.name, getBuilding(room.buildingId)?.name || '', roomFloorName(room.floorLevel), room.type, String(room.capacity), room.condition, room.status, room.allocatedTo])];
    exportFile('campus-rooms.csv', rows.map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(',')).join('\n'), 'text/csv');
  };

  const activeMapBuilding = selectedMapBuilding === null ? null : campusBuildings.find((building) => building.id === selectedMapBuilding) || null;
  const mapRooms = activeMapBuilding ? campusRooms.filter((room) => room.buildingId === activeMapBuilding.id && room.floorLevel === mapFloor) : [];

  const updateClassroomAllocation = (rowId: number, roomId: number | null) => {
    if (roomId !== null && classAllocations.some((row) => row.id !== rowId && row.roomId === roomId)) { notify('This room is already assigned to another class or section.'); return; }
    const allocation = classAllocations.find((row) => row.id === rowId);
    if (!allocation) return;
    setClassAllocations((previous) => previous.map((row) => row.id === rowId ? { ...row, roomId } : row));
    setRooms((previous) => previous.map((room) => {
      if (room.id === allocation.roomId && !classAllocations.some((row) => row.id !== rowId && row.roomId === allocation.roomId)) return { ...room, allocatedTo: '', currentStrength: 0 };
      if (room.id === roomId) return { ...room, allocatedTo: `${allocation.className}${allocation.section ? `-${allocation.section}` : ''}`, currentStrength: allocation.strength };
      return room;
    }));
  };
  const updateStaffAllocation = (rowId: number, roomId: number | null) => {
    if (roomId !== null && staffAllocations.some((row) => row.id !== rowId && row.roomId === roomId)) { notify('This room is already assigned to another staff/office group.'); return; }
    const allocation = staffAllocations.find((row) => row.id === rowId);
    if (!allocation) return;
    setStaffAllocations((previous) => previous.map((row) => row.id === rowId ? { ...row, roomId } : row));
    setRooms((previous) => previous.map((room) => {
      if (room.id === allocation.roomId && !staffAllocations.some((row) => row.id !== rowId && row.roomId === allocation.roomId)) return { ...room, allocatedTo: '' };
      if (room.id === roomId) return { ...room, allocatedTo: `${allocation.department} · ${allocation.role}` };
      return room;
    }));
  };
  const clearAllocations = () => {
    const classRoomIds = classAllocations.map((row) => row.roomId).filter((id): id is number => id !== null);
    const staffRoomIds = staffAllocations.map((row) => row.roomId).filter((id): id is number => id !== null);
    setClassAllocations((previous) => previous.map((row) => ({ ...row, roomId: null })));
    setStaffAllocations((previous) => previous.map((row) => ({ ...row, roomId: null })));
    setRooms((previous) => previous.map((room) => {
      if (room.type === 'Hostel Room' && room.campus === selectedCampus) return { ...room, currentStrength: 0, allocatedTo: '' };
      if (classRoomIds.includes(room.id)) return { ...room, currentStrength: 0, allocatedTo: '' };
      if (staffRoomIds.includes(room.id)) return { ...room, allocatedTo: '' };
      return room;
    }));
    notify('Classroom, hostel, and staff allocations cleared for this campus.');
  };

  const exportReportCsv = (report: ReportSpec) => {
    const rows = [['Report', report.title], ['Campus', selectedCampus], ['Generated', new Date().toLocaleString()], ['Buildings', String(campusBuildings.length)], ['Rooms', String(campusRooms.length)], ['Active Rooms', String(activeRooms)], ['Rooms Under Maintenance', String(campusRooms.filter((room) => room.status === 'Under Maintenance').length)], ['Total Capacity', String(totalCapacity)], ['Utilization', `${utilization}%`], [], ['Room No.', 'Room Name', 'Building', 'Type', 'Capacity', 'Condition', 'Status', 'Allocated To'], ...campusRooms.map((room) => [room.roomNumber, room.name, getBuilding(room.buildingId)?.name || '', room.type, String(room.capacity), room.condition, room.status, room.allocatedTo])];
    exportFile(`${report.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.csv`, rows.map((row) => row.map((value) => `"${String(value ?? '').replace(/"/g, '""')}"`).join(',')).join('\n'), 'text/csv');
  };

  const roomColumns = [
    { key: 'select', header: 'Select', render: (room: CampusRoom) => <input type="checkbox" aria-label={`Select ${room.roomNumber}`} checked={selectedRoomIds.includes(room.id)} onChange={(event) => setSelectedRoomIds((previous) => event.target.checked ? [...previous, room.id] : previous.filter((id) => id !== room.id))} className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" /> },
    { key: 'roomNumber', header: 'Room No.', render: (room: CampusRoom) => <div><span className="font-semibold text-gray-900">{room.roomNumber}</span><span className="block text-xs text-gray-500">{room.name}</span></div> },
    { key: 'building', header: 'Building', render: (room: CampusRoom) => <span>{getBuilding(room.buildingId)?.name || '—'}</span> },
    { key: 'floor', header: 'Floor', render: (room: CampusRoom) => roomFloorName(room.floorLevel) },
    { key: 'type', header: 'Type', render: (room: CampusRoom) => <Badge variant="outline">{room.type}</Badge> },
    { key: 'capacity', header: 'Capacity', render: (room: CampusRoom) => <span>{room.type === 'Hostel Room' ? `${room.beds} beds` : room.capacity}</span> },
    { key: 'condition', header: 'Condition', render: (room: CampusRoom) => <ConditionBadge condition={room.condition} /> },
    { key: 'status', header: 'Status', render: (room: CampusRoom) => <RoomStatusBadge status={room.status} /> },
    { key: 'actions', header: 'Actions', render: (room: CampusRoom) => <div className="flex gap-1"><Button variant="ghost" size="xs" title="View room" onClick={() => setRoomDetail(room)}><Eye className="h-4 w-4" /></Button><Button variant="ghost" size="xs" title="Edit room" onClick={() => openEditRoom(room)}><Edit2 className="h-4 w-4" /></Button><Button variant="ghost" size="xs" title="Remove room" className="text-red-600" onClick={() => setConfirmDelete({ kind: 'room', id: room.id })}><Trash2 className="h-4 w-4" /></Button></div> }
  ];

  const buildingColumns = [
    { key: 'name', header: 'Building Name', render: (building: CampusBuilding) => <div className="min-w-[160px]"><span className="font-semibold text-gray-900">{building.name}</span><span className="block font-mono text-xs text-gray-500">{building.code} · {building.campus}</span></div> },
    { key: 'type', header: 'Type', render: (building: CampusBuilding) => building.type },
    { key: 'floors', header: 'Floors', render: (building: CampusBuilding) => `${building.groundFloor ? 'G + ' : ''}${building.upperFloors}` },
    { key: 'rooms', header: 'Rooms', render: (building: CampusBuilding) => rooms.filter((room) => room.buildingId === building.id).length },
    { key: 'area', header: 'Built-up Area', render: (building: CampusBuilding) => `${building.builtUpArea.toLocaleString('en-IN')} sqft` },
    { key: 'condition', header: 'Condition', render: (building: CampusBuilding) => <ConditionBadge condition={building.condition} /> },
    { key: 'actions', header: 'Actions', render: (building: CampusBuilding) => <div className="flex min-w-[185px] gap-1"><Button size="xs" variant="outline" onClick={() => { setBuildingFilter(String(building.id)); switchTab('Rooms'); }}>Rooms</Button><Button size="xs" variant="ghost" onClick={() => openEditBuilding(building)}><Edit2 className="h-3.5 w-3.5" /> Edit</Button><Button size="xs" variant="ghost" className="text-red-600" disabled={rooms.some((room) => room.buildingId === building.id)} title={rooms.some((room) => room.buildingId === building.id) ? 'Remove all rooms first' : 'Delete building'} onClick={() => setConfirmDelete({ kind: 'building', id: building.id })}><Trash2 className="h-3.5 w-3.5" /></Button></div> }
  ];

  const roomTypeBreakdown = useMemo(() => {
    const counts = new Map<string, number>();
    campusRooms.forEach((room) => counts.set(room.type, (counts.get(room.type) || 0) + 1));
    return [...counts.entries()].sort((a, b) => b[1] - a[1]);
  }, [campusRooms]);
  const typeColors = ['#2563eb', '#7c3aed', '#0f766e', '#ea580c', '#db2777', '#0891b2', '#ca8a04', '#4f46e5', '#16a34a'];
  let gradientStop = 0;
  const donutGradient = roomTypeBreakdown.length ? `conic-gradient(${roomTypeBreakdown.map(([, count], index) => { const from = gradientStop; gradientStop += count / Math.max(1, totalRooms) * 100; return `${typeColors[index % typeColors.length]} ${from}% ${gradientStop}%`; }).join(', ')})` : 'conic-gradient(#e5e7eb 0% 100%)';
  const buildingOverview = campusBuildings.map((building) => ({ building, count: campusRooms.filter((room) => room.buildingId === building.id).length }));
  const maxBuildingRoomCount = Math.max(1, ...buildingOverview.map((item) => item.count));
  const healthCards = [
    { title: 'Total Campus Built-up Area', value: `${campusBuildings.reduce((sum, building) => sum + building.builtUpArea, 0).toLocaleString('en-IN')} sqft`, sub: `${(campusBuildings.reduce((sum, building) => sum + building.builtUpArea, 0) / 43560).toFixed(1)} acres total`, icon: <Building2 className="h-5 w-5" /> },
    { title: 'Academic Rooms', value: `${campusRooms.filter((room) => ['Classroom', 'Lab', 'Computer Lab', 'Library'].includes(room.type)).length} rooms`, sub: `${campusRooms.filter((room) => room.type === 'Classroom').length} classrooms · ${campusRooms.filter((room) => ['Lab', 'Computer Lab'].includes(room.type)).length} labs`, icon: <BookOpenIcon /> },
    { title: 'Hostel Rooms', value: `${campusRooms.filter((room) => room.type === 'Hostel Room').length} rooms`, sub: `${campusRooms.filter((room) => room.type === 'Hostel Room').reduce((sum, room) => sum + room.currentStrength, 0)} beds currently occupied`, icon: <BedDouble className="h-5 w-5" /> },
    { title: 'Sports & Activity Areas', value: `${campusRooms.filter((room) => ['Sports Hall', 'Playground', 'Swimming Pool'].includes(room.type)).length} areas`, sub: 'Grounds, courts, and halls', icon: <Activity className="h-5 w-5" /> },
    { title: 'Labs & Special Rooms', value: `${campusRooms.filter((room) => ['Lab', 'Computer Lab', 'Medical Room', 'Server Room'].includes(room.type)).length} rooms`, sub: `${campusRooms.filter((room) => room.type === 'Computer Lab').length} computer labs · other special rooms included`, icon: <Grid3X3 className="h-5 w-5" /> }
  ];
  const alerts = [
    ...campusRooms.filter((room) => room.status === 'Under Maintenance').slice(0, 2).map((room) => ({ tone: 'red', title: `Room ${room.roomNumber} (${room.name}) is under maintenance`, detail: `${getBuilding(room.buildingId)?.name || 'Building'} · follow-up required`, action: 'Update Status' })),
    ...campusRooms.filter((room) => room.condition === 'Needs Major Repair' && room.status !== 'Under Maintenance').slice(0, 1).map((room) => ({ tone: 'red', title: `${getBuilding(room.buildingId)?.name || 'Building'} — ${room.roomNumber} needs repair`, detail: 'Review condition and log the maintenance follow-up.', action: 'Review Room' })),
    { tone: 'orange', title: `${campusRooms.filter((room) => room.assetsCount === 0).length} rooms have no assets assigned`, detail: 'Verify inventory against rooms and equipment.', action: 'Go to Assets' },
    { tone: 'orange', title: `${campusRooms.filter((room) => room.type === 'Classroom' && !room.allocatedTo).length} classrooms have no class allocation`, detail: 'Review room allocation for the current academic year.', action: 'Allocate Now' },
    { tone: 'amber', title: `Campus utilization is ${utilization}%`, detail: `${totalStrength.toLocaleString('en-IN')} of ${totalCapacity.toLocaleString('en-IN')} room capacity currently occupied.`, action: 'Monitor' }
  ];

  const tabs: { key: CampusTab; icon: React.ReactNode }[] = [
    { key: 'Dashboard', icon: <LayoutDashboard className="h-4 w-4" /> },
    { key: 'Buildings', icon: <Building2 className="h-4 w-4" /> },
    { key: 'Rooms', icon: <DoorOpen className="h-4 w-4" /> },
    { key: 'Layout Map', icon: <MapIcon className="h-4 w-4" /> },
    { key: 'Room Allocation', icon: <ClipboardList className="h-4 w-4" /> },
    { key: 'Reports', icon: <BarChart3 className="h-4 w-4" /> }
  ];

  const renderDashboard = () => (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {healthCards.map((card, index) => <Card key={card.title} className="min-h-[132px]"><div className="flex items-start gap-3"><span className={`flex h-10 w-10 items-center justify-center rounded-xl ${['bg-blue-50 text-blue-700', 'bg-violet-50 text-violet-700', 'bg-amber-50 text-amber-700', 'bg-green-50 text-green-700', 'bg-cyan-50 text-cyan-700'][index]}`}>{card.icon}</span><div><p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{card.title}</p><p className="mt-2 text-lg font-bold text-gray-900">{card.value}</p><p className="mt-1 text-xs text-gray-500">{card.sub}</p></div></div></Card>)}
      </div>
      <div className="grid gap-5 xl:grid-cols-2">
        <Card title="Rooms per Building"><div className="space-y-3">{buildingOverview.map(({ building, count }) => <div key={building.id} className="grid grid-cols-[112px_1fr_40px] items-center gap-3 text-sm"><span className="truncate text-gray-600">{building.shortName}</span><div className="h-3 overflow-hidden rounded-full bg-gray-100"><div className="h-full rounded-full bg-blue-600" style={{ width: `${Math.max(4, count / maxBuildingRoomCount * 100)}%` }} /></div><span className="text-right font-semibold text-gray-800">{count}</span></div>)}</div><p className="mt-4 text-xs text-gray-400">Room inventory is grouped by the selected campus.</p></Card>
        <Card title="Room Type Breakdown"><div className="flex flex-col items-center gap-6 sm:flex-row"><div className="relative flex h-48 w-48 shrink-0 items-center justify-center rounded-full" style={{ background: donutGradient }}><div className="flex h-28 w-28 flex-col items-center justify-center rounded-full bg-white shadow-inner"><span className="text-2xl font-bold text-gray-900">{totalRooms}</span><span className="text-xs text-gray-500">total rooms</span></div></div><div className="max-h-48 flex-1 space-y-2 overflow-y-auto">{roomTypeBreakdown.map(([type, count], index) => <div key={type} className="flex items-center justify-between gap-3 text-sm"><div className="flex min-w-0 items-center gap-2"><span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: typeColors[index % typeColors.length] }} /><span className="truncate text-gray-600">{type}</span></div><span className="whitespace-nowrap font-medium text-gray-800">{count} <span className="text-xs text-gray-400">({totalRooms ? (count / totalRooms * 100).toFixed(1) : '0.0'}%)</span></span></div>)}</div></div></Card>
      </div>
      <Card title="Quick Building Overview" headerAction={<Button variant="outline" size="sm" onClick={() => switchTab('Buildings')}>All Buildings <ChevronRight className="h-4 w-4" /></Button>}>
        <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">{buildingOverview.map(({ building, count }) => <div key={building.id} className="rounded-xl border border-gray-200 p-4"><div className="flex items-start justify-between gap-2"><div><h3 className="font-semibold text-gray-900">{building.name}</h3><p className="mt-1 font-mono text-xs text-gray-500">Code: {building.code}</p></div><Building2 className="h-5 w-5 text-blue-600" /></div><div className="my-3 grid grid-cols-2 gap-y-2 text-xs"><span className="text-gray-500">Floors</span><span className="text-right font-medium">{building.groundFloor ? `G + ${building.upperFloors}` : building.upperFloors}</span><span className="text-gray-500">Rooms</span><span className="text-right font-medium">{count}</span><span className="text-gray-500">Capacity</span><span className="text-right font-medium">{campusRooms.filter((room) => room.buildingId === building.id).reduce((sum, room) => sum + room.capacity, 0).toLocaleString('en-IN')}</span><span className="text-gray-500">Condition</span><span className="text-right"><ConditionBadge condition={building.condition} /></span><span className="text-gray-500">Built</span><span className="text-right font-medium">{building.yearBuilt || '—'}</span></div><div className="flex gap-2"><Button size="sm" variant="outline" onClick={() => { setBuildingFilter(String(building.id)); switchTab('Rooms'); }}><Eye className="h-4 w-4" /> View Rooms</Button><Button size="sm" variant="ghost" onClick={() => openEditBuilding(building)}><Edit2 className="h-4 w-4" /> Edit</Button></div></div>)}</div>
      </Card>
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <Card title="Alerts & Attention Needed"><div className="divide-y">{alerts.map((alert, index) => <div key={`${alert.title}-${index}`} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0"><span className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${alert.tone === 'red' ? 'bg-red-500' : alert.tone === 'orange' ? 'bg-orange-500' : 'bg-amber-400'}`} /><div className="min-w-0 flex-1"><p className="text-sm font-semibold text-gray-800">{alert.title}</p><p className="mt-1 text-xs text-gray-500">{alert.detail}</p></div><Button size="xs" variant="outline" onClick={() => alert.action === 'Allocate Now' ? switchTab('Room Allocation') : alert.action === 'Review Room' || alert.action === 'Update Status' ? switchTab('Rooms') : alert.action === 'Go to Assets' ? notify('Room asset integration is ready to connect to Inventory.') : notify('Campus utilization is within the dashboard monitoring range.')}>{alert.action}</Button></div>)}</div></Card>
        <Card title="Recent Changes Log"><div className="space-y-3">{[
          { date: '27-Nov-2025 · 09:00 AM', change: 'Room CR-205 allocated to Class 10-A', by: 'Admin' },
          { date: '26-Nov-2025 · 03:00 PM', change: 'Hostel room GF-08 marked inactive for repair', by: 'Warden' },
          { date: '25-Nov-2025 · 11:00 AM', change: 'New Chemistry Lab room added', by: 'Admin' },
          { date: '24-Nov-2025 · 02:00 PM', change: 'Computer Block condition updated', by: 'Admin' }
        ].map((entry) => <div key={entry.date} className="flex gap-3"><span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-blue-500" /><div className="min-w-0 flex-1"><p className="text-sm text-gray-800">{entry.change}</p><p className="mt-1 text-xs text-gray-400">{entry.date} · {entry.by}</p></div></div>)}</div></Card>
      </div>
    </div>
  );

  const renderBuildings = () => {
    const filteredBuildings = campusBuildings.filter((building) => `${building.name} ${building.code} ${building.type}`.toLowerCase().includes(buildingSearch.toLowerCase()));
    return <Card title="All Buildings on Campus" headerAction={<div className="flex gap-2"><Button size="sm" variant="outline" onClick={exportLayout}><Download className="h-4 w-4" /> Export</Button><Button size="sm" onClick={openAddBuilding}><Plus className="h-4 w-4" /> Add New Building</Button></div>} noPadding><div className="flex flex-wrap items-center justify-between gap-3 border-b px-5 py-4"><p className="text-sm text-gray-500">Manage building identity, physical specifications, safety, and facilities.</p><div className="relative w-full sm:max-w-xs"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" /><input value={buildingSearch} onChange={(event) => setBuildingSearch(event.target.value)} placeholder="Search building…" className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-3 text-sm" /></div></div><Table columns={buildingColumns} data={filteredBuildings} emptyMessage="No buildings match your search." /></Card>;
  };

  const renderRooms = () => (
    <div className="space-y-4">
      <Card noPadding><div className="grid gap-3 p-4 lg:grid-cols-4"><div className="relative lg:col-span-2"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" /><input value={searchTerm} onChange={(event) => { setSearchTerm(event.target.value); setPage(1); }} placeholder="Search room no., name, building, type…" className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-3 text-sm" /></div><Select options={[{ value: 'All', label: 'All Buildings' }, ...allBuildingOptions]} value={buildingFilter} onChange={(event) => { setBuildingFilter(event.target.value); setFloorFilter('All'); setPage(1); }} /><Select options={[{ value: 'All', label: 'All Floors' }, ...floorOptions.map((level) => ({ value: String(level), label: roomFloorName(level) }))]} value={floorFilter} onChange={(event) => { setFloorFilter(event.target.value); setPage(1); }} /><Select options={[{ value: 'All', label: 'All Room Types' }, ...ROOM_TYPES.map((type) => ({ value: type, label: type }))]} value={typeFilter} onChange={(event) => { setTypeFilter(event.target.value); setPage(1); }} /><Select options={[{ value: 'All', label: 'All Statuses' }, ...ROOM_STATUSES.map((status) => ({ value: status, label: status }))]} value={statusFilter} onChange={(event) => { setStatusFilter(event.target.value); setPage(1); }} /><Select options={[{ value: 'All', label: 'Allocated & Unallocated' }, { value: 'Allocated', label: 'Allocated' }, { value: 'Unallocated', label: 'Unallocated' }]} value={allocatedFilter} onChange={(event) => { setAllocatedFilter(event.target.value); setPage(1); }} /><Select options={[{ value: 'All', label: 'All Conditions' }, ...CONDITIONS.map((condition) => ({ value: condition, label: condition }))]} value={conditionFilter} onChange={(event) => { setConditionFilter(event.target.value); setPage(1); }} /></div><div className="flex flex-wrap justify-between gap-2 border-t bg-gray-50 px-4 py-3"><div className="flex gap-2"><Button size="sm" variant="outline" onClick={resetRoomFilters}><RotateCcw className="h-4 w-4" /> Reset</Button><Button size="sm" variant="outline" onClick={exportRoomsCsv}><Download className="h-4 w-4" /> Export Rooms List</Button></div><Button size="sm" onClick={() => openAddRoom()}><Plus className="h-4 w-4" /> Add Room</Button></div></Card>
      <Card noPadding><Table columns={roomColumns} data={pageRooms} emptyMessage="No rooms match these filters." /><div className="flex flex-wrap items-center justify-between gap-3 border-t px-4 py-3 text-xs text-gray-500"><span>Showing {filteredRooms.length ? (page - 1) * rowsPerPage + 1 : 0}–{Math.min(page * rowsPerPage, filteredRooms.length)} of {filteredRooms.length} rooms</span><div className="flex items-center gap-2"><label htmlFor="rooms-per-page">Rows per page</label><select id="rooms-per-page" value={rowsPerPage} onChange={(event) => { setRowsPerPage(Number(event.target.value)); setPage(1); }} className="rounded border border-gray-300 px-2 py-1"><option value={14}>14</option><option value={25}>25</option><option value={50}>50</option></select><Button size="xs" variant="outline" disabled={page <= 1} onClick={() => setPage((value) => Math.max(1, value - 1))}><ChevronLeft className="h-3.5 w-3.5" /> Previous</Button><span>Page {page} of {maxPage}</span><Button size="xs" variant="outline" disabled={page >= maxPage} onClick={() => setPage((value) => Math.min(maxPage, value + 1))}>Next <ChevronRight className="h-3.5 w-3.5" /></Button></div></div></Card>
      <div className="flex flex-wrap items-center gap-2 rounded-lg border border-gray-200 bg-white p-3 text-xs text-gray-600"><span className="mr-2 font-semibold">Bulk actions · {selectedRoomIds.length} selected</span><Select className="w-48" options={ROOM_STATUSES.map((status) => ({ value: status, label: status }))} value={bulkStatus} onChange={(event) => setBulkStatus(event.target.value as RoomStatus)} /><Button size="xs" variant="outline" onClick={() => { if (!selectedRoomIds.length) { notify('Select one or more rooms first.'); return; } setRooms((previous) => previous.map((room) => selectedRoomIds.includes(room.id) ? { ...room, status: bulkStatus } : room)); setSelectedRoomIds([]); notify('Room statuses updated.'); }}>Change Status</Button><Select className="w-52" options={CONDITIONS.map((condition) => ({ value: condition, label: condition }))} value={bulkCondition} onChange={(event) => setBulkCondition(event.target.value as BuildingCondition)} /><Button size="xs" variant="outline" onClick={() => { if (!selectedRoomIds.length) { notify('Select one or more rooms first.'); return; } setRooms((previous) => previous.map((room) => selectedRoomIds.includes(room.id) ? { ...room, condition: bulkCondition } : room)); setSelectedRoomIds([]); notify('Room conditions updated.'); }}>Update Condition</Button><Button size="xs" variant="outline" onClick={() => { if (!selectedRoomIds.length) { notify('Select one or more rooms first.'); return; } notify(`${selectedRoomIds.length} rooms ready for allocation.`); switchTab('Room Allocation'); }}>Allocate Selected</Button></div>
    </div>
  );

  const renderLayoutMap = () => (
    <div className="space-y-4">
      <Card title={activeMapBuilding ? `Floor Plan — ${activeMapBuilding.name} (${activeMapBuilding.code})` : 'Campus Layout Map — Visual View'} headerAction={<div className="flex flex-wrap gap-2">{activeMapBuilding && <Button size="sm" variant="outline" onClick={() => setSelectedMapBuilding(null)}><ChevronLeft className="h-4 w-4" /> Back to Campus Map</Button>}<Button size="sm" variant="outline" onClick={() => setMapZoom((value) => Math.min(150, value + 10))}>Zoom In</Button><Button size="sm" variant="outline" onClick={() => setMapZoom((value) => Math.max(70, value - 10))}>Zoom Out</Button><Button size="sm" variant="outline" onClick={() => { setMapZoom(100); setSelectedMapBuilding(null); setMapFloor(0); }}><RotateCcw className="h-4 w-4" /> Reset</Button><Button size="sm" variant="outline" onClick={() => window.print()}><Printer className="h-4 w-4" /> Print Map</Button></div>}>
        {activeMapBuilding ? <div className="space-y-4"><div className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-gray-50 p-3"><p className="text-sm text-gray-600">{roomFloorName(mapFloor)} · {mapRooms.length} rooms · Condition: <ConditionBadge condition={activeMapBuilding.condition} /></p><Select className="w-56" options={Array.from({ length: activeMapBuilding.upperFloors + 1 }, (_, level) => ({ value: String(level), label: roomFloorName(level) }))} value={String(mapFloor)} onChange={(event) => setMapFloor(Number(event.target.value))} /></div><div className="overflow-auto rounded-xl border-2 border-dashed border-gray-300 bg-slate-50 p-5"><div className="mx-auto grid min-w-[650px] grid-cols-2 gap-3 md:grid-cols-4" style={{ transform: `scale(${mapZoom / 100})`, transformOrigin: 'top center' }}>{mapRooms.map((room) => <button key={room.id} onClick={() => setRoomDetail(room)} className={`min-h-[104px] rounded-xl border p-3 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${room.status === 'Inactive' ? 'border-gray-300 bg-gray-100' : room.status === 'Under Maintenance' || room.condition === 'Needs Major Repair' ? 'border-red-200 bg-red-50' : room.condition === 'Needs Minor Repair' ? 'border-amber-200 bg-amber-50' : 'border-green-200 bg-green-50'}`}><span className="font-mono text-xs font-bold">{room.roomNumber}</span><span className="mt-1 block truncate text-sm font-semibold">{room.name}</span><span className="mt-1 block text-xs text-gray-500">{room.type} · Cap {room.capacity || '—'}</span><span className="mt-2 block"><RoomStatusBadge status={room.status} /></span></button>)}{mapRooms.length === 0 && <p className="col-span-full py-10 text-center text-sm text-gray-500">No rooms configured on this floor.</p>}</div><div className="mt-6 rounded-lg border border-dashed border-gray-300 bg-white px-4 py-2 text-center text-xs font-semibold uppercase tracking-[0.25em] text-gray-400">Main Corridor</div></div><div className="flex flex-wrap gap-4 text-xs text-gray-600"><span>🟩 Active &amp; good</span><span>🟨 Needs repair</span><span>🟥 Under maintenance</span><span>⬛ Inactive</span></div><p className="text-xs text-gray-500">Click a room to review its details and linked allocation information.</p></div> : <><div className="mb-4 rounded-xl bg-blue-50 p-4"><p className="font-semibold text-blue-900">{selectedCampus} campus map</p><p className="mt-1 text-sm text-blue-800">Choose a building to view its floor-wise room layout. Building cards are interactive.</p></div><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{campusBuildings.map((building) => { const count = campusRooms.filter((room) => room.buildingId === building.id).length; return <button key={building.id} onClick={() => { setSelectedMapBuilding(building.id); setMapFloor(0); }} className="rounded-xl border border-gray-200 bg-white p-4 text-left shadow-sm transition hover:border-blue-300 hover:shadow-md"><div className="flex items-center justify-between"><span className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-700"><Building2 className="h-5 w-5" /></span><ConditionBadge condition={building.condition} /></div><h3 className="mt-4 font-semibold text-gray-900">{building.name}</h3><p className="mt-1 font-mono text-xs text-gray-500">{building.code} · {count} rooms</p><p className="mt-2 text-xs text-gray-600">{building.groundFloor ? `Ground + ${building.upperFloors} floors` : `${building.upperFloors} floors`}</p><span className="mt-4 inline-flex items-center text-xs font-semibold text-blue-700">Click to view rooms <ChevronRight className="ml-1 h-3.5 w-3.5" /></span></button>; })}</div></>}
      </Card>
    </div>
  );

  const renderClassroomAllocation = () => {
    const classroomRooms = campusRooms.filter((room) => room.type === 'Classroom' && room.status === 'Active');
    const unallocated = classAllocations.filter((row) => !row.roomId).length;
    const assignedIds = classAllocations.filter((row) => row.roomId).map((row) => row.roomId);
    return <Card title={`Classroom Allocation — Academic Year ${academicYear}`} noPadding><Table columns={[
      { key: 'class', header: 'Class', render: (row: ClassroomAllocation) => row.className },
      { key: 'section', header: 'Section / Stream', render: (row: ClassroomAllocation) => row.section || '—' },
      { key: 'room', header: 'Assigned Room', render: (row: ClassroomAllocation) => <Select options={[{ value: '', label: 'Select room' }, ...classroomRooms.map((room) => ({ value: String(room.id), label: `${room.roomNumber} · ${room.name}` }))]} value={row.roomId ? String(row.roomId) : ''} onChange={(event) => updateClassroomAllocation(row.id, event.target.value ? Number(event.target.value) : null)} /> },
      { key: 'capacity', header: 'Room Capacity', render: (row: ClassroomAllocation) => getRoom(row.roomId)?.capacity ?? '—' },
      { key: 'strength', header: 'Class Strength', render: (row: ClassroomAllocation) => { const capacity = getRoom(row.roomId)?.capacity || 0; return <span className={capacity && row.strength >= capacity ? 'font-bold text-red-600' : capacity && row.strength >= capacity * 0.9 ? 'font-semibold text-amber-600' : ''}>{row.strength}{capacity && row.strength >= capacity ? ' · Full' : capacity && row.strength >= capacity * 0.9 ? ' · Near full' : ''}</span>; } }
    ]} data={classAllocations} /><div className="flex flex-wrap items-center justify-between gap-3 border-t px-5 py-4"><div className="space-y-1 text-xs text-gray-500"><p>Unallocated classes: <strong className="text-gray-800">{unallocated}</strong></p><p>Conflict check: <strong className="text-green-700">No room is assigned to two classes</strong> · {assignedIds.length} assignments</p></div><Button onClick={() => notify('Classroom allocations saved for ' + academicYear + '.')}><Save className="h-4 w-4" /> Save Classroom Allocation</Button></div></Card>;
  };

  const renderHostelAllocation = () => {
    const hostelBuildings = campusBuildings.filter((building) => building.type === 'Hostel — Boys' || building.type === 'Hostel — Girls');
    const selectedHostel = hostelBuildings.find((building) => building.code === hostelFilter) || hostelBuildings[0];
    const hostelRooms = selectedHostel ? campusRooms.filter((room) => room.buildingId === selectedHostel.id && room.type === 'Hostel Room') : [];
    const beds = hostelRooms.reduce((sum, room) => sum + room.beds, 0);
    const occupied = hostelRooms.reduce((sum, room) => sum + room.currentStrength, 0);
    return <Card title="Hostel Room Allocation" headerAction={<Select className="w-56" options={hostelBuildings.map((building) => ({ value: building.code, label: `${building.name} (${building.code})` }))} value={selectedHostel?.code || ''} onChange={(event) => setHostelFilter(event.target.value)} />} noPadding><Table columns={[
      { key: 'number', header: 'Room No.', render: (room: CampusRoom) => <span className="font-mono font-semibold">{room.roomNumber}</span> },
      { key: 'type', header: 'Room Type', render: (room: CampusRoom) => room.bedType || 'Double Non-AC' },
      { key: 'capacity', header: 'Capacity (Beds)', render: (room: CampusRoom) => `${room.beds} beds` },
      { key: 'occupied', header: 'Occupied', render: (room: CampusRoom) => `${room.currentStrength}/${room.beds}` },
      { key: 'vacant', header: 'Vacant', render: (room: CampusRoom) => `${Math.max(0, room.beds - room.currentStrength)} beds` },
      { key: 'status', header: 'Status', render: (room: CampusRoom) => <RoomStatusBadge status={room.status} /> },
      { key: 'students', header: 'Students', render: (room: CampusRoom) => <Button size="xs" variant="outline" onClick={() => setRoomDetail(room)}>View Room</Button> }
    ]} data={hostelRooms.slice(0, 14)} emptyMessage="No hostel rooms in this building." /><div className="flex flex-wrap items-center justify-between gap-3 border-t px-5 py-4"><p className="text-sm text-gray-600">Total beds: <strong>{beds}</strong> · Occupied: <strong>{occupied}</strong> · Vacant: <strong>{Math.max(0, beds - occupied)}</strong> · Occupancy: <strong>{beds ? (occupied / beds * 100).toFixed(1) : '0.0'}%</strong></p><Button onClick={() => { const vacantRoom = hostelRooms.find((room) => room.status === 'Active' && room.currentStrength < room.beds); if (!vacantRoom) { notify('No active vacant beds are available in this hostel.'); return; } setRooms((previous) => previous.map((room) => room.id === vacantRoom.id ? { ...room, currentStrength: room.currentStrength + 1 } : room)); notify(`Demo student allocated to ${vacantRoom.roomNumber}.`); }}><Plus className="h-4 w-4" /> Allocate Student to Vacant Bed</Button></div></Card>;
  };

  const renderStaffAllocation = () => {
    const officeRooms = campusRooms.filter((room) => ['Office', 'Principal Office', 'Staff Room', 'Conference Room', 'Medical Room'].includes(room.type) && room.status === 'Active');
    return <Card title="Staff / Office Allocation" noPadding><Table columns={[
      { key: 'department', header: 'Department', render: (row: StaffAllocation) => row.department },
      { key: 'role', header: 'Role / Team', render: (row: StaffAllocation) => row.role },
      { key: 'room', header: 'Assigned Room', render: (row: StaffAllocation) => <Select options={[{ value: '', label: 'Unassigned' }, ...officeRooms.map((room) => ({ value: String(room.id), label: `${room.roomNumber} · ${room.name}` }))]} value={row.roomId ? String(row.roomId) : ''} onChange={(event) => updateStaffAllocation(row.id, event.target.value ? Number(event.target.value) : null)} /> },
      { key: 'location', header: 'Building / Floor', render: (row: StaffAllocation) => { const room = getRoom(row.roomId); const building = room ? getBuilding(room.buildingId) : undefined; return room ? `${building?.name || '—'} · ${roomFloorName(room.floorLevel)}` : 'Unallocated'; } }
    ]} data={staffAllocations} /><div className="flex justify-end border-t px-5 py-4"><Button onClick={() => notify('Staff and office allocations saved.')}><Save className="h-4 w-4" /> Save Staff / Office Allocation</Button></div></Card>;
  };

  const renderAllocation = () => <div className="space-y-4"><Card noPadding><div className="flex flex-wrap items-center justify-between gap-3 p-4"><div><h2 className="font-semibold text-gray-900">Room Allocation</h2><p className="text-sm text-gray-500">Assign rooms to classes, hostel students, and office teams.</p></div><div className="flex flex-wrap gap-2"><Select className="w-36" options={['2024-25', '2025-26', '2026-27'].map((year) => ({ value: year, label: year }))} value={academicYear} onChange={(event) => setAcademicYear(event.target.value)} /><Button size="sm" variant="outline" onClick={clearAllocations}><RotateCcw className="h-4 w-4" /> Clear All Allocations</Button><Button size="sm" variant="outline" onClick={() => exportFile('room-allocations.json', JSON.stringify({ academicYear, classAllocations, staffAllocations }, null, 2))}><Download className="h-4 w-4" /> Export</Button></div></div><div className="flex flex-wrap gap-1 border-t px-4 py-2">{(['Classroom Allocation', 'Hostel Allocation', 'Staff / Office Allocation'] as const).map((view) => <button key={view} onClick={() => setAllocationView(view)} className={`rounded-lg px-3 py-2 text-xs font-semibold ${allocationView === view ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>{view}</button>)}</div></Card>{allocationView === 'Classroom Allocation' ? renderClassroomAllocation() : allocationView === 'Hostel Allocation' ? renderHostelAllocation() : renderStaffAllocation()}</div>;

  const renderReports = () => <div className="space-y-5"><div className="rounded-xl border border-blue-100 bg-blue-50 p-4"><h2 className="font-semibold text-blue-900">Campus Infrastructure & Utilization Reports</h2><p className="mt-1 text-sm text-blue-800">Generate infrastructure summaries for UDISE, board affiliation, inspection, utilization, capacity, and maintenance. Spreadsheet exports are CSV files that open in Excel.</p></div>{(['Government & Compliance', 'Internal Management'] as const).map((group) => <div key={group}><h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-gray-500">{group === 'Government & Compliance' ? 'Government & Compliance Reports' : 'Internal Management Reports'}</h3><div className="grid gap-3 xl:grid-cols-2">{reportSpecs.filter((report) => report.group === group).map((report) => <Card key={report.title} className="flex flex-col justify-between"><div className="flex gap-3"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-700"><FileText className="h-5 w-5" /></span><div><p className="font-semibold text-gray-900">{reportSpecs.indexOf(report) + 1}. {report.title}</p><p className="mt-1 text-sm text-gray-500">{report.description}</p></div></div><div className="mt-4 flex flex-wrap gap-2"><Button size="sm" onClick={() => setReportPreview(report)}>Generate Preview</Button><Button size="sm" variant="outline" onClick={() => exportReportCsv(report)}><Download className="h-4 w-4" /> Export Excel (CSV)</Button></div></Card>)}</div></div>)}</div>;



  return (
    <div className="min-h-screen space-y-5 bg-gray-50/70 p-4 md:p-6">
      <header className="space-y-4">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between"><div><div className="mb-2 flex items-center gap-2 text-xs text-gray-500"><span>Home</span><ChevronRight className="h-3 w-3" /><span>Administration</span><ChevronRight className="h-3 w-3" /><span className="text-gray-800">Campus Building & Room Layout</span></div><div className="flex items-center gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-700"><Building2 className="h-6 w-6" /></span><div><h1 className="text-2xl font-bold tracking-tight text-gray-900">Campus Building & Room Layout</h1><p className="mt-1 text-sm text-gray-500">Manage campus buildings, rooms, floor plans, and allocations</p></div></div></div><div className="flex flex-wrap items-center gap-2"><Select className="min-w-[190px]" options={CAMPUS_OPTIONS.map((campus) => ({ value: campus, label: campus }))} value={selectedCampus} onChange={(event) => { setSelectedCampus(event.target.value); resetRoomFilters(); setSelectedMapBuilding(null); setSelectedRoomIds([]); }} /><Button variant="outline" onClick={exportLayout}><Download className="h-4 w-4" /> Export Layout</Button><Button variant="outline" onClick={() => window.print()}><Printer className="h-4 w-4" /> Print Campus Map</Button><Button variant="outline" onClick={openAddBuilding}><Plus className="h-4 w-4" /> Add Building</Button><Button onClick={() => openAddRoom()}><Plus className="h-4 w-4" /> Add Room</Button></div></div>
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-gray-200 bg-white px-4 py-3 text-xs text-gray-500"><span className="flex items-center gap-2"><MapPin className="h-4 w-4 text-blue-600" /> Campus: <strong className="text-gray-800">Sunshine Public School — {selectedCampus}</strong></span><span>Last updated: {new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date())}</span></div>
      </header>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-6">
        <StatCard title="Total Buildings" value={campusBuildings.length.toString()} icon={<Building2 className="h-5 w-5" />} tone="bg-blue-50 text-blue-700" />
        <StatCard title="Total Rooms" value={totalRooms.toLocaleString('en-IN')} icon={<DoorOpen className="h-5 w-5" />} tone="bg-violet-50 text-violet-700" />
        <StatCard title="Active Rooms" value={activeRooms.toLocaleString('en-IN')} detail="Currently available for use" icon={<CheckCircle className="h-5 w-5" />} tone="bg-green-50 text-green-700" />
        <StatCard title="Maintenance / Inactive" value={unavailableRooms.toLocaleString('en-IN')} detail="Unavailable rooms" icon={<Wrench className="h-5 w-5" />} tone="bg-amber-50 text-amber-700" />
        <StatCard title="Total Capacity" value={totalCapacity.toLocaleString('en-IN')} detail="Students / persons / beds" icon={<Users className="h-5 w-5" />} tone="bg-cyan-50 text-cyan-700" />
        <StatCard title="Campus Utilization" value={`${utilization}%`} detail={`${totalStrength.toLocaleString('en-IN')} occupied capacity`} icon={<Activity className="h-5 w-5" />} tone="bg-orange-50 text-orange-700" />
      </div>

      <nav className="overflow-x-auto rounded-xl border border-gray-200 bg-white p-1"><div className="flex min-w-max gap-1">{tabs.map((tab) => <button key={tab.key} onClick={() => switchTab(tab.key)} className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors ${activeTab === tab.key ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}>{tab.icon}{tab.key}</button>)}</div></nav>

      {activeTab === 'Dashboard' && renderDashboard()}
      {activeTab === 'Buildings' && renderBuildings()}
      {activeTab === 'Rooms' && renderRooms()}
      {activeTab === 'Layout Map' && renderLayoutMap()}
      {activeTab === 'Room Allocation' && renderAllocation()}
      {activeTab === 'Reports' && renderReports()}

      {toast && <div className="fixed bottom-5 right-5 z-[80] flex max-w-md items-center gap-2 rounded-xl bg-gray-900 px-4 py-3 text-sm text-white shadow-xl"><CheckCircle className="h-4 w-4 text-green-300" />{toast}<button aria-label="Dismiss notification" onClick={() => setToast('')}><X className="h-4 w-4" /></button></div>}

      {showBuildingModal && <div className="fixed inset-0 z-[60] flex items-center justify-center bg-gray-950/60 p-3" role="dialog" aria-modal="true" aria-label="Building editor"><div className="max-h-[94vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white shadow-2xl"><div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white px-5 py-4"><div><h2 className="text-lg font-bold text-gray-900">{editingBuildingId ? 'Edit Building' : 'Add New Building'}</h2><p className="text-xs text-gray-500">Basic identity, physical details, facilities, safety, and notes.</p></div><button onClick={() => setShowBuildingModal(false)} className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"><X className="h-5 w-5" /></button></div><div className="space-y-6 p-5"><section><h3 className="mb-3 text-sm font-bold text-gray-800">1. Basic Building Information</h3><div className="grid gap-4 md:grid-cols-2"><Input label="Campus" value={buildingForm.campus} disabled /><Input label="Building Name *" value={buildingForm.name} onChange={(event) => setBuildingForm((previous) => ({ ...previous, name: event.target.value }))} /><Input label="Building Short Name" value={buildingForm.shortName} onChange={(event) => setBuildingForm((previous) => ({ ...previous, shortName: event.target.value }))} /><Input label="Building Code *" value={buildingForm.code} maxLength={8} onChange={(event) => setBuildingForm((previous) => ({ ...previous, code: event.target.value.toUpperCase() }))} helperText="Unique code used in room numbering; up to 8 characters." /><Select label="Building Type" options={BUILDING_TYPES.map((type) => ({ value: type, label: type }))} value={buildingForm.type} onChange={(event) => setBuildingForm((previous) => ({ ...previous, type: event.target.value as BuildingType }))} /><Select label="Status" options={['Active', 'Inactive'].map((status) => ({ value: status, label: status }))} value={buildingForm.status} onChange={(event) => setBuildingForm((previous) => ({ ...previous, status: event.target.value as 'Active' | 'Inactive' }))} /></div></section><section><h3 className="mb-3 text-sm font-bold text-gray-800">2. Physical Details</h3><div className="grid gap-4 md:grid-cols-3"><Input label="Upper Floors" type="number" min={0} value={buildingForm.upperFloors} onChange={(event) => setBuildingForm((previous) => ({ ...previous, upperFloors: Number(event.target.value) }))} /><Select label="Ground Floor Exists?" options={['Yes', 'No'].map((value) => ({ value, label: value }))} value={buildingForm.groundFloor ? 'Yes' : 'No'} onChange={(event) => setBuildingForm((previous) => ({ ...previous, groundFloor: event.target.value === 'Yes' }))} /><Select label="Floor Naming" options={['Ground, 1st, 2nd…', '0, 1, 2…', 'Custom']} value={buildingForm.floorNaming || 'Ground, 1st, 2nd…'} onChange={(event) => setBuildingForm((previous) => ({ ...previous, floorNaming: event.target.value }))} /><Input label="Total Built-up Area (sqft)" type="number" value={buildingForm.builtUpArea} onChange={(event) => setBuildingForm((previous) => ({ ...previous, builtUpArea: Number(event.target.value) }))} /><Select label="Construction Type" options={['Pucca (RCC)', 'Pucca (Brick)', 'Semi-Pucca', 'Kachcha'].map((value) => ({ value, label: value }))} value={buildingForm.constructionType} onChange={(event) => setBuildingForm((previous) => ({ ...previous, constructionType: event.target.value }))} /><Input label="Year Built" type="number" value={buildingForm.yearBuilt} onChange={(event) => setBuildingForm((previous) => ({ ...previous, yearBuilt: Number(event.target.value) }))} /><Input label="Year of Last Renovation" type="number" value={buildingForm.renovationYear || ''} onChange={(event) => setBuildingForm((previous) => ({ ...previous, renovationYear: Number(event.target.value) }))} /><Select label="Building Condition" options={CONDITIONS.map((value) => ({ value, label: value }))} value={buildingForm.condition} onChange={(event) => setBuildingForm((previous) => ({ ...previous, condition: event.target.value as BuildingCondition }))} /><Input label="Building Location on Campus" value={buildingForm.location} onChange={(event) => setBuildingForm((previous) => ({ ...previous, location: event.target.value }))} /></div></section><section><h3 className="mb-3 text-sm font-bold text-gray-800">3. Facilities in this Building</h3><CheckList options={BUILDING_FACILITIES} selected={buildingForm.facilities} onToggle={(value) => setBuildingForm((previous) => ({ ...previous, facilities: previous.facilities.includes(value) ? previous.facilities.filter((item) => item !== value) : [...previous.facilities, value] }))} /></section><section><h3 className="mb-3 text-sm font-bold text-gray-800">4. Safety & Emergency Information</h3><div className="grid gap-4 md:grid-cols-2"><Input label="Fire Exit Location" value={buildingForm.fireExit} onChange={(event) => setBuildingForm((previous) => ({ ...previous, fireExit: event.target.value }))} /><Input label="Assembly Point" value={buildingForm.assemblyPoint} onChange={(event) => setBuildingForm((previous) => ({ ...previous, assemblyPoint: event.target.value }))} /><Input label="Emergency Exit Description" value={buildingForm.emergencyDescription} onChange={(event) => setBuildingForm((previous) => ({ ...previous, emergencyDescription: event.target.value }))} /><Input label="Warden / In-charge Name" value={buildingForm.inchargeName} onChange={(event) => setBuildingForm((previous) => ({ ...previous, inchargeName: event.target.value }))} /><Input label="Warden Contact" value={buildingForm.inchargePhone} onChange={(event) => setBuildingForm((previous) => ({ ...previous, inchargePhone: event.target.value }))} /></div></section><section><h3 className="mb-3 text-sm font-bold text-gray-800">5. Additional Information</h3><div className="grid gap-4 md:grid-cols-2"><Input label="Building Photo" type="file" accept="image/*" onChange={(event) => setBuildingForm((previous) => ({ ...previous, photo: event.target.files?.[0]?.name || previous.photo }))} /><Input label="Floor Plan / Blueprint" type="file" accept=".pdf,image/*" onChange={(event) => setBuildingForm((previous) => ({ ...previous, floorPlan: event.target.files?.[0]?.name || previous.floorPlan }))} /><textarea aria-label="Remarks / Notes" placeholder="Remarks / notes" value={buildingForm.remarks} onChange={(event) => setBuildingForm((previous) => ({ ...previous, remarks: event.target.value }))} rows={3} className="rounded-lg border border-gray-300 px-3 py-2 text-sm md:col-span-2" /></div></section></div><div className="sticky bottom-0 flex flex-wrap justify-end gap-2 border-t bg-gray-50 px-5 py-4"><Button variant="outline" onClick={() => setShowBuildingModal(false)}>Cancel</Button><Button variant="outline" onClick={() => saveBuilding(true)} disabled={editingBuildingId !== null}>Save &amp; Add Rooms</Button><Button onClick={() => saveBuilding(false)}><Save className="h-4 w-4" /> Save Building</Button></div></div></div>}

      {showRoomModal && <div className="fixed inset-0 z-[60] flex items-center justify-center bg-gray-950/60 p-3" role="dialog" aria-modal="true" aria-label="Room editor"><div className="max-h-[94vh] w-full max-w-5xl overflow-y-auto rounded-2xl bg-white shadow-2xl"><div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white px-5 py-4"><div><h2 className="text-lg font-bold text-gray-900">{editingRoomId ? 'Edit Room' : 'Add New Room'}</h2><p className="text-xs text-gray-500">Room identity, capacity, facilities, maintenance, and device linkage.</p></div><button onClick={() => setShowRoomModal(false)} className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"><X className="h-5 w-5" /></button></div><div className="space-y-6 p-5"><section><h3 className="mb-3 text-sm font-bold text-gray-800">1. Basic Room Identification</h3><div className="grid gap-4 md:grid-cols-3"><Select label="Building" options={campusBuildings.map((building) => ({ value: String(building.id), label: `${building.name} (${building.code})` }))} value={String(roomForm.buildingId)} onChange={(event) => { const buildingId = Number(event.target.value); const building = campusBuildings.find((item) => item.id === buildingId); setRoomForm((previous) => ({ ...previous, buildingId, campus: selectedCampus, floorLevel: Math.min(previous.floorLevel, building?.upperFloors || 0) })); }} /><Select label="Floor" options={Array.from({ length: (campusBuildings.find((building) => building.id === roomForm.buildingId)?.upperFloors || 0) + 1 }, (_, level) => ({ value: String(level), label: roomFloorName(level) }))} value={String(roomForm.floorLevel)} onChange={(event) => setRoomForm((previous) => ({ ...previous, floorLevel: Number(event.target.value) }))} /><Input label="Room Number *" value={roomForm.roomNumber} onChange={(event) => setRoomForm((previous) => ({ ...previous, roomNumber: event.target.value.toUpperCase() }))} helperText="Unique room identifier; suggested from building code and floor." /><Input label="Room Name *" value={roomForm.name} onChange={(event) => setRoomForm((previous) => ({ ...previous, name: event.target.value }))} /><Select label="Room Type" options={ROOM_TYPES.map((type) => ({ value: type, label: type }))} value={roomForm.type} onChange={(event) => setRoomForm((previous) => ({ ...previous, type: event.target.value as RoomType, beds: event.target.value === 'Hostel Room' ? 2 : 0, bedType: event.target.value === 'Hostel Room' ? 'Double Sharing' : '', feeCategory: event.target.value === 'Hostel Room' ? 'Double Sharing — Non-AC' : '', annualFee: event.target.value === 'Hostel Room' ? 48000 : 0 }))} /><Select label="Status" options={ROOM_STATUSES.map((status) => ({ value: status, label: status }))} value={roomForm.status} onChange={(event) => setRoomForm((previous) => ({ ...previous, status: event.target.value as RoomStatus }))} /></div></section><section>
  <h3 className="mb-3 text-sm font-bold text-gray-800">2. Capacity &amp; Size</h3>
  <div className="grid gap-4 md:grid-cols-3">
    <Input label="Seating Capacity" type="number" min={0} value={roomForm.capacity} onChange={(event) => setRoomForm((previous) => ({ ...previous, capacity: Number(event.target.value) }))} />
    <Input label="Exam Seating Capacity" type="number" min={0} value={roomForm.examCapacity} onChange={(event) => setRoomForm((previous) => ({ ...previous, examCapacity: Number(event.target.value) }))} />
    <Select label="Can be Used as Exam Hall?" options={['Yes', 'No'].map((value) => ({ value, label: value }))} value={roomForm.examEligible ? 'Yes' : 'No'} onChange={(event) => setRoomForm((previous) => ({ ...previous, examEligible: event.target.value === 'Yes' }))} />
    <Input label="Room Area (sqft)" type="number" value={roomForm.area} onChange={(event) => setRoomForm((previous) => ({ ...previous, area: Number(event.target.value) }))} />
    <Input label="Length (ft)" type="number" value={roomForm.length} onChange={(event) => setRoomForm((previous) => ({ ...previous, length: Number(event.target.value) }))} />
    <Input label="Width (ft)" type="number" value={roomForm.width} onChange={(event) => setRoomForm((previous) => ({ ...previous, width: Number(event.target.value) }))} />
  </div>
  {roomForm.type === 'Hostel Room' && <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50/50 p-4"><h4 className="mb-3 text-sm font-semibold text-gray-800">Hostel-Specific Capacity & Fee Linkage</h4><div className="grid gap-4 md:grid-cols-2"><Input label="Number of Beds" type="number" min={1} value={roomForm.beds} onChange={(event) => setRoomForm((previous) => ({ ...previous, beds: Number(event.target.value) }))} /><Select label="Bed Type" options={['Single', 'Double Sharing', 'Triple Sharing', 'Dormitory'].map((value) => ({ value, label: value }))} value={roomForm.bedType || 'Double Sharing'} onChange={(event) => setRoomForm((previous) => ({ ...previous, bedType: event.target.value }))} /><Select label="Fee Category" options={['Double Sharing — Non-AC', 'Single AC', 'Triple Sharing', 'Dormitory', 'Not Applicable'].map((value) => ({ value, label: value }))} value={roomForm.feeCategory || 'Not Applicable'} onChange={(event) => setRoomForm((previous) => ({ ...previous, feeCategory: event.target.value }))} /><Input label="Annual Fee (read-only from Fee Master)" type="number" value={roomForm.annualFee || 0} disabled /></div><p className="mt-3 text-xs text-gray-600">Student-bed assignment and the final fee amount are synchronized with the Hostel and Fee modules.</p></div>}
</section>
<section><h3 className="mb-3 text-sm font-bold text-gray-800">3. Facilities & Equipment</h3><CheckList options={ROOM_FACILITIES} selected={roomForm.amenities} onToggle={(value) => setRoomForm((previous) => ({ ...previous, amenities: previous.amenities.includes(value) ? previous.amenities.filter((item) => item !== value) : [...previous.amenities, value] }))} /></section><section><h3 className="mb-3 text-sm font-bold text-gray-800">4. Condition & Maintenance</h3><div className="grid gap-4 md:grid-cols-3"><Select label="Current Condition" options={CONDITIONS.map((condition) => ({ value: condition, label: condition }))} value={roomForm.condition} onChange={(event) => setRoomForm((previous) => ({ ...previous, condition: event.target.value as BuildingCondition }))} /><Input label="Last Maintained On" type="date" value={roomForm.maintainedOn} onChange={(event) => setRoomForm((previous) => ({ ...previous, maintainedOn: event.target.value }))} /><Input label="Next Maintenance Due" type="date" value={roomForm.nextMaintenance} onChange={(event) => setRoomForm((previous) => ({ ...previous, nextMaintenance: event.target.value }))} /><Input label="Emergency Exit in this Room" value={roomForm.emergencyExit || ''} onChange={(event) => setRoomForm((previous) => ({ ...previous, emergencyExit: event.target.value }))} /><Input label="Department" value={roomForm.department} onChange={(event) => setRoomForm((previous) => ({ ...previous, department: event.target.value }))} /><Input label="Assigned To / Class" value={roomForm.allocatedTo} onChange={(event) => setRoomForm((previous) => ({ ...previous, allocatedTo: event.target.value }))} /><Select label="Is Bookable?" options={['Yes', 'No'].map((value) => ({ value, label: value }))} value={roomForm.bookable ? 'Yes' : 'No'} onChange={(event) => setRoomForm((previous) => ({ ...previous, bookable: event.target.value === 'Yes' }))} /><Input label="Biometric Device ID" value={roomForm.biometricId} onChange={(event) => setRoomForm((previous) => ({ ...previous, biometricId: event.target.value }))} /><Input label="CCTV Camera ID" value={roomForm.cameraId} onChange={(event) => setRoomForm((previous) => ({ ...previous, cameraId: event.target.value }))} /><Input label="Smart Board ID" value={roomForm.smartBoardId} onChange={(event) => setRoomForm((previous) => ({ ...previous, smartBoardId: event.target.value }))} /><Input label="Projector Asset ID" value={roomForm.projectorAssetId} onChange={(event) => setRoomForm((previous) => ({ ...previous, projectorAssetId: event.target.value }))} /><Input label="Room Photo" type="file" accept="image/*" onChange={(event) => setRoomForm((previous) => ({ ...previous, photo: event.target.files?.[0]?.name || previous.photo }))} /><textarea aria-label="Maintenance remarks" placeholder="Maintenance remarks" value={roomForm.maintenanceRemarks} onChange={(event) => setRoomForm((previous) => ({ ...previous, maintenanceRemarks: event.target.value }))} rows={2} className="rounded-lg border border-gray-300 px-3 py-2 text-sm" /><textarea aria-label="Additional room remarks" placeholder="Additional room remarks" value={roomForm.remarks} onChange={(event) => setRoomForm((previous) => ({ ...previous, remarks: event.target.value }))} rows={2} className="rounded-lg border border-gray-300 px-3 py-2 text-sm" /></div></section></div><div className="sticky bottom-0 flex justify-end gap-2 border-t bg-gray-50 px-5 py-4"><Button variant="outline" onClick={() => setShowRoomModal(false)}>Cancel</Button>{editingRoomId === null && <Button variant="outline" onClick={() => saveRoom(true)}><Save className="h-4 w-4" /> Save &amp; Add Another</Button>}<Button onClick={() => saveRoom(false)}><Save className="h-4 w-4" /> Save Room</Button></div></div></div>}

      {roomDetail && <div className="fixed inset-0 z-[60] flex items-center justify-center bg-gray-950/60 p-3" role="dialog" aria-modal="true" aria-label={`Room details ${roomDetail.roomNumber}`}><div className="max-h-[94vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white shadow-2xl"><div className="sticky top-0 z-10 flex items-start justify-between border-b bg-white px-5 py-4"><div><h2 className="text-lg font-bold text-gray-900">Room Detail — {roomDetail.roomNumber}</h2><p className="mt-1 text-sm text-gray-500">{roomDetail.name} · {getBuilding(roomDetail.buildingId)?.name} · {roomFloorName(roomDetail.floorLevel)} · {roomDetail.status}</p></div><div className="flex gap-2"><Button size="sm" variant="outline" onClick={() => { openEditRoom(roomDetail); setRoomDetail(null); }}><Edit2 className="h-4 w-4" /> Edit Room</Button><button onClick={() => setRoomDetail(null)} className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"><X className="h-5 w-5" /></button></div></div><div className="grid gap-4 p-5 md:grid-cols-2"><Card title="Basic Details"><Detail label="Room Number" value={roomDetail.roomNumber} /><Detail label="Room Name" value={roomDetail.name} /><Detail label="Building" value={`${getBuilding(roomDetail.buildingId)?.name || '—'} (${getBuilding(roomDetail.buildingId)?.code || ''})`} /><Detail label="Floor" value={roomFloorName(roomDetail.floorLevel)} /><Detail label="Type" value={roomDetail.type} /><Detail label="Area" value={`${roomDetail.area} sqft`} />{roomDetail.type === 'Hostel Room' && <><Detail label="Bed Type" value={roomDetail.bedType || '—'} /><Detail label="Fee Category" value={roomDetail.feeCategory || '—'} /><Detail label="Annual Fee" value={`₹ ${(roomDetail.annualFee || 0).toLocaleString('en-IN')}`} /></>}</Card><Card title="Current Allocation"><Detail label="Allocation" value={roomDetail.allocatedTo || 'Not allocated'} /><Detail label="Department" value={roomDetail.department || '—'} /><Detail label="Exam Hall" value={roomDetail.examEligible ? `Yes · Exam capacity ${roomDetail.examCapacity}` : 'No'} /><Detail label="Bookings" value={roomDetail.bookable ? 'Available for event booking' : 'Not bookable'} /></Card><Card title="Capacity"><Detail label="Normal Capacity" value={roomDetail.type === 'Hostel Room' ? `${roomDetail.beds} beds` : `${roomDetail.capacity} persons`} /><Detail label="Exam Capacity" value={roomDetail.examCapacity ? `${roomDetail.examCapacity} students` : '—'} /><Detail label="Current Strength" value={`${roomDetail.currentStrength} ${roomDetail.type === 'Hostel Room' ? 'beds' : 'persons'}`} /><Detail label="Utilization" value={`${roomDetail.capacity ? (roomDetail.currentStrength / roomDetail.capacity * 100).toFixed(1) : 0}%`} /></Card><Card title="Condition & Maintenance"><Detail label="Condition" value={roomDetail.condition} /><Detail label="Last Maintained" value={roomDetail.maintainedOn || '—'} /><Detail label="Next Due" value={roomDetail.nextMaintenance || '—'} /><Detail label="Notes" value={roomDetail.maintenanceRemarks || 'No maintenance notes'} /></Card><Card title="Facilities in this Room"><div className="flex flex-wrap gap-2">{roomDetail.amenities.map((amenity) => <Badge key={amenity} variant="success">✓ {amenity}</Badge>)}{!roomDetail.amenities.length && <span className="text-sm text-gray-500">No facilities recorded.</span>}</div></Card><Card title="Assets & Device Linkage"><Detail label="Assets assigned" value={String(roomDetail.assetsCount)} /><Detail label="CCTV Camera" value={roomDetail.cameraId || '—'} /><Detail label="Smart Board" value={roomDetail.smartBoardId || '—'} /><Detail label="Projector Asset" value={roomDetail.projectorAssetId || '—'} /></Card></div><div className="flex flex-wrap justify-end gap-2 border-t bg-gray-50 px-5 py-4"><Button variant="outline" onClick={() => notify('Maintenance entry form is ready to connect to the Maintenance module.')}><Wrench className="h-4 w-4" /> Log Maintenance</Button><Button variant="outline" onClick={() => notify('Asset records are ready to connect to the Inventory module.')}><Eye className="h-4 w-4" /> View Assets</Button><Button onClick={() => { switchTab('Room Allocation'); setRoomDetail(null); }}>Allocate</Button></div></div></div>}

      {confirmDelete && <div className="fixed inset-0 z-[70] flex items-center justify-center bg-gray-950/60 p-4" role="dialog" aria-modal="true" aria-label="Confirm removal"><div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl"><div className="flex gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-full bg-red-50 text-red-600"><AlertTriangle className="h-5 w-5" /></span><div><h2 className="font-semibold text-gray-900">Confirm {confirmDelete.kind === 'building' ? 'building' : 'room'} removal</h2><p className="mt-1 text-sm text-gray-500">This removes the selected item from the local campus layout. Linked or occupied rooms cannot be deleted.</p></div></div><div className="mt-5 flex justify-end gap-2"><Button variant="outline" onClick={() => setConfirmDelete(null)}>Cancel</Button><Button variant="danger" onClick={confirmDeleteItem}><Trash2 className="h-4 w-4" /> Remove</Button></div></div></div>}

      {reportPreview && <div className="fixed inset-0 z-[70] flex items-center justify-center bg-gray-950/60 p-4" role="dialog" aria-modal="true" aria-label={`${reportPreview.title} preview`}><div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl"><div className="flex items-start justify-between border-b px-5 py-4"><div><h2 className="text-lg font-bold text-gray-900">{reportPreview.title}</h2><p className="text-xs text-gray-500">Generated for {selectedCampus} · {new Date().toLocaleString()}</p></div><button onClick={() => setReportPreview(null)} className="rounded-lg p-2 hover:bg-gray-100"><X className="h-5 w-5" /></button></div><div className="space-y-4 p-5"><div className="grid grid-cols-2 gap-3 sm:grid-cols-4"><MiniMetric label="Buildings" value={String(campusBuildings.length)} /><MiniMetric label="Rooms" value={String(totalRooms)} /><MiniMetric label="Active" value={String(activeRooms)} /><MiniMetric label="Utilization" value={`${utilization}%`} /></div><p className="text-sm text-gray-600">{reportPreview.description}</p><div className="overflow-x-auto rounded-lg border"><table className="w-full text-left text-xs"><thead className="bg-gray-50"><tr><th className="px-3 py-2">Room</th><th className="px-3 py-2">Building</th><th className="px-3 py-2">Type</th><th className="px-3 py-2">Capacity</th><th className="px-3 py-2">Condition</th><th className="px-3 py-2">Status</th></tr></thead><tbody className="divide-y">{campusRooms.slice(0, 25).map((room) => <tr key={room.id}><td className="px-3 py-2">{room.roomNumber}</td><td className="px-3 py-2">{getBuilding(room.buildingId)?.name}</td><td className="px-3 py-2">{room.type}</td><td className="px-3 py-2">{room.capacity}</td><td className="px-3 py-2">{room.condition}</td><td className="px-3 py-2">{room.status}</td></tr>)}</tbody></table></div><p className="text-xs text-gray-400">Preview shows up to 25 room rows. Export Excel (CSV) from the report card for the complete listing.</p></div><div className="flex justify-end gap-2 border-t bg-gray-50 px-5 py-4"><Button variant="outline" onClick={() => exportReportCsv(reportPreview)}><Download className="h-4 w-4" /> Export Excel (CSV)</Button><Button variant="outline" onClick={() => window.print()}><Printer className="h-4 w-4" /> Print / Save PDF</Button><Button onClick={() => setReportPreview(null)}>Close</Button></div></div></div>}
    </div>
  );
}

function ConditionBadge({ condition }: { condition: BuildingCondition }) {
  const variant = condition === 'Good' ? 'success' : condition === 'Needs Minor Repair' ? 'warning' : condition === 'Needs Major Repair' ? 'danger' : condition === 'Condemned' ? 'secondary' : 'info';
  return <Badge variant={variant}>{condition}</Badge>;
}

function CheckList({ options, selected, onToggle }: { options: string[]; selected: string[]; onToggle: (value: string) => void }) {
  return <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">{options.map((option) => <label key={option} className="flex items-center gap-2 rounded-lg border border-gray-100 px-3 py-2 text-xs text-gray-700"><input type="checkbox" checked={selected.includes(option)} onChange={() => onToggle(option)} className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />{option}</label>)}</div>;
}

function Detail({ label, value }: { label: string; value: string }) {
  return <div className="flex justify-between gap-4 border-b border-gray-100 py-2 last:border-0"><span className="text-xs text-gray-500">{label}</span><span className="text-right text-xs font-medium text-gray-800">{value}</span></div>;
}

function MiniMetric({ label, value }: { label: string; value: string }) {
  return <div className="rounded-lg bg-gray-50 p-3"><p className="text-xs text-gray-500">{label}</p><p className="mt-1 text-lg font-bold text-gray-900">{value}</p></div>;
}

function BookOpenIcon() { return <FileText className="h-5 w-5" />; }
