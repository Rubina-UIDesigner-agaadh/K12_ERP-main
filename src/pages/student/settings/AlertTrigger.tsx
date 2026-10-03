import React, { useState, Component } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Search,
  Bell,
  CheckCircle,
  XCircle,
  Zap,
  Edit2,
  AlertTriangle,
  Mail,
  Smartphone,
  MessageCircle,
  Tablet,
  Save,
  Eye } from
'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Table } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import { Modal } from '../../../components/ui/Modal';
// --- Types ---
type TriggerCategory =
'Academic' |
'Fee' |
'Administrative' |
'Transport' |
'Discipline' |
'Health' |
'Other';
type ConditionType =
'none' |
'percentage' |
'days_overdue' |
'days_before' |
'boolean';
interface AlertEvent {
  id: string;
  name: string;
  description: string;
  category: TriggerCategory;
  conditionType: ConditionType;
  conditionLabel?: string;
  defaultThreshold?: number;
  // Configurable Fields
  enabled: boolean;
  targetAudience: ('Student' | 'Parent')[];
  channels: ('SMS' | 'Email' | 'App' | 'WhatsApp')[];
  thresholdValue?: number;
  linkedTemplateId?: string;
}
// --- Mock Data (System Defined Events) ---
const SYSTEM_EVENTS: AlertEvent[] = [
{
  id: 'EVT001',
  name: 'Fee Overdue',
  description: 'When fee remains unpaid after due date',
  category: 'Fee',
  conditionType: 'days_overdue',
  conditionLabel: 'Overdue Days Threshold',
  defaultThreshold: 7,
  enabled: true,
  targetAudience: ['Parent'],
  channels: ['SMS', 'Email'],
  thresholdValue: 7,
  linkedTemplateId: 'TMP_FEE_OD'
},
{
  id: 'EVT002',
  name: 'Attendance Below Threshold',
  description: 'When attendance percentage falls below set limit',
  category: 'Academic',
  conditionType: 'percentage',
  conditionLabel: 'Threshold Percentage',
  defaultThreshold: 75,
  enabled: true,
  targetAudience: ['Parent', 'Student'],
  channels: ['App', 'Email'],
  thresholdValue: 75,
  linkedTemplateId: 'TMP_ATT_LOW'
},
{
  id: 'EVT003',
  name: 'Exam Result Published',
  description: 'Alert sent when exam results are published',
  category: 'Academic',
  conditionType: 'none',
  enabled: true,
  targetAudience: ['Parent', 'Student'],
  channels: ['App'],
  linkedTemplateId: 'TMP_EXAM_RES'
},
{
  id: 'EVT004',
  name: 'Transport Delay',
  description: 'Bus delay reported by transport team',
  category: 'Transport',
  conditionType: 'none',
  enabled: false,
  targetAudience: ['Parent'],
  channels: ['SMS', 'App'],
  linkedTemplateId: ''
},
{
  id: 'EVT005',
  name: 'New Discipline Incident',
  description: 'When a major discipline incident is logged',
  category: 'Discipline',
  conditionType: 'none',
  enabled: true,
  targetAudience: ['Parent'],
  channels: ['Email'],
  linkedTemplateId: 'TMP_DISC_INC'
}];

// Mock Templates for Dropdown
const MOCK_TEMPLATES = [
{
  id: 'TMP_FEE_OD',
  name: 'Fee Overdue Notice',
  category: 'Fee',
  channels: ['SMS', 'Email', 'App']
},
{
  id: 'TMP_ATT_LOW',
  name: 'Low Attendance Warning',
  category: 'Academic',
  channels: ['Email', 'App']
},
{
  id: 'TMP_EXAM_RES',
  name: 'Exam Result Announcement',
  category: 'Academic',
  channels: ['App', 'SMS']
},
{
  id: 'TMP_DISC_INC',
  name: 'Discipline Incident Report',
  category: 'Discipline',
  channels: ['Email']
},
{
  id: 'TMP_GEN',
  name: 'General Notification',
  category: 'Administrative',
  channels: ['SMS', 'Email', 'App', 'WhatsApp']
}];

