import React from 'react';
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  leftIcon?: React.ReactNode;
}
export function Input({
  label,
  helperText,
  error,
  leftIcon,
  className = '',
  ...props
}: InputProps) {
  return (
    <div className={className}>
      {label &&
      <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      }
      <div className="relative">
        {leftIcon &&
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {leftIcon}
          </div>
        }
        <input
          className={`
            block w-full rounded-lg border border-gray-300 bg-white
            px-3 py-2 text-sm text-gray-900 placeholder-gray-400
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            disabled:bg-gray-50 disabled:text-gray-500
            ${leftIcon ? 'pl-10' : ''}
            ${error ? 'border-red-500 focus:ring-red-500' : ''}
          `}
          {...props} />

      </div>
      {helperText && !error &&
      <p className="mt-1 text-xs text-gray-500">{helperText}</p>
      }
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>);

}