import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import {
  BellRing,
  Mail,
  MessageSquare,
  Smartphone,
  Send,
  Eye,
  Zap,
  AlertTriangle,
  Globe,
  Variable,
  History,
  Info,
  ChevronRight,
  ChevronLeft,
  RefreshCw,
  Plus,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  Download } from
'lucide-react';

export function ResultAlertConfiguration() {
  const [selectedTrigger, setSelectedTrigger] = useState('');
  const [selectedChannels, setSelectedChannels] = useState<string[]>([]);
  const [templateContent, setTemplateContent] = useState(
    "Dear Parent, the results for {exam_name} for your ward {student_name} have been published. Total Marks: {total_marks}/{max_marks}. Grade: {grade}."
  );

  // Original Data
  const triggers = [
  { id: 'Result Generated', label: 'Result Generated', icon: Zap, desc: 'Notify Staff when processing is complete', color: 'blue' },
  { id: 'Result Published', label: 'Result Published', icon: Globe, desc: 'Release results to Parents & Students', color: 'green' },
  { id: 'Low Performance', label: 'Low Performance Alert', icon: AlertTriangle, desc: 'Trigger for marks below passing criteria', color: 'orange' }];


  const channels = [
  { id: 'SMS', label: 'SMS Gateway', icon: MessageSquare, sub: 'Direct mobile text' },
  { id: 'Email', label: 'Email Service', icon: Mail, sub: 'HTML/Rich text reports' },
  { id: 'App', label: 'App Notification', icon: Smartphone, sub: 'Instant push alert' }];


  const variables = ['{student_name}', '{exam_name}', '{total_marks}', '{max_marks}', '{grade}', '{rank}'];

  // Communication Log Data
  const communicationLogs = [
  { id: '1', date: '15 Mar 2024', time: '10:30 AM', channel: 'SMS', templateName: 'Result Published', recipientCount: 245, status: 'Sent' },
  { id: '2', date: '15 Mar 2024', time: '10:30 AM', channel: 'Email', templateName: 'Result Published', recipientCount: 245, status: 'Sent' },
  { id: '3', date: '14 Mar 2024', time: '03:15 PM', channel: 'App', templateName: 'Result Generated', recipientCount: 12, status: 'Sent' },
  { id: '4', date: '14 Mar 2024', time: '02:00 PM', channel: 'SMS', templateName: 'Low Performance Alert', recipientCount: 34, status: 'Failed' },
  { id: '5', date: '13 Mar 2024', time: '11:45 AM', channel: 'Email', templateName: 'Result Published', recipientCount: 198, status: 'Sent' },
  { id: '6', date: '13 Mar 2024', time: '09:30 AM', channel: 'SMS', templateName: 'Result Generated', recipientCount: 15, status: 'Sent' }];


  const toggleChannel = (id: string) => {
    setSelectedChannels((prev) =>
    prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const insertVariable = (variable: string) => {
    setTemplateContent((prev) => prev + ' ' + variable);
  };

  const getPreviewMessage = () => {
    return templateContent.
    replace('{student_name}', 'Aditya Vardhan').
    replace('{exam_name}', 'Summative Assessment I').
    replace('{total_marks}', '485').
    replace('{max_marks}', '500').
    replace('{grade}', 'A+').
    replace('{rank}', '2');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Sent':
        return <Badge className="bg-green-100 text-green-700 border border-green-200"><CheckCircle className="w-3 h-3 mr-1" />Sent</Badge>;
      case 'Failed':
        return <Badge className="bg-red-100 text-red-700 border border-red-200"><XCircle className="w-3 h-3 mr-1" />Failed</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'SMS':
        return <MessageSquare className="w-4 h-4 text-green-600" />;
      case 'Email':
        return <Mail className="w-4 h-4 text-blue-600" />;
      case 'App':
        return <Smartphone className="w-4 h-4 text-purple-600" />;
      default:
        return null;
    }
  };

  const selectedTriggerData = triggers.find((t) => t.id === selectedTrigger);

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <BellRing className="w-7 h-7 text-orange-500" />
            Alert Configuration
          </h1>
          <p className="text-gray-500 mt-1">
            Automate result-related communications and performance triggers.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm">
            <History className="w-4 h-4 mr-2" />
            Logs
          </Button>
          <Button variant="primary" size="sm" className="bg-blue-600 shadow-md">
            Save Configuration
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Left Sidebar - Send New Alert */}
        <div className="xl:col-span-4">
          <Card className="shadow-lg overflow-hidden">
            <div className="p-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Send className="w-5 h-5" />
                Send New Alert
              </h2>
            </div>

            <div className="p-5 space-y-5">
              {/* Target Audience / Trigger Event */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Select Trigger Event</label>
                <select
                  value={selectedTrigger}
                  onChange={(e) => setSelectedTrigger(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white text-gray-900">

                  <option value="">Select trigger event</option>
                  {triggers.map((trigger) =>
                  <option key={trigger.id} value={trigger.id}>
                      {trigger.label}
                    </option>
                  )}
                </select>
                {selectedTriggerData &&
                <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg">
                    <div className="flex items-center gap-2">
                      <selectedTriggerData.icon className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-900">{selectedTriggerData.label}</span>
                    </div>
                    <p className="text-xs text-blue-700 mt-1">{selectedTriggerData.desc}</p>
                  </div>
                }
              </div>

              {/* Message Template */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Message Template</label>
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-1">
                    {variables.map((v) =>
                    <button
                      key={v}
                      onClick={() => insertVariable(v)}
                      className="text-xs px-2 py-1 bg-gray-100 border border-gray-200 rounded hover:border-blue-300 hover:text-blue-600 transition-colors font-mono">

                        {v}
                      </button>
                    )}
                    <button className="text-xs px-2 py-1 bg-blue-50 text-blue-600 border border-blue-100 rounded hover:bg-blue-100">
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  <textarea
                    className="w-full h-28 p-3 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                    value={templateContent}
                    onChange={(e) => setTemplateContent(e.target.value)}
                    placeholder="Enter your message template..." />

                </div>
              </div>

              {/* Preview Box */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Eye className="w-4 h-4 text-gray-400" />
                  Preview
                </label>
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {getPreviewMessage()}
                  </p>
                </div>
              </div>

              {/* Delivery Channels */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-gray-700">Delivery Channels</label>
                <div className="space-y-2">
                  {channels.map((channel) =>
                  <label
                    key={channel.id}
                    className={`flex items-center justify-between p-3 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedChannels.includes(channel.id) ?
                    'border-blue-400 bg-blue-50' :
                    'border-gray-200 hover:border-gray-300'}`
                    }>

                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${selectedChannels.includes(channel.id) ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
                          <channel.icon className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{channel.label}</p>
                          <p className="text-xs text-gray-500">{channel.sub}</p>
                        </div>
                      </div>
                      <input
                      type="checkbox"
                      checked={selectedChannels.includes(channel.id)}
                      onChange={() => toggleChannel(channel.id)}
                      className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500" />

                    </label>
                  )}
                </div>
              </div>

              {/* Send Button */}
              <Button
                variant="primary"
                className="w-full bg-blue-600 hover:bg-blue-700 py-3 text-base font-semibold shadow-lg"
                disabled={!selectedTrigger || selectedChannels.length === 0}>

                <Send className="w-5 h-5 mr-2" />
                Send Alert
              </Button>

              {/* Info Note */}
              <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg flex items-start gap-2">
                <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-blue-700">
                  <strong>Dynamic Triggers:</strong> Low performance alerts are calculated based on the <b>Passing Criteria (%)</b> configured in Exam Master.
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Panel - Communication Log */}
        <div className="xl:col-span-8">
          <Card className="shadow-lg overflow-hidden">
            <div className="p-4 border-b border-gray-200 bg-white">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <History className="w-5 h-5 text-gray-600" />
                    Communication Log
                  </h2>
                </div>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search..."
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none w-48" />

                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
            </div>

            {/* Logs Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Date</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Channel</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Template Name</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Recipient Count</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {communicationLogs.map((log) =>
                  <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-4">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{log.date}</p>
                          <p className="text-xs text-gray-500">{log.time}</p>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <div className="flex justify-center">
                          {getChannelIcon(log.channel)}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-sm font-medium text-gray-900">{log.templateName}</p>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span className="text-sm font-bold text-gray-900">{log.recipientCount}</span>
                      </td>
                      <td className="px-4 py-4 text-center">
                        {getStatusBadge(log.status)}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="p-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Showing <strong>{communicationLogs.length}</strong> entries
              </p>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" className="bg-blue-600 text-white border-blue-600">
                  1
                </Button>
                <Button variant="outline" size="sm">
                  2
                </Button>
                <Button variant="outline" size="sm">
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>);

}

export default ResultAlertConfiguration;