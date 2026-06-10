import { useState } from 'react';
import { useCurrentAccount, ConnectButton } from '@mysten/dapp-kit';
import {
  PlusIcon,
  CpuChipIcon,
  ShieldCheckIcon,
  DocumentMagnifyingGlassIcon,
  PuzzlePieceIcon,
  BoltIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';
import { useAgentIdentities } from '../hooks/useAgentIdentities';
import AgentCard from '../components/agent/AgentCard';
import MintAgentModal from '../components/agent/MintAgentModal';

const FEATURES = [
  {
    icon: CpuChipIcon,
    color: '#ddf4ff',
    iconColor: '#0969da',
    title: 'Credential-based identity',
    desc: 'Mint scoped on-chain identities for each agent. Every identity is verifiable, revocable, and tied to your wallet.',
  },
  {
    icon: ShieldCheckIcon,
    color: '#dafbe1',
    iconColor: '#1a7f37',
    title: 'Permission capsules',
    desc: 'Define exactly what each agent can do — swaps, lending, transfers — with granular spend limits and expiry.',
  },
  {
    icon: DocumentMagnifyingGlassIcon,
    color: '#fff8c5',
    iconColor: '#9a6700',
    title: 'Full audit trail',
    desc: 'Every action is recorded on-chain. Review complete execution history for transparency and compliance.',
  },
  {
    icon: PuzzlePieceIcon,
    color: '#ffebe9',
    iconColor: '#cf222e',
    title: 'Protocol integrations',
    desc: 'Connect agents to DeepBook, NAVI, Scallop and more via certified Move adapters — safely and verifiably.',
  },
  {
    icon: BoltIcon,
    color: '#f6f8fa',
    iconColor: '#57606a',
    title: 'Real-time execution',
    desc: 'Agents execute on Sui\'s sub-second finality. Monitor live permission checks and transaction status.',
  },
];

export default function CommandCenter() {
  const currentAccount = useCurrentAccount();
  const { agents, isLoading, refetch } = useAgentIdentities();
  const [showMintModal, setShowMintModal] = useState(false);

  /* ── No wallet connected: rich landing ── */
  if (!currentAccount) {
    return (
      <div className="space-y-12 py-4">
        {/* Hero */}
        <div className="text-center max-w-[600px] mx-auto">
          <p className="text-[12px] font-semibold uppercase tracking-[0.12em] mb-3" style={{ color: '#0969da' }}>
            Agent Credential Protocol · Sui Testnet
          </p>
          <h1 className="text-[32px] sm:text-[40px] font-bold leading-tight tracking-tight mb-4" style={{ color: '#1f2328' }}>
            Provision and certify<br className="hidden sm:block" /> autonomous agents on Sui
          </h1>
          <p className="text-[16px] leading-relaxed mb-8 mx-auto max-w-[480px]" style={{ color: '#57606a' }}>
            ACP Studio gives each agent a verified on-chain identity, scoped permissions, and a full audit trail — so you stay in control even when agents act autonomously.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <ConnectButton className="!h-10 !rounded-md !px-6 !text-[15px] !font-semibold !bg-[#0969da] !text-white hover:!bg-[#0550ae]" />
            <a
              href="/demo"
              className="inline-flex items-center gap-1.5 h-10 px-5 rounded-md text-[15px] font-medium border transition-colors hover:bg-[#f6f8fa]"
              style={{ borderColor: '#d0d7de', color: '#1f2328' }}
            >
              View demo
              <ArrowRightIcon className="w-4 h-4" strokeWidth={2} />
            </a>
          </div>
        </div>

        {/* Divider with label */}
        <div className="flex items-center gap-4">
          <div className="flex-1 h-px" style={{ background: '#eaeef2' }} />
          <span className="text-[12px] font-semibold uppercase tracking-wider" style={{ color: '#6e7781' }}>
            What ACP Studio does
          </span>
          <div className="flex-1 h-px" style={{ background: '#eaeef2' }} />
        </div>

        {/* Feature cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.slice(0, 3).map(({ icon: Icon, color, iconColor, title, desc }) => (
            <div
              key={title}
              className="rounded-xl p-6 flex flex-col"
              style={{ background: '#ffffff', border: '1px solid #d0d7de' }}
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center mb-5 shrink-0"
                style={{ background: color, border: `1px solid ${iconColor}22` }}
              >
                <Icon className="w-5 h-5" style={{ color: iconColor }} strokeWidth={1.5} />
              </div>
              <h3 className="text-[15px] font-semibold mb-2 leading-snug" style={{ color: '#1f2328' }}>
                {title}
              </h3>
              <p className="text-[13px] leading-relaxed flex-1" style={{ color: '#57606a' }}>
                {desc}
              </p>
            </div>
          ))}
        </div>

        {/* Second row: 2 cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {FEATURES.slice(3).map(({ icon: Icon, color, iconColor, title, desc }) => (
            <div
              key={title}
              className="rounded-xl p-6 flex flex-col"
              style={{ background: '#ffffff', border: '1px solid #d0d7de' }}
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center mb-5 shrink-0"
                style={{ background: color, border: `1px solid ${iconColor}22` }}
              >
                <Icon className="w-5 h-5" style={{ color: iconColor }} strokeWidth={1.5} />
              </div>
              <h3 className="text-[15px] font-semibold mb-2 leading-snug" style={{ color: '#1f2328' }}>
                {title}
              </h3>
              <p className="text-[13px] leading-relaxed flex-1" style={{ color: '#57606a' }}>
                {desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  /* ── Wallet connected: agents list ── */
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-[20px] font-semibold" style={{ color: '#1f2328' }}>My Agents</h1>
          <p className="text-[14px] mt-0.5" style={{ color: '#57606a' }}>
            {isLoading
              ? 'Loading…'
              : agents.length > 0
                ? `${agents.length} agent${agents.length !== 1 ? 's' : ''} · ${agents.reduce((s, a) => s + a.actionCount, 0)} total executions`
                : 'No agents provisioned yet'}
          </p>
        </div>
        <button
          onClick={() => setShowMintModal(true)}
          className="inline-flex items-center gap-1.5 px-4 py-[6px] rounded-md text-[14px] font-medium text-white transition-colors shrink-0"
          style={{ background: '#0969da', border: '1px solid rgba(31,35,40,0.15)' }}
          onMouseEnter={e => (e.currentTarget.style.background = '#0550ae')}
          onMouseLeave={e => (e.currentTarget.style.background = '#0969da')}
        >
          <PlusIcon className="w-4 h-4" strokeWidth={2.5} />
          Create agent
        </button>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="rounded-xl p-6 animate-pulse space-y-4"
              style={{ background: '#ffffff', border: '1px solid #d0d7de' }}>
              <div className="w-10 h-10 rounded-lg bg-[#eaeef2]" />
              <div className="space-y-2">
                <div className="h-4 rounded bg-[#eaeef2] w-2/5" />
                <div className="h-3 rounded bg-[#eaeef2] w-3/5" />
              </div>
            </div>
          ))}
        </div>
      ) : agents.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {agents.map(agent => <AgentCard key={agent.id} agent={agent} />)}
        </div>
      ) : (
        /* Empty state — feature-card style */
        <div className="rounded-xl border overflow-hidden" style={{ background: '#ffffff', borderColor: '#d0d7de' }}>
          {/* Top accent */}
          <div className="h-1 bg-gradient-to-r from-[#0969da] via-[#0969da] to-[#ddf4ff]" />
          <div className="flex flex-col sm:flex-row items-start gap-8 p-8">
            <div className="flex-1">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                style={{ background: '#ddf4ff', border: '1px solid rgba(9,105,218,0.15)' }}
              >
                <CpuChipIcon className="w-6 h-6 text-[#0969da]" strokeWidth={1.5} />
              </div>
              <h2 className="text-[18px] font-semibold mb-2" style={{ color: '#1f2328' }}>
                Provision your first agent
              </h2>
              <p className="text-[14px] leading-relaxed mb-6 max-w-[400px]" style={{ color: '#57606a' }}>
                Create an on-chain agent identity, attach a permission capsule with spend limits, and authorize it to interact with Sui DeFi protocols.
              </p>
              <button
                onClick={() => setShowMintModal(true)}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-md text-[14px] font-semibold text-white transition-colors"
                style={{ background: '#0969da' }}
                onMouseEnter={e => (e.currentTarget.style.background = '#0550ae')}
                onMouseLeave={e => (e.currentTarget.style.background = '#0969da')}
              >
                <PlusIcon className="w-4 h-4" strokeWidth={2.5} />
                Create first agent
              </button>
            </div>
            {/* Steps guide */}
            <div className="shrink-0 w-full sm:w-[220px] space-y-3">
              {[
                { n: '1', t: 'Mint identity', d: 'Deploy an on-chain agent object' },
                { n: '2', t: 'Attach capsule', d: 'Set permissions and spend limits' },
                { n: '3', t: 'Authorize', d: 'Agent acts within your defined bounds' },
              ].map(({ n, t, d }) => (
                <div key={n} className="flex items-start gap-3">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5"
                    style={{ background: '#ddf4ff', color: '#0969da', border: '1px solid rgba(9,105,218,0.2)' }}
                  >
                    {n}
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold" style={{ color: '#1f2328' }}>{t}</p>
                    <p className="text-[12px]" style={{ color: '#6e7781' }}>{d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Feature strip — shown when no agents */}
      {!isLoading && agents.length === 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-2">
          {FEATURES.slice(0, 3).map(({ icon: Icon, color, iconColor, title, desc }) => (
            <div
              key={title}
              className="rounded-xl p-4 flex gap-3"
              style={{ background: '#ffffff', border: '1px solid #d0d7de' }}
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                style={{ background: color }}
              >
                <Icon className="w-4 h-4" style={{ color: iconColor }} strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-[13px] font-semibold mb-0.5" style={{ color: '#1f2328' }}>{title}</p>
                <p className="text-[12px] leading-relaxed" style={{ color: '#6e7781' }}>{desc}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <MintAgentModal
        isOpen={showMintModal}
        onClose={() => setShowMintModal(false)}
        onSuccess={() => refetch()}
      />
    </div>
  );
}