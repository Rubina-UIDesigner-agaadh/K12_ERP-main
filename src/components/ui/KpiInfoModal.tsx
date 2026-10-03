import React from 'react';
import { X, Info, AlertCircle, Lightbulb, Target } from 'lucide-react';
export interface KpiInfo {
  title: string;
  description: string;
  whyItMatters: string;
  actionRequired: string;
}
interface KpiInfoModalProps {
  info: KpiInfo | null;
  onClose: () => void;
}
export function KpiInfoModal({ info, onClose }: KpiInfoModalProps) {
  if (!info) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}>

      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-auto overflow-hidden"
        onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className="bg-blue-600 px-6 py-5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <Info className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-white font-semibold text-base leading-tight">
                {info.title}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/20 hover:bg-white/30 transition-colors flex-shrink-0">

              <X className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Description */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Info className="w-3.5 h-3.5 text-blue-600" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900">
                Description
              </h3>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed pl-8">
              {info.description}
            </p>
          </div>

          <div className="border-t border-gray-100" />

          {/* Why it matters */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900">
                Why It Matters
              </h3>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed pl-8">
              {info.whyItMatters}
            </p>
          </div>

          <div className="border-t border-gray-100" />

          {/* Action Required */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Target className="w-3.5 h-3.5 text-green-600" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900">
                Action Required
              </h3>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed pl-8">
              {info.actionRequired}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition-colors">

            Got it
          </button>
        </div>
      </div>
    </div>);

}