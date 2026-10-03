import React, { useEffect, useState, useRef } from 'react';
import { ChevronDownIcon, XIcon, CheckIcon } from 'lucide-react';
interface MultiSelectOption {
  value: string;
  label: string;
}
interface MultiSelectProps {
  label?: string;
  options: MultiSelectOption[];
  value: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  className?: string;
}
export function MultiSelect({
  label,
  options,
  value,
  onChange,
  placeholder = 'Select...',
  className = ''
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
      containerRef.current &&
      !containerRef.current.contains(event.target as Node))
      {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  const toggleOption = (optionValue: string) => {
    if (value.includes(optionValue)) {
      onChange(value.filter((v) => v !== optionValue));
    } else {
      onChange([...value, optionValue]);
    }
  };
  const removeOption = (optionValue: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(value.filter((v) => v !== optionValue));
  };
  const clearAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange([]);
  };
  const selectAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(options.map((o) => o.value));
  };
  const selectedLabels = value.
  map((v) => options.find((o) => o.value === v)?.label).
  filter(Boolean) as string[];
  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {label &&
      <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      }

      {/* Trigger */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`min-h-[38px] w-full flex items-center justify-between gap-2 px-3 py-1.5 border rounded-lg cursor-pointer bg-white transition-all ${isOpen ? 'border-blue-500 ring-2 ring-blue-100' : 'border-gray-300 hover:border-gray-400'}`}>

        <div className="flex flex-wrap gap-1 flex-1 min-w-0">
          {selectedLabels.length === 0 ?
          <span className="text-sm text-gray-400 py-0.5">{placeholder}</span> :
          selectedLabels.length <= 2 ?
          selectedLabels.map((lbl, idx) =>
          <span
            key={idx}
            className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded-md">

                {lbl}
                <button
              onClick={(e) => removeOption(value[idx], e)}
              className="hover:text-blue-900 transition-colors">

                  <XIcon className="w-3 h-3" />
                </button>
              </span>
          ) :

          <>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded-md">
                {selectedLabels[0]}
                <button
                onClick={(e) => removeOption(value[0], e)}
                className="hover:text-blue-900 transition-colors">

                  <XIcon className="w-3 h-3" />
                </button>
              </span>
              <span className="inline-flex items-center px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-medium rounded-md">
                +{selectedLabels.length - 1} more
              </span>
            </>
          }
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {value.length > 0 &&
          <button
            onClick={clearAll}
            className="p-0.5 text-gray-400 hover:text-gray-600 transition-colors rounded">

              <XIcon className="w-3.5 h-3.5" />
            </button>
          }
          <ChevronDownIcon
            className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />

        </div>
      </div>

      {/* Dropdown */}
      {isOpen &&
      <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
          {/* Select All / Clear All */}
          <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100 bg-gray-50">
            <button
            onClick={selectAll}
            className="text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors">

              Select All
            </button>
            <span className="text-xs text-gray-400">
              {value.length}/{options.length} selected
            </span>
            {value.length > 0 &&
          <button
            onClick={clearAll}
            className="text-xs font-medium text-gray-500 hover:text-gray-700 transition-colors">

                Clear All
              </button>
          }
          </div>

          {/* Options */}
          <div className="max-h-52 overflow-y-auto">
            {options.map((option) => {
            const isSelected = value.includes(option.value);
            return (
              <div
                key={option.value}
                onClick={() => toggleOption(option.value)}
                className={`flex items-center gap-3 px-3 py-2.5 cursor-pointer transition-colors ${isSelected ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'}`}>

                  <div
                  className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-all ${isSelected ? 'bg-blue-600 border-blue-600' : 'border-gray-300'}`}>

                    {isSelected &&
                  <CheckIcon className="w-2.5 h-2.5 text-white" />
                  }
                  </div>
                  <span className="text-sm">{option.label}</span>
                </div>);

          })}
          </div>
        </div>
      }
    </div>);

}