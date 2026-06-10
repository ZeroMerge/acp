import { useLocation } from 'react-router-dom';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

interface NavbarProps {
  onMenuToggle: () => void;
  isMenuOpen: boolean;
}

const pageTitles: Record<string, string> = {
  '/app/agents': 'My Agents',
  '/app/explorer': 'Agent Explorer',
  '/app/integrations': 'Integrations',
};

export default function Navbar({ onMenuToggle, isMenuOpen }: NavbarProps) {
  const location = useLocation();
  const title = pageTitles[location.pathname] ?? 'ACP Studio';

  return (
    <nav
      className="fixed top-0 right-0 left-0 h-[56px] flex items-center justify-between px-4 sm:px-6 z-40 border-b transition-all duration-200"
      style={{
        background: '#F6F8FA', // Primer background color
        borderColor: '#D0D7DE',
        marginLeft: '256px',
      }}
    >
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-1.5 rounded-md hover:bg-[#EAECEF] transition-colors text-[#57606A]"
        >
          {isMenuOpen ? (
            <XMarkIcon className="w-[18px] h-[18px]" />
          ) : (
            <Bars3Icon className="w-[18px] h-[18px]" />
          )}
        </button>
        <h1 className="text-[14px] font-semibold text-[#24292F]">{title}</h1>
      </div>

      <div className="flex items-center gap-3">
        <span
          className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-md text-[12px] font-medium border bg-[#FFFFFF] text-[#57606A]"
          style={{ borderColor: '#D0D7DE' }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#1A7F37] mr-1.5"></span>
          Sui Testnet
        </span>
      </div>

      {/* Mobile: full width */}
      <style>{`
        @media (max-width: 1023px) {
          nav[style*="margin-left: 256px"] {
            margin-left: 0 !important;
          }
        }
      `}</style>
    </nav>
  );
}