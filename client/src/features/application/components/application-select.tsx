"use client"

import * as React from "react"
import { Check, ChevronDown, Search, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface ApplicationSelectProps {
  className?: string;
  values: string[];
  placeholder: string;
  value?: string;
  onChange?: (value: string) => void;
}

export function ApplicationSelect({ 
  className, 
  values, 
  placeholder, 
  value: valueProp, 
  onChange 
}: ApplicationSelectProps) {
  const [search, setSearch] = React.useState("");
  const [isOpen, setIsOpen] = React.useState(false);
  const [highlightedIndex, setHighlightedIndex] = React.useState(-1);
  
  const containerRef = React.useRef<HTMLDivElement>(null);
  const searchInputRef = React.useRef<HTMLInputElement>(null);
  const itemsRef = React.useRef<(HTMLDivElement | null)[]>([]);

  // Stable reference to values to prevent unnecessary re-filtering
  const stableValues = React.useMemo(() => values, [values.join(',')]);

  // Filter values based on search - show ALL results
  const displayedValues = React.useMemo(() => {
    if (!search.trim()) return stableValues;
    const searchLower = search.toLowerCase();
    return stableValues.filter(value => 
      value.toLowerCase().includes(searchLower)
    );
  }, [stableValues, search]);

  // Handle value selection
  const handleSelect = React.useCallback((selectedValue: string) => {
    if (onChange) {
      onChange(selectedValue === valueProp ? "" : selectedValue);
    }
    setIsOpen(false);
    setSearch("");
    setHighlightedIndex(-1);
  }, [onChange, valueProp]);

  // Handle opening/closing
  const handleToggle = React.useCallback(() => {
    setIsOpen(prev => {
      const newOpen = !prev;
      if (newOpen) {
        // Focus search input when opening
        setTimeout(() => searchInputRef.current?.focus(), 10);
      } else {
        setSearch("");
        setHighlightedIndex(-1);
      }
      return newOpen;
    });
  }, []);

  // Handle search input changes
  const handleSearchChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newSearch = e.target.value;
    setSearch(newSearch);
    setHighlightedIndex(-1);
    
    // Keep dropdown open when searching
    if (!isOpen) {
      setIsOpen(true);
    }
  }, [isOpen]);

  // Handle keyboard navigation
  const handleKeyDown = React.useCallback((e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault();
        setIsOpen(true);
        setTimeout(() => searchInputRef.current?.focus(), 10);
      }
      return;
    }

    switch (e.key) {
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        setSearch("");
        setHighlightedIndex(-1);
        break;
      
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < displayedValues.length - 1 ? prev + 1 : 0
        );
        break;
      
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev > 0 ? prev - 1 : displayedValues.length - 1
        );
        break;
      
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && displayedValues[highlightedIndex]) {
          handleSelect(displayedValues[highlightedIndex]);
        }
        break;
    }
  }, [isOpen, displayedValues, highlightedIndex, handleSelect]);

  // Handle clicks outside to close dropdown
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearch("");
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Scroll highlighted item into view
  React.useEffect(() => {
    if (highlightedIndex >= 0 && itemsRef.current[highlightedIndex]) {
      itemsRef.current[highlightedIndex]?.scrollIntoView({
        block: 'nearest',
        behavior: 'smooth'
      });
    }
  }, [highlightedIndex]);

  // Clear search when value changes externally
  React.useEffect(() => {
    if (valueProp && !isOpen) {
      setSearch("");
    }
  }, [valueProp, isOpen]);

  const displayValue = valueProp || "";
  const showPlaceholder = !displayValue;

  return (
    <div className={cn("relative", className)} ref={containerRef}>
      {/* Trigger */}
      <div
        className="flex justify-between items-center bg-[#F9F9FB] hover:bg-[#F9F9FB] shadow-none p-4 md:p-6 border-none rounded-2xl focus:ring-0 w-full h-auto font-semibold text-black text-xs md:text-base cursor-pointer"
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span className={cn(
          showPlaceholder && "text-gray-500"
        )}>
          {showPlaceholder ? `Select ${placeholder}` : displayValue}
        </span>
        <div className="flex items-center gap-2">
          {displayValue && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (onChange) onChange("");
              }}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <ChevronDown className={cn(
            "w-4 h-4 transition-transform duration-200",
            isOpen && "rotate-180"
          )} />
        </div>
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="top-full right-0 left-0 z-50 absolute bg-[#F9F9FB] shadow-lg mt-1 border-none rounded-[16px] overflow-hidden">
          {/* Search Input */}
          <div className="top-0 z-10 sticky bg-[#F9F9FB] p-3 border-b">
            <div className="relative">
              <Search className="top-1/2 left-3 absolute w-4 h-4 text-[#696E75] -translate-y-1/2 transform" />
              <input
                ref={searchInputRef}
                type="text"
                className="bg-transparent py-2 pr-3 pl-10 border-0 rounded-lg outline-none w-full font-mont placeholder:text-[#696E75] text-sm transition-colors"
                placeholder={`Search ${placeholder}...`}
                value={search}
                onChange={handleSearchChange}
                onKeyDown={handleKeyDown}
                autoComplete="off"
                autoCorrect="off"
                spellCheck="false"
              />
            </div>
          </div>

          {/* Results */}
          <div className="max-h-[250px] overflow-y-auto" role="listbox">
            {displayedValues.length === 0 ? (
              <div className="p-4 font-mont text-[#696E75] text-sm text-center">
                No {placeholder.toLowerCase()} found.
              </div>
            ) : (
              displayedValues.map((value, index) => (
                <div
                  key={value}
                  ref={el => { itemsRef.current[index] = el; }}
                  role="option"
                  aria-selected={value === valueProp}
                  className={cn(
                    "relative flex items-center px-8 py-2 outline-none w-full font-mont text-sm transition-colors cursor-pointer",
                    "hover:bg-gray-100 focus:bg-gray-100",
                    index === highlightedIndex && "bg-gray-100",
                    value === valueProp && "bg-blue-50"
                  )}
                  onClick={() => handleSelect(value)}
                  onMouseEnter={() => setHighlightedIndex(index)}
                >
                  <span className="left-2 absolute flex justify-center items-center w-3.5 h-3.5">
                    {value === valueProp && <Check className="w-4 h-4 text-blue-600" />}
                  </span>
                  <span>{value}</span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}