// src/components/common/SearchableSelect.tsx
import React, { useState, useRef, useEffect } from 'react';

interface Option {
  value: string;
  label: string;
}

interface SearchableSelectProps {
  options: Option[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  maxSelections?: number;
  label?: string;
  error?: string;
  className?: string;
  disabled?: boolean; // Add disabled prop
}

const SearchableSelect: React.FC<SearchableSelectProps> = ({
  options,
  selectedValues,
  onChange,
  placeholder = 'Search...',
  maxSelections = Infinity,
  label,
  error,
  className = '',
  disabled = false, // Default to false
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState<Option[]>(options);
  const containerRef = useRef<HTMLDivElement>(null);

  // Filter options based on search query
  useEffect(() => {
    // Always show all options if search query is empty
    if (!searchQuery.trim()) {
      const available = options.filter(option => 
        !selectedValues.includes(option.value)
      );
      setFilteredOptions(available);
      return;
    }
    
    // Otherwise filter by search term
    const filtered = options.filter(option => 
      option.label.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !selectedValues.includes(option.value)
    );
    setFilteredOptions(filtered);
    
    // If we have results, make sure the dropdown is open
    if (filtered.length > 0) {
      setIsOpen(true);
    }
  }, [searchQuery, options, selectedValues]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle option selection
  const handleSelectOption = (value: string) => {
    if (disabled) return; // Prevent selection if disabled

    if (selectedValues.includes(value)) {
      onChange(selectedValues.filter(v => v !== value));
    } else if (selectedValues.length < maxSelections) {
      onChange([...selectedValues, value]);
    }
    setSearchQuery('');
    
    // Keep dropdown open after selection to allow for multiple selections
    // but focus back on the input
    setTimeout(() => {
      const input = containerRef.current?.querySelector('input');
      if (input) {
        input.focus();
      }
    }, 10);
  };

  // Remove a selected option
  const handleRemoveOption = (value: string) => {
    if (disabled) return; // Prevent removal if disabled
    onChange(selectedValues.filter(v => v !== value));
  };

  // Get option label by value
  const getOptionLabel = (value: string): string => {
    const option = options.find(opt => opt.value === value);
    return option ? option.label : value;
  };

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label} {maxSelections !== Infinity && <span className="text-gray-500">({selectedValues.length}/{maxSelections})</span>}
        </label>
      )}

      {/* Selected Tags Display */}
      <div className="flex flex-wrap gap-2 mb-2">
        {selectedValues.map(value => (
          <div
            key={value}
            className={`bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm flex items-center ${
              disabled ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <span>{getOptionLabel(value)}</span>
            {!disabled && (
              <button
                type="button"
                onClick={() => handleRemoveOption(value)}
                className="ml-1 text-blue-800 hover:text-blue-900"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          className={`w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-900 ${
            disabled ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          placeholder={selectedValues.length < maxSelections ? placeholder : `Maximum ${maxSelections} selections`}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => !disabled && setIsOpen(true)}
          onClick={() => !disabled && setIsOpen(true)}
          disabled={disabled || selectedValues.length >= maxSelections}
          style={{ color: '#1f2937' }} /* Ensure text is visible */
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
          <button 
            type="button"
            className="focus:outline-none"
            onClick={() => !disabled && setIsOpen(!isOpen)}
            disabled={disabled}
          >
            <svg
              className={`h-5 w-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''} ${
                disabled ? 'opacity-50' : ''
              }`}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Dropdown Options */}
      {isOpen && !disabled && (
        <div className="absolute z-50 mt-1 w-full rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 max-h-60 overflow-auto">
          <div className="py-1">
            {filteredOptions.length > 0 ? (
              filteredOptions.map(option => (
                <div
                  key={option.value}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-800"
                  onClick={() => handleSelectOption(option.value)}
                >
                  {option.label}
                </div>
              ))
            ) : (
              <div className="px-4 py-2 text-gray-500">
                {searchQuery.trim() ? 'No matching tags found' : 'Start typing to search for tags'}
              </div>
            )}
          </div>
          {filteredOptions.length > 0 && filteredOptions.length < options.length && (
            <div className="px-4 py-2 text-xs text-gray-500 border-t border-gray-100">
              {filteredOptions.length} of {options.length} tags match your search
            </div>
          )}
        </div>
      )}

      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default SearchableSelect;