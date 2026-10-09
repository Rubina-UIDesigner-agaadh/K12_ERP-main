import React, { useMemo, useState, memo } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import {
  RefreshCw,
  Upload,
  Download,
  Wifi,
  WifiOff,
  CheckCircle,
  Plus,
  Settings,
  Trash2,
  Edit,
  Power,
  PowerOff,
  Activity,
  AlertTriangle,
  Clock,
  Database,
  Server,
  Monitor,
  Fingerprint,
  Search,
  Filter,
  X,
  ChevronDown,
  ChevronUp,
  MoreVertical,
  Eye,
  EyeOff,
  Link,
  Link2Off,
  Zap,
  ZapOff,
  HardDrive,
  Cpu,
  MemoryStick,
  Signal,
  SignalHigh,
  SignalLow,
  SignalMedium,
  SignalZero,
  History,
  FileSpreadsheet,
  FileText,
  Calendar,
  Users,
  MapPin,
  Globe,
  Lock,
  Unlock,
  Play,
  Pause,
  RotateCcw,
  Check,
  Info,
  AlertCircle,
  XCircle,
  Loader2 } from
'lucide-react';
type DeviceStatus = 'online' | 'offline' | 'syncing' | 'error' | 'maintenance';
type DeviceType = 'fingerprint' | 'face' | 'card' | 'multi';
type ConnectionType = 'ethernet' | 'wifi' | 'usb' | 'cloud';
interface BiometricDevice {
  id: string;
  name: string;
  type: DeviceType;
  model: string;
  serialNumber: string;
  ipAddress: string;
  port: number;
  location: string;
  department: string;
  status: DeviceStatus;
  connectionType: ConnectionType;
  lastSync: string;
  lastOnline: string;
  recordsToday: number;
  totalRecords: number;
  capacity: number;
  usedCapacity: number;
  firmwareVersion: string;
  isAutoSync: boolean;
  syncInterval: number;
  enrolledUsers: number;
  maxUsers: number;
  cpuUsage?: number;
  memoryUsage?: number;
  signalStrength?: number;
}
interface SyncLog {
  id: string;
  deviceId: string;
  deviceName: string;
  timestamp: string;
  recordsSynced: number;
  status: 'success' | 'failed' | 'partial';
  duration: string;
  errorMessage?: string;
}
interface ImportHistory {
  id: string;
  fileName: string;
  deviceName: string;
  importedAt: string;
  recordsImported: number;
  status: 'success' | 'failed' | 'processing';
  importedBy: string;
}
// Mock Data
const devicesData: BiometricDevice[] = [
{
  id: '1',
  name: 'Main Gate Device',
  type: 'fingerprint',
  model: 'ZKTeco K40',
  serialNumber: 'ZK-2024-001',
  ipAddress: '192.168.1.101',
  port: 4370,
  location: 'Main Entrance',
  department: 'All',
  status: 'online',
  connectionType: 'ethernet',
  lastSync: '2024-03-15 08:30 AM',
  lastOnline: '2024-03-15 08:35 AM',
  recordsToday: 245,
  totalRecords: 15420,
  capacity: 50000,
  usedCapacity: 32,
  firmwareVersion: '6.60',
  isAutoSync: true,
  syncInterval: 15,
  enrolledUsers: 1250,
  maxUsers: 3000,
  cpuUsage: 45,
  memoryUsage: 62,
  signalStrength: 95
},
{
  id: '2',
  name: 'Back Gate Device',
  type: 'face',
  model: 'Hikvision DS-K1T671M',
  serialNumber: 'HK-2024-002',
  ipAddress: '192.168.1.102',
  port: 8000,
  location: 'Back Entrance',
  department: 'All',
  status: 'online',
  connectionType: 'ethernet',
  lastSync: '2024-03-15 08:25 AM',
  lastOnline: '2024-03-15 08:35 AM',
  recordsToday: 128,
  totalRecords: 8750,
  capacity: 30000,
  usedCapacity: 29,
  firmwareVersion: '2.3.1',
  isAutoSync: true,
  syncInterval: 15,
  enrolledUsers: 1250,
  maxUsers: 5000,
  cpuUsage: 32,
  memoryUsage: 48,
  signalStrength: 88
},
{
  id: '3',
  name: 'Staff Room Device',
  type: 'multi',
  model: 'eSSL X990',
  serialNumber: 'ES-2024-003',
  ipAddress: '192.168.1.103',
  port: 4370,
  location: 'Staff Room',
  department: 'Staff',
  status: 'offline',
  connectionType: 'wifi',
  lastSync: '2024-03-14 06:00 PM',
  lastOnline: '2024-03-14 06:05 PM',
  recordsToday: 0,
  totalRecords: 5620,
  capacity: 20000,
  usedCapacity: 28,
  firmwareVersion: '3.2.5',
  isAutoSync: true,
  syncInterval: 30,
  enrolledUsers: 85,
  maxUsers: 1000,
  signalStrength: 0
},
{
  id: '4',
  name: 'Library Device',
  type: 'card',
  model: 'ZKTeco SC405',
  serialNumber: 'ZK-2024-004',
  ipAddress: '192.168.1.104',
  port: 4370,
  location: 'Library Entrance',
  department: 'Library',
  status: 'syncing',
  connectionType: 'ethernet',
  lastSync: '2024-03-15 08:20 AM',
  lastOnline: '2024-03-15 08:35 AM',
  recordsToday: 89,
  totalRecords: 4250,
  capacity: 10000,
  usedCapacity: 42,
  firmwareVersion: '4.1.0',
  isAutoSync: false,
  syncInterval: 60,
  enrolledUsers: 1500,
  maxUsers: 2000,
  cpuUsage: 78,
  memoryUsage: 55,
  signalStrength: 100
},
{
  id: '5',
  name: 'Lab Building Device',
  type: 'fingerprint',
  model: 'ZKTeco K50',
  serialNumber: 'ZK-2024-005',
  ipAddress: '192.168.1.105',
  port: 4370,
  location: 'Lab Building',
  department: 'Science',
  status: 'error',
  connectionType: 'wifi',
  lastSync: '2024-03-15 07:00 AM',
  lastOnline: '2024-03-15 07:15 AM',
  recordsToday: 45,
  totalRecords: 3100,
  capacity: 20000,
  usedCapacity: 15,
  firmwareVersion: '6.58',
  isAutoSync: true,
  syncInterval: 15,
  enrolledUsers: 450,
  maxUsers: 1000,
  cpuUsage: 12,
  memoryUsage: 35,
  signalStrength: 45
}];

