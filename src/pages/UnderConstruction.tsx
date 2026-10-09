import React from 'react';
import { Construction, ArrowLeft, Clock } from 'lucide-react';
export function UnderConstruction() {
  return (
    <div className="min-h-full bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        <div className="mb-6">
          <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
            <Construction className="w-10 h-10 text-amber-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Page Under Construction
          </h1>
          <p className="text-gray-500">
            This page is currently being developed. Please check back later for
            updates.
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-4">
            <Clock className="w-4 h-4" />
            <span>Coming Soon</span>
          </div>
          <p className="text-sm text-gray-600">
            Our team is working hard to bring you this feature. Thank you for
            your patience.
          </p>
        </div>
      </div>
    </div>);

}