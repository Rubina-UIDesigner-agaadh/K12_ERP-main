import React, { useEffect, useState, useRef } from 'react';
import { Building2, ChevronDown, Check, X, Calendar } from 'lucide-react';
export const BRANCHES = [
{
  id: 'main',
  name: 'Main Campus',
  color: 'bg-blue-500'
},
{
  id: 'north',
  name: 'North Branch',
  color: 'bg-emerald-500'
},
{
  id: 'south',
  name: 'South Branch',
  color: 'bg-violet-500'
},
{
  id: 'east',
  name: 'East Branch',
  color: 'bg-amber-500'
}];

export const ACADEMIC_YEARS = [
{
  value: '2024-25',
  label: '2024-2025'
},
{
  value: '2023-24',
  label: '2023-2024'
},
{
  value: '2022-23',
  label: '2022-2023'
},
{
  value: '2021-22',
  label: '2021-2022'
}];

export interface ReportFiltersState {
  selectedBranches: string[];
  academicYear: string;
}
interface ReportFiltersProps {
  value?: ReportFiltersState;
  onChange?: (state: ReportFiltersState) => void;
  className?: string;
}
export function ReportFilters({
  value,
  onChange,
  className = ''
}: ReportFiltersProps) {
  const [internalState, setInternalState] = useState<ReportFiltersState>({
    selectedBranches: BRANCHES.map((b) => b.id),
    academicYear: '2024-25'
  });
  const [showBranchDropdown, setShowBranchDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const state = value ?? internalState;
  const setState = (next: ReportFiltersState) => {
    if (!value) setInternalState(next);
    onChange?.(next);
  };
  const isAllSelected =
  state.selectedBranches.length === 0 ||
  state.selectedBranches.length === BRANCHES.length;
  const toggleBranch = (branchId: string) => {
    if (branchId === 'all') {
      setState({
        ...state,
        selectedBranches: []
      });
    } else {
      const next = state.selectedBranches.includes(branchId) ?
      state.selectedBranches.filter((b) => b !== branchId) :
      [...state.selectedBranches, branchId];
      setState({
        ...state,
        selectedBranches: next
      });
    }
  };
  const removeBranch = (branchId: string) => {
    setState({
      ...state,
      selectedBranches: state.selectedBranches.filter((b) => b !== branchId)
    });
  };
  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
      dropdownRef.current &&
      !dropdownRef.current.contains(e.target as Node))
      {
        setShowBranchDropdown(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);
  const branchLabel = isAllSelected ?
  'All Branches' :
  `${state.selectedBranches.length} Branch${state.selectedBranches.length > 1 ? 'es' : ''}`;
  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      {/* Branch Multi-Select */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setShowBranchDropdown((v) => !v)}
          className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[180px]">

          <Building2 className="w-4 h-4 text-gray-500 shrink-0" />
          <span className="flex-1 text-left text-gray-700 font-medium">
            {branchLabel}
          </span>
          <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
        </button>

        {showBranchDropdown &&
        <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-200 rounded-xl shadow-xl z-50">
            <div className="p-2">
              {/* All Branches option */}
              <div
              onClick={() => toggleBranch('all')}
              className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-gray-50 ${isAllSelected ? 'bg-blue-50' : ''}`}>

                <div
                className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 ${isAllSelected ? 'bg-blue-500 border-blue-500' : 'border-gray-300'}`}>

                  {isAllSelected && <Check className="w-3 h-3 text-white" />}
                </div>
                <span className="text-sm font-medium text-gray-800">
                  All Branches
                </span>
              </div>

              <div className="border-t my-2" />

              {BRANCHES.map((branch) => {
              const isSelected = state.selectedBranches.includes(branch.id);
              return (
                <div
                  key={branch.id}
                  onClick={() => toggleBranch(branch.id)}
                  className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-gray-50 ${isSelected ? 'bg-blue-50' : ''}`}>

                    <div
                    className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 ${isSelected ? 'bg-blue-500 border-blue-500' : 'border-gray-300'}`}>

                      {isSelected && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <div
                    className={`w-3 h-3 rounded-full shrink-0 ${branch.color}`} />

                    <span className="text-sm text-gray-700">{branch.name}</span>
                  </div>);

            })}
            </div>

            <div className="border-t p-2">
              <button
              onClick={() => setShowBranchDropdown(false)}
              className="w-full py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors">

                Apply
              </button>
            </div>
          </div>
        }
      </div>

      {/* Academic Year Single Select */}
      <div className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 shadow-sm">
        <Calendar className="w-4 h-4 text-gray-500 shrink-0" />
        <select
          value={state.academicYear}
          onChange={(e) =>
          setState({
            ...state,
            academicYear: e.target.value
          })
          }
          className="text-sm text-gray-700 font-medium bg-transparent focus:outline-none cursor-pointer">

          {ACADEMIC_YEARS.map((ay) =>
          <option key={ay.value} value={ay.value}>
              {ay.label}
            </option>
          )}
        </select>
      </div>

      {/* Selected Branch Tags */}
      {!isAllSelected && state.selectedBranches.length > 0 &&
      <div className="flex flex-wrap gap-1.5">
          {state.selectedBranches.map((branchId) => {
          const branch = BRANCHES.find((b) => b.id === branchId);
          return branch ?
          <span
            key={branchId}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-gray-200 rounded-full text-xs text-gray-700 shadow-sm">

                <span
              className={`w-2 h-2 rounded-full shrink-0 ${branch.color}`} />

                {branch.name}
                <button
              onClick={() => removeBranch(branchId)}
              className="text-gray-400 hover:text-gray-600 ml-0.5">

                  <X className="w-3 h-3" />
                </button>
              </span> :
          null;
        })}
          <button
          onClick={() =>
          setState({
            ...state,
            selectedBranches: []
          })
          }
          className="text-xs text-blue-600 hover:text-blue-800 px-1">

            Clear All
          </button>
        </div>
      }
    </div>);

}