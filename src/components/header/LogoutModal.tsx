import React from 'react';
import { AlertTriangle, LogOut } from 'lucide-react';
interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}
export function LogoutModal({ isOpen, onClose, onConfirm }: LogoutModalProps) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose} />


      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden transform transition-all scale-100">
        <div className="p-6 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <LogOut className="h-8 w-8 text-red-600 ml-1" />
          </div>

          <h3 className="text-xl font-bold text-gray-900 mb-2">Log Out?</h3>
          <p className="text-gray-500 mb-6">
            Are you sure you want to log out of your account? You will need to
            sign in again to access the system.
          </p>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 px-4 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">

              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 py-2.5 px-4 bg-red-600 rounded-xl text-sm font-medium text-white hover:bg-red-700 shadow-lg shadow-red-600/20 transition-colors">

              Log Out
            </button>
          </div>
        </div>
      </div>
    </div>);

}