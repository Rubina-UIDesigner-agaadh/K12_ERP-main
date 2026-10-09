import React, { useState, createContext, useContext, Component } from 'react';
// --- Compound Component API (Radix-style) ---
interface TabsContextValue {
  value: string;
  onValueChange: (value: string) => void;
}
const TabsContext = createContext<TabsContextValue>({
  value: '',
  onValueChange: () => {}
});
interface TabsRootProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}
export function Tabs(props: TabsRootProps | LegacyTabsProps): JSX.Element {
  // Detect legacy API (has `tabs` array prop)
  if ('tabs' in props) {
    return <LegacyTabs {...props as LegacyTabsProps} />;
  }
  return <TabsRoot {...props as TabsRootProps} />;
}
function TabsRoot({
  value: controlledValue,
  defaultValue,
  onValueChange,
  children,
  className
}: TabsRootProps) {
  const [internalValue, setInternalValue] = useState(defaultValue || '');
  const value = controlledValue !== undefined ? controlledValue : internalValue;
  const handleChange = (newValue: string) => {
    if (controlledValue === undefined) setInternalValue(newValue);
    onValueChange?.(newValue);
  };
  return (
    <TabsContext.Provider
      value={{
        value,
        onValueChange: handleChange
      }}>

      <div className={className}>{children}</div>
    </TabsContext.Provider>);

}
interface TabsListProps {
  children: React.ReactNode;
  className?: string;
}
export function TabsList({ children, className }: TabsListProps) {
  return (
    <div className={`border-b border-gray-200 ${className || ''}`}>
      <nav className="flex -mb-px">{children}</nav>
    </div>);

}
interface TabsTriggerProps {
  value: string;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}
export function TabsTrigger({
  value,
  children,
  className,
  disabled
}: TabsTriggerProps) {
  const ctx = useContext(TabsContext);
  const isActive = ctx.value === value;
  return (
    <button
      onClick={() => !disabled && ctx.onValueChange(value)}
      disabled={disabled}
      className={`
        px-4 py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-1
        ${isActive ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className || ''}
      `}>

      {children}
    </button>);

}
interface TabsContentProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}
export function TabsContent({ value, children, className }: TabsContentProps) {
  const ctx = useContext(TabsContext);
  if (ctx.value !== value) return null;
  return <div className={className}>{children}</div>;
}
// --- Legacy Array API (backwards compatible) ---
interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
}
interface LegacyTabsProps {
  tabs: Tab[];
  defaultTab?: string;
}
function LegacyTabs({ tabs, defaultTab }: LegacyTabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);
  const activeContent = tabs.find((tab) => tab.id === activeTab)?.content;
  return (
    <div>
      <div className="border-b border-gray-200">
        <nav className="flex -mb-px">
          {tabs.map((tab) =>
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
                px-4 py-3 text-sm font-medium border-b-2 transition-colors
                ${activeTab === tab.id ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
              `}>

              {tab.label}
            </button>
          )}
        </nav>
      </div>
      <div className="py-4">{activeContent}</div>
    </div>);

}