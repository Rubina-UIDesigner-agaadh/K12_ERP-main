import React, { useEffect, useState } from 'react';
import {
  Activity,
  Award,
  BarChart3,
  Bell,
  BookOpen,
  Briefcase,
  Bus,
  CalendarDays,
  ChevronRight,
  ChevronDown,
  ClipboardList,
  Clock,
  FileText,
  Heart,
  LayoutDashboard,
  List,
  Mail,
  Maximize2,
  PanelLeftClose,
  PanelLeftOpen,
  Puzzle,
  QrCode,
  Receipt,
  Settings,
  Shield,
  Star,
  Users,
  Wallet,
  ExternalLink,
  type LucideIcon } from
'lucide-react';
import { SubModule, SidebarSection, FavoriteItem } from '../types/navigation';

function pageIcon(id: string, label: string): LucideIcon {
  const t = `${id} ${label}`.toLowerCase();
  if (/(dashboard|overview|kpi)/.test(t)) return LayoutDashboard;
  if (/(teacher|staff|employee|payroll|salary|hr )/.test(t)) return Briefcase;
  if (/(student|enrol|admission|applicant)/.test(t)) return Users;
  if (/(fee|invoice|payment|wallet|collection|scholarship)/.test(t)) return Wallet;
  if (/(expense|bill|vendor|purchase)/.test(t)) return Receipt;
  if (/(report|analytic|mis)/.test(t)) return BarChart3;
  if (/(attend|leave|calendar)/.test(t)) return CalendarDays;
  if (/(exam|assessment|result|mark)/.test(t)) return ClipboardList;
  if (/(academic|curriculum|plan|lesson|syllabus|subject)/.test(t)) return BookOpen;
  if (/(timetable|schedule)/.test(t)) return Clock;
  if (/(setting|config|setup|master)/.test(t)) return Settings;
  if (/(alert|notif)/.test(t)) return Bell;
  if (/(message|inbox|mail|email|sms|whatsapp)/.test(t)) return Mail;
  if (/(transport|bus|gps|route|vehicle)/.test(t)) return Bus;
  if (/(barcode|qr|id-register|id card)/.test(t)) return QrCode;
  if (/(certificate|award)/.test(t)) return Award;
  if (/(security|role|permission|audit)/.test(t)) return Shield;
  if (/(plugin)/.test(t)) return Puzzle;
  if (/(health)/.test(t)) return Activity;
  if (/(list|register)/.test(t)) return List;
  return FileText;
}

interface SidebarProps {
  activeSubModule: SubModule | null;
  activeSidebarItemId: string;
  onSidebarItemSelect: (itemId: string) => void;
  activeModuleId: string;
  activeModuleLabel: string;
  favorites: FavoriteItem[];
  onToggleFavorite: (item: FavoriteItem) => void;
  onNavigateFavorite: (item: FavoriteItem) => void;
  collapsed: boolean;
  onToggleCollapsed: () => void;
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
  onNavigateFavorite,
  collapsed,
  onToggleCollapsed
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
    <aside className={`flex shrink-0 flex-col overflow-hidden bg-gradient-to-b from-[#0D3B4C] via-[#145369] to-[#1A6B8A] transition-[width] duration-300 ${collapsed ? 'w-16' : 'w-80'}`}>
      <div className={`border-b border-white/10 ${collapsed ? 'px-1 py-3' : 'px-5 py-4'}`}>
        {collapsed ? (
          <button
            type="button"
            title="Expand sidebar"
            aria-label="Expand sidebar"
            onClick={onToggleCollapsed}
            className="flex h-10 w-full items-center justify-center rounded-md text-white/90 transition-colors hover:bg-white/10 hover:text-white"
          >
            <PanelLeftOpen className="h-5 w-5" />
          </button>
        ) : (
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h2 className="flex items-center gap-2 text-xl font-semibold tracking-wide text-white">
                <LayoutDashboard className="h-7 w-7 shrink-0 text-cyan-300" />
                <span className="truncate">{showFavoritesView ? 'Dashboard' : activeSubModule?.label || 'Dashboard'}</span>
              </h2>
              <p className="mt-1 pl-9 text-sm font-medium uppercase tracking-wider text-white/60">
                {showFavoritesView ? 'My Favorites' : 'Module View'}
              </p>
            </div>
            <button
              type="button"
              title="Collapse sidebar"
              aria-label="Collapse sidebar"
              onClick={onToggleCollapsed}
              className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-white/70 transition-colors hover:bg-white/10 hover:text-white"
            >
              <PanelLeftClose className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      <nav className={`flex-1 overflow-y-auto custom-scrollbar ${collapsed ? 'px-1.5 py-3' : 'px-3 py-4'}`}>
        {collapsed ? (
        <div className="space-y-1">
          {showFavoritesView ? (
            favorites.length === 0 ? (
              <p className="px-1 text-center text-[10px] text-white/40">No favorites</p>
            ) : (
              favorites.map((fav) => {
                const Icon = pageIcon(fav.sidebarItemId, fav.sidebarItemLabel);
                return (
                  <button
                    key={`${fav.moduleId}-${fav.subModuleId}-${fav.sidebarItemId}`}
                    type="button"
                    title={`${fav.sidebarItemLabel} · ${fav.moduleLabel}`}
                    aria-label={fav.sidebarItemLabel}
                    onClick={() => onNavigateFavorite(fav)}
                    onContextMenu={(e) => openContextMenu(
                      e,
                      `/${fav.moduleId}/${fav.subModuleId}/${fav.sidebarItemId}`,
                      fav.sidebarItemLabel,
                    )}
                    className="flex h-10 w-full items-center justify-center rounded-md text-white/80 transition-colors hover:bg-white/10 hover:text-white"
                  >
                    <Icon className="h-5 w-5" />
                  </button>
                );
              })
            )
          ) : (
            sections.filter((section) => !section.hidden).flatMap((section) => section.items).map((item) => {
              const Icon = pageIcon(item.id, item.label);
              const isActive = activeSidebarItemId === item.id;
              const path = `/${activeModuleId}/${activeSubModule?.id || item.id}/${item.id}`;
              return (
                <button
                  key={item.id}
                  type="button"
                  title={item.label}
                  aria-label={item.label}
                  aria-current={isActive ? 'page' : undefined}
                  onClick={() => onSidebarItemSelect(item.id)}
                  onContextMenu={(e) => openContextMenu(e, path, item.label)}
                  className={`flex h-10 w-full items-center justify-center rounded-md transition-colors ${isActive ? 'bg-white/15 text-cyan-300 shadow-sm' : 'text-white/75 hover:bg-white/10 hover:text-white'}`}
                >
                  <Icon className="h-5 w-5" />
                </button>
              );
            })
          )}
        </div>
        ) : showFavoritesView ?
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

      {!collapsed && (
      <div className="border-t border-white/10 p-4">
        <div className="flex items-center justify-between text-sm text-white/30">
          <span>v3.1.0</span>
          <span>EduManager</span>
        </div>
      </div>
      )}

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