const syncLogs: SyncLog[] = [
{
  id: '1',
  deviceId: '1',
  deviceName: 'Main Gate Device',
  timestamp: '2024-03-15 08:30 AM',
  recordsSynced: 45,
  status: 'success',
  duration: '12s'
},
{
  id: '2',
  deviceId: '2',
  deviceName: 'Back Gate Device',
  timestamp: '2024-03-15 08:25 AM',
  recordsSynced: 32,
  status: 'success',
  duration: '8s'
},
{
  id: '3',
  deviceId: '4',
  deviceName: 'Library Device',
  timestamp: '2024-03-15 08:20 AM',
  recordsSynced: 18,
  status: 'partial',
  duration: '25s',
  errorMessage: '3 records failed validation'
},
{
  id: '4',
  deviceId: '5',
  deviceName: 'Lab Building Device',
  timestamp: '2024-03-15 07:00 AM',
  recordsSynced: 0,
  status: 'failed',
  duration: '45s',
  errorMessage: 'Connection timeout'
},
{
  id: '5',
  deviceId: '1',
  deviceName: 'Main Gate Device',
  timestamp: '2024-03-15 08:15 AM',
  recordsSynced: 38,
  status: 'success',
  duration: '10s'
}];

const importHistory: ImportHistory[] = [
{
  id: '1',
  fileName: 'attendance_20240315.dat',
  deviceName: 'Main Gate Device',
  importedAt: '2024-03-15 07:00 AM',
  recordsImported: 156,
  status: 'success',
  importedBy: 'Admin'
},
{
  id: '2',
  fileName: 'staff_attendance.csv',
  deviceName: 'Staff Room Device',
  importedAt: '2024-03-14 06:30 PM',
  recordsImported: 42,
  status: 'success',
  importedBy: 'Admin'
},
{
  id: '3',
  fileName: 'backup_data.xlsx',
  deviceName: 'Back Gate Device',
  importedAt: '2024-03-14 02:00 PM',
  recordsImported: 0,
  status: 'failed',
  importedBy: 'System'
}];

const deviceTypeOptions = [
{
  value: 'fingerprint',
  label: 'Fingerprint Scanner'
},
{
  value: 'face',
  label: 'Face Recognition'
},
{
  value: 'card',
  label: 'Card Reader'
},
{
  value: 'multi',
  label: 'Multi-Modal'
}];

const connectionTypeOptions = [
{
  value: 'ethernet',
  label: 'Ethernet (LAN)'
},
{
  value: 'wifi',
  label: 'WiFi'
},
{
  value: 'usb',
  label: 'USB'
},
{
  value: 'cloud',
  label: 'Cloud API'
}];

const departmentOptions = [
{
  value: 'All',
  label: 'All Departments'
},
{
  value: 'Science',
  label: 'Science'
},
{
  value: 'Commerce',
  label: 'Commerce'
},
{
  value: 'Arts',
  label: 'Arts'
},
{
  value: 'Staff',
  label: 'Staff Only'
},
{
  value: 'Library',
  label: 'Library'
}];

const syncIntervalOptions = [
{
  value: '5',
  label: 'Every 5 minutes'
},
{
  value: '15',
  label: 'Every 15 minutes'
},
{
  value: '30',
  label: 'Every 30 minutes'
},
{
  value: '60',
  label: 'Every 1 hour'
},
{
  value: '120',
  label: 'Every 2 hours'
},
{
  value: 'manual',
  label: 'Manual Only'
}];

