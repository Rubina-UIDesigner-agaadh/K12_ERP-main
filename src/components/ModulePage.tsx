import React from 'react';
import {
  Home,
  ChevronRight,
  MoreHorizontal,
  Printer,
  Download,
  Share2 } from
'lucide-react';
interface ModulePageProps {
  moduleName: string;
  subModuleName: string;
  screenName: string;
}
export function ModulePage({
  moduleName,
  subModuleName,
  screenName
}: ModulePageProps) {
  return (
    <div className="flex-1 bg-gray-50/50 min-h-full">
      {/* Breadcrumb Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900">{screenName}</h1>
          <div className="flex items-center gap-2">
            <button
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              title="Print">

              <Printer className="h-5 w-5" />
            </button>
            <button
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              title="Download">

              <Download className="h-5 w-5" />
            </button>
            <button
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              title="Share">

              <Share2 className="h-5 w-5" />
            </button>
          </div>
        </div>

        <nav className="flex items-center text-sm text-gray-500">
          <a href="#" className="hover:text-blue-600 transition-colors">
            <Home className="h-4 w-4" />
          </a>
          <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
          <span className="hover:text-blue-600 transition-colors cursor-pointer">
            {moduleName}
          </span>
          <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
          <span className="hover:text-blue-600 transition-colors cursor-pointer">
            {subModuleName}
          </span>
          <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
          <span className="font-medium text-gray-900">{screenName}</span>
        </nav>
      </div>

      {/* Content Area Placeholder */}
      <div className="p-6">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm min-h-[400px] flex flex-col items-center justify-center p-8 text-center">
          <div className="bg-blue-50 p-4 rounded-full mb-4">
            <MoreHorizontal className="h-8 w-8 text-blue-500" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {screenName} Content
          </h3>
          <p className="text-gray-500 max-w-md">
            This is a placeholder for the <strong>{screenName}</strong> screen.
            In a real application, this area would contain the specific forms,
            tables, or dashboards for this module.
          </p>
          <div className="mt-6 flex gap-3">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors shadow-sm font-medium">
              Create New
            </button>
            <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors shadow-sm font-medium">
              View Reports
            </button>
          </div>
        </div>
      </div>
    </div>);

}