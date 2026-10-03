import React, { useState } from 'react';
import { X, Moon, Sun, Check } from 'lucide-react';
interface ThemePanelProps {
  isOpen: boolean;
  onClose: () => void;
}
const THEMES = [
{
  id: 'teal',
  name: 'Ocean Teal',
  color: '#0F4C5C'
},
{
  id: 'blue',
  name: 'Royal Blue',
  color: '#1E40AF'
},
{
  id: 'purple',
  name: 'Deep Purple',
  color: '#6B21A8'
},
{
  id: 'emerald',
  name: 'Forest Green',
  color: '#065F46'
},
{
  id: 'rose',
  name: 'Rose Red',
  color: '#9F1239'
},
{
  id: 'slate',
  name: 'Slate Grey',
  color: '#334155'
}];

export function ThemePanel({ isOpen, onClose }: ThemePanelProps) {
  const [activeTheme, setActiveTheme] = useState('teal');
  const [isDarkMode, setIsDarkMode] = useState(false);
  if (!isOpen) return null;
  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="absolute top-16 right-20 w-80 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
          <h3 className="font-semibold text-gray-900">Theme Settings</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600">

            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-4 space-y-6">
          {/* Mode Toggle */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 block">
              Appearance
            </label>
            <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 rounded-lg">
              <button
                onClick={() => setIsDarkMode(false)}
                className={`flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-all ${!isDarkMode ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>

                <Sun className="h-4 w-4" /> Light
              </button>
              <button
                onClick={() => setIsDarkMode(true)}
                className={`flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-all ${isDarkMode ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>

                <Moon className="h-4 w-4" /> Dark
              </button>
            </div>
          </div>

          {/* Color Scheme */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 block">
              Color Scheme
            </label>
            <div className="grid grid-cols-3 gap-3">
              {THEMES.map((theme) =>
              <button
                key={theme.id}
                onClick={() => setActiveTheme(theme.id)}
                className={`group relative flex flex-col items-center gap-2 p-2 rounded-lg border-2 transition-all ${activeTheme === theme.id ? 'border-[#0F4C5C] bg-cyan-50/50' : 'border-transparent hover:bg-gray-50'}`}>

                  <div
                  className="w-8 h-8 rounded-full shadow-sm flex items-center justify-center"
                  style={{
                    backgroundColor: theme.color
                  }}>

                    {activeTheme === theme.id &&
                  <Check className="h-4 w-4 text-white" />
                  }
                  </div>
                  <span className="text-xs font-medium text-gray-600">
                    {theme.name}
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>);

}