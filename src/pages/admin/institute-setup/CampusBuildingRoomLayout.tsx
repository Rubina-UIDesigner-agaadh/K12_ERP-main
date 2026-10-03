// CampusBuildingRoomLayout.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Table } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import { Textarea } from '../../../components/ui/Textarea';
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  Filter,
  X,
  Save,
  Building,
  Building2,
  Home,
  Layers,
  MapPin,
  Users,
  CheckCircle,
  AlertCircle,
  ChevronDown,
  ChevronRight,
  Download,
  Upload,
  Copy,
  Eye,
  Settings,
  MoreVertical,
  FolderPlus,
  DoorOpen,
  Maximize2,
  Grid3X3 } from
'lucide-react';

// Type definitions
interface Campus {
  id: number;
  name: string;
  code: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  contactPerson: string;
  contactPhone: string;
  contactEmail: string;
  status: 'Active' | 'Inactive';
  buildings: Building[];
  createdAt: Date;
  updatedAt: Date;
}

interface Building {
  id: number;
  campusId: number;
  name: string;
  code: string;
  description: string;
  totalFloors: number;
  yearBuilt?: number;
  status: 'Active' | 'Inactive' | 'Under Maintenance';
  floors: Floor[];
  createdAt: Date;
  updatedAt: Date;
}

interface Floor {
  id: number;
  buildingId: number;
  name: string;
  level: number;
  description: string;
  status: 'Active' | 'Inactive';
  rooms: Room[];
  createdAt: Date;
  updatedAt: Date;
}

