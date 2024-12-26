import React, { useCallback, useMemo } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { DEFAULT_CONFIG } from '../config';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function SearchInput({
  value,
  onChange,
  placeholder = 'Search...',
  disabled = false
}: SearchInputProps) {
  const debouncedOnChange = useDebouncedCallback(
    onChange,
    DEFAULT_CONFIG.debounceTimeout
  );

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitizedValue = e.target.value.trim();
    debouncedOnChange(sanitizedValue);
  }, [debouncedOnChange]);

  const inputId = useMemo(() => `search-input-${Math.random().toString(36).slice(2)}`, []);

  return (
    <div className="relative">
      <input
        id={inputId}
        type="search"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        aria-label={DEFAULT_CONFIG.accessibility.ariaLabels.searchInput}
      />
    </div>
  );
}