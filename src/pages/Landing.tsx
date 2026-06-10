import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  CubeIcon,
  CommandLineIcon,
  RectangleGroupIcon,
} from '@heroicons/react/24/outline';
import GlassBackground from '../components/ui/GlassBackground';
import VSCodeRejection from '../components/demo/Demo';

// --- INLINE LOGO COMPONENTS ---
const SuiLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 29 36" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" clipRule="evenodd" d="M22.5363 15.0142L22.5357 15.0158C24.0044 16.8574 24.8821 19.1898 24.8821 21.7268C24.8821 24.3014 23.9781 26.6655 22.4698 28.5196L22.3399 28.6792L22.3055 28.4763C22.2762 28.3038 22.2418 28.1296 22.2018 27.954C21.447 24.6374 18.9876 21.7934 14.9397 19.4907C12.2063 17.9399 10.6417 16.0727 10.2309 13.9511C9.96558 12.5792 10.1628 11.2012 10.544 10.0209C10.9251 8.84103 11.4919 7.85247 11.9735 7.2573L11.9738 7.25692L13.5484 5.3315C13.8246 4.99384 14.3413 4.99384 14.6175 5.3315L22.5363 15.0142ZM25.0269 13.0906L25.0272 13.0898L14.4731 0.184802C14.2715 -0.0616007 13.8943 -0.0616009 13.6928 0.184802L3.1385 13.09L3.13878 13.0907L3.10444 13.1333C1.16226 15.5434 0 18.6061 0 21.9402C0 29.7051 6.30498 36 14.0829 36C21.8608 36 28.1658 29.7051 28.1658 21.9402C28.1658 18.6062 27.0035 15.5434 25.0614 13.1333L25.0269 13.0906ZM5.66381 14.9727L5.66423 14.9721L6.60825 13.8178L6.63678 14.0309C6.65938 14.1997 6.68678 14.3694 6.71928 14.5398C7.33009 17.7446 9.51208 20.4169 13.1602 22.4865C16.3312 24.2912 18.1775 26.3666 18.7095 28.6427C18.9314 29.5926 18.971 30.5272 18.8749 31.3443L18.8689 31.3948L18.8232 31.4172C17.3919 32.1164 15.783 32.5088 14.0826 32.5088C8.11832 32.5088 3.28308 27.6817 3.28308 21.7268C3.28308 19.1701 4.17443 16.8208 5.66381 14.9727Z" fill="currentColor"/>
  </svg>
);

const NaviLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 1500 1000" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <g clipPath="url(#clip0_1746_81)">
      <path d="M1500 640.8V970C1500 986.6 1486.6 1000 1470 1000H1271C1258.6 1000 1246.6 996.2 1236.5 989.1L577.999 525.401C554.699 507.801 499.999 512.801 499.999 566.5V970C499.999 986.6 486.599 1000 469.999 1000H29.9998C13.3998 1000 -0.000154495 986.6 -0.000154495 970V530.001C-0.000154495 513.401 13.3998 500.001 29.9998 500.001H299.999C362.799 500.001 399.999 459.601 399.999 400.001V50.0012C399.999 33.4012 413.399 20.0012 429.999 20.0012H628.599C642.999 20.0012 653.399 23.9012 663.599 31.3012L1483 608.1C1495.4 616.8 1500 626.6 1500 640.8Z" fill="currentColor"/>
      <path d="M1500 29.9999V459.799C1500 477.399 1483 486.399 1468.5 476.199L1017.2 158.4C1006.4 150.9 999.999 142.5 999.999 125.5V29.9999C999.999 13.3999 1013.4 -6.10352e-05 1030 -6.10352e-05H1470C1486.6 -6.10352e-05 1500 13.3999 1500 29.9999Z" fill="currentColor"/>
    </g>
    <defs>
      <clipPath id="clip0_1746_81">
        <rect width="1500" height="1000" fill="white"/>
      </clipPath>
    </defs>
  </svg>
);

const DeepBookLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 40 25" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M0 0.835938H30.4007C35.9974 0.835938 40.5343 5.3729 40.5343 10.9695V10.9695H0V0.835938Z" fill="currentColor"/>
    <path d="M0 23.5312H30.4007C35.9974 23.5312 40.5343 18.9943 40.5343 13.3977V13.3977H0V23.5312Z" fill="currentColor"/>
  </svg>
);

