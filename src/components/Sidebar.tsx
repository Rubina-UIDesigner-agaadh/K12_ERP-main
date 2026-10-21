import React, { useEffect, useState } from 'react';
import {
  LayoutDashboard,
  ChevronRight,
  ChevronDown,
  Star,
  Heart,
  ExternalLink,
  Maximize2 } from
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

type ContextMenuState = {
  x: number;
  y: number;
  path: string;
  label: string;
};

function openPath(path: string, mode: 'tab' | 'window') {
  if (mode === 'tab') {
    window.open(path, '_blank', 'noopener,noreferrer');
    return;
  }
  const width = Math.min(1280, window.screen.availWidth - 48);
  const height = Math.min(800, window.screen.availHeight - 80);
  window.open(
    path,
    '_blank',
    `noopener,noreferrer,width=${width},height=${height},left=48,top=48`,
  );
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
  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null);

  const toggleSection = (title: string) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [title]: !prev[title]
    }));
  };

  const showFavoritesView = activeModuleId === 'dashboard' || !activeSubModule;

  const isFavorited = (itemId: string) => {
    return favorites.some((fav) => fav.sidebarItemId === itemId);
  };

  const openContextMenu = (e: React.MouseEvent, path: string, label: string) => {
    e.preventDefault();
    e.stopPropagation();
    const width = 220;
    const height = 108;
    setContextMenu({
      x: Math.min(e.clientX, window.innerWidth - width - 8),
      y: Math.min(e.clientY, window.innerHeight - height - 8),
      path,
      label,
    });
  };

  useEffect(() => {
    if (!contextMenu) return;
    const close = () => setContextMenu(null);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    window.addEventListener('click', close);
    window.addEventListener('scroll', close, true);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('click', close);
      window.removeEventListener('scroll', close, true);
      window.removeEventListener('keydown', onKey);
    };
  }, [contextMenu]);

  return (
    <aside className="flex w-80 shrink-0 flex-col overflow-hidden bg-gradient-to-b from-[#0D3B4C] via-[#145369] to-[#1A6B8A] transition-all duration-300">
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

      <nav className="flex-1 overflow-y-auto px-3 py-4 custom-scrollbar">
        {showFavoritesView ?
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
              onContextMenu={(e) => openContextMenu(
                e,
                `/${fav.moduleId}/${fav.subModuleId}/${fav.sidebarItemId}`,
                fav.sidebarItemLabel,
              )}
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

        sections.filter((section) => !section.hidden).map((section, idx) => {
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
                  const path = `/${activeModuleId}/${activeSubModule?.id || item.id}/${item.id}`;
                  return (
                    <div
                      key={item.id}
                      onContextMenu={(e) => openContextMenu(e, path, item.label)}
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

      <div className="border-t border-white/10 p-4">
        <div className="flex items-center justify-between text-sm text-white/30">
          <span>v3.1.0</span>
          <span>EduManager</span>
        </div>
      </div>

      {contextMenu &&
      <div
        className="fixed z-[80] min-w-[200px] overflow-hidden rounded-lg border border-gray-200 bg-white py-1 shadow-xl"
        style={{ top: contextMenu.y, left: contextMenu.x }}
        onClick={(e) => e.stopPropagation()}
        onContextMenu={(e) => e.preventDefault()}>

          <p className="truncate border-b border-gray-100 px-3 py-1.5 text-[11px] font-medium text-gray-500">
            {contextMenu.label}
          </p>
          <button
          type="button"
          className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-gray-800 hover:bg-gray-50"
          onClick={() => {
            openPath(contextMenu.path, 'tab');
            setContextMenu(null);
          }}>

            <ExternalLink className="h-4 w-4 text-gray-500" />
            Open in new tab
          </button>
          <button
          type="button"
          className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-gray-800 hover:bg-gray-50"
          onClick={() => {
            openPath(contextMenu.path, 'window');
            setContextMenu(null);
          }}>

            <Maximize2 className="h-4 w-4 text-gray-500" />
            Open in new window
          </button>
        </div>
      }
    </aside>);

}
