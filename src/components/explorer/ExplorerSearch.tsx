import { useState } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface ExplorerSearchProps {
  onSearch: (query: string) => void;
  isLoading?: boolean;
}

export default function ExplorerSearch({ onSearch, isLoading }: ExplorerSearchProps) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !isLoading) {
      onSearch(query.trim());
    }
  };

  return (
    <div className="w-full max-w-[720px] mx-auto">
      <form onSubmit={handleSubmit} className="relative flex items-center">
        <MagnifyingGlassIcon className="absolute left-4 w-5 h-5 text-[var(--text-muted)] stroke-[2]" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by Agent ID (0x...) or Owner Address..."
          className="w-full h-14 pl-12 pr-28 border text-[14px] outline-none transition-colors focus:border-[var(--accent)]"
          style={{ background: 'var(--bg-input)', borderColor: 'var(--border-default)', color: 'var(--text-primary)' }}
        />
        <button
          type="submit"
          disabled={isLoading || !query.trim()}
          className="absolute right-2 h-10 px-5 border border-[var(--border-subtle)] text-[12px] font-sans font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-50 flex items-center justify-center bg-[var(--accent)]"
        >
          {isLoading ? (
            <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          ) : (
            'Search'
          )}
        </button>
      </form>
    </div>
  );
}