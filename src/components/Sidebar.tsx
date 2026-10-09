import React, { useState } from 'react';
import {
  LayoutDashboard,
  ChevronRight,
  ChevronDown,
  Star,
  Heart } from
'lucide-react';
import { SubModule, SidebarSection, FavoriteItem } from '../types/navigation';
interface SidebarProps {
  activeSubModule: SubModule | null;
  activeSidebarItemId: string;
  onSidebarItemSelect: (itemId: string) => void;
  activeModuleId: string;
  activeModuleLabel: string;
  favorites: FavoriteItem[];
  onToggleFavorite: (item: FavoriteItem) => void;
  onNavigateFavorite: (item: FavoriteItem) => void;
}
export function Sidebar({
  activeSubModule,
  activeSidebarItemId,
  onSidebarItemSelect,
  activeModuleId,
  activeModuleLabel,
  favorites,
  onToggleFavorite,
  onNavigateFavorite
}: SidebarProps) {
  // Default sidebar content if no specific config exists
  const defaultSidebar: SidebarSection[] = [
  {
    title: 'Menu',
    items: activeSubModule ?
    [
    {
      label: activeSubModule.label,
      id: activeSubModule.id
    }] :

    []
  }];

  const sections = activeSubModule?.sidebarConfig || defaultSidebar;
  const [collapsedSections, setCollapsedSections] = useState<
    Record<string, boolean>>(
    {});
  const toggleSection = (title: string) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [title]: !prev[title]
    }));
  };
  // Check if we should show favorites view
  // Show favorites if:
  // 1. Dashboard is selected (activeModuleId === 'dashboard')
  // 2. OR no submodule is selected/available
  const showFavoritesView = activeModuleId === 'dashboard' || !activeSubModule;
  // Check if an item is favorited
  const isFavorited = (itemId: string) => {
    return favorites.some((fav) => fav.sidebarItemId === itemId);
  };
  return (
    <aside className="flex w-80 shrink-0 flex-col overflow-hidden bg-gradient-to-b from-[#0D3B4C] via-[#145369] to-[#1A6B8A] transition-all duration-300">
      {/* Sidebar Header */}
      <div className="border-b border-white/10 px-5 py-4">
        <h2 className="flex items-center gap-2 text-xl font-semibold tracking-wide text-white">
          <LayoutDashboard className="h-7 w-7 text-cyan-300" />
          {showFavoritesView ?
          'Dashboard' :
          activeSubModule?.label || 'Dashboard'}
        </h2>
        <p className="mt-1 pl-9 text-sm font-medium uppercase tracking-wider text-white/60">
          {showFavoritesView ? 'My Favorites' : 'Module View'}
        </p>
      </div>

      {/* Sidebar Content */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 custom-scrollbar">
        {showFavoritesView ?
        // Favorites View
        <div className="space-y-4">
            <div className="mb-2 flex items-center gap-2 px-3">
              <Star className="h-4 w-4 text-yellow-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-white">
                Favorites
              </span>
            </div>

            {favorites.length > 0 ?
          <div className="space-y-1">
                {favorites.map((fav) =>
            <button
              key={`${fav.moduleId}-${fav.subModuleId}-${fav.sidebarItemId}`}
              onClick={() => onNavigateFavorite(fav)}
              className="group flex w-full items-center justify-between rounded-md px-3 py-3 text-sm font-medium text-white/90 hover:bg-white/10 transition-all duration-200">

                    <div className="flex items-center gap-3 overflow-hidden">
                      <Heart
                  className="h-4 w-4 text-red-400 fill-red-400 shrink-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite(fav);
                  }} />

                      <div className="flex flex-col items-start truncate">
                        <span className="truncate">{fav.sidebarItemLabel}</span>
                        <span className="text-[10px] text-white/50 uppercase tracking-wide">
                          {fav.moduleLabel} • {fav.subModuleLabel}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="h-3 w-3 text-white/30 group-hover:text-white/70" />
                  </button>
            )}
              </div> :

          <div className="px-3 py-4 text-sm text-white/50 text-center border border-dashed border-white/10 rounded-lg">
                <p>No favorites added yet.</p>
                <p className="mt-2 text-xs">
                  Browse modules and tap the heart icon ♡ to add favorites.
                </p>
              </div>
          }
          </div> :

        // Regular Module View
        sections.map((section, idx) => {
          const isCollapsed = collapsedSections[section.title];
          return (
            <div key={idx} className="mb-6">
                <button
                onClick={() => toggleSection(section.title)}
                className="mb-2 flex w-full items-center justify-between px-3 text-left group">

                  <span className="text-xs font-bold uppercase tracking-wider text-white/90 group-hover:text-white transition-colors">
                    {section.title}
                  </span>
                  <ChevronDown
                  className={`h-3 w-3 text-white/50 transition-transform duration-200 ${isCollapsed ? '-rotate-90' : ''}`} />

                </button>

                <div
                className={`space-y-1 transition-all duration-300 ${isCollapsed ? 'h-0 overflow-hidden opacity-0' : 'opacity-100'}`}>

                  {section.items.map((item) => {
                  const isActive = activeSidebarItemId === item.id;
                  const favorited = isFavorited(item.id);
                  return (
                    <div
                      key={item.id}
                      className={`group flex w-full items-center justify-between rounded-md pr-2 transition-all duration-200
                          ${isActive ? 'bg-white/10 text-white shadow-sm' : 'text-white/70 hover:bg-white/5 hover:text-white'}`}>

                        <button
                        onClick={() => onSidebarItemSelect(item.id)}
                        className="flex-1 py-2 pl-3 text-left text-sm font-medium truncate">

                          {item.label}
                        </button>

                        <div className="flex items-center gap-2">
                          <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (activeSubModule) {
                              onToggleFavorite({
                                sidebarItemId: item.id,
                                sidebarItemLabel: item.label,
                                subModuleId: activeSubModule.id,
                                subModuleLabel: activeSubModule.label,
                                moduleId: activeModuleId,
                                moduleLabel: activeModuleLabel
                              });
                            }
                          }}
                          className={`p-1.5 rounded-full transition-colors ${favorited ? 'text-red-400 hover:bg-white/10' : 'text-white/20 hover:text-white/60 hover:bg-white/10'}`}>

                            <Heart
                            className={`h-3.5 w-3.5 ${favorited ? 'fill-red-400' : ''}`} />

                          </button>

                          {isActive &&
                        <ChevronRight className="h-3 w-3 text-cyan-300" />
                        }
                        </div>
                      </div>);

                })}
                </div>

                {idx < sections.length - 1 &&
              <div className="mt-4 h-px w-full bg-white/10 mx-3" />
              }
              </div>);

        })
        }
      </nav>

      {/* Footer */}
      <div className="border-t border-white/10 p-4">
        <div className="flex items-center justify-between text-sm text-white/30">
          <span>v3.1.0</span>
          <span>EduManager</span>
        </div>
      </div>
    </aside>);

}