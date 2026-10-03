import React, { useCallback } from 'react';
interface SelectOption {
  value: string;
  label: string;
}
interface SelectProps {
  label?: string;
  options: SelectOption[];
  value?: string;
  onChange?:
  ((e: React.ChangeEvent<HTMLSelectElement>) => void) |
  ((value: string) => void);
  placeholder?: string;
  className?: string;
  defaultValue?: string;
}
export function Select({
  label,
  options,
  value,
  onChange,
  placeholder,
  className = '',
  defaultValue
}: SelectProps) {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      if (!onChange) return;
      const val = e.target.value;
      // The codebase has two Select onChange patterns:
      //
      // Pattern A (130+ files): onChange={(e) => setState(e.target.value)}
      // Pattern B (100+ files): onChange={setState} or onChange={(val) => fn(val)}
      //
      // To support BOTH without editing hundreds of files, we create a
      // lightweight proxy that behaves as a string AND has .target.value.
      // This is safe because:
      //   - Pattern A: arg.target.value → returns the string ✓
      //   - Pattern B: setState(arg) → state is a plain object, but
      //     when React uses it as <select value={state}>, we need it
      //     to resolve to the string. We override toString/valueOf.
      //
      // However, strict equality (===) with string primitives will fail
      // for Pattern B. To avoid this, we detect Pattern B at call time:
      // if onChange was created as a direct state setter or a simple
      // arrow function that doesn't access .target, we pass the string.
      //
      // Detection heuristic: check if the function source mentions "target"
      const fnStr = onChange.toString();
      const usesEventTarget =
      fnStr.includes('.target') || fnStr.includes('target');
      if (usesEventTarget) {
        // Pattern A: pass the real event
        ;(onChange as (e: React.ChangeEvent<HTMLSelectElement>) => void)(e);
      } else {
        // Pattern B: pass the string value directly
        ;(onChange as (value: string) => void)(val);
      }
    },
    [onChange]
  );
  return (
    <div className={className}>
      {label &&
      <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      }
      <select
        value={value}
        defaultValue={defaultValue}
        onChange={handleChange}
        className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">

        {placeholder &&
        <option value="" disabled>
            {placeholder}
          </option>
        }
        {options.map((option) =>
        <option key={option.value} value={option.value}>
            {option.label}
          </option>
        )}
      </select>
    </div>);

}