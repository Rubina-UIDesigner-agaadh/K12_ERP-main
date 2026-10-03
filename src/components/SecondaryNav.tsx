import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { modules } from '../data/navigationData';
import { Module, SubModule } from '../types/navigation';
interface SecondaryNavProps {
  activeModuleId: string;
  onModuleSelect: (moduleId: string) => void;
  onSubModuleSelect: (subModule: SubModule) => void;
}
export function SecondaryNav({
  activeModuleId,
  onModuleSelect,
  onSubModuleSelect
}: SecondaryNavProps) {
  const navigate = useNavigate();
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState<{
    left: number;
    top: number;
  } | null>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setOpenDropdownId(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  const handleModuleClick = (module: Module) => {
    // If no submodules, do nothing
    if (!module.subModules || module.subModules.length === 0) return;
    // Only toggle dropdown, DO NOT navigate
    if (openDropdownId === module.id) {
      setOpenDropdownId(null);
      setDropdownPosition(null);
    } else {
      const button = buttonRefs.current.get(module.id);
      if (button && navRef.current) {
        const buttonRect = button.getBoundingClientRect();
        const navRect = navRef.current.getBoundingClientRect();
        setDropdownPosition({
          left: buttonRect.left - navRect.left,
          top: navRect.height
        });
      }
      setOpenDropdownId(module.id);
    }
  };
  const handleSubModuleClick = (
  subModule: SubModule,
  parentModuleId: string) =>
  {
    // Build URL and navigate
    let firstPageId = subModule.id;
    if (subModule.sidebarConfig && subModule.sidebarConfig.length > 0) {
      firstPageId = subModule.sidebarConfig[0].items[0]?.id || subModule.id;
    }
    navigate(`/${parentModuleId}/${subModule.id}/${firstPageId}`);
    setOpenDropdownId(null);
    setDropdownPosition(null);
  };
  const openModule = modules.find((m) => m.id === openDropdownId);
  return (
    <div className="relative" ref={navRef}>
      {/* Navigation Bar */}
      <div className="flex items-center justify-between border-b border-gray-100 bg-white px-4 py-2 z-30">
        <nav className="flex items-center overflow-x-auto no-scrollbar pb-1 md:pb-0">
          {modules.map((module) => {
            // Active state logic:
            // 1. If dropdown is open, highlight that module
            // 2. If no dropdown is open, highlight the currently active module
            const isActive = openDropdownId ?
            openDropdownId === module.id :
            activeModuleId === module.id;
            const isOpen = openDropdownId === module.id;
            const Icon = module.icon;
            return (
              <div key={module.id} className="shrink-0 mr-1">
                <button
                  ref={(el) => {
                    if (el) buttonRefs.current.set(module.id, el);
                  }}
                  onClick={() => handleModuleClick(module)}
                  className={`flex items-center gap-2 rounded-sm px-3 py-2 text-sm font-medium transition-all duration-200
                    ${isActive ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}>

                  <Icon
                    className={`h-4 w-4 ${isActive ? 'text-gray-900' : 'text-gray-500'}`} />

                  <span className="whitespace-nowrap">{module.label}</span>
                  {module.subModules && module.subModules.length > 0 &&
                  <ChevronDown
                    className={`h-3.5 w-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />

                  }
                </button>
              </div>);

          })}
        </nav>
      </div>

      {/* Dropdown Menu - Positioned outside the header */}
      {openDropdownId && openModule && dropdownPosition &&
      <div
        className="absolute bg-white shadow-xl z-50 rounded-sm border border-gray-100"
        style={{
          left: dropdownPosition.left,
          top: dropdownPosition.top,
          minWidth: '220px'
        }}>

          <div className="py-2 max-h-[60vh] overflow-y-auto custom-scrollbar">
            {openModule.subModules.map((subModule) =>
          <button
            key={subModule.id}
            onClick={(e) => {
              e.stopPropagation();
              handleSubModuleClick(subModule, openModule.id);
            }}
            className="block w-full px-5 py-3 text-left text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors">

                {subModule.label}
              </button>
          )}
          </div>
        </div>
      }
    </div>);

}