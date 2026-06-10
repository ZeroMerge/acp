import { useState } from 'react';
import { useSuiClient } from '@mysten/dapp-kit';
import {
  MagnifyingGlassIcon,
  ArrowPathIcon,
  CpuChipIcon,
  ShieldCheckIcon,
  DocumentMagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import { AGENT_IDENTITY_TYPE } from '../constants/package';
import AgentReadOnlyView from '../components/explorer/AgentReadOnlyView';
import AgentCard from '../components/agent/AgentCard';
import type { AgentIdentityObject } from '../types';

const TIPS = [
  { icon: CpuChipIcon,               color: '#ddf4ff', iconColor: '#0969da', text: 'Paste an agent object ID (0x…) to inspect its identity and mandate' },
  { icon: ShieldCheckIcon,            color: '#dafbe1', iconColor: '#1a7f37', text: 'Search by owner address to see all agents belonging to that wallet' },
  { icon: DocumentMagnifyingGlassIcon, color: '#fff8c5', iconColor: '#9a6700', text: 'View live permissions, spend meters, and full action audit logs' },
];

export default function ExplorerPage() {
  const client = useSuiClient();
  const [query, setQuery] = useState('');
  const [searchResult, setSearchResult] = useState<AgentIdentityObject | null>(null);
  const [searchResults, setSearchResults] = useState<AgentIdentityObject[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (q = query) => {
    if (!q.trim()) return;
    setIsLoading(true); setHasSearched(true);
    setSearchResult(null); setSearchResults(null);
    try {
      if (q.startsWith('0x')) {
        if (q.length > 42) {
          const obj = await client.getObject({ id: q, options: { showContent: true } });
          if (obj.data?.type?.includes('AgentIdentity')) {
            const f = (obj.data.content as any)?.fields;
            setSearchResult({ id: obj.data.objectId, owner: f?.owner ?? '', name: Array.isArray(f?.name) ? new TextDecoder().decode(new Uint8Array(f.name)) : f?.name ?? '', createdEpoch: Number(f?.created_epoch ?? 0), actionCount: Number(f?.action_count ?? 0) });
          } else { await fetchByAddress(q); }
        } else { await fetchByAddress(q); }
      }
    } catch { } finally { setIsLoading(false); }
  };

  const fetchByAddress = async (address: string) => {
    const result = await client.getOwnedObjects({ owner: address, filter: { StructType: AGENT_IDENTITY_TYPE }, options: { showContent: true } });
    const agents = result.data.map(obj => {
      const f = (obj.data?.content as any)?.fields;
      return { id: obj.data?.objectId ?? '', owner: f?.owner ?? '', name: Array.isArray(f?.name) ? new TextDecoder().decode(new Uint8Array(f.name)) : f?.name ?? '', createdEpoch: Number(f?.created_epoch ?? 0), actionCount: Number(f?.action_count ?? 0) };
    });
    if (agents.length === 1) setSearchResult(agents[0]);
    else if (agents.length > 1) setSearchResults(agents);
  };

  const handleReset = () => { setSearchResult(null); setSearchResults(null); setHasSearched(false); setQuery(''); };

  if (searchResult) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[20px] font-semibold" style={{ color: '#1f2328' }}>Agent audit view</h1>
            <p className="text-[14px] mt-0.5" style={{ color: '#57606a' }}>Read-only inspection of identity and permissions.</p>
          </div>
          <button onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-3 py-[5px] rounded-md text-[13px] font-medium border transition-colors hover:bg-[#eaeef2]"
            style={{ background: '#f6f8fa', borderColor: '#d0d7de', color: '#57606a' }}>
            <ArrowPathIcon className="w-3.5 h-3.5" strokeWidth={2} />
            New search
          </button>
        </div>
        <AgentReadOnlyView agent={searchResult} />
      </div>
    );
  }

  return (
    <div className="space-y-8">

      {/* Hero search section */}
      <div
        className="rounded-xl overflow-hidden"
        style={{ background: '#ffffff', border: '1px solid #d0d7de' }}
      >
        {/* Blue accent bar */}
        <div className="h-1 bg-gradient-to-r from-[#0969da] to-[#ddf4ff]" />

        <div className="px-6 sm:px-10 py-10 text-center">
          <div
            className="w-12 h-12 rounded-full mx-auto mb-5 flex items-center justify-center"
            style={{ background: '#ddf4ff', border: '1px solid rgba(9,105,218,0.15)' }}
          >
            <MagnifyingGlassIcon className="w-6 h-6 text-[#0969da]" strokeWidth={1.5} />
          </div>
          <h1 className="text-[22px] font-bold mb-2" style={{ color: '#1f2328' }}>
            Audit any agent on Sui
          </h1>
          <p className="text-[14px] mb-7 max-w-[400px] mx-auto leading-relaxed" style={{ color: '#57606a' }}>
            Search by agent Object ID or owner address to inspect permissions, spend limits, and execution history.
          </p>

          {/* Search input */}
          <div className="flex flex-col sm:flex-row gap-2 max-w-[560px] mx-auto">
            <div className="relative flex-1">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#6e7781' }} strokeWidth={2} />
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSearch()}
                placeholder="0x… object ID or address"
                className="w-full pl-9 pr-4 h-10 rounded-md text-[14px] outline-none transition-all"
                style={{ background: '#f6f8fa', border: '1px solid #d0d7de', color: '#1f2328' }}
                onFocus={e => { e.currentTarget.style.background = '#ffffff'; e.currentTarget.style.borderColor = '#0969da'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(9,105,218,0.3)'; }}
                onBlur={e => { e.currentTarget.style.background = '#f6f8fa'; e.currentTarget.style.borderColor = '#d0d7de'; e.currentTarget.style.boxShadow = 'none'; }}
              />
            </div>
            <button
              onClick={() => handleSearch()}
              disabled={isLoading || !query.trim()}
              className="px-6 h-10 rounded-md text-[14px] font-medium text-white transition-colors disabled:opacity-50 shrink-0"
              style={{ background: '#0969da', border: '1px solid rgba(31,35,40,0.15)' }}
              onMouseEnter={e => { if (!(e.currentTarget as HTMLButtonElement).disabled) (e.currentTarget as HTMLButtonElement).style.background = '#0550ae'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = '#0969da'; }}
            >
              {isLoading ? 'Searching…' : 'Search'}
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      {searchResults && searchResults.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-[13px] font-semibold" style={{ color: '#57606a' }}>
              {searchResults.length} agent{searchResults.length !== 1 ? 's' : ''} found
            </p>
            <button onClick={handleReset} className="text-[13px] font-medium" style={{ color: '#0969da' }}>Clear</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {searchResults.map(agent => <AgentCard key={agent.id} agent={agent} readOnly />)}
          </div>
        </div>
      )}

      {/* No results */}
      {hasSearched && !searchResult && (!searchResults || !searchResults.length) && !isLoading && (
        <div className="text-center py-12 rounded-xl border px-6"
          style={{ background: '#ffffff', borderColor: '#d0d7de' }}>
          <p className="text-[15px] font-semibold mb-1.5" style={{ color: '#1f2328' }}>No agents found</p>
          <p className="text-[14px] mb-5" style={{ color: '#57606a' }}>No ACP agent identities match that query on Sui Testnet.</p>
          <button onClick={handleReset}
            className="px-4 py-[6px] rounded-md text-[14px] font-medium border transition-colors hover:bg-[#eaeef2]"
            style={{ background: '#f6f8fa', borderColor: '#d0d7de', color: '#57606a' }}>
            Try again
          </button>
        </div>
      )}

      {/* What you can look up — tip cards */}
      {!hasSearched && (
        <div className="space-y-3">
          <p className="text-[12px] font-semibold uppercase tracking-wider" style={{ color: '#6e7781' }}>What you can inspect</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {TIPS.map(({ icon: Icon, color, iconColor, text }) => (
              <div key={text} className="flex items-start gap-3 rounded-xl p-4"
                style={{ background: '#ffffff', border: '1px solid #d0d7de' }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                  style={{ background: color }}>
                  <Icon className="w-4 h-4" style={{ color: iconColor }} strokeWidth={1.5} />
                </div>
                <p className="text-[13px] leading-relaxed" style={{ color: '#57606a' }}>{text}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}