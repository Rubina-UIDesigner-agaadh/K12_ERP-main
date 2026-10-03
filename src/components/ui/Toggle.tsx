import React, { useState } from 'react';
interface ToggleProps {
  label?: string;
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  size?: 'sm' | 'md';
  className?: string;
}
export function Toggle({
  label,
  checked,
  defaultChecked = false,
  onChange,
  disabled = false,
  size = 'md',
  className = ''
}: ToggleProps) {
  const [internalChecked, setInternalChecked] = useState(defaultChecked);
  const isControlled = checked !== undefined;
  const isChecked = isControlled ? checked : internalChecked;
  const handleToggle = () => {
    if (disabled) return;
    const next = !isChecked;
    if (!isControlled) setInternalChecked(next);
    onChange?.(next);
  };
  const trackSize = size === 'sm' ? 'w-8 h-4' : 'w-11 h-6';
  const thumbSize = size === 'sm' ? 'w-3 h-3' : 'w-5 h-5';
  const thumbTranslate =
  size === 'sm' ?
  isChecked ?
  'translate-x-4' :
  'translate-x-0.5' :
  isChecked ?
  'translate-x-5' :
  'translate-x-0.5';
  return (
    <label
      className={`flex items-center gap-2 cursor-pointer select-none ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      onClick={handleToggle}>

      <div
        className={`relative inline-flex items-center rounded-full transition-colors duration-200 ease-in-out flex-shrink-0 ${trackSize} ${isChecked ? 'bg-blue-600' : 'bg-gray-300'}`}>

        <span
          className={`inline-block rounded-full bg-white shadow transform transition-transform duration-200 ease-in-out ${thumbSize} ${thumbTranslate}`} />

      </div>
      {label && <span className="text-sm text-gray-700">{label}</span>}
    </label>);

}