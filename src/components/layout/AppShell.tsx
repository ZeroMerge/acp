import { Outlet, useLocation, Link } from 'react-router-dom';
import { useCurrentAccount, ConnectButton, useDisconnectWallet } from '@mysten/dapp-kit';
import {
  CpuChipIcon,
  MagnifyingGlassIcon,
  Squares2X2Icon,
  PlayIcon,
  WifiIcon,
} from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import acpFullLogo from '../../public/logo/acp_full_logo.png';
import acpIcon from '../../public/logo/acp_icon.png';
import AddressDisplay from '../ui/AddressDisplay';

const NAV_ITEMS = [
  { path: '/app/agents',       label: 'My Agents',    icon: CpuChipIcon },
  { path: '/app/explorer',     label: 'Explorer',     icon: MagnifyingGlassIcon },
  { path: '/app/integrations', label: 'Integrations', icon: Squares2X2Icon },
  { path: '/demo',             label: 'Demo',         icon: PlayIcon },
];

function WalletRequiredOverlay() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div
        className="flex flex-col items-center gap-5 text-center max-w-[360px] w-full px-8 py-12 rounded-xl"
        style={{ background: '#ffffff', border: '1px solid #d0d7de', boxShadow: '0 1px 3px rgba(31,35,40,0.12)' }}
      >
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center"
          style={{ background: '#ddf4ff', border: '1px solid rgba(9,105,218,0.15)' }}
        >
          <WifiIcon className="w-7 h-7 text-[#0969da]" strokeWidth={1.5} />
        </div>
        <div>
          <h2 className="text-[18px] font-semibold mb-2" style={{ color: '#1f2328' }}>Connect your wallet</h2>
          <p className="text-[14px] leading-relaxed" style={{ color: '#57606a' }}>
            ACP Studio requires a Sui wallet to manage your autonomous agents.
          </p>
        </div>
        <ConnectButton className="!w-full !rounded-md !h-9 !text-[14px] !font-medium !bg-[#0969da] !text-white hover:!bg-[#0550ae]" />
      </div>
    </div>
  );
}

