import React from 'react';
import {
  FileText,
  Settings,
  BarChart3,
  LayoutDashboard,
  Database } from
'lucide-react';
interface PlaceholderPageProps {
  title: string;
  type?: 'list' | 'transaction' | 'report' | 'dashboard' | 'master';
  onAdd?: () => void;
}
export function PlaceholderPage({
  title,
  type = 'transaction',
  onAdd
}: PlaceholderPageProps) {
  const getIcon = () => {
    switch (type) {
      case 'list':
        return <FileText className="w-12 h-12 text-blue-500" />;
      case 'transaction':
        return <Settings className="w-12 h-12 text-green-500" />;
      case 'report':
        return <BarChart3 className="w-12 h-12 text-purple-500" />;
      case 'dashboard':
        return <LayoutDashboard className="w-12 h-12 text-orange-500" />;
      case 'master':
        return <Database className="w-12 h-12 text-cyan-500" />;
      default:
        return <FileText className="w-12 h-12 text-gray-500" />;
    }
  };
  const getTypeLabel = () => {
    switch (type) {
      case 'list':
        return 'List View';
      case 'transaction':
        return 'Transaction';
      case 'report':
        return 'Report';
      case 'dashboard':
        return 'Dashboard';
      case 'master':
        return 'Master Data';
      default:
        return 'Page';
    }
  };
  const getTypeColor = () => {
    switch (type) {
      case 'list':
        return 'bg-blue-50 border-blue-200';
      case 'transaction':
        return 'bg-green-50 border-green-200';
      case 'report':
        return 'bg-purple-50 border-purple-200';
      case 'dashboard':
        return 'bg-orange-50 border-orange-200';
      case 'master':
        return 'bg-cyan-50 border-cyan-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };
  return (
    <div className="min-h-full bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
            <span
              className={`px-2 py-0.5 rounded text-xs font-medium ${type === 'list' ? 'bg-blue-100 text-blue-700' : type === 'transaction' ? 'bg-green-100 text-green-700' : type === 'report' ? 'bg-purple-100 text-purple-700' : type === 'dashboard' ? 'bg-orange-100 text-orange-700' : 'bg-cyan-100 text-cyan-700'}`}>

              {getTypeLabel()}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        </div>

        {/* Placeholder Content */}
        <div
          className={`rounded-xl border-2 border-dashed ${getTypeColor()} p-12`}>

          <div className="flex flex-col items-center justify-center text-center">
            <div className="mb-4 p-4 rounded-full bg-white shadow-sm">
              {getIcon()}
            </div>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              {title}
            </h2>
            <p className="text-gray-500 max-w-md mb-6">
              This page is ready for implementation. The navigation and routing
              are configured correctly.
            </p>
            {onAdd &&
            <button
              onClick={onAdd}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">

                Add New
              </button>
            }
          </div>
        </div>

        {/* Sample Actions */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
            <div className="text-2xl font-bold text-gray-900">--</div>
            <div className="text-sm text-gray-500">Total Records</div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
            <div className="text-2xl font-bold text-green-600">--</div>
            <div className="text-sm text-gray-500">Active</div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">--</div>
            <div className="text-sm text-gray-500">Pending</div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
            <div className="text-2xl font-bold text-gray-400">--</div>
            <div className="text-sm text-gray-500">Archived</div>
          </div>
        </div>
      </div>
    </div>);

}
// Convenience exports for different page types
export function ListPage({
  title,
  onAdd



}: {title: string;onAdd?: () => void;}) {
  return <PlaceholderPage title={title} type="list" onAdd={onAdd} />;
}
export function TransactionPage({ title }: {title: string;}) {
  return <PlaceholderPage title={title} type="transaction" />;
}
export function ReportPage({ title }: {title: string;}) {
  return <PlaceholderPage title={title} type="report" />;
}
export function DashboardPage({ title }: {title: string;}) {
  return <PlaceholderPage title={title} type="dashboard" />;
}
export function MasterPage({ title }: {title: string;}) {
  return <PlaceholderPage title={title} type="master" />;
}