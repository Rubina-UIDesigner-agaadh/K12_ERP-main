import { LucideIcon } from 'lucide-react';

export interface SidebarItem {
  label: string;
  id: string;
}

export interface SidebarSection {
  title: string;
  items: SidebarItem[];
}

export interface SubModule {
  id: string;
  label: string;
  sidebarConfig?: SidebarSection[];
}

export interface Module {
  id: string;
  label: string;
  icon: LucideIcon;
  subModules: SubModule[];
}

export interface NavigationState {
  activeModuleId: string;
  activeSubModuleId: string;
  activeSidebarItemId: string;
}

export interface FavoriteItem {
  sidebarItemId: string;
  sidebarItemLabel: string;
  subModuleId: string;
  subModuleLabel: string;
  moduleId: string;
  moduleLabel: string;
}