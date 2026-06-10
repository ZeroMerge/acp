import { BookOpenIcon, BeakerIcon, Squares2X2Icon } from '@heroicons/react/24/outline';
import { INTEGRATIONS } from '../data/integrations';
import IntegrationCard from '../components/integrations/IntegrationCard';

export default function IntegrationsPage() {
  const liveCount = INTEGRATIONS.filter(i => i.status === 'live').length;
  const comingSoonCount = INTEGRATIONS.length - liveCount;

  return (
    <div className="space-y-8">

      {/* Hero card */}
      <div
        className="rounded-xl overflow-hidden"
        style={{ background: '#ffffff', border: '1px solid #d0d7de' }}
      >
        <div className="h-1 bg-gradient-to-r from-[#0969da] to-[#ddf4ff]" />
        <div className="px-6 sm:px-10 py-8 flex flex-col sm:flex-row sm:items-center gap-6">
          <div className="flex-1">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
              style={{ background: '#ddf4ff', border: '1px solid rgba(9,105,218,0.15)' }}
            >
              <Squares2X2Icon className="w-6 h-6 text-[#0969da]" strokeWidth={1.5} />
            </div>
            <h1 className="text-[22px] font-bold mb-2" style={{ color: '#1f2328' }}>
              Protocol Integration Directory
            </h1>
            <p className="text-[14px] leading-relaxed mb-5 max-w-[480px]" style={{ color: '#57606a' }}>
              Certified Move adapters that let ACP agents interact with Sui DeFi protocols within defined permission boundaries.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-medium border"
                style={{ background: '#dafbe1', color: '#1a7f37', borderColor: 'rgba(26,127,55,0.25)' }}>
                <span className="w-1.5 h-1.5 rounded-full bg-[#1a7f37]" />
                {liveCount} live
              </span>
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[12px] font-medium border"
                style={{ background: '#f6f8fa', color: '#57606a', borderColor: '#d0d7de' }}>
                {comingSoonCount} coming soon
              </span>
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[12px] font-medium border"
                style={{ background: '#ddf4ff', color: '#0969da', borderColor: 'rgba(9,105,218,0.2)' }}>
                8 permission types
              </span>
            </div>
          </div>

          {/* Developer CTA */}
          <div
            className="shrink-0 rounded-xl p-5 w-full sm:w-[240px]"
            style={{ background: '#f6f8fa', border: '1px solid #d0d7de' }}
          >
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center mb-3"
              style={{ background: '#ffffff', border: '1px solid #d0d7de' }}
            >
              <BeakerIcon className="w-4 h-4 text-[#57606a]" strokeWidth={1.5} />
            </div>
            <p className="text-[13px] font-semibold mb-1" style={{ color: '#1f2328' }}>Building on Sui?</p>
            <p className="text-[12px] leading-relaxed mb-4" style={{ color: '#57606a' }}>
              Integrate the ACP adapter pattern to allow certified agents to interact with your protocol.
            </p>
            <div className="flex flex-col gap-2">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 px-3 py-[6px] rounded-md text-[13px] font-medium text-white transition-colors"
                style={{ background: '#0969da' }}
                onMouseEnter={e => ((e.currentTarget as HTMLAnchorElement).style.background = '#0550ae')}
                onMouseLeave={e => ((e.currentTarget as HTMLAnchorElement).style.background = '#0969da')}
              >
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
                View on GitHub
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 px-3 py-[6px] rounded-md text-[13px] font-medium border transition-colors hover:bg-[#eaeef2]"
                style={{ background: '#ffffff', borderColor: '#d0d7de', color: '#1f2328' }}
              >
                <BookOpenIcon className="w-3.5 h-3.5" strokeWidth={1.5} />
                Read docs
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Integration grid */}
      <div>
        <p className="text-[12px] font-semibold uppercase tracking-wider mb-3" style={{ color: '#6e7781' }}>
          Available adapters
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {INTEGRATIONS.map(integration => (
            <IntegrationCard key={integration.name} integration={integration} />
          ))}
        </div>
      </div>
    </div>
  );
}