export default function Landing() {
  const phrases = [
    { prefix: "on ", name: "Sui", logo: SuiLogo },
    { prefix: "with ", name: "DeepBook", logo: DeepBookLogo },
    { prefix: "with ", name: "NAVI", logo: NaviLogo },
  ];
  
  const [text, setText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(80);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const handleTyping = () => {
      const current = loopNum % phrases.length;
      const fullText = phrases[current].prefix + phrases[current].name;

      setText(isDeleting 
        ? fullText.substring(0, text.length - 1) 
        : fullText.substring(0, text.length + 1)
      );

      if (!isDeleting && text === fullText) {
        timer = setTimeout(() => setIsDeleting(true), 2500);
        setTypingSpeed(40);
      } else if (isDeleting && text === '') {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
        setTypingSpeed(80);
      } else {
        timer = setTimeout(handleTyping, typingSpeed);
      }
    };

    timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [text, isDeleting, loopNum, typingSpeed, phrases]);

  const currentPhrase = phrases[loopNum % phrases.length];
  const isTypingName = text.length > currentPhrase.prefix.length;
  const typedPrefix = text.substring(0, currentPhrase.prefix.length);
  const typedName = text.substring(currentPhrase.prefix.length);
  const CurrentLogo = currentPhrase.logo;

  return (
    <div className="min-h-screen relative text-[var(--text-primary)] selection:bg-[var(--accent)] selection:text-white font-display bg-transparent flex flex-col pt-[64px]">
      
      {/* SLOT 1: CUSTOM LIQUID GLASS BACKGROUND */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <GlassBackground
          style={{ position: 'absolute', inset: 0 }}
          blurPx={18}
          colors={{
            canvas: 'rgba(15, 23, 42, 0.08)',
            blob1: 'rgba(96, 165, 250, 0.14)',
            blob2: 'rgba(129, 140, 248, 0.12)',
            blob3: 'rgba(56, 189, 248, 0.12)',
            panelFill: 'rgba(255, 255, 255, 0.12)',
            panelEdge: 'rgba(255, 255, 255, 0.22)',
            panelHighlight: 'rgba(255, 255, 255, 0.3)',
          }}
        />
      </div>

      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 h-[64px] z-50 bg-[var(--bg-base)]/80 backdrop-blur-xl border-b border-[var(--border-subtle)]">
        <div className="max-w-[1280px] mx-auto h-full px-8 flex items-center justify-between border-x border-[var(--border-subtle)]">
          <div className="flex items-center gap-3">
            <CubeIcon className="w-6 h-6 text-[var(--accent)]" />
            <span className="text-[16px] font-bold tracking-wider uppercase">ACP Studio</span>
          </div>
          <div className="flex items-center gap-6">
            <Link
              to="/app/agents"
              className="inline-flex items-center px-6 py-2.5 text-[13px] font-bold text-white bg-[var(--accent)] hover:opacity-90 transition-opacity rounded-none"
            >
              Launch App
            </Link>
          </div>
        </div>
      </nav>

      {/* =========================================
          SECTION 1: HERO (GRID ON)
      ========================================= */}
      <section className="max-w-[1280px] w-full mx-auto border-x border-b border-[var(--border-subtle)] pt-[120px] pb-[160px] md:pt-[160px] md:pb-[240px] px-8 flex flex-col justify-center">
        <div className="max-w-[960px]">
          
          <h1 className="text-[36px] sm:text-[48px] md:text-[64px] lg:text-[72px] font-bold leading-[1.05] tracking-[-0.02em] mb-8">
            Authorization infrastructure for autonomous agents{' '}
            <span className="text-[var(--accent)]">
              {typedPrefix}
              {isTypingName && (
                <span className="inline-block align-middle mx-[0.15em] -translate-y-[0.05em]">
                  <CurrentLogo className="h-[0.7em] w-auto" />
                </span>
              )}
              <span className="whitespace-nowrap">
                {typedName}
                <span className="animate-pulse">_</span>
              </span>
            </span>
          </h1>
          
          <p className="text-[16px] md:text-[20px] leading-relaxed text-[var(--text-secondary)] mb-12 max-w-[640px]">
            ACP provisions verifiable cryptographic credentials and memory-bounded permission capsules natively enforced by the Move type system.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link
              to="/app/agents"
              className="w-full sm:w-auto inline-flex items-center justify-center h-14 px-10 text-[14px] font-bold uppercase tracking-widest text-white bg-[var(--accent)] hover:opacity-90 transition-opacity rounded-none"
            >
              Launch App
            </Link>
            
            <div className="flex items-center w-full sm:w-auto gap-2">
              <a
                href="https://mirror.xyz"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-none inline-flex items-center justify-center h-14 px-8 border border-[var(--border-default)] text-[14px] font-bold uppercase tracking-widest text-[var(--text-primary)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors rounded-none bg-transparent"
              >
                View Whitepaper
              </a>
              
              <a 
                href="https://github.com/your-repo" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-14 h-14 flex items-center justify-center border border-[var(--border-default)] text-[var(--text-secondary)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors bg-transparent shrink-0 rounded-none"
              >
                <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>

              <a 
                href="https://suiscan.xyz" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-14 h-14 flex items-center justify-center border border-[var(--border-default)] text-[var(--text-secondary)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors bg-transparent shrink-0 rounded-none"
              >
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter">
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 12 2 12 2C12 2 17.5228 6.47715 22 12 22Z" />
                  <path d="M12 16C14.2091 16 16 14.2091 16 12C16 9.79086 12 6 12 6C12 6 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================
          SECTION 2: BREATHING SPACE (GRID CUT OFF)
      ========================================= */}
      <section className="w-full flex flex-col items-center justify-center pt-[140px] px-8 border-b border-[var(--border-subtle)] relative">
        <h2 className="text-[32px] md:text-[40px] font-bold mb-4 text-center max-w-[800px]">
          Extend agents with your own tools
        </h2>
        <p className="text-[16px] text-[var(--text-secondary)] text-center max-w-[600px] mb-20">
          Your MCP servers, plugins, and skills all come together so you spend less time configuring and more time shipping.
        </p>

        <div className="w-full max-w-[1280px] h-[100px] relative flex items-end justify-center">
          <span className="text-[var(--text-muted)] font-mono text-[12px] mb-4">
            [ 3D Isometric Cubes Mount Here ]
          </span>
        </div>
      </section>

      {/* =========================================
          SECTION 3: FEATURES MATRIX (GRID RESUMES)
      ========================================= */}
      <section className="max-w-[1280px] w-full mx-auto grid grid-cols-1 md:grid-cols-3 border-x border-b border-[var(--border-subtle)] bg-[var(--bg-base)]/40 backdrop-blur-sm">
        {[
          {
            icon: CubeIcon,
            title: 'Identity Layer',
            description: 'Every agent receives an isolated, verifiable onchain passport bound to a unique immutable object ID.',
          },
          {
            icon: CommandLineIcon,
            title: 'Permission Capsule',
            description: 'A non-copyable resource mapping explicitly scoped actions, spend boundaries, and contract whitelists.',
          },
          {
            icon: RectangleGroupIcon,
            title: 'Subset Delegation',
            description: 'Authorizes automated downward delegation chains limited strictly to logical subsets of the parent token.',
          },
        ].map(({ icon: Icon, title, description }, i) => (
          <div
            key={title}
            className={`p-12 flex flex-col items-start ${
              i !== 2 ? 'border-b md:border-b-0 md:border-r border-[var(--border-subtle)]' : ''
            }`}
          >
            <Icon className="w-8 h-8 text-[var(--text-primary)] mb-8 stroke-[1.5]" />
            <h3 className="text-[22px] font-bold tracking-tight mb-4">{title}</h3>
            <p className="text-[15px] leading-relaxed text-[var(--text-secondary)]">
              {description}
            </p>
          </div>
        ))}
      </section>

      {/* =========================================
          SECTION 4: DEMO STAGE (GRID ON, FULL WIDTH FLUSH)
      ========================================= */}
      <section className="max-w-[1280px] w-full mx-auto border-x border-b border-[var(--border-subtle)] bg-[var(--bg-base)] flex flex-col pt-[120px]">
        
        <div className="w-full text-center px-8 mb-12">
          <h3 className="text-[14px] md:text-[15px] font-bold tracking-[0.2em] uppercase text-[var(--accent)]">
            Enforced at sui compiler level to protect agents from going rogue
          </h3>
        </div>

        <div className="w-full relative px-6 md:px-12 lg:px-24">
          <VSCodeRejection />
        </div>

      </section>

      {/* =========================================
          SECTION 5: FOOTER (GRID ON)
      ========================================= */}
      <footer className="max-w-[1280px] w-full mx-auto mt-auto border-x border-[var(--border-subtle)]">
        <div className="h-[120px]"></div>
      </footer>

    </div>
  );
}