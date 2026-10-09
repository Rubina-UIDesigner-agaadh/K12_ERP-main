import React, { useEffect, useState, useRef } from 'react';
import { Search, X } from 'lucide-react';
export function SearchExpand() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isExpanded]);
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
      containerRef.current &&
      !containerRef.current.contains(event.target as Node))
      {
        if (!query) {
          setIsExpanded(false);
        }
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [query]);
  const handleClear = () => {
    setQuery('');
    inputRef.current?.focus();
  };
  return (
    <div
      ref={containerRef}
      className={`relative flex items-center transition-all duration-300 ease-in-out ${isExpanded ? 'w-64' : 'w-10'}`}>

      <div
        className={`absolute right-0 flex items-center h-10 rounded-full bg-white/10 border border-white/10 overflow-hidden transition-all duration-300 ${isExpanded ? 'w-full bg-white/20 border-white/30' : 'w-10 cursor-pointer hover:bg-white/20'}`}
        onClick={() => !isExpanded && setIsExpanded(true)}>

        <div className="flex items-center justify-center w-10 h-10 shrink-0 text-white/90">
          <Search className="h-5 w-5" />
        </div>

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search..."
          className={`w-full h-full bg-transparent border-none text-white placeholder-white/50 text-sm focus:ring-0 px-0 ${isExpanded ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} />


        {isExpanded && query &&
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleClear();
          }}
          className="flex items-center justify-center w-8 h-10 text-white/70 hover:text-white">

            <X className="h-4 w-4" />
          </button>
        }
      </div>
    </div>);

}