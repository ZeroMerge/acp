import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCurrentAccount, useDisconnectWallet, ConnectButton } from '@mysten/dapp-kit';
import {
  CpuChipIcon,
  MagnifyingGlassIcon,
  Squares2X2Icon,
  PlayIcon,
  ArrowRightOnRectangleIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';
import acpIcon from '../../public/logo/acp_icon.png';
import AddressDisplay from '../ui/AddressDisplay';
import { useAgentIdentities } from '../../hooks/useAgentIdentities';
import MintAgentModal from '../agent/MintAgentModal';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const NAV_ITEMS = [
  { path: '/app/agents',       label: 'My Agents',    icon: CpuChipIcon },
  { path: '/app/explorer',     label: 'Explorer',     icon: MagnifyingGlassIcon },
  { path: '/app/integrations', label: 'Integrations', icon: Squares2X2Icon },
  { path: '/demo',             label: 'Demo',         icon: PlayIcon },
];

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const location = useLocation();
  const currentAccount = useCurrentAccount();
  const { mutate: disconnect } = useDisconnectWallet();
  const { agents, refetch } = useAgentIdentities();
  const [showMintModal, setShowMintModal] = useState(false);

  const isActive = (path: string) => {
    if (path === '/app/agents') return location.pathname.startsWith('/app/agents');
    return location.pathname === path;
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full z-50 flex flex-col bg-[#f6f8fa] border-r border-[#d0d7de] transition-transform duration-200 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ width: '256px' }}
      >
        {/* ── Logo ── */}
        <div className="flex items-center gap-2.5 px-4 h-[56px] border-b border-[#d0d7de] shrink-0">
          <img
            src={acpIcon}
            alt="ACP"
            className="w-7 h-7 object-contain shrink-0"
          />
          <span
            className="text-[15px] font-semibold tracking-tight"
            style={{ color: '#1f2328', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif' }}
          >
            ACP Studio
          </span>
        </div>

        {/* ── Navigation ── */}
        <nav className="flex-1 overflow-y-auto px-2 py-3 flex flex-col gap-4">

          {/* Platform section */}
          <div>
            <p className="px-2 mb-1 text-[11px] font-semibold uppercase tracking-widest text-[#57606a]">
              Platform
            </p>
            <div className="space-y-0.5">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={onClose}
                    className={`flex items-center gap-2 px-2 py-[6px] rounded-md text-[14px] transition-colors duration-100 ${
                      active
                        ? 'bg-[rgba(9,105,218,0.08)] text-[#0969da] font-semibold'
                        : 'text-[#1f2328] hover:bg-[#eaeef2]'
                    }`}
                  >
                    <Icon
                      className={`w-4 h-4 shrink-0 ${active ? 'text-[#0969da]' : 'text-[#57606a]'}`}
                      strokeWidth={active ? 2 : 1.5}
                    />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Live Agents section */}
          <div>
            <div className="flex items-center justify-between px-2 mb-1">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-[#57606a]">
                Live Agents
              </p>
              <button
                onClick={() => { setShowMintModal(true); onClose(); }}
                title="Create New Agent"
                className="w-5 h-5 rounded flex items-center justify-center text-[#57606a] hover:text-[#0969da] hover:bg-[#eaeef2] transition-colors"
              >
                <PlusIcon className="w-3.5 h-3.5" strokeWidth={2} />
              </button>
            </div>

            {agents.length > 0 ? (
              <div className="space-y-0.5">
                {agents.slice(0, 6).map((agent) => {
                  const active = location.pathname === `/app/agents/${agent.id}`;
                  return (
                    <Link
                      key={agent.id}
                      to={`/app/agents/${agent.id}`}
                      onClick={onClose}
                      className={`flex items-center gap-2 px-2 py-[5px] rounded-md text-[13px] transition-colors ${
                        active
                          ? 'bg-[rgba(9,105,218,0.08)] text-[#0969da] font-semibold'
                          : 'text-[#57606a] hover:bg-[#eaeef2] hover:text-[#1f2328]'
                      }`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full shrink-0 ${
                          active ? 'bg-[#0969da]' : 'bg-[#d0d7de]'
                        }`}
                      />
                      <span className="truncate">{agent.name || 'Unnamed Agent'}</span>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <p className="px-2 text-[12px] text-[#6e7781] italic">
                No active agents
              </p>
            )}
          </div>
        </nav>

        {/* ── Footer / Wallet ── */}
        <div className="p-3 border-t border-[#d0d7de] shrink-0">
          {currentAccount ? (
            <div className="flex flex-col gap-1.5">
              <div className="px-2 py-1.5 rounded-md bg-white border border-[#d0d7de]">
                <AddressDisplay address={currentAccount.address} chars={4} showLink={false} />
              </div>
              <button
                onClick={() => { disconnect(); onClose(); }}
                className="flex items-center justify-center gap-1.5 w-full py-[5px] px-3 rounded-md text-[13px] text-[#57606a] bg-[#f6f8fa] border border-[#d0d7de] hover:text-[#cf222e] hover:border-[#cf222e] hover:bg-[#ffebe9] transition-colors"
              >
                <ArrowRightOnRectangleIcon className="w-3.5 h-3.5" strokeWidth={2} />
                Disconnect
              </button>
            </div>
          ) : (
            <ConnectButton className="!w-full !rounded-md !h-8 !text-[13px] !font-medium !bg-[#0969da] !text-white hover:!bg-[#0550ae]" />
          )}
        </div>
      </aside>

      <MintAgentModal
        isOpen={showMintModal}
        onClose={() => setShowMintModal(false)}
        onSuccess={() => { refetch(); }}
      />
    </>
  );
}