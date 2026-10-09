import React, { useEffect, useState, useRef } from 'react';
import { ChevronDown, BoxIcon } from 'lucide-react';
interface HeaderDropdownProps {
  icon?: BoxIcon;
  value: string;
  options: string[];
  onChange: (value: string) => void;
  className?: string;
  textColor?: string;
}
export function HeaderDropdown({
  icon: Icon,
  value,
  options,
  onChange,
  className = '',
  textColor = 'text-white/90'
}: HeaderDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node))
      {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1.5 text-base transition-colors hover:text-white ${textColor} ${className}`}>

        {Icon && <Icon className="h-4 w-4" />}
        <span className="max-w-[120px] truncate">{value}</span>
        <ChevronDown
          className={`h-3 w-3 opacity-70 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />

      </button>

      {isOpen &&
      <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 py-1 z-50 animate-in fade-in zoom-in-95 duration-100 origin-top-left">
          {options.map((option) =>
        <button
          key={option}
          onClick={() => {
            onChange(option);
            setIsOpen(false);
          }}
          className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors ${value === option ? 'text-[#0F4C5C] font-medium bg-cyan-50' : 'text-gray-700'}`}>

              {option}
            </button>
        )}
        </div>
      }
    </div>);

}