type ViewMode = 'grid' | 'list';
type TabType = 'devices' | 'sync-logs' | 'import-history' | 'settings';
export function DeviceSyncBiometric() {
  // State Management
  const [devices, setDevices] = useState<BiometricDevice[]>(devicesData);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [activeTab, setActiveTab] = useState<TabType>('devices');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  // Modal States
  const [showAddDeviceModal, setShowAddDeviceModal] = useState(false);
  const [showEditDeviceModal, setShowEditDeviceModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeviceDetailsModal, setShowDeviceDetailsModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<BiometricDevice | null>(
    null
  );
  // Form States
  const [newDevice, setNewDevice] = useState({
    name: '',
    type: 'fingerprint',
    model: '',
    serialNumber: '',
    ipAddress: '',
    port: '4370',
    location: '',
    department: 'All',
    connectionType: 'ethernet',
    syncInterval: '15',
    isAutoSync: true
  });
  // Loading States
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncingDeviceId, setSyncingDeviceId] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  // Import States
  const [importDevice, setImportDevice] = useState('');
  const [importDate, setImportDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [importFile, setImportFile] = useState<File | null>(null);
  // Calculate statistics
  const stats = useMemo(() => {
    const total = devices.length;
    const online = devices.filter((d) => d.status === 'online').length;
    const offline = devices.filter((d) => d.status === 'offline').length;
    const syncing = devices.filter((d) => d.status === 'syncing').length;
    const error = devices.filter((d) => d.status === 'error').length;
    const recordsToday = devices.reduce((sum, d) => sum + d.recordsToday, 0);
    const totalRecords = devices.reduce((sum, d) => sum + d.totalRecords, 0);
    const totalUsers = devices.reduce((sum, d) => sum + d.enrolledUsers, 0);
    return {
      total,
      online,
      offline,
      syncing,
      error,
      recordsToday,
      totalRecords,
      totalUsers
    };
  }, [devices]);
  // Filter devices
  const filteredDevices = useMemo(() => {
    let filtered = devices;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (d) =>
        d.name.toLowerCase().includes(query) ||
        d.location.toLowerCase().includes(query) ||
        d.ipAddress.includes(query) ||
        d.serialNumber.toLowerCase().includes(query)
      );
    }
    if (statusFilter) {
      filtered = filtered.filter((d) => d.status === statusFilter);
    }
    if (typeFilter) {
      filtered = filtered.filter((d) => d.type === typeFilter);
    }
    return filtered;
  }, [devices, searchQuery, statusFilter, typeFilter]);
  // Get status badge variant
  const getStatusBadgeVariant = (status: DeviceStatus) => {
    switch (status) {
      case 'online':
        return 'success';
      case 'offline':
        return 'danger';
      case 'syncing':
        return 'info';
      case 'error':
        return 'danger';
      case 'maintenance':
        return 'warning';
      default:
        return 'default';
    }
  };
  // Get status icon
  const getStatusIcon = (status: DeviceStatus) => {
    switch (status) {
      case 'online':
        return <Wifi className="w-5 h-5 text-green-500" />;
      case 'offline':
        return <WifiOff className="w-5 h-5 text-red-500" />;
      case 'syncing':
        return <RefreshCw className="w-5 h-5 text-blue-500 animate-spin" />;
      case 'error':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'maintenance':
        return <Settings className="w-5 h-5 text-yellow-500" />;
      default:
        return <Signal className="w-5 h-5 text-gray-500" />;
    }
  };
  // Get device type icon
  const getDeviceTypeIcon = (type: DeviceType) => {
    switch (type) {
      case 'fingerprint':
        return <Fingerprint className="w-6 h-6" />;
      case 'face':
        return <Users className="w-6 h-6" />;
      case 'card':
        return <HardDrive className="w-6 h-6" />;
      case 'multi':
        return <Cpu className="w-6 h-6" />;
      default:
        return <Server className="w-6 h-6" />;
    }
  };
  // Get signal strength icon
  const getSignalIcon = (strength?: number) => {
    if (!strength || strength === 0)
    return <SignalZero className="w-4 h-4 text-gray-400" />;
    if (strength < 30) return <SignalLow className="w-4 h-4 text-red-500" />;
    if (strength < 60)
    return <SignalMedium className="w-4 h-4 text-yellow-500" />;
    return <SignalHigh className="w-4 h-4 text-green-500" />;
  };
  // Handle sync device
  const handleSyncDevice = (deviceId: string) => {
    setSyncingDeviceId(deviceId);
    setDevices((prev) =>
    prev.map((d) =>
    d.id === deviceId ?
    {
      ...d,
      status: 'syncing' as DeviceStatus
    } :
    d
    )
    );
    setTimeout(() => {
      setDevices((prev) =>
      prev.map((d) =>
      d.id === deviceId ?
      {
        ...d,
        status: 'online' as DeviceStatus,
        lastSync: new Date().toLocaleString(),
        recordsToday: d.recordsToday + Math.floor(Math.random() * 20)
      } :
      d
      )
      );
      setSyncingDeviceId(null);
    }, 3000);
  };
  // Handle sync all
  const handleSyncAll = () => {
    setIsSyncing(true);
    const onlineDevices = devices.filter(
      (d) => d.status === 'online' || d.status === 'error'
    );
    onlineDevices.forEach((device) => {
      handleSyncDevice(device.id);
    });
    setTimeout(() => {
      setIsSyncing(false);
    }, 4000);
  };
  // Handle add device
  const handleAddDevice = () => {
    const device: BiometricDevice = {
      id: Date.now().toString(),
      name: newDevice.name,
      type: newDevice.type as DeviceType,
      model: newDevice.model,
      serialNumber: newDevice.serialNumber,
      ipAddress: newDevice.ipAddress,
      port: parseInt(newDevice.port),
      location: newDevice.location,
      department: newDevice.department,
      status: 'offline',
      connectionType: newDevice.connectionType as ConnectionType,
      lastSync: 'Never',
      lastOnline: 'Never',
      recordsToday: 0,
      totalRecords: 0,
      capacity: 20000,
      usedCapacity: 0,
      firmwareVersion: 'Unknown',
      isAutoSync: newDevice.isAutoSync,
      syncInterval: parseInt(newDevice.syncInterval) || 0,
      enrolledUsers: 0,
      maxUsers: 1000
    };
    setDevices((prev) => [...prev, device]);
    setShowAddDeviceModal(false);
    setNewDevice({
      name: '',
      type: 'fingerprint',
      model: '',
      serialNumber: '',
      ipAddress: '',
      port: '4370',
      location: '',
      department: 'All',
      connectionType: 'ethernet',
      syncInterval: '15',
      isAutoSync: true
    });
  };
  // Handle connect device
  const handleConnectDevice = () => {
    if (!selectedDevice) return;
    setIsConnecting(true);
    setTimeout(() => {
      setDevices((prev) =>
      prev.map((d) =>
      d.id === selectedDevice.id ?
      {
        ...d,
        status: 'online' as DeviceStatus,
        lastOnline: new Date().toLocaleString()
      } :
      d
      )
      );
      setIsConnecting(false);
      setShowConnectModal(false);
    }, 2000);
  };
  // Handle disconnect device
  const handleDisconnectDevice = (deviceId: string) => {
    setDevices((prev) =>
    prev.map((d) =>
    d.id === deviceId ?
    {
      ...d,
      status: 'offline' as DeviceStatus
    } :
    d
    )
    );
  };
  // Handle delete device
  const handleDeleteDevice = () => {
    if (!selectedDevice) return;
    setDevices((prev) => prev.filter((d) => d.id !== selectedDevice.id));
    setShowDeleteModal(false);
    setSelectedDevice(null);
  };
  // Handle file import
  const handleImportFile = () => {
    if (!importFile || !importDevice) return;
    setIsImporting(true);
    setTimeout(() => {
      setIsImporting(false);
      setShowImportModal(false);
      setImportFile(null);
      setImportDevice('');
    }, 2000);
  };
  // Handle file drop
  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setImportFile(file);
    }
  };
  // Clear filters
  const handleClearFilters = () => {
    setSearchQuery('');
    setStatusFilter('');
    setTypeFilter('');
  };
  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-full">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Device Sync / Biometric Import
          </h1>
          <p className="text-gray-500 mt-1">
            Manage biometric devices and sync attendance data
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            leftIcon={<Upload className="w-4 h-4" />}
            onClick={() => setShowImportModal(true)}>

            Import File
          </Button>
          <Button
            variant="outline"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => setShowAddDeviceModal(true)}>

            Add Device
          </Button>
          <Button
            variant="primary"
            leftIcon={
            isSyncing ?
            <Loader2 className="w-4 h-4 animate-spin" /> :

            <RefreshCw className="w-4 h-4" />

            }
            onClick={handleSyncAll}
            disabled={isSyncing}>

            {isSyncing ? 'Syncing...' : 'Sync All Devices'}
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-4">
          {[
          {
            id: 'devices',
            label: 'Devices',
            icon: Server
          },
          {
            id: 'sync-logs',
            label: 'Sync Logs',
            icon: History
          },
          {
            id: 'import-history',
            label: 'Import History',
            icon: Upload
          },
          {
            id: 'settings',
            label: 'Settings',
            icon: Settings
          }].
          map((tab) =>
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as TabType)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.id ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>

              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          )}
        </nav>
      </div>

      {/* Devices Tab */}
      {activeTab === 'devices' &&
      <>
          {/* Filters */}
          <Card className="p-4">
            <div className="flex flex-col md:flex-row gap-4 items-end">
              <div className="flex-1">
                <Input
                placeholder="Search devices by name, location, IP..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                leftIcon={<Search className="w-4 h-4 text-gray-400" />} />

              </div>
              <Select
              options={[
              {
                value: '',
                label: 'All Status'
              },
              {
                value: 'online',
                label: 'Online'
              },
              {
                value: 'offline',
                label: 'Offline'
              },
              {
                value: 'syncing',
                label: 'Syncing'
              },
              {
                value: 'error',
                label: 'Error'
              }]
              }
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)} />

              <Select
              options={[
              {
                value: '',
                label: 'All Types'
              },
              ...deviceTypeOptions]
              }
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)} />

              <div className="flex gap-2">
                <Button
                variant={viewMode === 'grid' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}>

                  Grid
                </Button>
                <Button
                variant={viewMode === 'list' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}>

                  List
                </Button>
              </div>
              {(searchQuery || statusFilter || typeFilter) &&
            <Button variant="ghost" size="sm" onClick={handleClearFilters}>
                  <X className="w-4 h-4 mr-1" />
                  Clear
                </Button>
            }
            </div>
          </Card>

          {/* Device Grid View */}
          {viewMode === 'grid' &&
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDevices.map((device) =>
          <Card
            key={device.id}
            className={`overflow-hidden transition-all hover:shadow-lg ${device.status === 'error' ? 'border-red-200' : device.status === 'offline' ? 'border-gray-300' : ''}`}>

                  <div
              className={`p-4 ${device.status === 'online' ? 'bg-gradient-to-r from-green-500 to-green-600' : device.status === 'syncing' ? 'bg-gradient-to-r from-blue-500 to-blue-600' : device.status === 'error' ? 'bg-gradient-to-r from-red-500 to-red-600' : device.status === 'offline' ? 'bg-gradient-to-r from-gray-400 to-gray-500' : 'bg-gradient-to-r from-yellow-500 to-yellow-600'}`}>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                          <div className="text-white">
                            {getDeviceTypeIcon(device.type)}
                          </div>
                        </div>
                        <div className="text-white">
                          <h3 className="font-semibold">{device.name}</h3>
                          <p className="text-white/80 text-sm">
                            {device.model}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getSignalIcon(device.signalStrength)}
                        <Badge
                    variant={getStatusBadgeVariant(device.status)}
                    className="text-xs">

                          {device.status.charAt(0).toUpperCase() +
                    device.status.slice(1)}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">{device.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600 font-mono text-xs">
                          {device.ipAddress}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="p-2 bg-gray-50 rounded-lg">
                        <p className="text-lg font-bold text-blue-600">
                          {device.recordsToday}
                        </p>
                        <p className="text-xs text-gray-500">Today</p>
                      </div>
                      <div className="p-2 bg-gray-50 rounded-lg">
                        <p className="text-lg font-bold text-green-600">
                          {device.enrolledUsers}
                        </p>
                        <p className="text-xs text-gray-500">Users</p>
                      </div>
                      <div className="p-2 bg-gray-50 rounded-lg">
                        <p className="text-lg font-bold text-purple-600">
                          {device.usedCapacity}%
                        </p>
                        <p className="text-xs text-gray-500">Capacity</p>
                      </div>
                    </div>

                    {/* Progress bars for CPU and Memory */}
                    {device.status === 'online' &&
              device.cpuUsage !== undefined &&
              <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-500 flex items-center gap-1">
                              <Cpu className="w-3 h-3" /> CPU
                            </span>
                            <span className="font-medium">
                              {device.cpuUsage}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div
                    className={`h-1.5 rounded-full ${device.cpuUsage > 80 ? 'bg-red-500' : device.cpuUsage > 60 ? 'bg-yellow-500' : 'bg-green-500'}`}
                    style={{
                      width: `${device.cpuUsage}%`
                    }} />

                          </div>
                        </div>
              }

                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Last Sync: {device.lastSync}</span>
                      {device.isAutoSync &&
                <Badge variant="info" className="text-xs">
                          Auto: {device.syncInterval}m
                        </Badge>
                }
                    </div>

                    <div className="flex gap-2">
                      {device.status === 'offline' ?
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => {
                    setSelectedDevice(device);
                    setShowConnectModal(true);
                  }}
                  leftIcon={<Link className="w-4 h-4" />}>

                          Connect
                        </Button> :

                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => handleSyncDevice(device.id)}
                  disabled={
                  syncingDeviceId === device.id ||
                  device.status === 'syncing'
                  }
                  leftIcon={
                  syncingDeviceId === device.id ||
                  device.status === 'syncing' ?
                  <Loader2 className="w-4 h-4 animate-spin" /> :

                  <RefreshCw className="w-4 h-4" />

                  }>

                          {syncingDeviceId === device.id ||
                  device.status === 'syncing' ?
                  'Syncing' :
                  'Sync'}
                        </Button>
                }
                      <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedDevice(device);
                    setShowDeviceDetailsModal(true);
                  }}>

                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedDevice(device);
                    setShowEditDeviceModal(true);
                  }}>

                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-600 hover:bg-red-50"
                  onClick={() => {
                    setSelectedDevice(device);
                    setShowDeleteModal(true);
                  }}>

                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
          )}

              {/* Add New Device Card */}
              <Card
            className="border-2 border-dashed border-gray-300 hover:border-blue-400 cursor-pointer transition-colors min-h-[320px] flex items-center justify-center"
            onClick={() => setShowAddDeviceModal(true)}>

                <div className="text-center text-gray-500">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Plus className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="font-medium text-gray-700">Add New Device</p>
                  <p className="text-sm">Click to connect a biometric device</p>
                </div>
              </Card>
            </div>
        }

          {/* Device List View */}
          {viewMode === 'list' &&
        <Card noPadding>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left py-3 px-4 font-medium text-gray-500 text-sm">
                        Device
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500 text-sm">
                        Type
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500 text-sm">
                        IP Address
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500 text-sm">
                        Location
                      </th>
                      <th className="text-center py-3 px-4 font-medium text-gray-500 text-sm">
                        Status
                      </th>
                      <th className="text-center py-3 px-4 font-medium text-gray-500 text-sm">
                        Records
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500 text-sm">
                        Last Sync
                      </th>
                      <th className="text-center py-3 px-4 font-medium text-gray-500 text-sm">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredDevices.map((device) =>
                <tr key={device.id} className="hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${device.status === 'online' ? 'bg-green-100' : device.status === 'syncing' ? 'bg-blue-100' : device.status === 'error' ? 'bg-red-100' : 'bg-gray-100'}`}>

                              <div
                          className={
                          device.status === 'online' ?
                          'text-green-600' :
                          device.status === 'syncing' ?
                          'text-blue-600' :
                          device.status === 'error' ?
                          'text-red-600' :
                          'text-gray-400'
                          }>

                                {getDeviceTypeIcon(device.type)}
                              </div>
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">
                                {device.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {device.model}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-gray-600 capitalize">
                            {device.type}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-mono text-sm text-gray-600">
                            {device.ipAddress}:{device.port}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-gray-600">
                            {device.location}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <Badge variant={getStatusBadgeVariant(device.status)}>
                            {device.status.charAt(0).toUpperCase() +
                      device.status.slice(1)}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className="font-bold text-blue-600">
                            {device.recordsToday}
                          </span>
                          <span className="text-gray-400 text-sm">
                            {' '}
                            / {device.totalRecords.toLocaleString()}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-sm text-gray-600">
                            {device.lastSync}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center justify-center gap-1">
                            {device.status === 'offline' ?
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedDevice(device);
                          setShowConnectModal(true);
                        }}>

                                <Link className="w-4 h-4" />
                              </Button> :

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSyncDevice(device.id)}
                        disabled={syncingDeviceId === device.id}>

                                {syncingDeviceId === device.id ?
                        <Loader2 className="w-4 h-4 animate-spin" /> :

                        <RefreshCw className="w-4 h-4" />
                        }
                              </Button>
                      }
                            <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedDevice(device);
                          setShowDeviceDetailsModal(true);
                        }}>

                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedDevice(device);
                          setShowEditDeviceModal(true);
                        }}>

                              <Settings className="w-4 h-4" />
                            </Button>
                            <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:bg-red-50"
                        onClick={() => {
                          setSelectedDevice(device);
                          setShowDeleteModal(true);
                        }}>

                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                )}
                  </tbody>
                </table>
              </div>
            </Card>
        }
        </>
      }

      {/* Sync Logs Tab */}
      {activeTab === 'sync-logs' &&
      <Card title="Sync History" noPadding>
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <Input
            placeholder="Search logs..."
            className="w-64"
            leftIcon={<Search className="w-4 h-4 text-gray-400" />} />

            <div className="flex gap-2">
              <Input type="date" className="w-40" />
              <Button
              variant="outline"
              leftIcon={<Download className="w-4 h-4" />}>

                Export
              </Button>
            </div>
          </div>
          <div className="divide-y divide-gray-100">
            {syncLogs.map((log) =>
          <div
            key={log.id}
            className="p-4 flex items-center justify-between hover:bg-gray-50">

                <div className="flex items-center gap-4">
                  <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${log.status === 'success' ? 'bg-green-100' : log.status === 'failed' ? 'bg-red-100' : 'bg-yellow-100'}`}>

                    {log.status === 'success' ?
                <CheckCircle className="w-5 h-5 text-green-600" /> :
                log.status === 'failed' ?
                <XCircle className="w-5 h-5 text-red-600" /> :

                <AlertTriangle className="w-5 h-5 text-yellow-600" />
                }
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {log.deviceName}
                    </p>
                    <p className="text-sm text-gray-500">{log.timestamp}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="font-bold text-gray-900">
                      {log.recordsSynced}
                    </p>
                    <p className="text-xs text-gray-500">Records</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{log.duration}</p>
                    <p className="text-xs text-gray-500">Duration</p>
                  </div>
                  <Badge
                variant={
                log.status === 'success' ?
                'success' :
                log.status === 'failed' ?
                'danger' :
                'warning'
                }>

                    {log.status.charAt(0).toUpperCase() + log.status.slice(1)}
                  </Badge>
                </div>
              </div>
          )}
          </div>
        </Card>
      }

      {/* Import History Tab */}
      {activeTab === 'import-history' &&
      <Card title="Import History" noPadding>
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <Input
            placeholder="Search imports..."
            className="w-64"
            leftIcon={<Search className="w-4 h-4 text-gray-400" />} />

            <Button
            variant="primary"
            leftIcon={<Upload className="w-4 h-4" />}
            onClick={() => setShowImportModal(true)}>

              New Import
            </Button>
          </div>
          <div className="divide-y divide-gray-100">
            {importHistory.map((item) =>
          <div
            key={item.id}
            className="p-4 flex items-center justify-between hover:bg-gray-50">

                <div className="flex items-center gap-4">
                  <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center ${item.status === 'success' ? 'bg-green-100' : item.status === 'failed' ? 'bg-red-100' : 'bg-blue-100'}`}>

                    {item.fileName.endsWith('.csv') ?
                <FileSpreadsheet className="w-5 h-5 text-green-600" /> :

                <FileText className="w-5 h-5 text-blue-600" />
                }
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{item.fileName}</p>
                    <p className="text-sm text-gray-500">
                      {item.deviceName} • {item.importedAt}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="font-bold text-gray-900">
                      {item.recordsImported}
                    </p>
                    <p className="text-xs text-gray-500">Records</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">{item.importedBy}</p>
                    <p className="text-xs text-gray-500">Imported By</p>
                  </div>
                  <Badge
                variant={
                item.status === 'success' ?
                'success' :
                item.status === 'failed' ?
                'danger' :
                'info'
                }>

                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                  </Badge>
                </div>
              </div>
          )}
          </div>
        </Card>
      }

      {/* Settings Tab */}
      {activeTab === 'settings' &&
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card title="Sync Settings">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Auto Sync</p>
                  <p className="text-sm text-gray-500">
                    Automatically sync all devices at set intervals
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Select
                  options={syncIntervalOptions}
                  value="15"
                  onChange={() => {}}
                  className="w-40" />

                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">
                    Sync on Device Connect
                  </p>
                  <p className="text-sm text-gray-500">
                    Start sync when device comes online
                  </p>
                </div>
                <input
                type="checkbox"
                defaultChecked
                className="rounded text-blue-600" />

              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">
                    Error Notifications
                  </p>
                  <p className="text-sm text-gray-500">
                    Send alerts when sync fails
                  </p>
                </div>
                <input
                type="checkbox"
                defaultChecked
                className="rounded text-blue-600" />

              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Offline Queue</p>
                  <p className="text-sm text-gray-500">
                    Queue data for offline devices
                  </p>
                </div>
                <input
                type="checkbox"
                defaultChecked
                className="rounded text-blue-600" />

              </div>
            </div>
          </Card>

          <Card title="Connection Settings">
            <div className="space-y-4">
              <Input
              label="Default Connection Timeout (seconds)"
              type="number"
              defaultValue="30" />

              <Input label="Retry Attempts" type="number" defaultValue="3" />
              <Input
              label="Retry Delay (seconds)"
              type="number"
              defaultValue="10" />

              <Select
              label="Default Communication Protocol"
              options={[
              {
                value: 'tcp',
                label: 'TCP/IP'
              },
              {
                value: 'udp',
                label: 'UDP'
              },
              {
                value: 'http',
                label: 'HTTP/REST'
              }]
              }
              value="tcp"
              onChange={() => {}} />

            </div>
          </Card>

          <Card title="Import Settings">
            <div className="space-y-4">
              <Select
              label="Default File Format"
              options={[
              {
                value: 'csv',
                label: 'CSV'
              },
              {
                value: 'xlsx',
                label: 'Excel (XLSX)'
              },
              {
                value: 'dat',
                label: 'DAT File'
              },
              {
                value: 'txt',
                label: 'Text File'
              }]
              }
              value="csv"
              onChange={() => {}} />

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Skip Duplicates</p>
                  <p className="text-sm text-gray-500">
                    Don't import duplicate records
                  </p>
                </div>
                <input
                type="checkbox"
                defaultChecked
                className="rounded text-blue-600" />

              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Validate Data</p>
                  <p className="text-sm text-gray-500">
                    Validate records before import
                  </p>
                </div>
                <input
                type="checkbox"
                defaultChecked
                className="rounded text-blue-600" />

              </div>
            </div>
          </Card>

          <Card title="Security Settings">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">
                    Encrypted Connection
                  </p>
                  <p className="text-sm text-gray-500">
                    Use SSL/TLS for device communication
                  </p>
                </div>
                <input
                type="checkbox"
                defaultChecked
                className="rounded text-blue-600" />

              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">
                    Device Authentication
                  </p>
                  <p className="text-sm text-gray-500">
                    Require password for device access
                  </p>
                </div>
                <input
                type="checkbox"
                defaultChecked
                className="rounded text-blue-600" />

              </div>
              <Input
              label="Device Password"
              type="password"
              placeholder="••••••••" />

            </div>
          </Card>
        </div>
      }

      {/* Add Device Modal */}
      {showAddDeviceModal &&
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Plus className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Add New Device
                  </h3>
                  <p className="text-sm text-gray-500">
                    Connect a biometric device to the system
                  </p>
                </div>
              </div>
              <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAddDeviceModal(false)}>

                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[60vh] space-y-6">
              {/* Basic Information */}
              <div>
                <h4 className="font-medium text-gray-900 mb-4">
                  Basic Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                  label="Device Name"
                  placeholder="e.g., Main Gate Device"
                  value={newDevice.name}
                  onChange={(e) =>
                  setNewDevice({
                    ...newDevice,
                    name: e.target.value
                  })
                  }
                  required />

                  <Select
                  label="Device Type"
                  options={deviceTypeOptions}
                  value={newDevice.type}
                  onChange={(e) =>
                  setNewDevice({
                    ...newDevice,
                    type: e.target.value
                  })
                  } />

                  <Input
                  label="Model"
                  placeholder="e.g., ZKTeco K40"
                  value={newDevice.model}
                  onChange={(e) =>
                  setNewDevice({
                    ...newDevice,
                    model: e.target.value
                  })
                  } />

                  <Input
                  label="Serial Number"
                  placeholder="e.g., ZK-2024-001"
                  value={newDevice.serialNumber}
                  onChange={(e) =>
                  setNewDevice({
                    ...newDevice,
                    serialNumber: e.target.value
                  })
                  } />

                </div>
              </div>

              {/* Network Settings */}
              <div>
                <h4 className="font-medium text-gray-900 mb-4">
                  Network Settings
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Select
                  label="Connection Type"
                  options={connectionTypeOptions}
                  value={newDevice.connectionType}
                  onChange={(e) =>
                  setNewDevice({
                    ...newDevice,
                    connectionType: e.target.value
                  })
                  } />

                  <Input
                  label="IP Address"
                  placeholder="e.g., 192.168.1.100"
                  value={newDevice.ipAddress}
                  onChange={(e) =>
                  setNewDevice({
                    ...newDevice,
                    ipAddress: e.target.value
                  })
                  }
                  required />

                  <Input
                  label="Port"
                  type="number"
                  placeholder="e.g., 4370"
                  value={newDevice.port}
                  onChange={(e) =>
                  setNewDevice({
                    ...newDevice,
                    port: e.target.value
                  })
                  } />

                </div>
              </div>

              {/* Location Settings */}
              <div>
                <h4 className="font-medium text-gray-900 mb-4">
                  Location & Department
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                  label="Location"
                  placeholder="e.g., Main Entrance"
                  value={newDevice.location}
                  onChange={(e) =>
                  setNewDevice({
                    ...newDevice,
                    location: e.target.value
                  })
                  } />

                  <Select
                  label="Department"
                  options={departmentOptions}
                  value={newDevice.department}
                  onChange={(e) =>
                  setNewDevice({
                    ...newDevice,
                    department: e.target.value
                  })
                  } />

                </div>
              </div>

              {/* Sync Settings */}
              <div>
                <h4 className="font-medium text-gray-900 mb-4">
                  Sync Settings
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                    <input
                    type="checkbox"
                    checked={newDevice.isAutoSync}
                    onChange={(e) =>
                    setNewDevice({
                      ...newDevice,
                      isAutoSync: e.target.checked
                    })
                    }
                    className="rounded text-blue-600" />

                    <div>
                      <p className="font-medium text-gray-900">
                        Enable Auto Sync
                      </p>
                      <p className="text-sm text-gray-500">
                        Automatically sync at intervals
                      </p>
                    </div>
                  </div>
                  {newDevice.isAutoSync &&
                <Select
                  label="Sync Interval"
                  options={syncIntervalOptions}
                  value={newDevice.syncInterval}
                  onChange={(e) =>
                  setNewDevice({
                    ...newDevice,
                    syncInterval: e.target.value
                  })
                  } />

                }
                </div>
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-b-xl flex justify-between">
              <Button
              variant="outline"
              onClick={() => setShowAddDeviceModal(false)}>

                Cancel
              </Button>
              <div className="flex gap-2">
                <Button
                variant="outline"
                leftIcon={<Zap className="w-4 h-4" />}
                disabled={!newDevice.ipAddress}>

                  Test Connection
                </Button>
                <Button
                variant="primary"
                leftIcon={<Plus className="w-4 h-4" />}
                onClick={handleAddDevice}
                disabled={!newDevice.name || !newDevice.ipAddress}>

                  Add Device
                </Button>
              </div>
            </div>
          </div>
        </div>
      }

      {/* Connect Device Modal */}
      {showConnectModal && selectedDevice &&
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Link className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Connect Device
                  </h3>
                  <p className="text-sm text-gray-500">{selectedDevice.name}</p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">IP Address</p>
                    <p className="font-mono font-medium">
                      {selectedDevice.ipAddress}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Port</p>
                    <p className="font-mono font-medium">
                      {selectedDevice.port}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Connection Type</p>
                    <p className="font-medium capitalize">
                      {selectedDevice.connectionType}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Last Online</p>
                    <p className="font-medium">{selectedDevice.lastOnline}</p>
                  </div>
                </div>
              </div>

              {isConnecting &&
            <div className="flex items-center justify-center gap-3 p-4 bg-blue-50 rounded-lg">
                  <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                  <span className="text-blue-600">Connecting to device...</span>
                </div>
            }
            </div>

            <div className="p-4 bg-gray-50 rounded-b-xl flex justify-end gap-3">
              <Button
              variant="outline"
              onClick={() => setShowConnectModal(false)}
              disabled={isConnecting}>

                Cancel
              </Button>
              <Button
              variant="primary"
              leftIcon={
              isConnecting ?
              <Loader2 className="w-4 h-4 animate-spin" /> :

              <Link className="w-4 h-4" />

              }
              onClick={handleConnectDevice}
              disabled={isConnecting}>

                {isConnecting ? 'Connecting...' : 'Connect'}
              </Button>
            </div>
          </div>
        </div>
      }

      {/* Delete Modal */}
      {showDeleteModal && selectedDevice &&
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <Trash2 className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Delete Device
                  </h3>
                  <p className="text-sm text-gray-500">
                    This action cannot be undone
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <p className="text-gray-600">
                Are you sure you want to delete{' '}
                <strong>{selectedDevice.name}</strong>? All sync history and
                configuration will be permanently removed.
              </p>
            </div>

            <div className="p-4 bg-gray-50 rounded-b-xl flex justify-end gap-3">
              <Button
              variant="outline"
              onClick={() => setShowDeleteModal(false)}>

                Cancel
              </Button>
              <Button
              variant="primary"
              className="bg-red-600 hover:bg-red-700"
              leftIcon={<Trash2 className="w-4 h-4" />}
              onClick={handleDeleteDevice}>

                Delete Device
              </Button>
            </div>
          </div>
        </div>
      }

      {/* Import Modal */}
      {showImportModal &&
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Upload className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Import Attendance Data
                  </h3>
                  <p className="text-sm text-gray-500">
                    Upload a file from biometric device
                  </p>
                </div>
              </div>
              <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowImportModal(false)}>

                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="p-6 space-y-4">
              <Select
              label="Select Device"
              options={[
              {
                value: '',
                label: 'Select a device'
              },
              ...devices.map((d) => ({
                value: d.id,
                label: d.name
              }))]
              }
              value={importDevice}
              onChange={(e) => setImportDevice(e.target.value)} />


              <Input
              label="Date"
              type="date"
              value={importDate}
              onChange={(e) => setImportDate(e.target.value)} />


              <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${importFile ? 'border-green-300 bg-green-50' : 'border-gray-300 hover:border-blue-400'}`}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleFileDrop}>

                {importFile ?
              <div className="flex items-center justify-center gap-3">
                    <CheckCircle className="w-8 h-8 text-green-500" />
                    <div className="text-left">
                      <p className="font-medium text-gray-900">
                        {importFile.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {(importFile.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                    <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setImportFile(null)}>

                      <X className="w-4 h-4" />
                    </Button>
                  </div> :

              <>
                    <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 mb-1">
                      Drop file here or click to upload
                    </p>
                    <p className="text-sm text-gray-400">
                      Supports CSV, XLSX, DAT files
                    </p>
                    <input
                  type="file"
                  accept=".csv,.xlsx,.dat,.txt"
                  className="hidden"
                  id="file-upload"
                  onChange={(e) =>
                  setImportFile(e.target.files?.[0] || null)
                  } />

                    <label htmlFor="file-upload">
                      <Button
                    variant="outline"
                    size="sm"
                    className="mt-3"
                    as="span">

                        Browse Files
                      </Button>
                    </label>
                  </>
              }
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-b-xl flex justify-end gap-3">
              <Button
              variant="outline"
              onClick={() => setShowImportModal(false)}>

                Cancel
              </Button>
              <Button
              variant="primary"
              leftIcon={
              isImporting ?
              <Loader2 className="w-4 h-4 animate-spin" /> :

              <Upload className="w-4 h-4" />

              }
              onClick={handleImportFile}
              disabled={!importFile || !importDevice || isImporting}>

                {isImporting ? 'Importing...' : 'Import Data'}
              </Button>
            </div>
          </div>
        </div>
      }

      {/* Device Details Modal */}
      {showDeviceDetailsModal && selectedDevice &&
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <div
            className={`p-6 ${selectedDevice.status === 'online' ? 'bg-gradient-to-r from-green-500 to-green-600' : selectedDevice.status === 'syncing' ? 'bg-gradient-to-r from-blue-500 to-blue-600' : selectedDevice.status === 'error' ? 'bg-gradient-to-r from-red-500 to-red-600' : 'bg-gradient-to-r from-gray-400 to-gray-500'}`}>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                    <div className="text-white">
                      {getDeviceTypeIcon(selectedDevice.type)}
                    </div>
                  </div>
                  <div className="text-white">
                    <h3 className="text-xl font-bold">{selectedDevice.name}</h3>
                    <p className="text-white/80">
                      {selectedDevice.model} • {selectedDevice.serialNumber}
                    </p>
                  </div>
                </div>
                <Button
                variant="ghost"
                onClick={() => setShowDeviceDetailsModal(false)}
                className="text-white hover:bg-white/20">

                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto max-h-[60vh] space-y-6">
              {/* Status and Stats */}
              <div className="grid grid-cols-4 gap-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">
                    {selectedDevice.recordsToday}
                  </p>
                  <p className="text-xs text-gray-500">Today's Records</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-purple-600">
                    {selectedDevice.totalRecords.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500">Total Records</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">
                    {selectedDevice.enrolledUsers}
                  </p>
                  <p className="text-xs text-gray-500">Enrolled Users</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-orange-600">
                    {selectedDevice.usedCapacity}%
                  </p>
                  <p className="text-xs text-gray-500">Capacity Used</p>
                </div>
              </div>

              {/* Device Information */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900">
                    Network Information
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">IP Address:</span>
                      <span className="font-mono">
                        {selectedDevice.ipAddress}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Port:</span>
                      <span className="font-mono">{selectedDevice.port}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Connection:</span>
                      <span className="capitalize">
                        {selectedDevice.connectionType}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Signal:</span>
                      <span className="flex items-center gap-1">
                        {getSignalIcon(selectedDevice.signalStrength)}
                        {selectedDevice.signalStrength}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900">
                    Location & Settings
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Location:</span>
                      <span>{selectedDevice.location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Department:</span>
                      <span>{selectedDevice.department}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Auto Sync:</span>
                      <Badge
                      variant={
                      selectedDevice.isAutoSync ? 'success' : 'default'
                      }>

                        {selectedDevice.isAutoSync ?
                      `Every ${selectedDevice.syncInterval}m` :
                      'Disabled'}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Firmware:</span>
                      <span>{selectedDevice.firmwareVersion}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* System Resources */}
              {selectedDevice.cpuUsage !== undefined &&
            <div className="space-y-3">
                  <h4 className="font-medium text-gray-900">
                    System Resources
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-500">CPU Usage</span>
                        <span className="font-medium">
                          {selectedDevice.cpuUsage}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                      className={`h-2 rounded-full ${selectedDevice.cpuUsage > 80 ? 'bg-red-500' : selectedDevice.cpuUsage > 60 ? 'bg-yellow-500' : 'bg-green-500'}`}
                      style={{
                        width: `${selectedDevice.cpuUsage}%`
                      }} />

                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-500">Memory Usage</span>
                        <span className="font-medium">
                          {selectedDevice.memoryUsage}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                      className={`h-2 rounded-full ${(selectedDevice.memoryUsage || 0) > 80 ? 'bg-red-500' : (selectedDevice.memoryUsage || 0) > 60 ? 'bg-yellow-500' : 'bg-green-500'}`}
                      style={{
                        width: `${selectedDevice.memoryUsage}%`
                      }} />

                      </div>
                    </div>
                  </div>
                </div>
            }

              {/* Last Activity */}
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900">Activity</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-gray-500">Last Sync</p>
                    <p className="font-medium">{selectedDevice.lastSync}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-gray-500">Last Online</p>
                    <p className="font-medium">{selectedDevice.lastOnline}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-b-xl flex justify-between">
              <Button
              variant="outline"
              onClick={() => setShowDeviceDetailsModal(false)}>

                Close
              </Button>
              <div className="flex gap-2">
                <Button
                variant="outline"
                leftIcon={<Edit className="w-4 h-4" />}>

                  Edit Settings
                </Button>
                <Button
                variant="primary"
                leftIcon={<RefreshCw className="w-4 h-4" />}
                disabled={selectedDevice.status === 'offline'}>

                  Sync Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      }
    </div>);

}