export function AlertTrigger() {
  const navigate = useNavigate();
  // --- State ---
  const [events, setEvents] = useState<AlertEvent[]>(SYSTEM_EVENTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  // Configuration Modal State
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [configForm, setConfigForm] = useState<Partial<AlertEvent>>({});
  const [isDirty, setIsDirty] = useState(false);
  // --- Handlers ---
  const handleOpenConfig = (event: AlertEvent) => {
    setSelectedEventId(event.id);
    setConfigForm({
      ...event
    }); // Clone for editing
    setIsConfigOpen(true);
  };
  const handleSaveConfig = () => {
    // Validate Current Form
    if (configForm.enabled) {
      if (
      !configForm.targetAudience ||
      configForm.targetAudience.length === 0)
      {
        alert('Please select at least one Target Audience.');
        return;
      }
      if (!configForm.channels || configForm.channels.length === 0) {
        alert('Please select at least one Channel.');
        return;
      }
      if (!configForm.linkedTemplateId) {
        alert('Please link a Message Template.');
        return;
      }
      // Validate Threshold if applicable
      if (
      configForm.conditionType !== 'none' && (
      configForm.thresholdValue === undefined ||
      configForm.thresholdValue === null ||
      isNaN(configForm.thresholdValue)))
      {
        alert(`Please enter a valid value for ${configForm.conditionLabel}.`);
        return;
      }
    }
    // Update State
    setEvents((prev) =>
    prev.map((e) =>
    e.id === configForm.id ?
    {
      ...e,
      ...configForm
    } as AlertEvent :
    e
    )
    );
    setIsDirty(true); // Mark page as dirty
    setIsConfigOpen(false);
  };
  const handleSaveAllRules = () => {
    // Final Validation Scan
    const invalidEvents = events.filter(
      (e) =>
      e.enabled && (
      !e.linkedTemplateId ||
      e.channels.length === 0 ||
      e.targetAudience.length === 0)
    );
    if (invalidEvents.length > 0) {
      alert(
        `Cannot save: ${invalidEvents.length} enabled events have missing configuration (Template, Audience or Channel). Please check items marked with warning.`
      );
      return;
    }
    // Simulate API Save
    console.log('Saving Rules Payload:', events);
    alert('Alert trigger settings saved successfully.');
    setIsDirty(false);
  };
  const toggleEventStatus = (id: string, currentStatus: boolean) => {
    // Quick toggle from list
    setEvents((prev) =>
    prev.map((e) =>
    e.id === id ?
    {
      ...e,
      enabled: !currentStatus
    } :
    e
    )
    );
    setIsDirty(true);
  };
  const handleBack = () => {
    if (isDirty) {
      if (
      confirm(
        'You have unsaved changes to Alert Trigger Settings. Discard changes?'
      ))
      {
        navigate('/student-settings');
      }
    } else {
      navigate('/student-settings');
    }
  };
  // --- Derived Data ---
  const filteredEvents = events.filter((e) => {
    const matchesSearch =
    e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
    categoryFilter === 'All' || e.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });
  // --- Helper Components ---
  const ChannelIcon = ({ type, active }: {type: string;active: boolean;}) => {
    const className = `w-4 h-4 ${active ? 'text-blue-600' : 'text-gray-300'}`;
    switch (type) {
      case 'SMS':
        return <MessageCircle className={className} />;
      case 'Email':
        return <Mail className={className} />;
      case 'App':
        return <Tablet className={className} />;
      // Using Tablet as proxy for App/Mobile
      case 'WhatsApp':
        return <Smartphone className={className} />;
      default:
        return null;
    }
  };
  const columns = [
  {
    key: 'name',
    header: 'Event Name',
    render: (row: AlertEvent) =>
    <div>
          <div className="font-medium text-gray-900 flex items-center gap-2">
            {row.name}
            {row.enabled && (
        !row.linkedTemplateId || row.channels.length === 0) &&
        <AlertTriangle
          className="w-4 h-4 text-orange-500"
          title="Configuration Incomplete" />

        }
          </div>
          <div className="text-xs text-gray-500">{row.description}</div>
        </div>

  },
  {
    key: 'category',
    header: 'Category',
    render: (row: AlertEvent) =>
    <Badge variant="outline">{row.category}</Badge>

  },
  {
    key: 'condition',
    header: 'Trigger Condition',
    render: (row: AlertEvent) => {
      if (row.conditionType === 'none')
      return (
        <span className="text-xs text-gray-500">On Event Occurrence</span>);

      if (row.conditionType === 'percentage')
      return (
        <span className="text-xs text-gray-700">
              {' '}
              &lt; {row.thresholdValue}%
            </span>);

      if (row.conditionType === 'days_overdue')
      return (
        <span className="text-xs text-gray-700">
              {' '}
              &gt; {row.thresholdValue} days
            </span>);

      if (row.conditionType === 'days_before')
      return (
        <span className="text-xs text-gray-700">
              {row.thresholdValue} days before
            </span>);

      return <span className="text-xs text-gray-500">-</span>;
    }
  },
  {
    key: 'audience',
    header: 'Audience',
    render: (row: AlertEvent) =>
    <div className="text-xs text-gray-700">
          {row.targetAudience.join(' & ') ||
      <span className="text-gray-400 italic">None</span>
      }
        </div>

  },
  {
    key: 'channels',
    header: 'Channels',
    render: (row: AlertEvent) =>
    <div className="flex gap-2">
          <ChannelIcon type="SMS" active={row.channels.includes('SMS')} />
          <ChannelIcon type="Email" active={row.channels.includes('Email')} />
          <ChannelIcon type="App" active={row.channels.includes('App')} />
          <ChannelIcon
        type="WhatsApp"
        active={row.channels.includes('WhatsApp')} />

        </div>

  },
  {
    key: 'status',
    header: 'Status',
    render: (row: AlertEvent) =>
    <div
      className="flex items-center gap-2 cursor-pointer"
      onClick={(e) => {
        e.stopPropagation();
        toggleEventStatus(row.id, row.enabled);
      }}>

          {row.enabled ?
      <CheckCircle className="w-5 h-5 text-green-500" /> :

      <XCircle className="w-5 h-5 text-gray-400" />
      }
          <span
        className={`text-sm ${row.enabled ? 'text-green-700' : 'text-gray-500'}`}>

            {row.enabled ? 'Enabled' : 'Disabled'}
          </span>
        </div>

  },
  {
    key: 'actions',
    header: 'Actions',
    render: (row: AlertEvent) =>
    <Button variant="ghost" size="sm" onClick={() => handleOpenConfig(row)}>
          <Edit2 className="w-4 h-4" />
        </Button>

  }];

  // --- Render ---
  return (
    <div className="flex flex-col h-full bg-gray-50/50">
      {/* Header */}
      <div className="flex-shrink-0 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-white border-b sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={handleBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Bell className="w-6 h-6 text-blue-600" /> Alert Trigger Settings
            </h1>
            <p className="text-sm text-gray-500">
              Configure events that automatically send alerts to students and
              parents.
            </p>
          </div>
        </div>
        <Button
          onClick={handleSaveAllRules}
          disabled={!isDirty}
          leftIcon={<Save className="w-4 h-4" />}>

          Save Rules
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-6">
        {/* Filters */}
        <Card className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search events..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)} />

            </div>
            <div className="w-full md:w-64">
              <Select
                options={[
                {
                  value: 'All',
                  label: 'All Categories'
                },
                {
                  value: 'Academic',
                  label: 'Academic'
                },
                {
                  value: 'Fee',
                  label: 'Fees & Finance'
                },
                {
                  value: 'Administrative',
                  label: 'Administrative'
                },
                {
                  value: 'Transport',
                  label: 'Transport'
                },
                {
                  value: 'Discipline',
                  label: 'Discipline'
                },
                {
                  value: 'Health',
                  label: 'Health'
                }]
                }
                value={categoryFilter}
                onChange={setCategoryFilter} />

            </div>
          </div>
        </Card>

        {/* Event List */}
        <Card className="p-0 overflow-hidden shadow-sm" noPadding>
          <Table
            columns={columns}
            data={filteredEvents}
            emptyMessage="No alert events found." />

        </Card>
      </div>

      {/* Configuration Modal */}
      <Modal
        isOpen={isConfigOpen}
        onClose={() => setIsConfigOpen(false)}
        title={`Configure Alert - ${configForm.name}`}
        size="lg"
        footer={
        <>
            <Button variant="outline" onClick={() => setIsConfigOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveConfig}>Save Changes</Button>
          </>
        }>

        <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
          {/* General Settings */}
          <div className="bg-gray-50 p-4 rounded border border-gray-200">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">
                Category:{' '}
                <Badge variant="outline" className="ml-2">
                  {configForm.category}
                </Badge>
              </span>
              <div className="flex items-center gap-2">
                <label
                  htmlFor="modal-enable"
                  className="text-sm font-medium text-gray-900 cursor-pointer">

                  Enable Event
                </label>
                <div
                  className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${configForm.enabled ? 'bg-green-500' : 'bg-gray-300'}`}
                  onClick={() =>
                  setConfigForm({
                    ...configForm,
                    enabled: !configForm.enabled
                  })
                  }>

                  <div
                    className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${configForm.enabled ? 'translate-x-5' : 'translate-x-0'}`} />

                </div>
              </div>
            </div>
            <p className="text-xs text-gray-500">{configForm.description}</p>
            {!configForm.enabled &&
            <p className="text-xs text-red-600 mt-2 font-medium">
                Turned OFF: No alerts will be sent for this event.
              </p>
            }
          </div>

          {/* Audience & Channels */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-gray-900 border-b pb-1">
              Audience & Channels
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Target Audience *
                </label>
                <div className="flex flex-col gap-2">
                  {['Student', 'Parent'].map((aud) =>
                  <label
                    key={aud}
                    className="flex items-center gap-2 cursor-pointer">

                      <input
                      type="checkbox"
                      className="rounded border-gray-300 text-blue-600"
                      checked={configForm.targetAudience?.includes(
                        aud as any
                      )}
                      onChange={(e) => {
                        const current = configForm.targetAudience || [];
                        setConfigForm({
                          ...configForm,
                          targetAudience: e.target.checked ?
                          [...current, aud as any] :
                          current.filter((a) => a !== aud)
                        });
                      }}
                      disabled={!configForm.enabled} />

                      <span className="text-sm">{aud}</span>
                    </label>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Channels *
                </label>
                <div className="flex flex-col gap-2">
                  {['SMS', 'Email', 'App', 'WhatsApp'].map((ch) =>
                  <label
                    key={ch}
                    className="flex items-center gap-2 cursor-pointer">

                      <input
                      type="checkbox"
                      className="rounded border-gray-300 text-blue-600"
                      checked={configForm.channels?.includes(ch as any)}
                      onChange={(e) => {
                        const current = configForm.channels || [];
                        setConfigForm({
                          ...configForm,
                          channels: e.target.checked ?
                          [...current, ch as any] :
                          current.filter((c) => c !== ch)
                        });
                      }}
                      disabled={!configForm.enabled} />

                      <span className="text-sm">{ch}</span>
                    </label>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Trigger Conditions */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-gray-900 border-b pb-1">
              Trigger Conditions
            </h4>
            {configForm.conditionType === 'none' ?
            <p className="text-sm text-gray-500 italic">
                Alert is sent immediately each time this event occurs.
              </p> :

            <div className="max-w-xs">
                <Input
                label={`${configForm.conditionLabel} *`}
                type="number"
                value={configForm.thresholdValue}
                onChange={(e) =>
                setConfigForm({
                  ...configForm,
                  thresholdValue: parseFloat(e.target.value)
                })
                }
                disabled={!configForm.enabled} />

              </div>
            }
          </div>

          {/* Template Mapping */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-gray-900 border-b pb-1">
              Templates & Content
            </h4>
            <Select
              label="Linked Template *"
              options={[
              {
                value: '',
                label: 'Select Template'
              },
              ...MOCK_TEMPLATES.filter(
                (t) =>
                t.category === configForm.category ||
                t.category === 'Administrative'
              ).map((t) => ({
                value: t.id,
                label: t.name
              }))]
              }
              value={configForm.linkedTemplateId || ''}
              onChange={(val) =>
              setConfigForm({
                ...configForm,
                linkedTemplateId: val
              })
              }
              disabled={!configForm.enabled} />

            {configForm.linkedTemplateId &&
            <div className="bg-blue-50 p-3 rounded text-xs text-blue-800 flex gap-2 items-start">
                <Zap className="w-4 h-4 mt-0.5" />
                <div>
                  <span className="font-medium">
                    Template Supported Channels:
                  </span>
                  <div className="mt-1">
                    {MOCK_TEMPLATES.find(
                    (t) => t.id === configForm.linkedTemplateId
                  )?.channels.join(', ')}
                  </div>
                </div>
              </div>
            }
          </div>

          {/* Preview */}
          <div className="border-t pt-4">
            <Button
              variant="ghost"
              size="sm"
              leftIcon={<Eye className="w-4 h-4" />}>

              Preview Alert
            </Button>
          </div>
        </div>
      </Modal>
    </div>);

}