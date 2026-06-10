import { useNavigate } from 'react-router-dom';
import { ChevronRightIcon, CpuChipIcon } from '@heroicons/react/24/outline';
import type { AgentIdentityObject, PermissionCapsuleObject } from '../../types';
import { StatusBadge } from '../ui/Badge';
import { usePermissionCapsule } from '../../hooks/usePermissionCapsule';

interface AgentCardProps {
  agent: AgentIdentityObject;
  capsule?: PermissionCapsuleObject | null;
  readOnly?: boolean;
}

export default function AgentCard({ agent, capsule: propCapsule, readOnly = false }: AgentCardProps) {
  const navigate = useNavigate();
  const { capsule: fetchedCapsule } = usePermissionCapsule(agent.id, agent.owner);
  const capsule = propCapsule ?? fetchedCapsule;

  const status: 'active' | 'expired' | 'no_capsule' =
    !capsule ? 'no_capsule' : capsule.isExpired ? 'expired' : 'active';

  const permCount = capsule?.permissions?.length ?? 0;
  const shortId = `${agent.id.slice(0, 6)}…${agent.id.slice(-4)}`;

  return (
    <div
      onClick={() => !readOnly && navigate(`/app/agents/${agent.id}`)}
      className={`group flex flex-col justify-between rounded-xl p-6 transition-all duration-150 ${
        !readOnly ? 'cursor-pointer' : ''
      }`}
      style={{
        background: '#ffffff',
        border: '1px solid #d0d7de',
        boxShadow: '0 1px 3px rgba(31,35,40,0.06)',
      }}
      onMouseEnter={e => {
        if (!readOnly) {
          (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 12px rgba(31,35,40,0.1)';
          (e.currentTarget as HTMLDivElement).style.borderColor = '#0969da';
        }
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = '0 1px 3px rgba(31,35,40,0.06)';
        (e.currentTarget as HTMLDivElement).style.borderColor = '#d0d7de';
      }}
    >
      {/* Icon */}
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
        style={{ background: '#ddf4ff', border: '1px solid rgba(9,105,218,0.15)' }}
      >
        <CpuChipIcon className="w-5 h-5 text-[#0969da]" strokeWidth={1.5} />
      </div>

      {/* Title + status */}
      <div className="flex items-start justify-between gap-3 mb-2">
        <h3 className="text-[15px] font-semibold leading-snug" style={{ color: '#1f2328' }}>
          {agent.name || 'Unnamed Agent'}
        </h3>
        <StatusBadge status={status} />
      </div>

      {/* Meta */}
      <p className="text-[13px] mb-4" style={{ color: '#57606a' }}>
        <span className="font-mono">{shortId}</span>
        {permCount > 0 && (
          <span className="ml-2 px-2 py-0.5 rounded-full text-[11px] font-medium"
            style={{ background: '#f6f8fa', border: '1px solid #d0d7de', color: '#57606a' }}>
            {permCount} permission{permCount !== 1 ? 's' : ''}
          </span>
        )}
      </p>

      {/* Footer */}
      {!readOnly && (
        <div className="flex items-center justify-between mt-auto pt-4" style={{ borderTop: '1px solid #eaeef2' }}>
          <span className="text-[12px]" style={{ color: '#6e7781' }}>
            Epoch {agent.createdEpoch} · {agent.actionCount} run{agent.actionCount !== 1 ? 's' : ''}
          </span>
          <ChevronRightIcon
            className="w-4 h-4 transition-transform group-hover:translate-x-0.5"
            style={{ color: '#0969da' }}
            strokeWidth={2}
          />
        </div>
      )}
    </div>
  );
}