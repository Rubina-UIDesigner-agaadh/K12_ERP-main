import React from 'react';
interface TextareaProps extends
  React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
  error?: string;
}
export function Textarea({
  label,
  helperText,
  error,
  className = '',
  ...props
}: TextareaProps) {
  return (
    <div className={className}>
      {label &&
      <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      }
      <textarea
        className={`
          block w-full rounded-lg border border-gray-300 bg-white
          px-3 py-2 text-sm text-gray-900 placeholder-gray-400
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
          disabled:bg-gray-50 disabled:text-gray-500 resize-vertical
          ${error ? 'border-red-500 focus:ring-red-500' : ''}
        `}
        {...props} />

      {helperText && !error &&
      <p className="mt-1 text-xs text-gray-500">{helperText}</p>
      }
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>);

}