interface Room {
  id: number;
  floorId: number;
  buildingId: number;
  campusId: number;
  roomNumber: string;
  name: string;
  type: RoomType;
  capacity: number;
  area: number;
  amenities: string[];
  status: 'Available' | 'Occupied' | 'Under Maintenance' | 'Reserved';
  assignedTo?: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

type RoomType = 'Classroom' | 'Lab' | 'Office' | 'Library' | 'Auditorium' | 'Conference Room' | 'Staff Room' | 'Store Room' | 'Washroom' | 'Canteen' | 'Sports Room' | 'Medical Room' | 'Other';

interface FlattenedRoom {
  id: number;
  campusId: number;
  campusName: string;
  buildingId: number;
  buildingName: string;
  floorId: number;
  floorName: string;
  roomNumber: string;
  roomName: string;
  type: RoomType;
  capacity: number;
  area: number;
  status: Room['status'];
  amenities: string[];
  assignedTo?: string;
}

const ROOM_TYPES: RoomType[] = [
'Classroom', 'Lab', 'Office', 'Library', 'Auditorium',
'Conference Room', 'Staff Room', 'Store Room', 'Washroom',
'Canteen', 'Sports Room', 'Medical Room', 'Other'];


const AMENITIES_LIST = [
'Projector', 'Smart Board', 'AC', 'WiFi', 'CCTV',
'Sound System', 'Whiteboard', 'Computer', 'Printer',
'Water Dispenser', 'First Aid Kit', 'Fire Extinguisher'];


export function CampusBuildingRoomLayout() {
  // Initial mock data
  const initialCampuses: Campus[] = [
  {
    id: 1,
    name: 'Main Campus',
    code: 'MC',
    address: '123 Education Street, Sector 15',
    city: 'New Delhi',
    state: 'Delhi',
    pincode: '110001',
    contactPerson: 'Dr. Rajesh Kumar',
    contactPhone: '+91 98765 43210',
    contactEmail: 'admin@maincampus.edu',
    status: 'Active',
    createdAt: new Date('2020-01-01'),
    updatedAt: new Date('2024-01-15'),
    buildings: [
    {
      id: 1,
      campusId: 1,
      name: 'Academic Block A',
      code: 'ABA',
      description: 'Primary academic building with classrooms and labs',
      totalFloors: 4,
      yearBuilt: 2015,
      status: 'Active',
      createdAt: new Date('2020-01-01'),
      updatedAt: new Date('2024-01-15'),
      floors: [
      {
        id: 1,
        buildingId: 1,
        name: 'Ground Floor',
        level: 0,
        description: 'Reception and administrative offices',
        status: 'Active',
        createdAt: new Date('2020-01-01'),
        updatedAt: new Date('2024-01-15'),
        rooms: [
        {
          id: 1,
          floorId: 1,
          buildingId: 1,
          campusId: 1,
          roomNumber: '101',
          name: 'Classroom 101',
          type: 'Classroom',
          capacity: 40,
          area: 600,
          amenities: ['Projector', 'AC', 'WiFi', 'Whiteboard'],
          status: 'Available',
          description: 'Standard classroom with modern amenities',
          createdAt: new Date('2020-01-01'),
          updatedAt: new Date('2024-01-15')
        },
        {
          id: 2,
          floorId: 1,
          buildingId: 1,
          campusId: 1,
          roomNumber: '102',
          name: 'Classroom 102',
          type: 'Classroom',
          capacity: 40,
          area: 600,
          amenities: ['Projector', 'AC', 'WiFi', 'Whiteboard'],
          status: 'Occupied',
          assignedTo: 'Class 10-A',
          description: 'Standard classroom',
          createdAt: new Date('2020-01-01'),
          updatedAt: new Date('2024-01-15')
        },
        {
          id: 3,
          floorId: 1,
          buildingId: 1,
          campusId: 1,
          roomNumber: '103',
          name: 'Reception',
          type: 'Office',
          capacity: 5,
          area: 200,
          amenities: ['AC', 'WiFi', 'Computer', 'Printer'],
          status: 'Occupied',
          assignedTo: 'Admin Department',
          description: 'Main reception area',
          createdAt: new Date('2020-01-01'),
          updatedAt: new Date('2024-01-15')
        }]

      },
      {
        id: 2,
        buildingId: 1,
        name: 'First Floor',
        level: 1,
        description: 'Science labs and classrooms',
        status: 'Active',
        createdAt: new Date('2020-01-01'),
        updatedAt: new Date('2024-01-15'),
        rooms: [
        {
          id: 4,
          floorId: 2,
          buildingId: 1,
          campusId: 1,
          roomNumber: '201',
          name: 'Physics Lab',
          type: 'Lab',
          capacity: 30,
          area: 800,
          amenities: ['Projector', 'AC', 'WiFi', 'Smart Board', 'Fire Extinguisher'],
          status: 'Available',
          description: 'Fully equipped physics laboratory',
          createdAt: new Date('2020-01-01'),
          updatedAt: new Date('2024-01-15')
        },
        {
          id: 5,
          floorId: 2,
          buildingId: 1,
          campusId: 1,
          roomNumber: '202',
          name: 'Chemistry Lab',
          type: 'Lab',
          capacity: 30,
          area: 800,
          amenities: ['Projector', 'AC', 'WiFi', 'Fire Extinguisher', 'First Aid Kit'],
          status: 'Under Maintenance',
          description: 'Chemistry laboratory with fume hoods',
          createdAt: new Date('2020-01-01'),
          updatedAt: new Date('2024-01-15')
        },
        {
          id: 6,
          floorId: 2,
          buildingId: 1,
          campusId: 1,
          roomNumber: '203',
          name: 'Biology Lab',
          type: 'Lab',
          capacity: 30,
          area: 800,
          amenities: ['Projector', 'AC', 'WiFi', 'First Aid Kit'],
          status: 'Available',
          description: 'Biology laboratory with microscopes',
          createdAt: new Date('2020-01-01'),
          updatedAt: new Date('2024-01-15')
        }]

      },
      {
        id: 3,
        buildingId: 1,
        name: 'Second Floor',
        level: 2,
        description: 'Computer labs and IT rooms',
        status: 'Active',
        createdAt: new Date('2020-01-01'),
        updatedAt: new Date('2024-01-15'),
        rooms: [
        {
          id: 7,
          floorId: 3,
          buildingId: 1,
          campusId: 1,
          roomNumber: '301',
          name: 'Computer Lab 1',
          type: 'Lab',
          capacity: 40,
          area: 1000,
          amenities: ['AC', 'WiFi', 'Computer', 'Projector', 'Smart Board'],
          status: 'Occupied',
          assignedTo: 'IT Department',
          description: 'Main computer laboratory',
          createdAt: new Date('2020-01-01'),
          updatedAt: new Date('2024-01-15')
        },
        {
          id: 8,
          floorId: 3,
          buildingId: 1,
          campusId: 1,
          roomNumber: '302',
          name: 'Computer Lab 2',
          type: 'Lab',
          capacity: 35,
          area: 900,
          amenities: ['AC', 'WiFi', 'Computer', 'Projector'],
          status: 'Available',
          description: 'Secondary computer laboratory',
          createdAt: new Date('2020-01-01'),
          updatedAt: new Date('2024-01-15')
        }]

      },
      {
        id: 4,
        buildingId: 1,
        name: 'Third Floor',
        level: 3,
        description: 'Senior classrooms and staff rooms',
        status: 'Active',
        createdAt: new Date('2020-01-01'),
        updatedAt: new Date('2024-01-15'),
        rooms: [
        {
          id: 9,
          floorId: 4,
          buildingId: 1,
          campusId: 1,
          roomNumber: '401',
          name: 'Classroom 401',
          type: 'Classroom',
          capacity: 45,
          area: 650,
          amenities: ['Projector', 'AC', 'WiFi', 'Smart Board'],
          status: 'Occupied',
          assignedTo: 'Class 12-A',
          description: 'Senior secondary classroom',
          createdAt: new Date('2020-01-01'),
          updatedAt: new Date('2024-01-15')
        },
        {
          id: 10,
          floorId: 4,
          buildingId: 1,
          campusId: 1,
          roomNumber: '402',
          name: 'Staff Room',
          type: 'Staff Room',
          capacity: 20,
          area: 500,
          amenities: ['AC', 'WiFi', 'Water Dispenser', 'Computer', 'Printer'],
          status: 'Occupied',
          assignedTo: 'Teaching Staff',
          description: 'Teachers common room',
          createdAt: new Date('2020-01-01'),
          updatedAt: new Date('2024-01-15')
        }]

      }]

    },
    {
      id: 2,
      campusId: 1,
      name: 'Admin Block',
      code: 'AB',
      description: 'Administrative offices and management',
      totalFloors: 3,
      yearBuilt: 2010,
      status: 'Active',
      createdAt: new Date('2020-01-01'),
      updatedAt: new Date('2024-01-15'),
      floors: [
      {
        id: 5,
        buildingId: 2,
        name: 'Ground Floor',
        level: 0,
        description: 'Main administrative offices',
        status: 'Active',
        createdAt: new Date('2020-01-01'),
        updatedAt: new Date('2024-01-15'),
        rooms: [
        {
          id: 11,
          floorId: 5,
          buildingId: 2,
          campusId: 1,
          roomNumber: 'A-01',
          name: 'Principal Office',
          type: 'Office',
          capacity: 10,
          area: 400,
          amenities: ['AC', 'WiFi', 'Computer', 'Printer', 'CCTV'],
          status: 'Occupied',
          assignedTo: 'Principal',
          description: 'Principal administrative office',
          createdAt: new Date('2020-01-01'),
          updatedAt: new Date('2024-01-15')
        },
        {
          id: 12,
          floorId: 5,
          buildingId: 2,
          campusId: 1,
          roomNumber: 'A-02',
          name: 'Vice Principal Office',
          type: 'Office',
          capacity: 8,
          area: 300,
          amenities: ['AC', 'WiFi', 'Computer', 'Printer'],
          status: 'Occupied',
          assignedTo: 'Vice Principal',
          description: 'Vice Principal office',
          createdAt: new Date('2020-01-01'),
          updatedAt: new Date('2024-01-15')
        },
        {
          id: 13,
          floorId: 5,
          buildingId: 2,
          campusId: 1,
          roomNumber: 'A-03',
          name: 'Conference Room',
          type: 'Conference Room',
          capacity: 25,
          area: 500,
          amenities: ['Projector', 'AC', 'WiFi', 'Sound System', 'Smart Board'],
          status: 'Available',
          description: 'Main conference room for meetings',
          createdAt: new Date('2020-01-01'),
          updatedAt: new Date('2024-01-15')
        }]

      },
      {
        id: 6,
        buildingId: 2,
        name: 'First Floor',
        level: 1,
        description: 'Accounts and HR departments',
        status: 'Active',
        createdAt: new Date('2020-01-01'),
        updatedAt: new Date('2024-01-15'),
        rooms: [
        {
          id: 14,
          floorId: 6,
          buildingId: 2,
          campusId: 1,
          roomNumber: 'A-11',
          name: 'Accounts Office',
          type: 'Office',
          capacity: 8,
          area: 350,
          amenities: ['AC', 'WiFi', 'Computer', 'Printer'],
          status: 'Occupied',
          assignedTo: 'Accounts Department',
          description: 'Accounts and finance office',
          createdAt: new Date('2020-01-01'),
          updatedAt: new Date('2024-01-15')
        },
        {
          id: 15,
          floorId: 6,
          buildingId: 2,
          campusId: 1,
          roomNumber: 'A-12',
          name: 'HR Office',
          type: 'Office',
          capacity: 6,
          area: 300,
          amenities: ['AC', 'WiFi', 'Computer', 'Printer'],
          status: 'Occupied',
          assignedTo: 'HR Department',
          description: 'Human Resources office',
          createdAt: new Date('2020-01-01'),
          updatedAt: new Date('2024-01-15')
        }]

      }]

    },
    {
      id: 3,
      campusId: 1,
      name: 'Library Building',
      code: 'LB',
      description: 'Central library and reading rooms',
      totalFloors: 2,
      yearBuilt: 2018,
      status: 'Active',
      createdAt: new Date('2020-01-01'),
      updatedAt: new Date('2024-01-15'),
      floors: [
      {
        id: 7,
        buildingId: 3,
        name: 'Ground Floor',
        level: 0,
        description: 'Main library section',
        status: 'Active',
        createdAt: new Date('2020-01-01'),
        updatedAt: new Date('2024-01-15'),
        rooms: [
        {
          id: 16,
          floorId: 7,
          buildingId: 3,
          campusId: 1,
          roomNumber: 'LIB-01',
          name: 'Main Library',
          type: 'Library',
          capacity: 100,
          area: 2000,
          amenities: ['AC', 'WiFi', 'Computer', 'CCTV'],
          status: 'Available',
          description: 'Central library with book collection',
          createdAt: new Date('2020-01-01'),
          updatedAt: new Date('2024-01-15')
        },
        {
          id: 17,
          floorId: 7,
          buildingId: 3,
          campusId: 1,
          roomNumber: 'LIB-02',
          name: 'Reading Room',
          type: 'Library',
          capacity: 50,
          area: 800,
          amenities: ['AC', 'WiFi'],
          status: 'Available',
          description: 'Quiet reading area',
          createdAt: new Date('2020-01-01'),
          updatedAt: new Date('2024-01-15')
        }]

      },
      {
        id: 8,
        buildingId: 3,
        name: 'First Floor',
        level: 1,
        description: 'Digital library and archives',
        status: 'Active',
        createdAt: new Date('2020-01-01'),
        updatedAt: new Date('2024-01-15'),
        rooms: [
        {
          id: 18,
          floorId: 8,
          buildingId: 3,
          campusId: 1,
          roomNumber: 'LIB-11',
          name: 'Digital Library',
          type: 'Library',
          capacity: 40,
          area: 600,
          amenities: ['AC', 'WiFi', 'Computer'],
          status: 'Available',
          description: 'E-library with digital resources',
          createdAt: new Date('2020-01-01'),
          updatedAt: new Date('2024-01-15')
        }]

      }]

    }]

  },
  {
    id: 2,
    name: 'City Branch',
    code: 'CB',
    address: '456 Knowledge Park, Downtown',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400001',
    contactPerson: 'Mrs. Priya Sharma',
    contactPhone: '+91 87654 32109',
    contactEmail: 'admin@citybranch.edu',
    status: 'Active',
    createdAt: new Date('2021-06-01'),
    updatedAt: new Date('2024-02-10'),
    buildings: [
    {
      id: 4,
      campusId: 2,
      name: 'Main Building',
      code: 'MB',
      description: 'Primary building for city branch',
      totalFloors: 5,
      yearBuilt: 2020,
      status: 'Active',
      createdAt: new Date('2021-06-01'),
      updatedAt: new Date('2024-02-10'),
      floors: [
      {
        id: 9,
        buildingId: 4,
        name: 'Ground Floor',
        level: 0,
        description: 'Reception and administration',
        status: 'Active',
        createdAt: new Date('2021-06-01'),
        updatedAt: new Date('2024-02-10'),
        rooms: [
        {
          id: 19,
          floorId: 9,
          buildingId: 4,
          campusId: 2,
          roomNumber: 'G-01',
          name: 'Reception Hall',
          type: 'Office',
          capacity: 15,
          area: 400,
          amenities: ['AC', 'WiFi', 'Computer', 'CCTV'],
          status: 'Occupied',
          assignedTo: 'Reception',
          description: 'Main reception and visitor area',
          createdAt: new Date('2021-06-01'),
          updatedAt: new Date('2024-02-10')
        },
        {
          id: 20,
          floorId: 9,
          buildingId: 4,
          campusId: 2,
          roomNumber: 'G-02',
          name: 'Auditorium',
          type: 'Auditorium',
          capacity: 200,
          area: 3000,
          amenities: ['Projector', 'AC', 'WiFi', 'Sound System', 'CCTV'],
          status: 'Available',
          description: 'Main auditorium for events',
          createdAt: new Date('2021-06-01'),
          updatedAt: new Date('2024-02-10')
        }]

      },
      {
        id: 10,
        buildingId: 4,
        name: 'First Floor',
        level: 1,
        description: 'Classrooms',
        status: 'Active',
        createdAt: new Date('2021-06-01'),
        updatedAt: new Date('2024-02-10'),
        rooms: [
        {
          id: 21,
          floorId: 10,
          buildingId: 4,
          campusId: 2,
          roomNumber: '1-01',
          name: 'Classroom 1',
          type: 'Classroom',
          capacity: 35,
          area: 550,
          amenities: ['Projector', 'AC', 'WiFi', 'Whiteboard'],
          status: 'Occupied',
          assignedTo: 'Class 8-A',
          description: 'Standard classroom',
          createdAt: new Date('2021-06-01'),
          updatedAt: new Date('2024-02-10')
        },
        {
          id: 22,
          floorId: 10,
          buildingId: 4,
          campusId: 2,
          roomNumber: '1-02',
          name: 'Classroom 2',
          type: 'Classroom',
          capacity: 35,
          area: 550,
          amenities: ['Projector', 'AC', 'WiFi', 'Whiteboard'],
          status: 'Available',
          description: 'Standard classroom',
          createdAt: new Date('2021-06-01'),
          updatedAt: new Date('2024-02-10')
        }]

      },
      {
        id: 11,
        buildingId: 4,
        name: 'Second Floor',
        level: 2,
        description: 'Library and labs',
        status: 'Active',
        createdAt: new Date('2021-06-01'),
        updatedAt: new Date('2024-02-10'),
        rooms: [
        {
          id: 23,
          floorId: 11,
          buildingId: 4,
          campusId: 2,
          roomNumber: '2-01',
          name: 'Branch Library',
          type: 'Library',
          capacity: 60,
          area: 1000,
          amenities: ['AC', 'WiFi', 'Computer', 'CCTV'],
          status: 'Available',
          description: 'Branch library',
          createdAt: new Date('2021-06-01'),
          updatedAt: new Date('2024-02-10')
        },
        {
          id: 24,
          floorId: 11,
          buildingId: 4,
          campusId: 2,
          roomNumber: '2-02',
          name: 'Science Lab',
          type: 'Lab',
          capacity: 30,
          area: 700,
          amenities: ['AC', 'WiFi', 'Fire Extinguisher', 'First Aid Kit'],
          status: 'Available',
          description: 'Combined science laboratory',
          createdAt: new Date('2021-06-01'),
          updatedAt: new Date('2024-02-10')
        }]

      }]

    }]

  },
  {
    id: 3,
    name: 'Sports Complex',
    code: 'SC',
    address: '789 Stadium Road, Sports City',
    city: 'New Delhi',
    state: 'Delhi',
    pincode: '110002',
    contactPerson: 'Mr. Vikram Singh',
    contactPhone: '+91 76543 21098',
    contactEmail: 'sports@school.edu',
    status: 'Active',
    createdAt: new Date('2022-01-01'),
    updatedAt: new Date('2024-03-01'),
    buildings: [
    {
      id: 5,
      campusId: 3,
      name: 'Indoor Sports Arena',
      code: 'ISA',
      description: 'Indoor sports facilities',
      totalFloors: 2,
      yearBuilt: 2022,
      status: 'Active',
      createdAt: new Date('2022-01-01'),
      updatedAt: new Date('2024-03-01'),
      floors: [
      {
        id: 12,
        buildingId: 5,
        name: 'Ground Floor',
        level: 0,
        description: 'Main sports hall',
        status: 'Active',
        createdAt: new Date('2022-01-01'),
        updatedAt: new Date('2024-03-01'),
        rooms: [
        {
          id: 25,
          floorId: 12,
          buildingId: 5,
          campusId: 3,
          roomNumber: 'SP-01',
          name: 'Basketball Court',
          type: 'Sports Room',
          capacity: 100,
          area: 2500,
          amenities: ['Sound System', 'CCTV', 'First Aid Kit'],
          status: 'Available',
          description: 'Indoor basketball court',
          createdAt: new Date('2022-01-01'),
          updatedAt: new Date('2024-03-01')
        },
        {
          id: 26,
          floorId: 12,
          buildingId: 5,
          campusId: 3,
          roomNumber: 'SP-02',
          name: 'Badminton Hall',
          type: 'Sports Room',
          capacity: 50,
          area: 1500,
          amenities: ['CCTV', 'First Aid Kit'],
          status: 'Reserved',
          assignedTo: 'Sports Tournament',
          description: 'Indoor badminton courts',
          createdAt: new Date('2022-01-01'),
          updatedAt: new Date('2024-03-01')
        },
        {
          id: 27,
          floorId: 12,
          buildingId: 5,
          campusId: 3,
          roomNumber: 'SP-03',
          name: 'Medical Room',
          type: 'Medical Room',
          capacity: 10,
          area: 200,
          amenities: ['AC', 'First Aid Kit'],
          status: 'Available',
          description: 'Sports medical facility',
          createdAt: new Date('2022-01-01'),
          updatedAt: new Date('2024-03-01')
        }]

      }]

    }]

  }];


  // State management
  const [campuses, setCampuses] = useState<Campus[]>(initialCampuses);
  const [flattenedRooms, setFlattenedRooms] = useState<FlattenedRoom[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [campusFilter, setCampusFilter] = useState('All');
  const [buildingFilter, setBuildingFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [viewMode, setViewMode] = useState<'table' | 'hierarchy'>('table');
  const [expandedCampuses, setExpandedCampuses] = useState<number[]>([]);
  const [expandedBuildings, setExpandedBuildings] = useState<number[]>([]);
  const [expandedFloors, setExpandedFloors] = useState<number[]>([]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  // Modal states
  const [showCampusModal, setShowCampusModal] = useState(false);
  const [showBuildingModal, setShowBuildingModal] = useState(false);
  const [showFloorModal, setShowFloorModal] = useState(false);
  const [showRoomModal, setShowRoomModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState<FlattenedRoom | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Form data states
  const [campusFormData, setCampusFormData] = useState({
    name: '',
    code: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    contactPerson: '',
    contactPhone: '',
    contactEmail: '',
    status: 'Active' as 'Active' | 'Inactive'
  });

  const [buildingFormData, setBuildingFormData] = useState({
    campusId: 0,
    name: '',
    code: '',
    description: '',
    totalFloors: 1,
    yearBuilt: new Date().getFullYear(),
    status: 'Active' as 'Active' | 'Inactive' | 'Under Maintenance'
  });

  const [floorFormData, setFloorFormData] = useState({
    campusId: 0,
    buildingId: 0,
    name: '',
    level: 0,
    description: '',
    status: 'Active' as 'Active' | 'Inactive'
  });

  const [roomFormData, setRoomFormData] = useState({
    campusId: 0,
    buildingId: 0,
    floorId: 0,
    roomNumber: '',
    name: '',
    type: 'Classroom' as RoomType,
    capacity: 30,
    area: 500,
    amenities: [] as string[],
    status: 'Available' as Room['status'],
    assignedTo: '',
    description: ''
  });

  // Toast notification
  const [toast, setToast] = useState<{
    isVisible: boolean;
    message: string;
    type: 'success' | 'error' | 'info';
  }>({ isVisible: false, message: '', type: 'info' });

  // Confirmation modal
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    type: 'deleteCampus' | 'deleteBuilding' | 'deleteFloor' | 'deleteRoom' | null;
    targetId: number | null;
    message: string;
  }>({ isOpen: false, type: null, targetId: null, message: '' });

  // Show toast
  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info') => {
    setToast({ isVisible: true, message, type });
    setTimeout(() => setToast((prev) => ({ ...prev, isVisible: false })), 4000);
  }, []);

  // Flatten rooms for table view
  useEffect(() => {
    const rooms: FlattenedRoom[] = [];
    campuses.forEach((campus) => {
      campus.buildings.forEach((building) => {
        building.floors.forEach((floor) => {
          floor.rooms.forEach((room) => {
            rooms.push({
              id: room.id,
              campusId: campus.id,
              campusName: campus.name,
              buildingId: building.id,
              buildingName: building.name,
              floorId: floor.id,
              floorName: floor.name,
              roomNumber: room.roomNumber,
              roomName: room.name,
              type: room.type,
              capacity: room.capacity,
              area: room.area,
              status: room.status,
              amenities: room.amenities,
              assignedTo: room.assignedTo
            });
          });
        });
      });
    });
    setFlattenedRooms(rooms);
  }, [campuses]);

  // Filter rooms
  const filteredRooms = flattenedRooms.filter((room) => {
    const matchesSearch =
    room.roomName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    room.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    room.campusName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    room.buildingName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCampus = campusFilter === 'All' || room.campusName === campusFilter;
    const matchesBuilding = buildingFilter === 'All' || room.buildingName === buildingFilter;
    const matchesType = typeFilter === 'All' || room.type === typeFilter;
    const matchesStatus = statusFilter === 'All' || room.status === statusFilter;
    return matchesSearch && matchesCampus && matchesBuilding && matchesType && matchesStatus;
  });

  // Get all buildings for filter
  const allBuildings = campuses.flatMap((c) => c.buildings.map((b) => ({ ...b, campusName: c.name })));

  // Reset form data
  const resetCampusForm = () => {
    setCampusFormData({
      name: '', code: '', address: '', city: '', state: '', pincode: '',
      contactPerson: '', contactPhone: '', contactEmail: '', status: 'Active'
    });
  };

  const resetBuildingForm = () => {
    setBuildingFormData({
      campusId: campuses[0]?.id || 0, name: '', code: '', description: '',
      totalFloors: 1, yearBuilt: new Date().getFullYear(), status: 'Active'
    });
  };

  const resetFloorForm = () => {
    setFloorFormData({
      campusId: campuses[0]?.id || 0, buildingId: 0, name: '', level: 0,
      description: '', status: 'Active'
    });
  };

  const resetRoomForm = () => {
    setRoomFormData({
      campusId: campuses[0]?.id || 0, buildingId: 0, floorId: 0,
      roomNumber: '', name: '', type: 'Classroom', capacity: 30, area: 500,
      amenities: [], status: 'Available', assignedTo: '', description: ''
    });
  };

  // CRUD Operations for Campus
  const handleCreateCampus = () => {
    if (!campusFormData.name.trim() || !campusFormData.code.trim()) {
      showToast('Please fill in required fields', 'error');
      return;
    }

    const newCampus: Campus = {
      id: Date.now(),
      ...campusFormData,
      buildings: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setCampuses((prev) => [...prev, newCampus]);
    setShowCampusModal(false);
    resetCampusForm();
    showToast('Campus created successfully', 'success');
  };

  const handleUpdateCampus = () => {
    if (!editingId) return;

    setCampuses((prev) => prev.map((campus) => {
      if (campus.id === editingId) {
        return { ...campus, ...campusFormData, updatedAt: new Date() };
      }
      return campus;
    }));

    setShowCampusModal(false);
    setIsEditing(false);
    setEditingId(null);
    resetCampusForm();
    showToast('Campus updated successfully', 'success');
  };

  const handleDeleteCampus = (campusId: number) => {
    setCampuses((prev) => prev.filter((c) => c.id !== campusId));
    setConfirmModal({ isOpen: false, type: null, targetId: null, message: '' });
    showToast('Campus deleted successfully', 'success');
  };

  // CRUD Operations for Building
  const handleCreateBuilding = () => {
    if (!buildingFormData.name.trim() || !buildingFormData.code.trim() || !buildingFormData.campusId) {
      showToast('Please fill in required fields', 'error');
      return;
    }

    const newBuilding: Building = {
      id: Date.now(),
      campusId: buildingFormData.campusId,
      name: buildingFormData.name,
      code: buildingFormData.code,
      description: buildingFormData.description,
      totalFloors: buildingFormData.totalFloors,
      yearBuilt: buildingFormData.yearBuilt,
      status: buildingFormData.status,
      floors: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setCampuses((prev) => prev.map((campus) => {
      if (campus.id === buildingFormData.campusId) {
        return { ...campus, buildings: [...campus.buildings, newBuilding], updatedAt: new Date() };
      }
      return campus;
    }));

    setShowBuildingModal(false);
    resetBuildingForm();
    showToast('Building created successfully', 'success');
  };

  const handleUpdateBuilding = () => {
    if (!editingId) return;

    setCampuses((prev) => prev.map((campus) => {
      return {
        ...campus,
        buildings: campus.buildings.map((building) => {
          if (building.id === editingId) {
            return {
              ...building,
              name: buildingFormData.name,
              code: buildingFormData.code,
              description: buildingFormData.description,
              totalFloors: buildingFormData.totalFloors,
              yearBuilt: buildingFormData.yearBuilt,
              status: buildingFormData.status,
              updatedAt: new Date()
            };
          }
          return building;
        }),
        updatedAt: new Date()
      };
    }));

    setShowBuildingModal(false);
    setIsEditing(false);
    setEditingId(null);
    resetBuildingForm();
    showToast('Building updated successfully', 'success');
  };

  const handleDeleteBuilding = (buildingId: number) => {
    setCampuses((prev) => prev.map((campus) => ({
      ...campus,
      buildings: campus.buildings.filter((b) => b.id !== buildingId),
      updatedAt: new Date()
    })));
    setConfirmModal({ isOpen: false, type: null, targetId: null, message: '' });
    showToast('Building deleted successfully', 'success');
  };

  // CRUD Operations for Floor
  const handleCreateFloor = () => {
    if (!floorFormData.name.trim() || !floorFormData.buildingId) {
      showToast('Please fill in required fields', 'error');
      return;
    }

    const newFloor: Floor = {
      id: Date.now(),
      buildingId: floorFormData.buildingId,
      name: floorFormData.name,
      level: floorFormData.level,
      description: floorFormData.description,
      status: floorFormData.status,
      rooms: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setCampuses((prev) => prev.map((campus) => ({
      ...campus,
      buildings: campus.buildings.map((building) => {
        if (building.id === floorFormData.buildingId) {
          return { ...building, floors: [...building.floors, newFloor], updatedAt: new Date() };
        }
        return building;
      }),
      updatedAt: new Date()
    })));

    setShowFloorModal(false);
    resetFloorForm();
    showToast('Floor created successfully', 'success');
  };

  const handleUpdateFloor = () => {
    if (!editingId) return;

    setCampuses((prev) => prev.map((campus) => ({
      ...campus,
      buildings: campus.buildings.map((building) => ({
        ...building,
        floors: building.floors.map((floor) => {
          if (floor.id === editingId) {
            return {
              ...floor,
              name: floorFormData.name,
              level: floorFormData.level,
              description: floorFormData.description,
              status: floorFormData.status,
              updatedAt: new Date()
            };
          }
          return floor;
        }),
        updatedAt: new Date()
      })),
      updatedAt: new Date()
    })));

    setShowFloorModal(false);
    setIsEditing(false);
    setEditingId(null);
    resetFloorForm();
    showToast('Floor updated successfully', 'success');
  };

  const handleDeleteFloor = (floorId: number) => {
    setCampuses((prev) => prev.map((campus) => ({
      ...campus,
      buildings: campus.buildings.map((building) => ({
        ...building,
        floors: building.floors.filter((f) => f.id !== floorId),
        updatedAt: new Date()
      })),
      updatedAt: new Date()
    })));
    setConfirmModal({ isOpen: false, type: null, targetId: null, message: '' });
    showToast('Floor deleted successfully', 'success');
  };

  // CRUD Operations for Room
  const handleCreateRoom = () => {
    if (!roomFormData.roomNumber.trim() || !roomFormData.name.trim() || !roomFormData.floorId) {
      showToast('Please fill in required fields', 'error');
      return;
    }

    const newRoom: Room = {
      id: Date.now(),
      floorId: roomFormData.floorId,
      buildingId: roomFormData.buildingId,
      campusId: roomFormData.campusId,
      roomNumber: roomFormData.roomNumber,
      name: roomFormData.name,
      type: roomFormData.type,
      capacity: roomFormData.capacity,
      area: roomFormData.area,
      amenities: roomFormData.amenities,
      status: roomFormData.status,
      assignedTo: roomFormData.assignedTo || undefined,
      description: roomFormData.description,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setCampuses((prev) => prev.map((campus) => ({
      ...campus,
      buildings: campus.buildings.map((building) => ({
        ...building,
        floors: building.floors.map((floor) => {
          if (floor.id === roomFormData.floorId) {
            return { ...floor, rooms: [...floor.rooms, newRoom], updatedAt: new Date() };
          }
          return floor;
        }),
        updatedAt: new Date()
      })),
      updatedAt: new Date()
    })));

    setShowRoomModal(false);
    resetRoomForm();
    showToast('Room created successfully', 'success');
  };

  const handleUpdateRoom = () => {
    if (!editingId) return;

    setCampuses((prev) => prev.map((campus) => ({
      ...campus,
      buildings: campus.buildings.map((building) => ({
        ...building,
        floors: building.floors.map((floor) => ({
          ...floor,
          rooms: floor.rooms.map((room) => {
            if (room.id === editingId) {
              return {
                ...room,
                roomNumber: roomFormData.roomNumber,
                name: roomFormData.name,
                type: roomFormData.type,
                capacity: roomFormData.capacity,
                area: roomFormData.area,
                amenities: roomFormData.amenities,
                status: roomFormData.status,
                assignedTo: roomFormData.assignedTo || undefined,
                description: roomFormData.description,
                updatedAt: new Date()
              };
            }
            return room;
          }),
          updatedAt: new Date()
        })),
        updatedAt: new Date()
      })),
      updatedAt: new Date()
    })));

    setShowRoomModal(false);
    setIsEditing(false);
    setEditingId(null);
    resetRoomForm();
    showToast('Room updated successfully', 'success');
  };

  const handleDeleteRoom = (roomId: number) => {
    setCampuses((prev) => prev.map((campus) => ({
      ...campus,
      buildings: campus.buildings.map((building) => ({
        ...building,
        floors: building.floors.map((floor) => ({
          ...floor,
          rooms: floor.rooms.filter((r) => r.id !== roomId),
          updatedAt: new Date()
        })),
        updatedAt: new Date()
      })),
      updatedAt: new Date()
    })));
    setConfirmModal({ isOpen: false, type: null, targetId: null, message: '' });
    showToast('Room deleted successfully', 'success');
  };

  // Edit handlers
  const handleEditCampus = (campus: Campus) => {
    setCampusFormData({
      name: campus.name,
      code: campus.code,
      address: campus.address,
      city: campus.city,
      state: campus.state,
      pincode: campus.pincode,
      contactPerson: campus.contactPerson,
      contactPhone: campus.contactPhone,
      contactEmail: campus.contactEmail,
      status: campus.status
    });
    setEditingId(campus.id);
    setIsEditing(true);
    setShowCampusModal(true);
  };

  const handleEditBuilding = (building: Building) => {
    setBuildingFormData({
      campusId: building.campusId,
      name: building.name,
      code: building.code,
      description: building.description,
      totalFloors: building.totalFloors,
      yearBuilt: building.yearBuilt || new Date().getFullYear(),
      status: building.status
    });
    setEditingId(building.id);
    setIsEditing(true);
    setShowBuildingModal(true);
  };

  const handleEditFloor = (floor: Floor, campusId: number) => {
    setFloorFormData({
      campusId: campusId,
      buildingId: floor.buildingId,
      name: floor.name,
      level: floor.level,
      description: floor.description,
      status: floor.status
    });
    setEditingId(floor.id);
    setIsEditing(true);
    setShowFloorModal(true);
  };

  const handleEditRoom = (room: FlattenedRoom) => {
    const fullRoom = campuses.
    flatMap((c) => c.buildings).
    flatMap((b) => b.floors).
    flatMap((f) => f.rooms).
    find((r) => r.id === room.id);

    if (fullRoom) {
      setRoomFormData({
        campusId: room.campusId,
        buildingId: room.buildingId,
        floorId: room.floorId,
        roomNumber: fullRoom.roomNumber,
        name: fullRoom.name,
        type: fullRoom.type,
        capacity: fullRoom.capacity,
        area: fullRoom.area,
        amenities: fullRoom.amenities,
        status: fullRoom.status,
        assignedTo: fullRoom.assignedTo || '',
        description: fullRoom.description
      });
      setEditingId(room.id);
      setIsEditing(true);
      setShowRoomModal(true);
    }
  };

  // Toggle amenity selection
  const handleAmenityToggle = (amenity: string) => {
    setRoomFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity) ?
      prev.amenities.filter((a) => a !== amenity) :
      [...prev.amenities, amenity]
    }));
  };

  // Toggle hierarchy expansion
  const toggleCampusExpand = (campusId: number) => {
    setExpandedCampuses((prev) =>
    prev.includes(campusId) ? prev.filter((id) => id !== campusId) : [...prev, campusId]
    );
  };

  const toggleBuildingExpand = (buildingId: number) => {
    setExpandedBuildings((prev) =>
    prev.includes(buildingId) ? prev.filter((id) => id !== buildingId) : [...prev, buildingId]
    );
  };

  const toggleFloorExpand = (floorId: number) => {
    setExpandedFloors((prev) =>
    prev.includes(floorId) ? prev.filter((id) => id !== floorId) : [...prev, floorId]
    );
  };

  // Export data
  const handleExportData = () => {
    const exportData = JSON.stringify(campuses, null, 2);
    const blob = new Blob([exportData], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `campus-layout-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    window.URL.revokeObjectURL(url);
    showToast('Data exported successfully', 'success');
  };

  // Get buildings for selected campus
  const getBuildingsForCampus = (campusId: number) => {
    return campuses.find((c) => c.id === campusId)?.buildings || [];
  };

  // Get floors for selected building
  const getFloorsForBuilding = (buildingId: number) => {
    for (const campus of campuses) {
      const building = campus.buildings.find((b) => b.id === buildingId);
      if (building) return building.floors;
    }
    return [];
  };

  // Calculate statistics
  const stats = {
    totalCampuses: campuses.length,
    totalBuildings: campuses.reduce((acc, c) => acc + c.buildings.length, 0),
    totalFloors: campuses.reduce((acc, c) => acc + c.buildings.reduce((acc2, b) => acc2 + b.floors.length, 0), 0),
    totalRooms: flattenedRooms.length,
    availableRooms: flattenedRooms.filter((r) => r.status === 'Available').length,
    occupiedRooms: flattenedRooms.filter((r) => r.status === 'Occupied').length,
    totalCapacity: flattenedRooms.reduce((acc, r) => acc + r.capacity, 0)
  };

  // Table columns
  const columns = [
  {
    key: 'campus',
    header: 'Campus',
    render: (row: FlattenedRoom) =>
    <span className="font-medium">{row.campusName}</span>

  },
  {
    key: 'building',
    header: 'Building',
    render: (row: FlattenedRoom) => row.buildingName
  },
  {
    key: 'floor',
    header: 'Floor',
    render: (row: FlattenedRoom) => row.floorName
  },
  {
    key: 'room',
    header: 'Room No',
    render: (row: FlattenedRoom) =>
    <span className="font-medium">{row.roomNumber}</span>

  },
  {
    key: 'name',
    header: 'Room Name',
    render: (row: FlattenedRoom) => row.roomName
  },
  {
    key: 'type',
    header: 'Room Type',
    render: (row: FlattenedRoom) =>
    <Badge variant="default">{row.type}</Badge>

  },
  {
    key: 'capacity',
    header: 'Capacity',
    render: (row: FlattenedRoom) =>
    <span className="flex items-center gap-1">
          <Users className="w-4 h-4 text-gray-400" />
          {row.capacity}
        </span>

  },
  {
    key: 'status',
    header: 'Status',
    render: (row: FlattenedRoom) =>
    <Badge
      variant={
      row.status === 'Available' ? 'success' :
      row.status === 'Occupied' ? 'warning' :
      row.status === 'Reserved' ? 'info' : 'danger'
      }>

          {row.status}
        </Badge>

  },
  {
    key: 'actions',
    header: 'Actions',
    render: (row: FlattenedRoom) =>
    <div className="flex gap-1">
          <Button
        variant="ghost"
        size="xs"
        title="View Details"
        onClick={() => setShowDetailModal(row)}>

            <Eye className="w-4 h-4" />
          </Button>
          <Button
        variant="ghost"
        size="xs"
        title="Edit"
        onClick={() => handleEditRoom(row)}>

            <Edit2 className="w-4 h-4" />
          </Button>
          <Button
        variant="ghost"
        size="xs"
        className="text-red-500"
        title="Delete"
        onClick={() => setConfirmModal({
          isOpen: true,
          type: 'deleteRoom',
          targetId: row.id,
          message: `Are you sure you want to delete room "${row.roomName}"?`
        })}>

            <Trash2 className="w-4 h-4" />
          </Button>
        </div>

  }];


  return (
    <div className="space-y-6 p-6">
      {/* Toast Notification */}
      {toast.isVisible &&
      <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg ${
      toast.type === 'success' ? 'bg-green-500 text-white' :
      toast.type === 'error' ? 'bg-red-500 text-white' :
      'bg-blue-500 text-white'}`
      }>
          {toast.type === 'success' && <CheckCircle className="w-5 h-5" />}
          {toast.type === 'error' && <AlertCircle className="w-5 h-5" />}
          <span>{toast.message}</span>
          <button onClick={() => setToast((prev) => ({ ...prev, isVisible: false }))}>
            <X className="w-4 h-4" />
          </button>
        </div>
      }

      {/* Confirmation Modal */}
      {confirmModal.isOpen &&
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-2">Confirm Delete</h3>
            <p className="text-gray-600 mb-4">{confirmModal.message}</p>
            <div className="flex justify-end gap-2">
              <Button
              variant="outline"
              onClick={() => setConfirmModal({ isOpen: false, type: null, targetId: null, message: '' })}>

                Cancel
              </Button>
              <Button
              variant="danger"
              onClick={() => {
                if (confirmModal.type === 'deleteCampus' && confirmModal.targetId) {
                  handleDeleteCampus(confirmModal.targetId);
                } else if (confirmModal.type === 'deleteBuilding' && confirmModal.targetId) {
                  handleDeleteBuilding(confirmModal.targetId);
                } else if (confirmModal.type === 'deleteFloor' && confirmModal.targetId) {
                  handleDeleteFloor(confirmModal.targetId);
                } else if (confirmModal.type === 'deleteRoom' && confirmModal.targetId) {
                  handleDeleteRoom(confirmModal.targetId);
                }
              }}>

                Delete
              </Button>
            </div>
          </div>
        </div>
      }

      {/* Room Detail Modal */}
      {showDetailModal &&
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold">Room Details</h3>
              <button onClick={() => setShowDetailModal(null)}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-500">Room Number</label>
                  <p className="font-medium">{showDetailModal.roomNumber}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Room Name</label>
                  <p className="font-medium">{showDetailModal.roomName}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Type</label>
                  <p><Badge variant="default">{showDetailModal.type}</Badge></p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Status</label>
                  <p>
                    <Badge
                    variant={
                    showDetailModal.status === 'Available' ? 'success' :
                    showDetailModal.status === 'Occupied' ? 'warning' : 'danger'
                    }>

                      {showDetailModal.status}
                    </Badge>
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Capacity</label>
                  <p className="font-medium">{showDetailModal.capacity} persons</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Area</label>
                  <p className="font-medium">{showDetailModal.area} sq.ft</p>
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-500">Location</label>
                <p className="font-medium">
                  {showDetailModal.campusName} → {showDetailModal.buildingName} → {showDetailModal.floorName}
                </p>
              </div>

              {showDetailModal.assignedTo &&
            <div>
                  <label className="text-sm text-gray-500">Assigned To</label>
                  <p className="font-medium">{showDetailModal.assignedTo}</p>
                </div>
            }

              <div>
                <label className="text-sm text-gray-500">Amenities</label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {showDetailModal.amenities.map((amenity) =>
                <Badge key={amenity} variant="default">{amenity}</Badge>
                )}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => setShowDetailModal(null)}>
                Close
              </Button>
              <Button onClick={() => {
              handleEditRoom(showDetailModal);
              setShowDetailModal(null);
            }}>
                <Edit2 className="w-4 h-4 mr-2" />
                Edit Room
              </Button>
            </div>
          </div>
        </div>
      }

      {/* Campus Modal */}
      {showCampusModal &&
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold">
                {isEditing ? 'Edit Campus' : 'Add New Campus'}
              </h3>
              <button onClick={() => {
              setShowCampusModal(false);
              setIsEditing(false);
              setEditingId(null);
              resetCampusForm();
            }}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                label="Campus Name *"
                placeholder="Enter campus name"
                value={campusFormData.name}
                onChange={(e) => setCampusFormData((prev) => ({ ...prev, name: e.target.value }))} />

                <Input
                label="Campus Code *"
                placeholder="e.g., MC, CB"
                value={campusFormData.code}
                onChange={(e) => setCampusFormData((prev) => ({ ...prev, code: e.target.value.toUpperCase() }))} />

              </div>

              <Textarea
              label="Address"
              placeholder="Enter full address"
              value={campusFormData.address}
              onChange={(e) => setCampusFormData((prev) => ({ ...prev, address: e.target.value }))}
              rows={2} />


              <div className="grid grid-cols-3 gap-4">
                <Input
                label="City"
                placeholder="City"
                value={campusFormData.city}
                onChange={(e) => setCampusFormData((prev) => ({ ...prev, city: e.target.value }))} />

                <Input
                label="State"
                placeholder="State"
                value={campusFormData.state}
                onChange={(e) => setCampusFormData((prev) => ({ ...prev, state: e.target.value }))} />

                <Input
                label="Pincode"
                placeholder="Pincode"
                value={campusFormData.pincode}
                onChange={(e) => setCampusFormData((prev) => ({ ...prev, pincode: e.target.value }))} />

              </div>

              <div className="grid grid-cols-3 gap-4">
                <Input
                label="Contact Person"
                placeholder="Name"
                value={campusFormData.contactPerson}
                onChange={(e) => setCampusFormData((prev) => ({ ...prev, contactPerson: e.target.value }))} />

                <Input
                label="Contact Phone"
                placeholder="Phone"
                value={campusFormData.contactPhone}
                onChange={(e) => setCampusFormData((prev) => ({ ...prev, contactPhone: e.target.value }))} />

                <Input
                label="Contact Email"
                placeholder="Email"
                value={campusFormData.contactEmail}
                onChange={(e) => setCampusFormData((prev) => ({ ...prev, contactEmail: e.target.value }))} />

              </div>

              <Select
              label="Status"
              options={[
              { value: 'Active', label: 'Active' },
              { value: 'Inactive', label: 'Inactive' }]
              }
              value={campusFormData.status}
              onChange={(e) => setCampusFormData((prev) => ({ ...prev, status: e.target.value as any }))} />

            </div>

            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => {
              setShowCampusModal(false);
              setIsEditing(false);
              setEditingId(null);
              resetCampusForm();
            }}>
                Cancel
              </Button>
              <Button onClick={isEditing ? handleUpdateCampus : handleCreateCampus}>
                <Save className="w-4 h-4 mr-2" />
                {isEditing ? 'Update Campus' : 'Add Campus'}
              </Button>
            </div>
          </div>
        </div>
      }