export default function AppShell() {
  const currentAccount = useCurrentAccount();
  const { mutate: disconnect } = useDisconnectWallet();
  const location = useLocation();
  const [walletMenuOpen, setWalletMenuOpen] = useState(false);

  useEffect(() => { setWalletMenuOpen(false); }, [location.pathname]);

  const isWalletRequired = location.pathname.startsWith('/app/agents');
  const needsWallet = isWalletRequired && !currentAccount;

  const isActive = (path: string) => {
    if (path === '/app/agents') return location.pathname.startsWith('/app/agents');
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen" style={{ background: '#f6f8fa', color: '#1f2328' }}>

      {/* ══════════════════════════════════════
          TOP HEADER  (all breakpoints)
      ══════════════════════════════════════ */}
      <header
        className="fixed top-0 left-0 right-0 z-40 border-b"
        style={{ background: '#ffffff', borderColor: '#d0d7de' }}
      >
        {/* Header bar */}
        <div className="h-[56px] flex items-center justify-between px-5 sm:px-8">
          {/* Logo */}
          <Link to="/app/agents" className="flex items-center shrink-0">
            {/* Full logo on sm+ */}
            <img
              src={acpFullLogo}
              alt="Agent Credential Protocol"
              className="hidden sm:block h-[22px] w-auto object-contain"
            />
            {/* Icon only on mobile */}
            <img
              src={acpIcon}
              alt="ACP"
              className="block sm:hidden h-7 w-7 object-contain"
            />
          </Link>

          {/* Right side: network badge + wallet */}
          <div className="flex items-center gap-2.5">
            <span
              className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-[4px] rounded-full text-[12px] font-medium border"
              style={{ background: '#dafbe1', color: '#1a7f37', borderColor: 'rgba(26,127,55,0.2)' }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#1a7f37] animate-pulse" />
              Testnet
            </span>

            {currentAccount ? (
              <div className="relative">
                <button
                  onClick={() => setWalletMenuOpen(v => !v)}
                  className="flex items-center gap-2 px-2.5 py-[5px] rounded-md border text-[13px] transition-colors hover:bg-[#f6f8fa]"
                  style={{ background: '#ffffff', borderColor: '#d0d7de', color: '#1f2328' }}
                >
                  <span className="w-2 h-2 rounded-full bg-[#1a7f37]" />
                  <AddressDisplay address={currentAccount.address} chars={4} showLink={false} showCopy={false} />
                </button>
                {walletMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setWalletMenuOpen(false)} />
                    <div
                      className="absolute right-0 top-full mt-1.5 w-36 rounded-lg border py-1 z-50"
                      style={{ background: '#ffffff', borderColor: '#d0d7de', boxShadow: '0 8px 24px rgba(140,149,159,0.2)' }}
                    >
                      <button
                        onClick={() => { disconnect(); setWalletMenuOpen(false); }}
                        className="w-full text-left px-3 py-2 text-[13px] transition-colors hover:bg-[#f6f8fa]"
                        style={{ color: '#cf222e' }}
                      >
                        Disconnect
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <ConnectButton className="!h-8 !rounded-md !px-3 !text-[13px] !font-medium !bg-[#0969da] !text-white hover:!bg-[#0550ae]" />
            )}
          </div>
        </div>

        {/* ── Desktop / Tablet underline tab bar (sm+) ── */}
        <nav
          className="hidden sm:flex items-center px-5 sm:px-8 border-t"
          style={{ borderColor: '#eaeef2' }}
        >
          {NAV_ITEMS.map(({ path, label, icon: Icon }) => {
            const active = isActive(path);
            return (
              <Link
                key={path}
                to={path}
                className="flex items-center gap-1.5 px-3 py-2.5 text-[14px] font-medium border-b-2 transition-colors -mb-px mr-1"
                style={{
                  color: active ? '#1f2328' : '#57606a',
                  borderBottomColor: active ? '#0969da' : 'transparent',
                }}
                onMouseEnter={e => { if (!active) (e.currentTarget as HTMLAnchorElement).style.color = '#1f2328'; }}
                onMouseLeave={e => { if (!active) (e.currentTarget as HTMLAnchorElement).style.color = '#57606a'; }}
              >
                <Icon className="w-4 h-4 shrink-0" strokeWidth={active ? 2 : 1.5} />
                {label}
              </Link>
            );
          })}
        </nav>
      </header>

      {/* ══════════════════════════════════════
          MAIN CONTENT
          Mobile: pt-[56px] (header only)
          Desktop: pt-[56px+44px=100px] (header + tab bar)
      ══════════════════════════════════════ */}
      <main
        className="pb-[100px] sm:pb-10 pt-[56px] sm:pt-[100px]"
      >
        <div className="w-full max-w-[960px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {needsWallet ? <WalletRequiredOverlay /> : <Outlet />}
        </div>
      </main>

      {/* ══════════════════════════════════════
          MOBILE ONLY — Floating pill bottom nav
          Active = blue pill with icon + label
          Inactive = icon only
      ══════════════════════════════════════ */}
      <nav
        className="sm:hidden fixed bottom-5 left-1/2 -translate-x-1/2 z-40 flex items-center gap-1 rounded-full px-1.5 py-1.5 border"
        style={{
          background: '#ffffff',
          borderColor: '#d0d7de',
          boxShadow: '0 4px 20px rgba(31,35,40,0.15)',
        }}
      >
        {NAV_ITEMS.map(({ path, label, icon: Icon }) => {
          const active = isActive(path);
          return (
            <Link
              key={path}
              to={path}
              className="flex items-center gap-1.5 rounded-full transition-all duration-200"
              style={{
                background: active ? '#0969da' : 'transparent',
                color:      active ? '#ffffff'  : '#6e7781',
                padding:    active ? '7px 14px 7px 10px' : '8px 10px',
              }}
            >
              <Icon className="w-[18px] h-[18px] shrink-0" strokeWidth={active ? 2 : 1.5} />
              {active && (
                <span className="text-[13px] font-semibold leading-none whitespace-nowrap">
                  {label}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}