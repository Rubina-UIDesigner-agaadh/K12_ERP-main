import React from 'react';
interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
  headerAction?: React.ReactNode;
}
export function Card({
  title,
  children,
  className = '',
  noPadding = false,
  headerAction
}: CardProps) {
  return (
    <div
      className={`bg-white rounded-lg border border-gray-200 shadow-sm ${className}`}>

      {title &&
      <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">{title}</h3>
          {headerAction}
        </div>
      }
      <div className={noPadding ? '' : 'p-5'}>{children}</div>
    </div>);

}