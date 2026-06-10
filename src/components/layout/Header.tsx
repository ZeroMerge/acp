import { useLocation } from 'react-router-dom';
import { useCurrentAccount, useDisconnectWallet, ConnectButton } from '@mysten/dapp-kit';
import { Bars3Icon } from '@heroicons/react/24/outline';
import AddressDisplay from '../ui/AddressDisplay';

interface HeaderProps {
  onOpenSidebar: () => void;
}

const pageTitles: Record<string, string> = {
  '/app/agents':       'My Agents',
  '/app/explorer':     'Explorer',
  '/app/integrations': 'Integrations',
};

export default function Header({ onOpenSidebar }: HeaderProps) {
  const location = useLocation();
  const currentAccount = useCurrentAccount();
  const { mutate: disconnect } = useDisconnectWallet();

  let title = 'ACP Studio';
  if (location.pathname.startsWith('/app/agents/')) {
    title = 'Agent Details';
  } else {
    title = pageTitles[location.pathname] ?? 'ACP Studio';
  }

  return (
    <header
      className="fixed top-0 left-0 right-0 h-[56px] z-40 flex items-center justify-between px-4 sm:px-6 border-b"
      style={{ background: '#ffffff', borderColor: '#d0d7de' }}
    >
      {/* Left — hamburger + title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenSidebar}
          className="lg:hidden p-1.5 rounded-md text-[#57606a] hover:bg-[#f6f8fa] hover:text-[#1f2328] transition-colors"
          aria-label="Open sidebar"
        >
          <Bars3Icon className="w-5 h-5" strokeWidth={2} />
        </button>
        <h1
          className="text-[14px] font-semibold"
          style={{ color: '#1f2328' }}
        >
          {title}
        </h1>
      </div>

      {/* Right — network + wallet */}
      <div className="flex items-center gap-2">
        {/* Network pill */}
        <span
          className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-medium border"
          style={{ background: '#dafbe1', color: '#1a7f37', borderColor: 'rgba(26,127,55,0.2)' }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#1a7f37] animate-pulse" />
          Testnet
        </span>

        {/* Wallet chip */}
        {currentAccount ? (
          <div
            className="flex items-center gap-2 px-2.5 py-1 rounded-md border text-[13px]"
            style={{ background: '#f6f8fa', borderColor: '#d0d7de' }}
          >
            <AddressDisplay
              address={currentAccount.address}
              chars={4}
              showLink={false}
              showCopy={false}
            />
            <button
              onClick={() => disconnect()}
              className="text-[12px] text-[#6e7781] hover:text-[#cf222e] transition-colors leading-none"
              title="Disconnect"
            >
              ×
            </button>
          </div>
        ) : (
          <ConnectButton className="!h-8 !rounded-md !px-3 !text-[13px] !font-medium !bg-[#0969da] !text-white hover:!bg-[#0550ae]" />
        )}
      </div>
    </header>
  );
}