      {/* Building Modal */}
      {showBuildingModal &&
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-xl w-full mx-4">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold">
                {isEditing ? 'Edit Building' : 'Add New Building'}
              </h3>
              <button onClick={() => {
              setShowBuildingModal(false);
              setIsEditing(false);
              setEditingId(null);
              resetBuildingForm();
            }}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <Select
              label="Campus *"
              options={campuses.map((c) => ({ value: c.id.toString(), label: c.name }))}
              value={buildingFormData.campusId.toString()}
              onChange={(e) => setBuildingFormData((prev) => ({ ...prev, campusId: parseInt(e.target.value) }))}
              disabled={isEditing} />


              <div className="grid grid-cols-2 gap-4">
                <Input
                label="Building Name *"
                placeholder="Enter building name"
                value={buildingFormData.name}
                onChange={(e) => setBuildingFormData((prev) => ({ ...prev, name: e.target.value }))} />

                <Input
                label="Building Code *"
                placeholder="e.g., ABA, LB"
                value={buildingFormData.code}
                onChange={(e) => setBuildingFormData((prev) => ({ ...prev, code: e.target.value.toUpperCase() }))} />

              </div>

              <Textarea
              label="Description"
              placeholder="Enter building description"
              value={buildingFormData.description}
              onChange={(e) => setBuildingFormData((prev) => ({ ...prev, description: e.target.value }))}
              rows={2} />


              <div className="grid grid-cols-2 gap-4">
                <Input
                label="Total Floors"
                type="number"
                min={1}
                value={buildingFormData.totalFloors}
                onChange={(e) => setBuildingFormData((prev) => ({ ...prev, totalFloors: parseInt(e.target.value) || 1 }))} />

                <Input
                label="Year Built"
                type="number"
                value={buildingFormData.yearBuilt}
                onChange={(e) => setBuildingFormData((prev) => ({ ...prev, yearBuilt: parseInt(e.target.value) }))} />

              </div>

              <Select
              label="Status"
              options={[
              { value: 'Active', label: 'Active' },
              { value: 'Inactive', label: 'Inactive' },
              { value: 'Under Maintenance', label: 'Under Maintenance' }]
              }
              value={buildingFormData.status}
              onChange={(e) => setBuildingFormData((prev) => ({ ...prev, status: e.target.value as any }))} />

            </div>

            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => {
              setShowBuildingModal(false);
              setIsEditing(false);
              setEditingId(null);
              resetBuildingForm();
            }}>
                Cancel
              </Button>
              <Button onClick={isEditing ? handleUpdateBuilding : handleCreateBuilding}>
                <Save className="w-4 h-4 mr-2" />
                {isEditing ? 'Update Building' : 'Add Building'}
              </Button>
            </div>
          </div>
        </div>
      }

      {/* Floor Modal */}
      {showFloorModal &&
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-xl w-full mx-4">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold">
                {isEditing ? 'Edit Floor' : 'Add New Floor'}
              </h3>
              <button onClick={() => {
              setShowFloorModal(false);
              setIsEditing(false);
              setEditingId(null);
              resetFloorForm();
            }}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <Select
              label="Campus *"
              options={campuses.map((c) => ({ value: c.id.toString(), label: c.name }))}
              value={floorFormData.campusId.toString()}
              onChange={(e) => {
                const campusId = parseInt(e.target.value);
                setFloorFormData((prev) => ({ ...prev, campusId, buildingId: 0 }));
              }}
              disabled={isEditing} />


              <Select
              label="Building *"
              options={getBuildingsForCampus(floorFormData.campusId).map((b) => ({ value: b.id.toString(), label: b.name }))}
              value={floorFormData.buildingId.toString()}
              onChange={(e) => setFloorFormData((prev) => ({ ...prev, buildingId: parseInt(e.target.value) }))}
              disabled={isEditing} />


              <div className="grid grid-cols-2 gap-4">
                <Input
                label="Floor Name *"
                placeholder="e.g., Ground Floor, First Floor"
                value={floorFormData.name}
                onChange={(e) => setFloorFormData((prev) => ({ ...prev, name: e.target.value }))} />

                <Input
                label="Floor Level"
                type="number"
                placeholder="0, 1, 2, ..."
                value={floorFormData.level}
                onChange={(e) => setFloorFormData((prev) => ({ ...prev, level: parseInt(e.target.value) || 0 }))} />

              </div>

              <Textarea
              label="Description"
              placeholder="Enter floor description"
              value={floorFormData.description}
              onChange={(e) => setFloorFormData((prev) => ({ ...prev, description: e.target.value }))}
              rows={2} />


              <Select
              label="Status"
              options={[
              { value: 'Active', label: 'Active' },
              { value: 'Inactive', label: 'Inactive' }]
              }
              value={floorFormData.status}
              onChange={(e) => setFloorFormData((prev) => ({ ...prev, status: e.target.value as any }))} />

            </div>

            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => {
              setShowFloorModal(false);
              setIsEditing(false);
              setEditingId(null);
              resetFloorForm();
            }}>
                Cancel
              </Button>
              <Button onClick={isEditing ? handleUpdateFloor : handleCreateFloor}>
                <Save className="w-4 h-4 mr-2" />
                {isEditing ? 'Update Floor' : 'Add Floor'}
              </Button>
            </div>
          </div>
        </div>
      }

      {/* Room Modal */}
      {showRoomModal &&
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold">
                {isEditing ? 'Edit Room' : 'Add New Room'}
              </h3>
              <button onClick={() => {
              setShowRoomModal(false);
              setIsEditing(false);
              setEditingId(null);
              resetRoomForm();
            }}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <Select
                label="Campus *"
                options={campuses.map((c) => ({ value: c.id.toString(), label: c.name }))}
                value={roomFormData.campusId.toString()}
                onChange={(e) => {
                  const campusId = parseInt(e.target.value);
                  setRoomFormData((prev) => ({ ...prev, campusId, buildingId: 0, floorId: 0 }));
                }}
                disabled={isEditing} />


                <Select
                label="Building *"
                options={getBuildingsForCampus(roomFormData.campusId).map((b) => ({ value: b.id.toString(), label: b.name }))}
                value={roomFormData.buildingId.toString()}
                onChange={(e) => {
                  const buildingId = parseInt(e.target.value);
                  setRoomFormData((prev) => ({ ...prev, buildingId, floorId: 0 }));
                }}
                disabled={isEditing} />


                <Select
                label="Floor *"
                options={getFloorsForBuilding(roomFormData.buildingId).map((f) => ({ value: f.id.toString(), label: f.name }))}
                value={roomFormData.floorId.toString()}
                onChange={(e) => setRoomFormData((prev) => ({ ...prev, floorId: parseInt(e.target.value) }))}
                disabled={isEditing} />

              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                label="Room Number *"
                placeholder="e.g., 101, A-01"
                value={roomFormData.roomNumber}
                onChange={(e) => setRoomFormData((prev) => ({ ...prev, roomNumber: e.target.value }))} />

                <Input
                label="Room Name *"
                placeholder="e.g., Physics Lab, Principal Office"
                value={roomFormData.name}
                onChange={(e) => setRoomFormData((prev) => ({ ...prev, name: e.target.value }))} />

              </div>

              <div className="grid grid-cols-3 gap-4">
                <Select
                label="Room Type *"
                options={ROOM_TYPES.map((t) => ({ value: t, label: t }))}
                value={roomFormData.type}
                onChange={(e) => setRoomFormData((prev) => ({ ...prev, type: e.target.value as RoomType }))} />

                <Input
                label="Capacity"
                type="number"
                min={1}
                placeholder="Number of people"
                value={roomFormData.capacity}
                onChange={(e) => setRoomFormData((prev) => ({ ...prev, capacity: parseInt(e.target.value) || 0 }))} />

                <Input
                label="Area (sq.ft)"
                type="number"
                min={1}
                placeholder="Square feet"
                value={roomFormData.area}
                onChange={(e) => setRoomFormData((prev) => ({ ...prev, area: parseInt(e.target.value) || 0 }))} />

              </div>

              <div className="grid grid-cols-2 gap-4">
                <Select
                label="Status"
                options={[
                { value: 'Available', label: 'Available' },
                { value: 'Occupied', label: 'Occupied' },
                { value: 'Reserved', label: 'Reserved' },
                { value: 'Under Maintenance', label: 'Under Maintenance' }]
                }
                value={roomFormData.status}
                onChange={(e) => setRoomFormData((prev) => ({ ...prev, status: e.target.value as any }))} />

                <Input
                label="Assigned To"
                placeholder="e.g., Class 10-A, IT Department"
                value={roomFormData.assignedTo}
                onChange={(e) => setRoomFormData((prev) => ({ ...prev, assignedTo: e.target.value }))} />

              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Amenities</label>
                <div className="grid grid-cols-3 gap-2 p-3 border rounded-lg max-h-32 overflow-y-auto">
                  {AMENITIES_LIST.map((amenity) =>
                <label key={amenity} className="flex items-center gap-2 cursor-pointer">
                      <input
                    type="checkbox"
                    checked={roomFormData.amenities.includes(amenity)}
                    onChange={() => handleAmenityToggle(amenity)}
                    className="rounded border-gray-300" />

                      <span className="text-sm">{amenity}</span>
                    </label>
                )}
                </div>
              </div>

              <Textarea
              label="Description"
              placeholder="Enter room description"
              value={roomFormData.description}
              onChange={(e) => setRoomFormData((prev) => ({ ...prev, description: e.target.value }))}
              rows={2} />

            </div>

            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => {
              setShowRoomModal(false);
              setIsEditing(false);
              setEditingId(null);
              resetRoomForm();
            }}>
                Cancel
              </Button>
              <Button onClick={isEditing ? handleUpdateRoom : handleCreateRoom}>
                <Save className="w-4 h-4 mr-2" />
                {isEditing ? 'Update Room' : 'Add Room'}
              </Button>
            </div>
          </div>
        </div>
      }

      {/* Header */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Campus Layout & Rooms
          </h1>
          <p className="text-sm text-gray-500">
            Define buildings, floors, and room infrastructure
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" onClick={() => {
            resetCampusForm();
            setIsEditing(false);
            setShowCampusModal(true);
          }}>
            <MapPin className="w-4 h-4 mr-2" />
            Add Campus
          </Button>
          <Button variant="outline" onClick={() => {
            resetBuildingForm();
            setIsEditing(false);
            setShowBuildingModal(true);
          }}>
            <Building2 className="w-4 h-4 mr-2" />
            Add Building
          </Button>
          <Button variant="outline" onClick={() => {
            resetFloorForm();
            setIsEditing(false);
            setShowFloorModal(true);
          }}>
            <Layers className="w-4 h-4 mr-2" />
            Add Floor
          </Button>
          <Button onClick={() => {
            resetRoomForm();
            setIsEditing(false);
            setShowRoomModal(true);
          }}>
            <Plus className="w-4 h-4 mr-2" />
            Add Room
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        <Card className="p-4">
          <div className="text-center">
            <MapPin className="w-6 h-6 mx-auto mb-1 text-blue-500" />
            <p className="text-2xl font-bold">{stats.totalCampuses}</p>
            <p className="text-xs text-gray-500">Campuses</p>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <Building2 className="w-6 h-6 mx-auto mb-1 text-purple-500" />
            <p className="text-2xl font-bold">{stats.totalBuildings}</p>
            <p className="text-xs text-gray-500">Buildings</p>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <Layers className="w-6 h-6 mx-auto mb-1 text-orange-500" />
            <p className="text-2xl font-bold">{stats.totalFloors}</p>
            <p className="text-xs text-gray-500">Floors</p>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <DoorOpen className="w-6 h-6 mx-auto mb-1 text-green-500" />
            <p className="text-2xl font-bold">{stats.totalRooms}</p>
            <p className="text-xs text-gray-500">Total Rooms</p>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <CheckCircle className="w-6 h-6 mx-auto mb-1 text-green-500" />
            <p className="text-2xl font-bold">{stats.availableRooms}</p>
            <p className="text-xs text-gray-500">Available</p>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <Users className="w-6 h-6 mx-auto mb-1 text-yellow-500" />
            <p className="text-2xl font-bold">{stats.occupiedRooms}</p>
            <p className="text-xs text-gray-500">Occupied</p>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <Maximize2 className="w-6 h-6 mx-auto mb-1 text-indigo-500" />
            <p className="text-2xl font-bold">{stats.totalCapacity.toLocaleString()}</p>
            <p className="text-xs text-gray-500">Total Capacity</p>
          </div>
        </Card>
      </div>

      {/* View Toggle and Filters */}
      <Card className="p-4">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex gap-2">
            <Button
              variant={viewMode === 'table' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setViewMode('table')}>

              <Grid3X3 className="w-4 h-4 mr-2" />
              Table View
            </Button>
            <Button
              variant={viewMode === 'hierarchy' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setViewMode('hierarchy')}>

              <Layers className="w-4 h-4 mr-2" />
              Hierarchy View
            </Button>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleExportData}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {viewMode === 'table' &&
        <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                type="text"
                placeholder="Search rooms..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg" />

              </div>
            </div>
            <select
            value={campusFilter}
            onChange={(e) => setCampusFilter(e.target.value)}
            className="border rounded-lg px-3 py-2">

              <option value="All">All Campuses</option>
              {campuses.map((c) =>
            <option key={c.id} value={c.name}>{c.name}</option>
            )}
            </select>
            <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="border rounded-lg px-3 py-2">

              <option value="All">All Types</option>
              {ROOM_TYPES.map((type) =>
            <option key={type} value={type}>{type}</option>
            )}
            </select>
            <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border rounded-lg px-3 py-2">

              <option value="All">All Status</option>
              <option value="Available">Available</option>
              <option value="Occupied">Occupied</option>
              <option value="Reserved">Reserved</option>
              <option value="Under Maintenance">Under Maintenance</option>
            </select>
          </div>
        }
      </Card>

      {/* Main Content */}
      {viewMode === 'table' ?
      <Card>
          {filteredRooms.length === 0 ?
        <div className="p-8 text-center text-gray-500">
              <DoorOpen className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium">No rooms found</p>
              <p className="text-sm">Add rooms to your campus infrastructure</p>
            </div> :

        <Table columns={columns} data={filteredRooms} />
        }
        </Card> :

      <div className="space-y-4">
          {campuses.map((campus) =>
        <Card key={campus.id} className="overflow-hidden">
              <div
            className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50"
            onClick={() => toggleCampusExpand(campus.id)}>

                <div className="flex items-center gap-3">
                  {expandedCampuses.includes(campus.id) ?
              <ChevronDown className="w-5 h-5" /> :

              <ChevronRight className="w-5 h-5" />
              }
                  <MapPin className="w-5 h-5 text-blue-500" />
                  <div>
                    <h3 className="font-semibold">{campus.name}</h3>
                    <p className="text-sm text-gray-500">{campus.code} • {campus.city}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge variant={campus.status === 'Active' ? 'success' : 'default'}>
                    {campus.status}
                  </Badge>
                  <span className="text-sm text-gray-500">
                    {campus.buildings.length} Buildings
                  </span>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="xs" onClick={(e) => {
                  e.stopPropagation();
                  handleEditCampus(campus);
                }}>
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                  variant="ghost"
                  size="xs"
                  className="text-red-500"
                  onClick={(e) => {
                    e.stopPropagation();
                    setConfirmModal({
                      isOpen: true,
                      type: 'deleteCampus',
                      targetId: campus.id,
                      message: `Delete campus "${campus.name}" and all its buildings?`
                    });
                  }}>

                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {expandedCampuses.includes(campus.id) &&
          <div className="border-t">
                  {campus.buildings.map((building) =>
            <div key={building.id} className="border-b last:border-b-0">
                      <div
                className="p-4 pl-12 flex items-center justify-between cursor-pointer hover:bg-gray-50"
                onClick={() => toggleBuildingExpand(building.id)}>

                        <div className="flex items-center gap-3">
                          {expandedBuildings.includes(building.id) ?
                  <ChevronDown className="w-4 h-4" /> :

                  <ChevronRight className="w-4 h-4" />
                  }
                          <Building2 className="w-5 h-5 text-purple-500" />
                          <div>
                            <h4 className="font-medium">{building.name}</h4>
                            <p className="text-sm text-gray-500">{building.code} • {building.totalFloors} Floors</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <Badge
                    variant={
                    building.status === 'Active' ? 'success' :
                    building.status === 'Under Maintenance' ? 'warning' : 'default'
                    }>

                            {building.status}
                          </Badge>
                          <span className="text-sm text-gray-500">
                            {building.floors.reduce((acc, f) => acc + f.rooms.length, 0)} Rooms
                          </span>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="xs" onClick={(e) => {
                      e.stopPropagation();
                      handleEditBuilding(building);
                    }}>
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button
                      variant="ghost"
                      size="xs"
                      className="text-red-500"
                      onClick={(e) => {
                        e.stopPropagation();
                        setConfirmModal({
                          isOpen: true,
                          type: 'deleteBuilding',
                          targetId: building.id,
                          message: `Delete building "${building.name}"?`
                        });
                      }}>

                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>

                      {expandedBuildings.includes(building.id) &&
              <div className="bg-gray-50">
                          {building.floors.map((floor) =>
                <div key={floor.id} className="border-t">
                              <div
                    className="p-3 pl-20 flex items-center justify-between cursor-pointer hover:bg-gray-100"
                    onClick={() => toggleFloorExpand(floor.id)}>

                                <div className="flex items-center gap-3">
                                  {expandedFloors.includes(floor.id) ?
                      <ChevronDown className="w-4 h-4" /> :

                      <ChevronRight className="w-4 h-4" />
                      }
                                  <Layers className="w-4 h-4 text-orange-500" />
                                  <div>
                                    <span className="font-medium">{floor.name}</span>
                                    <span className="text-sm text-gray-500 ml-2">
                                      (Level {floor.level})
                                    </span>
                                  </div>
                                </div>
                                <div className="flex items-center gap-4">
                                  <span className="text-sm text-gray-500">
                                    {floor.rooms.length} Rooms
                                  </span>
                                  <div className="flex gap-1">
                                    <Button variant="ghost" size="xs" onClick={(e) => {
                          e.stopPropagation();
                          handleEditFloor(floor, campus.id);
                        }}>
                                      <Edit2 className="w-4 h-4" />
                                    </Button>
                                    <Button
                          variant="ghost"
                          size="xs"
                          className="text-red-500"
                          onClick={(e) => {
                            e.stopPropagation();
                            setConfirmModal({
                              isOpen: true,
                              type: 'deleteFloor',
                              targetId: floor.id,
                              message: `Delete floor "${floor.name}"?`
                            });
                          }}>

                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </div>
                              </div>

                              {expandedFloors.includes(floor.id) &&
                  <div className="pl-28 pr-4 pb-3">
                                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                                    {floor.rooms.map((room) =>
                      <div
                        key={room.id}
                        className="p-3 bg-white rounded-lg border flex items-center justify-between">

                                        <div className="flex items-center gap-2">
                                          <DoorOpen className="w-4 h-4 text-green-500" />
                                          <div>
                                            <p className="font-medium text-sm">{room.roomNumber}</p>
                                            <p className="text-xs text-gray-500">{room.name}</p>
                                          </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <Badge
                            variant={
                            room.status === 'Available' ? 'success' :
                            room.status === 'Occupied' ? 'warning' : 'default'
                            }>

                                            {room.status}
                                          </Badge>
                                          <div className="flex gap-1">
                                            <Button
                              variant="ghost"
                              size="xs"
                              onClick={() => {
                                const flatRoom = flattenedRooms.find((r) => r.id === room.id);
                                if (flatRoom) handleEditRoom(flatRoom);
                              }}>

                                              <Edit2 className="w-3 h-3" />
                                            </Button>
                                            <Button
                              variant="ghost"
                              size="xs"
                              className="text-red-500"
                              onClick={() => setConfirmModal({
                                isOpen: true,
                                type: 'deleteRoom',
                                targetId: room.id,
                                message: `Delete room "${room.name}"?`
                              })}>

                                              <Trash2 className="w-3 h-3" />
                                            </Button>
                                          </div>
                                        </div>
                                      </div>
                      )}
                                    {floor.rooms.length === 0 &&
                      <p className="text-sm text-gray-500 py-2">No rooms on this floor</p>
                      }
                                  </div>
                                </div>
                  }
                            </div>
                )}
                          {building.floors.length === 0 &&
                <p className="text-sm text-gray-500 py-4 pl-20">No floors in this building</p>
                }
                        </div>
              }
                    </div>
            )}
                  {campus.buildings.length === 0 &&
            <p className="text-sm text-gray-500 py-4 pl-12">No buildings in this campus</p>
            }
                </div>
          }
            </Card>
        )}
        </div>
      }
    </div>);

}