import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, PlusIcon, PencilIcon } from '@heroicons/react/24/outline';
import { useAgentIdentities } from '../hooks/useAgentIdentities';
import { usePermissionCapsule } from '../hooks/usePermissionCapsule';
import { useAgentHistory } from '../hooks/useAgentHistory';
import { StatusBadge, PermissionBadge } from '../components/ui/Badge';
import AddressDisplay from '../components/ui/AddressDisplay';
import CountdownTimer from '../components/ui/CountdownTimer';
import CapsuleVisualizer from '../components/capsule/CapsuleVisualizer';
import AttachCapsuleModal from '../components/capsule/AttachCapsuleModal';
import RevokeButton from '../components/capsule/RevokeButton';
import DelegationTree from '../components/agent/DelegationTree';
import { formatRelativeTime, suiscanTxUrl } from '../lib/utils';

type TabId = 'passport' | 'mandate' | 'protocols' | 'audit' | 'delegation';

const PANEL = { background: '#ffffff', border: '1px solid #d0d7de', borderRadius: '6px', boxShadow: '0 1px 0 rgba(31,35,40,0.04)' };

export default function AgentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { agents, refetch: refetchAgents } = useAgentIdentities();
  const agent = agents.find(a => a.id === id);
  const { capsule, hasCapsule, refetch: refetchCapsule } = usePermissionCapsule(agent?.id ?? '');
  const { events, isLoading: eventsLoading } = useAgentHistory(agent?.id ?? '');
  const [showAttachModal, setShowAttachModal] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>('passport');

  if (!agent) {
    return (
      <div className="flex flex-col items-center justify-center py-20 rounded-md border px-6 text-center"
        style={{ background: '#ffffff', borderColor: '#d0d7de' }}>
        <p className="text-[16px] font-semibold mb-4" style={{ color: '#1f2328' }}>Agent not found</p>
        <button onClick={() => navigate('/app/agents')}
          className="inline-flex items-center gap-2 px-4 py-[6px] rounded-md text-[14px] font-medium text-white"
          style={{ background: '#0969da' }}>
          <ArrowLeftIcon className="w-4 h-4" />
          Back to My Agents
        </button>
      </div>
    );
  }

  const status: 'active' | 'expired' | 'no_capsule' = !capsule ? 'no_capsule' : capsule.isExpired ? 'expired' : 'active';
  const hasDelegate = capsule?.permissions.includes(7) ?? false;

  const tabs = [
    { id: 'passport',   label: 'Passport' },
    { id: 'mandate',    label: 'Mandate' },
    { id: 'protocols',  label: 'Protocols' },
    { id: 'audit',      label: 'Audit log' },
    ...(hasDelegate ? [{ id: 'delegation', label: 'Delegation' }] : []),
  ] as const;

  const renderTabContent = () => {
    switch (activeTab) {

      case 'passport':
        return (
          <div style={PANEL}>
            <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid #eaeef2' }}>
              <span className="text-[14px] font-semibold" style={{ color: '#1f2328' }}>Identity</span>
              <StatusBadge status={status} />
            </div>
            <div className="divide-y divide-[#eaeef2]">
              {[
                { label: 'Agent name',      value: agent.name || 'Unnamed Agent',      mono: false },
                { label: 'Object ID',       value: <AddressDisplay address={agent.id} chars={8} />, mono: false },
                { label: 'Owner',           value: <AddressDisplay address={agent.owner} chars={8} />, mono: false },
                { label: 'Created epoch',   value: agent.createdEpoch,                  mono: true },
                { label: 'Execution count', value: `${agent.actionCount} action(s)`,    mono: true },
              ].map(({ label, value, mono }, idx) => (
                <div key={label} className="flex items-center justify-between px-5 py-3"
                  style={{ background: idx % 2 === 0 ? '#ffffff' : '#f6f8fa' }}>
                  <span className="text-[13px]" style={{ color: '#57606a' }}>{label}</span>
                  <span className={`text-[13px] font-medium ${mono ? 'font-mono' : ''}`} style={{ color: '#1f2328' }}>
                    {value as any}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );

      case 'mandate':
        return (
          <div style={PANEL}>
            <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid #eaeef2' }}>
              <span className="text-[14px] font-semibold" style={{ color: '#1f2328' }}>Permission Mandate</span>
              {capsule && <CountdownTimer expiryEpoch={capsule.expiryEpoch} />}
            </div>
            {hasCapsule && capsule ? (
              <div className="p-5 space-y-5">
                <CapsuleVisualizer capsule={capsule} />
                <div className="flex items-center justify-end gap-2 pt-4" style={{ borderTop: '1px solid #eaeef2' }}>
                  <button onClick={() => setShowAttachModal(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-[5px] rounded-md text-[13px] font-medium transition-colors"
                    style={{ background: '#f6f8fa', border: '1px solid #d0d7de', color: '#57606a' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#eaeef2'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = '#f6f8fa'; }}>
                    <PencilIcon className="w-3.5 h-3.5" strokeWidth={2} />
                    Update
                  </button>
                  <RevokeButton capsuleId={capsule.id} onSuccess={() => { refetchCapsule(); refetchAgents(); setActiveTab('passport'); }} />
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center py-14 px-6 text-center">
                <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
                  style={{ background: '#ddf4ff', border: '1px solid rgba(9,105,218,0.2)' }}>
                  <svg className="w-6 h-6" style={{ color: '#0969da' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                </div>
                <p className="text-[14px] mb-5" style={{ color: '#57606a' }}>No active permission capsule attached.</p>
                <button onClick={() => setShowAttachModal(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-[6px] rounded-md text-[14px] font-medium text-white"
                  style={{ background: '#0969da' }}>
                  <PlusIcon className="w-4 h-4" strokeWidth={2.5} />
                  Attach capsule
                </button>
              </div>
            )}
          </div>
        );

      case 'protocols': {
        const whitelist = capsule?.protocolWhitelist ?? [];
        return (
          <div style={PANEL}>
            <div className="px-5 py-4" style={{ borderBottom: '1px solid #eaeef2' }}>
              <span className="text-[14px] font-semibold" style={{ color: '#1f2328' }}>Authorized Protocols</span>
            </div>
            {whitelist.length > 0 ? (
              <div className="divide-y divide-[#eaeef2]">
                {whitelist.map((addr, idx) => {
                  const isDeepBook = addr.toLowerCase().includes('deepbook') || addr.length === 66;
                  const isNavi = addr.toLowerCase().includes('navi');
                  const name = isDeepBook ? 'DeepBook v3' : isNavi ? 'NAVI Protocol' : 'Contract Endpoint';
                  return (
                    <div key={addr} className="flex items-center justify-between px-5 py-3"
                      style={{ background: idx % 2 === 0 ? '#ffffff' : '#f6f8fa' }}>
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-md flex items-center justify-center text-[12px] font-bold text-white shrink-0"
                          style={{ background: isDeepBook ? '#0969da' : isNavi ? '#6639ba' : '#57606a' }}>
                          {name[0]}
                        </div>
                        <div>
                          <p className="text-[13px] font-semibold" style={{ color: '#1f2328' }}>{name}</p>
                          <AddressDisplay address={addr} chars={6} showCopy={false} showLink={true}
                            className="!text-[#57606a]" />
                        </div>
                      </div>
                      <span className="inline-flex items-center gap-1 px-2 py-[2px] rounded-full text-[11px] font-medium border"
                        style={{ background: '#dafbe1', color: '#1a7f37', borderColor: 'rgba(26,127,55,0.25)' }}>
                        ✓ Allowed
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="px-5 py-10 text-center text-[13px]" style={{ color: '#57606a' }}>
                No whitelisted protocols configured.
              </p>
            )}
          </div>
        );
      }

      case 'audit':
        return (
          <div style={PANEL}>
            <div className="px-5 py-4" style={{ borderBottom: '1px solid #eaeef2' }}>
              <span className="text-[14px] font-semibold" style={{ color: '#1f2328' }}>Action Audit Log</span>
            </div>
            {eventsLoading ? (
              <div className="p-5 space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-14 rounded-md animate-pulse" style={{ background: '#f6f8fa', border: '1px solid #eaeef2' }} />
                ))}
              </div>
            ) : events.length > 0 ? (
              <div className="divide-y divide-[#eaeef2]">
                {events.map((event, idx) => (
                  <div key={event.id} className="flex items-center justify-between px-5 py-3"
                    style={{ background: idx % 2 === 0 ? '#ffffff' : '#f6f8fa' }}>
                    <div className="flex items-center gap-3">
                      <PermissionBadge type={Number(event.data?.permission_type ?? 0)} active />
                      <a href={suiscanTxUrl(event.txDigest)} target="_blank" rel="noopener noreferrer"
                        className="font-mono text-[12px] font-medium hover:underline" style={{ color: '#0969da' }}>
                        {event.txDigest.slice(0, 12)}…
                      </a>
                    </div>
                    <span className="text-[12px]" style={{ color: '#6e7781' }}>
                      {formatRelativeTime(event.timestampMs)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="px-5 py-10 text-center text-[13px]" style={{ color: '#57606a' }}>
                No actions recorded yet.
              </p>
            )}
          </div>
        );

      case 'delegation':
        return (
          <div style={PANEL}>
            <div className="px-5 py-4" style={{ borderBottom: '1px solid #eaeef2' }}>
              <span className="text-[14px] font-semibold" style={{ color: '#1f2328' }}>Delegation Tree</span>
            </div>
            <div className="p-5"><DelegationTree agentId={agent.id} /></div>
          </div>
        );

      default: return null;
    }
  };

  return (
    <div className="space-y-5 pb-16">
      {/* Back nav */}
      <button onClick={() => navigate('/app/agents')}
        className="inline-flex items-center gap-1.5 text-[13px] font-medium transition-colors"
        style={{ color: '#57606a' }}
        onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.color = '#0969da')}
        onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.color = '#57606a')}>
        <ArrowLeftIcon className="w-3.5 h-3.5" strokeWidth={2} />
        Back to My Agents
      </button>

      {/* GitHub-style underline tab nav */}
      <div style={{ borderBottom: '1px solid #d0d7de' }}>
        <nav className="flex items-center gap-0 -mb-px">
          {tabs.map(tab => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabId)}
                className="px-4 py-2.5 text-[14px] font-medium transition-colors border-b-2"
                style={{
                  color: active ? '#1f2328' : '#57606a',
                  borderBottomColor: active ? '#0969da' : 'transparent',
                  background: 'transparent',
                }}
                onMouseEnter={e => { if (!active) (e.currentTarget as HTMLButtonElement).style.color = '#1f2328'; }}
                onMouseLeave={e => { if (!active) (e.currentTarget as HTMLButtonElement).style.color = '#57606a'; }}
              >
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {renderTabContent()}

      {showAttachModal && (
        <AttachCapsuleModal
          isOpen={showAttachModal}
          onClose={() => setShowAttachModal(false)}
          agentId={agent.id}
          onSuccess={() => { refetchCapsule(); setShowAttachModal(false); setActiveTab('mandate'); }}
        />
      )}
    </div>
  );
}