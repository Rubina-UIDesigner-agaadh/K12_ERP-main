import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import {
  Upload,
  Download,
  Play,
  Pause,
  RefreshCw,
  Settings,
  Database,
  HardDrive,
  Cpu,
  Wifi,
  WifiOff,
  Fingerprint,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  AlertTriangle,
  Info,
  FileText,
  File,
  Folder,
  FolderOpen,
  Terminal,
  Code,
  Activity,
  Zap,
  Loader,
  RotateCcw,
  Trash2,
  Copy,
  Eye,
  EyeOff,
  Search,
  Filter,
  ChevronUp,
  ChevronDown,
  ChevronRight,
  MoreHorizontal,
  Link,
  Unlink,
  Server,
  Monitor,
  Usb,
  Radio,
  Signal,
  BarChart3,
  TrendingUp,
  Users,
  Calendar,
  History,
  Shield,
  Lock,
  Unlock,
  Power,
  PowerOff,
  Save,
  X,
  Check,
  ExternalLink,
  Maximize2,
  Minimize2,
  ArrowUp,
  ArrowDown } from
'lucide-react';

export function AttendanceDeviceImport() {
  const [selectedDevice, setSelectedDevice] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showLogs, setShowLogs] = useState(true);
  const [logFilter, setLogFilter] = useState('all');

  const devices = [
  { id: 'DEV001', name: 'ZKTeco K40 - Main Entrance', ip: '192.168.1.101', status: 'online', type: 'fingerprint', lastSync: '2024-02-01 09:30 AM', records: 156 },
  { id: 'DEV002', name: 'ZKTeco F18 - Building A', ip: '192.168.1.102', status: 'online', type: 'fingerprint', lastSync: '2024-02-01 09:28 AM', records: 89 },
  { id: 'DEV003', name: 'Hikvision DS-K1T341 - Parking', ip: '192.168.1.103', status: 'offline', type: 'face', lastSync: '2024-01-31 06:00 PM', records: 0 },
  { id: 'DEV004', name: 'eSSL X990 - Building B', ip: '192.168.1.104', status: 'online', type: 'fingerprint', lastSync: '2024-02-01 09:25 AM', records: 67 },
  { id: 'DEV005', name: 'Suprema BioStation - Server Room', ip: '192.168.1.105', status: 'online', type: 'fingerprint', lastSync: '2024-02-01 09:30 AM', records: 12 }];


  const importLogs = [
  { id: 1, timestamp: '2024-02-01 09:30:45', type: 'success', message: 'Successfully connected to device ZKTeco K40', details: 'Connection established via TCP/IP' },
  { id: 2, timestamp: '2024-02-01 09:30:46', type: 'info', message: 'Starting data fetch from device', details: 'Requesting attendance logs from 2024-01-01 to 2024-02-01' },
  { id: 3, timestamp: '2024-02-01 09:30:48', type: 'success', message: 'Fetched 156 attendance records', details: 'Data transfer completed in 2.3 seconds' },
  { id: 4, timestamp: '2024-02-01 09:30:49', type: 'info', message: 'Validating imported records', details: 'Checking for duplicates and data integrity' },
  { id: 5, timestamp: '2024-02-01 09:30:50', type: 'warning', message: '3 duplicate records found', details: 'Records already exist in database, skipping...' },
  { id: 6, timestamp: '2024-02-01 09:30:51', type: 'success', message: '153 new records imported successfully', details: 'Records saved to attendance_raw table' },
  { id: 7, timestamp: '2024-02-01 09:30:52', type: 'info', message: 'Processing employee mapping', details: 'Matching device IDs to employee records' },
  { id: 8, timestamp: '2024-02-01 09:30:53', type: 'error', message: '2 records have unknown device IDs', details: 'Device IDs: 99901, 99902 - not mapped to any employee' },
  { id: 9, timestamp: '2024-02-01 09:30:54', type: 'success', message: 'Import process completed', details: 'Total: 153 imported, 3 skipped, 2 errors' },
  { id: 10, timestamp: '2024-02-01 09:30:55', type: 'info', message: 'Device sync timestamp updated', details: 'Next scheduled sync: 2024-02-01 10:30 AM' }];


  const getLogIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'info':
        return <Info className="w-4 h-4 text-blue-500" />;
      default:
        return <Info className="w-4 h-4 text-gray-500" />;
    }
  };

  const getLogBgColor = (type) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-l-4 border-green-500';
      case 'error':
        return 'bg-red-50 border-l-4 border-red-500';
      case 'warning':
        return 'bg-yellow-50 border-l-4 border-yellow-500';
      case 'info':
        return 'bg-blue-50 border-l-4 border-blue-500';
      default:
        return 'bg-gray-50 border-l-4 border-gray-500';
    }
  };

  const filteredLogs = logFilter === 'all' ?
  importLogs :
  importLogs.filter((log) => log.type === logFilter);

  const logCounts = {
    all: importLogs.length,
    success: importLogs.filter((l) => l.type === 'success').length,
    error: importLogs.filter((l) => l.type === 'error').length,
    warning: importLogs.filter((l) => l.type === 'warning').length,
    info: importLogs.filter((l) => l.type === 'info').length
  };

  const selectedDeviceData = devices.find((d) => d.id === selectedDevice);

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Attendance Device Import
          </h1>
          <p className="text-sm text-gray-500">
            Import attendance data from biometric devices and hardware
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh Devices
          </Button>
          <Button variant="outline">
            <Settings className="w-4 h-4 mr-2" />
            Device Settings
          </Button>
          <Button variant="primary" className="bg-blue-600 hover:bg-blue-700">
            <Download className="w-4 h-4 mr-2" />
            Sync All Devices
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <HardDrive className="w-5 h-5 text-blue-600" />
            <span className="text-xs text-blue-600 font-medium">Total</span>
          </div>
          <p className="text-2xl font-bold text-blue-700">{devices.length}</p>
          <p className="text-xs text-blue-600">Registered Devices</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
          <div className="flex items-center justify-between mb-2">
            <Wifi className="w-5 h-5 text-green-600" />
            <span className="text-xs text-green-600 font-medium">Active</span>
          </div>
          <p className="text-2xl font-bold text-green-700">{devices.filter((d) => d.status === 'online').length}</p>
          <p className="text-xs text-green-600">Online</p>
        </div>
        <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-xl border border-red-200">
          <div className="flex items-center justify-between mb-2">
            <WifiOff className="w-5 h-5 text-red-600" />
            <span className="text-xs text-red-600 font-medium">Check</span>
          </div>
          <p className="text-2xl font-bold text-red-700">{devices.filter((d) => d.status === 'offline').length}</p>
          <p className="text-xs text-red-600">Offline</p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200">
          <div className="flex items-center justify-between mb-2">
            <Database className="w-5 h-5 text-purple-600" />
            <span className="text-xs text-purple-600 font-medium">Pending</span>
          </div>
          <p className="text-2xl font-bold text-purple-700">{devices.reduce((sum, d) => sum + d.records, 0)}</p>
          <p className="text-xs text-purple-600">Records to Import</p>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-xl border border-orange-200">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="w-5 h-5 text-orange-600" />
            <TrendingUp className="w-4 h-4 text-orange-500" />
          </div>
          <p className="text-2xl font-bold text-orange-700">1,247</p>
          <p className="text-xs text-orange-600">Imported Today</p>
        </div>
        <div className="bg-gradient-to-br from-teal-50 to-teal-100 p-4 rounded-xl border border-teal-200">
          <div className="flex items-center justify-between mb-2">
            <Activity className="w-5 h-5 text-teal-600" />
            <span className="text-xs text-teal-600 font-medium">Rate</span>
          </div>
          <p className="text-2xl font-bold text-teal-700">98.5%</p>
          <p className="text-xs text-teal-600">Success Rate</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card title="Select Device">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Biometric Device <span className="text-red-500">*</span>
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    value={selectedDevice}
                    onChange={(e) => setSelectedDevice(e.target.value)}>

                    <option value="">-- Select a Device --</option>
                    {devices.map((device) =>
                    <option key={device.id} value={device.id} disabled={device.status === 'offline'}>
                        {device.name} ({device.status === 'online' ? '🟢 Online' : '🔴 Offline'})
                      </option>
                    )}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Import Mode
                  </label>
                  <Select
                    options={[
                    { value: 'auto', label: 'Auto-detect Format' },
                    { value: 'zkteco', label: 'ZKTeco Standard' },
                    { value: 'essl', label: 'eSSL Format' },
                    { value: 'hikvision', label: 'Hikvision Format' },
                    { value: 'custom', label: 'Custom Template' }]
                    }
                    defaultValue="auto" />

                </div>
              </div>

              {selectedDeviceData &&
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Device Information</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-xs text-gray-500">Device ID</p>
                      <p className="text-sm font-medium text-gray-900">{selectedDeviceData.id}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">IP Address</p>
                      <p className="text-sm font-medium text-gray-900">{selectedDeviceData.ip}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Device Type</p>
                      <div className="flex items-center gap-1">
                        <Fingerprint className="w-4 h-4 text-blue-500" />
                        <span className="text-sm font-medium text-gray-900 capitalize">{selectedDeviceData.type}</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Status</p>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full ${
                    selectedDeviceData.status === 'online' ?
                    'bg-green-100 text-green-700' :
                    'bg-red-100 text-red-700'}`
                    }>
                        {selectedDeviceData.status === 'online' ?
                      <Wifi className="w-3 h-3" /> :

                      <WifiOff className="w-3 h-3" />
                      }
                        {selectedDeviceData.status}
                      </span>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Last Sync</p>
                      <p className="text-sm font-medium text-gray-900">{selectedDeviceData.lastSync}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Pending Records</p>
                      <p className="text-sm font-bold text-blue-600">{selectedDeviceData.records}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Button variant="outline" className="text-sm">
                      <Link className="w-3 h-3 mr-1" />
                      Test Connection
                    </Button>
                    <Button variant="outline" className="text-sm">
                      <Download className="w-3 h-3 mr-1" />
                      Fetch Now
                    </Button>
                    <Button variant="outline" className="text-sm">
                      <Settings className="w-3 h-3 mr-1" />
                      Configure
                    </Button>
                  </div>
                </div>
              }
            </div>
          </Card>

          <Card title="File Upload">
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 transition-colors cursor-pointer bg-gray-50">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                    <Upload className="w-8 h-8 text-blue-600" />
                  </div>
                  <p className="text-lg font-medium text-gray-700 mb-1">
                    Drop attendance files here
                  </p>
                  <p className="text-sm text-gray-500 mb-4">
                    or click to browse from your computer
                  </p>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="px-2 py-1 text-xs font-medium rounded bg-blue-100 text-blue-700">.txt</span>
                    <span className="px-2 py-1 text-xs font-medium rounded bg-green-100 text-green-700">.dat</span>
                    <span className="px-2 py-1 text-xs font-medium rounded bg-purple-100 text-purple-700">.csv</span>
                    <span className="px-2 py-1 text-xs font-medium rounded bg-orange-100 text-orange-700">.xlsx</span>
                  </div>
                  <Button variant="outline">
                    <FolderOpen className="w-4 h-4 mr-2" />
                    Choose Files
                  </Button>
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Uploaded Files</h4>
                {uploadedFiles.length === 0 ?
                <div className="text-center py-4">
                    <File className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">No files uploaded yet</p>
                  </div> :

                <div className="space-y-2">
                    {uploadedFiles.map((file, index) =>
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-700">{file.name}</span>
                        </div>
                        <button className="p-1 hover:bg-red-100 rounded">
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                  )}
                  </div>
                }
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      defaultChecked />

                    <span className="text-sm text-gray-700">Auto-map employees</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      defaultChecked />

                    <span className="text-sm text-gray-700">Skip duplicates</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" />

                    <span className="text-sm text-gray-700">Backup original file</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <Button variant="outline">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
                <Button variant="outline">
                  <Eye className="w-4 h-4 mr-2" />
                  Preview Data
                </Button>
                <Button
                  variant="primary"
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => setIsProcessing(true)}>

                  <Play className="w-4 h-4 mr-2" />
                  Process Logs
                </Button>
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card title="Device Status">
            <div className="space-y-3">
              {devices.map((device) =>
              <div
                key={device.id}
                className={`p-3 rounded-lg border cursor-pointer transition-all ${
                selectedDevice === device.id ?
                'border-blue-500 bg-blue-50' :
                'border-gray-200 hover:border-gray-300 bg-white'}`
                }
                onClick={() => device.status === 'online' && setSelectedDevice(device.id)}>

                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    device.status === 'online' ? 'bg-green-100' : 'bg-red-100'}`
                    }>
                        {device.type === 'fingerprint' ?
                      <Fingerprint className={`w-5 h-5 ${device.status === 'online' ? 'text-green-600' : 'text-red-600'}`} /> :

                      <Monitor className={`w-5 h-5 ${device.status === 'online' ? 'text-green-600' : 'text-red-600'}`} />
                      }
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{device.name}</p>
                        <p className="text-xs text-gray-500">{device.ip}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {device.status === 'online' ?
                    <Signal className="w-4 h-4 text-green-500" /> :

                    <WifiOff className="w-4 h-4 text-red-500" />
                    }
                    </div>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-xs text-gray-500">Last: {device.lastSync}</span>
                    {device.records > 0 &&
                  <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-blue-100 text-blue-700">
                        {device.records} pending
                      </span>
                  }
                  </div>
                </div>
              )}
            </div>
          </Card>

          <Card title="Quick Actions">
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Download className="w-4 h-4 mr-2" />
                Sync All Online Devices
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Usb className="w-4 h-4 mr-2" />
                Import from USB
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Server className="w-4 h-4 mr-2" />
                Connect New Device
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Clock className="w-4 h-4 mr-2" />
                Schedule Auto-Sync
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <History className="w-4 h-4 mr-2" />
                Import History
              </Button>
              <div className="border-t pt-3">
                <div className="flex items-start gap-2 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5" />
                  <div>
                    <p className="text-xs font-medium text-yellow-800">Device Alert</p>
                    <p className="text-xs text-yellow-700 mt-0.5">
                      1 device offline. Check network connection.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <Card>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Terminal className="w-5 h-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-900">Process Logs</h3>
              {isProcessing &&
              <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700">
                  <Loader className="w-3 h-3 animate-spin" />
                  Processing...
                </span>
              }
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                {['all', 'success', 'error', 'warning', 'info'].map((filter) =>
                <button
                  key={filter}
                  onClick={() => setLogFilter(filter)}
                  className={`px-3 py-1 rounded text-xs font-medium transition-all capitalize ${
                  logFilter === filter ?
                  'bg-white text-blue-600 shadow-sm' :
                  'text-gray-600 hover:text-gray-900'}`
                  }>

                    {filter} ({logCounts[filter]})
                  </button>
                )}
              </div>
              <Button variant="outline" className="text-sm" onClick={() => setShowLogs(!showLogs)}>
                {showLogs ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </Button>
              <Button variant="outline" className="text-sm">
                <Copy className="w-4 h-4 mr-1" />
                Copy
              </Button>
              <Button variant="outline" className="text-sm">
                <Download className="w-4 h-4 mr-1" />
                Export
              </Button>
              <Button variant="outline" className="text-sm">
                <Trash2 className="w-4 h-4 mr-1" />
                Clear
              </Button>
            </div>
          </div>

          {showLogs &&
          <div className="bg-gray-900 rounded-lg p-4 max-h-96 overflow-y-auto font-mono text-sm">
              {filteredLogs.length === 0 ?
            <div className="text-center py-8">
                  <Terminal className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-400">No logs to display</p>
                  <p className="text-gray-500 text-xs mt-1">Logs will appear here when you process data</p>
                </div> :

            <div className="space-y-2">
                  {filteredLogs.map((log) =>
              <div
                key={log.id}
                className={`flex items-start gap-3 p-2 rounded ${
                log.type === 'success' ? 'bg-green-900/30' :
                log.type === 'error' ? 'bg-red-900/30' :
                log.type === 'warning' ? 'bg-yellow-900/30' :
                'bg-blue-900/30'}`
                }>

                      <span className="text-gray-500 text-xs whitespace-nowrap">{log.timestamp}</span>
                      <span className={`text-xs font-medium uppercase px-1.5 py-0.5 rounded ${
                log.type === 'success' ? 'bg-green-500 text-white' :
                log.type === 'error' ? 'bg-red-500 text-white' :
                log.type === 'warning' ? 'bg-yellow-500 text-black' :
                'bg-blue-500 text-white'}`
                }>
                        {log.type}
                      </span>
                      <div className="flex-1">
                        <p className={`${
                  log.type === 'success' ? 'text-green-400' :
                  log.type === 'error' ? 'text-red-400' :
                  log.type === 'warning' ? 'text-yellow-400' :
                  'text-blue-400'}`
                  }>
                          {log.message}
                        </p>
                        <p className="text-gray-500 text-xs mt-0.5">{log.details}</p>
                      </div>
                    </div>
              )}
                </div>
            }
            </div>
          }

          {showLogs &&
          <div className="flex items-center justify-between pt-2 border-t">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-xs text-gray-600">{logCounts.success} Success</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span className="text-xs text-gray-600">{logCounts.error} Errors</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <span className="text-xs text-gray-600">{logCounts.warning} Warnings</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span className="text-xs text-gray-600">{logCounts.info} Info</span>
                </div>
              </div>
              <span className="text-xs text-gray-500">
                Last updated: {new Date().toLocaleString()}
              </span>
            </div>
          }
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card title="Import Summary">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-xs text-green-700">Successful</span>
                </div>
                <p className="text-2xl font-bold text-green-700">153</p>
              </div>
              <div className="bg-red-50 p-3 rounded-lg border border-red-200">
                <div className="flex items-center gap-2 mb-1">
                  <XCircle className="w-4 h-4 text-red-600" />
                  <span className="text-xs text-red-700">Failed</span>
                </div>
                <p className="text-2xl font-bold text-red-700">2</p>
              </div>
              <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                <div className="flex items-center gap-2 mb-1">
                  <AlertTriangle className="w-4 h-4 text-yellow-600" />
                  <span className="text-xs text-yellow-700">Skipped</span>
                </div>
                <p className="text-2xl font-bold text-yellow-700">3</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2 mb-1">
                  <Database className="w-4 h-4 text-blue-600" />
                  <span className="text-xs text-blue-700">Total</span>
                </div>
                <p className="text-2xl font-bold text-blue-700">158</p>
              </div>
            </div>
            <div className="border-t pt-3 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Processing Time</span>
                <span className="font-medium">10.2 seconds</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Records/Second</span>
                <span className="font-medium">15.5</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">File Size</span>
                <span className="font-medium">245 KB</span>
              </div>
            </div>
          </div>
        </Card>

        <Card title="Error Details">
          <div className="space-y-3">
            {[
            { id: 99901, error: 'Unknown Device ID', suggestion: 'Map to employee or add to system' },
            { id: 99902, error: 'Unknown Device ID', suggestion: 'Map to employee or add to system' }].
            map((err, index) =>
            <div key={index} className="p-3 bg-red-50 rounded-lg border border-red-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-red-800">Device ID: {err.id}</span>
                  <button className="text-xs text-blue-600 hover:underline">Fix Now</button>
                </div>
                <p className="text-xs text-red-700">{err.error}</p>
                <p className="text-xs text-gray-600 mt-1">💡 {err.suggestion}</p>
              </div>
            )}
            {logCounts.error === 0 &&
            <div className="text-center py-4">
                <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <p className="text-sm text-gray-600">No errors found</p>
              </div>
            }
          </div>
        </Card>

        <Card title="Connection Settings">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Communication Protocol</label>
              <Select
                options={[
                { value: 'tcp', label: 'TCP/IP' },
                { value: 'udp', label: 'UDP' },
                { value: 'http', label: 'HTTP API' },
                { value: 'usb', label: 'USB Direct' }]
                }
                defaultValue="tcp" />

            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Port Number" type="number" defaultValue="4370" />
              <Input label="Timeout (sec)" type="number" defaultValue="30" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">SSL/TLS Encryption</span>
              <input
                type="checkbox"
                className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" />

            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Auto-retry on failure</span>
              <input
                type="checkbox"
                className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                defaultChecked />

            </div>
            <Button variant="outline" className="w-full">
              <Save className="w-4 h-4 mr-2" />
              Save Settings
            </Button>
          </div>
        </Card>
      </div>

      <Card title="Recent Import History">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Import ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date & Time
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Device / Source
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Records
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Success
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Failed
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Imported By
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {[
              { id: 'IMP001', date: '2024-02-01 09:30 AM', device: 'ZKTeco K40 - Main Entrance', records: 156, success: 153, failed: 2, status: 'completed', importedBy: 'Admin' },
              { id: 'IMP002', date: '2024-02-01 08:00 AM', device: 'eSSL X990 - Building B', records: 67, success: 67, failed: 0, status: 'completed', importedBy: 'System' },
              { id: 'IMP003', date: '2024-01-31 06:30 PM', device: 'File Upload (attendance.dat)', records: 245, success: 240, failed: 5, status: 'completed', importedBy: 'HR Manager' },
              { id: 'IMP004', date: '2024-01-31 09:00 AM', device: 'ZKTeco F18 - Building A', records: 89, success: 89, failed: 0, status: 'completed', importedBy: 'System' },
              { id: 'IMP005', date: '2024-01-30 06:00 PM', device: 'All Devices - Scheduled Sync', records: 412, success: 408, failed: 4, status: 'completed', importedBy: 'System' }].
              map((record) =>
              <tr key={record.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-blue-600">{record.id}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{record.date}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{record.device}</td>
                  <td className="px-4 py-3 text-sm text-center font-medium text-gray-900">{record.records}</td>
                  <td className="px-4 py-3 text-sm text-center font-medium text-green-600">{record.success}</td>
                  <td className="px-4 py-3 text-sm text-center font-medium text-red-600">{record.failed}</td>
                  <td className="px-4 py-3 text-center">
                    <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">
                      <CheckCircle className="w-3 h-3" />
                      {record.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{record.importedBy}</td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button className="p-1.5 hover:bg-gray-200 rounded-lg" title="View Details">
                        <Eye className="w-4 h-4 text-gray-500" />
                      </button>
                      <button className="p-1.5 hover:bg-gray-200 rounded-lg" title="Download Log">
                        <Download className="w-4 h-4 text-gray-500" />
                      </button>
                      <button className="p-1.5 hover:bg-gray-200 rounded-lg" title="Retry Failed">
                        <RotateCcw className="w-4 h-4 text-gray-500" />
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