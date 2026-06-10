import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';
import type { IntegrationConfig } from '../../types';
import { StatusBadge, PermissionBadge } from '../ui/Badge';

interface IntegrationCardProps {
  integration: IntegrationConfig;
}

export default function IntegrationCard({ integration }: IntegrationCardProps) {
  const [showAdapter, setShowAdapter] = useState(false);

  const adapterCode = `// ${integration.name} ACP Adapter
module ${integration.name.toLowerCase().replace(/\s/g, '_')}_adapter {
  use acp::permission_capsule::{Self, PermissionCapsule};

  public fun execute(
    capsule: &PermissionCapsule,
    ctx: &mut TxContext
  ) {
    permission_capsule::verify_permission(
      capsule, ${integration.permissions[0] ?? 6}
    );
    // protocol-specific action
  }
}`;

  return (
    <>
      <div
        className="group flex flex-col justify-between rounded-xl p-6 transition-all duration-150"
        style={{ background: '#ffffff', border: '1px solid #d0d7de', boxShadow: '0 1px 3px rgba(31,35,40,0.06)' }}
        onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 12px rgba(31,35,40,0.1)'; (e.currentTarget as HTMLDivElement).style.borderColor = '#0969da'; }}
        onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = '0 1px 3px rgba(31,35,40,0.06)'; (e.currentTarget as HTMLDivElement).style.borderColor = '#d0d7de'; }}
      >
        {/* Icon + status */}
        <div className="flex items-start justify-between mb-4">
          <span
            className="w-10 h-10 rounded-lg flex items-center justify-center text-[15px] font-bold text-white shrink-0"
            style={{ background: integration.color || '#0969da' }}
          >
            {integration.name.charAt(0)}
          </span>
          <StatusBadge status={integration.status} />
        </div>

        {/* Name + description */}
        <h3 className="text-[15px] font-semibold mb-2 leading-snug" style={{ color: '#1f2328' }}>
          {integration.name}
        </h3>
        <p className="text-[13px] leading-relaxed mb-4" style={{ color: '#57606a' }}>
          {integration.description}
        </p>

        {/* Permission badges */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {integration.permissions.map(perm => (
            <PermissionBadge key={perm} type={perm} />
          ))}
        </div>

        {/* Footer */}
        <div className="pt-4 mt-auto" style={{ borderTop: '1px solid #eaeef2' }}>
          <button
            onClick={() => setShowAdapter(true)}
            className="text-[13px] font-medium transition-colors"
            style={{ color: '#0969da' }}
            onMouseEnter={e => (e.currentTarget.style.textDecoration = 'underline')}
            onMouseLeave={e => (e.currentTarget.style.textDecoration = 'none')}
          >
            View adapter pattern →
          </button>
        </div>
      </div>

      {/* Adapter modal */}
      <AnimatePresence>
        {showAdapter && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(31,35,40,0.5)' }}
            onClick={() => setShowAdapter(false)}
          >
            <motion.div
              initial={{ scale: 0.97, y: 6 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.97 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-[680px] overflow-hidden rounded-xl"
              style={{ background: '#ffffff', border: '1px solid #d0d7de', boxShadow: '0 1px 3px rgba(31,35,40,0.12), 0 8px 24px rgba(66,74,83,0.12)' }}
            >
              <div className="flex items-center justify-between px-5 py-4"
                style={{ borderBottom: '1px solid #d0d7de', background: '#f6f8fa' }}>
                <div>
                  <h3 className="text-[15px] font-semibold" style={{ color: '#1f2328' }}>{integration.name} adapter</h3>
                  <p className="text-[12px] mt-0.5" style={{ color: '#57606a' }}>Move entrypoint for ACP agent interactions</p>
                </div>
                <button onClick={() => setShowAdapter(false)}
                  className="w-7 h-7 rounded-md flex items-center justify-center transition-colors hover:bg-[#eaeef2]"
                  style={{ color: '#6e7781' }}>
                  <XMarkIcon className="w-4 h-4" strokeWidth={2} />
                </button>
              </div>
              <pre className="p-5 text-[13px] font-mono leading-relaxed overflow-x-auto"
                style={{ background: '#0d1117', color: '#e6edf3' }}>
                <code>{adapterCode}</code>
              </pre>
              <div className="flex justify-end px-5 py-3" style={{ borderTop: '1px solid #d0d7de', background: '#f6f8fa' }}>
                <button onClick={() => setShowAdapter(false)}
                  className="px-4 py-[5px] rounded-md text-[13px] font-medium border transition-colors hover:bg-[#eaeef2]"
                  style={{ background: '#f6f8fa', borderColor: '#d0d7de', color: '#1f2328' }}>
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}