import React from 'react';
interface Column {
  key: string;
  header: string;
  render?: (row: any) => React.ReactNode;
}
interface TableProps {
  columns: Column[];
  data: any[];
  emptyMessage?: string;
}
export function Table({
  columns = [],
  data = [],
  emptyMessage = 'No data available'
}: TableProps) {
  if (!data || data.length === 0) {
    return <div className="text-center py-12 text-gray-500">{emptyMessage}</div>;
  }
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            {columns.map((column) =>
              <th
                key={column.key}
                className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">

                {column.header}
              </th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {data.map((row, rowIndex) =>
            <tr
              key={row.id || rowIndex}
              className="hover:bg-gray-50 transition-colors">

              {columns.map((column) =>
                <td key={column.key} className="px-4 py-3 text-sm">
                  {column.render ? column.render(row) : row[column.key]}
                </td>
              )}
            </tr>
          )}
        </tbody>
      </table>
    </div>);

}
// Sub-components for composable table usage
export function TableHead({
  children,
  className = ''



}: { children: React.ReactNode; className?: string; }) {
  return (
    <thead className={`bg-gray-50 border-b border-gray-200 ${className}`}>
      {children}
    </thead>);

}
export function TableBody({
  children,
  className = ''



}: { children: React.ReactNode; className?: string; }) {
  return (
    <tbody className={`divide-y divide-gray-100 ${className}`}>
      {children}
    </tbody>);

}
export function TableRow({
  children,
  className = ''



}: { children: React.ReactNode; className?: string; }) {
  return (
    <tr className={`hover:bg-gray-50 transition-colors ${className}`}>
      {children}
    </tr>);

}
export function TableHeader({
  children,
  className = ''



}: { children: React.ReactNode; className?: string; }) {
  return (
    <th
      className={`px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider ${className}`}>

      {children}
    </th>);

}
export function TableCell({
  children,
  className = ''



}: { children: React.ReactNode; className?: string; }) {
  return <td className={`px-4 py-3 text-sm ${className}`}>{children}</td>;
}