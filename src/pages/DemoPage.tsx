import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckIcon } from '@heroicons/react/24/outline';
import { useCurrentAccount, ConnectButton } from '@mysten/dapp-kit';
import Panel1Mint from '../components/demo/Panel1Mint';
import Panel2Capsule from '../components/demo/Panel2Capsule';
import Panel3Authorized from '../components/demo/Panel3Authorized';
import Panel4Rejection from '../components/demo/Panel4Rejection';

const STEPS = [
  { num: 1, label: 'Mint identity', title: '1. Mint Agent Identity' },
  { num: 2, label: 'Attach capsule', title: '2. Attach Permission Capsule' },
  { num: 3, label: 'Execute trade', title: '3. Authorized DeFi Execution' },
  { num: 4, label: 'Reject transfer', title: '4. Unauthorized Rejection' },
];

const STEP_EXPLAINERS: Record<number, { title: string; subtitle: string; bullets: string[] }> = {
  1: {
    title: 'On-Chain Agent Identity',
    subtitle: 'Every dapp agent in the ACP ecosystem requires a verified cryptographic root identity.',
    bullets: [
      'Deploys an AgentIdentity object to the Sui blockchain.',
      'Acts as the absolute root of ownership and permission delegation.',
      'Stores metadata like the agent name and operation counts directly on-chain.',
      'Tied securely to your parent wallet address, ensuring complete control.'
    ]
  },
  2: {
    title: 'Granular Permission Scoping',
    subtitle: 'Permission capsules dictate precisely what smart contracts an agent is authorized to call.',
    bullets: [
      'Attaches a PermissionCapsule to the agent identity.',
      'Restricts execution to specific function calls and contract addresses (whitelisting).',
      'Configures strict security boundaries: per-transaction limit, daily limit, and lifetime limits.',
      'Includes an automatic expiration epoch, after which all permissions immediately expire.'
    ]
  },
  3: {
    title: 'Autonomous execution',
    subtitle: 'The agent executes transactions autonomously, verified in real-time by the blockchain.',
    bullets: [
      'The agent calls the DeepBook adapter using its capsule ID.',
      'Sui validators verify that the capsule is active and has the required permissions.',
      'The daily and lifetime spend limits are charged and updated dynamically.',
      'Audit log tracks the action on-chain for auditing and compliance.'
    ]
  },
  4: {
    title: 'Move Runtime Protection',
    subtitle: 'Security is guaranteed at the virtual machine level, preventing rogue agent actions.',
    bullets: [
      'The agent attempts a transfer of assets — a capability not granted in its capsule.',
      'Sui Move runtime rejects the action at the type system level, aborting execution.',
      'Rejections are mathematical guarantees, not client-side software checks.',
      'Protects your parent wallet and locked funds from execution bugs or logic drift.'
    ]
  }
};

export default function DemoPage() {
  const currentAccount = useCurrentAccount();
  const [step, setStep] = useState(1);
  const [agentId, setAgentId] = useState('');
  const [capsuleId, setCapsuleId] = useState('');

  const handleMintComplete = useCallback((id: string) => {
    setAgentId(id);
    setStep(2);
  }, []);

  const handleCapsuleComplete = useCallback((id: string) => {
    setCapsuleId(id);
    setStep(3);
  }, []);

  const handleTradeComplete = useCallback(() => {
    setStep(4);
  }, []);

  const currentExplainer = STEP_EXPLAINERS[step];

  return (
    <div className="space-y-6 max-w-[1020px] mx-auto py-4">
      {/* Header */}
      <div>
        <h1 className="text-[20px] font-semibold text-[#1f2328]">ACP Lifecycle Demo</h1>
        <p className="text-[14px] mt-0.5 text-[#57606a]">
          Observe the on-chain security boundaries of the Agent Credential Protocol on Sui Testnet.
        </p>
      </div>

      {!currentAccount ? (
        <div
          className="flex flex-col items-center gap-5 text-center py-16 px-6 rounded-xl border"
          style={{ background: '#ffffff', borderColor: '#d0d7de', boxShadow: '0 1px 3px rgba(31,35,40,0.08)' }}
        >
          <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: '#ddf4ff' }}>
            <svg className="w-6 h-6 text-[#0969da]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          </div>
          <div>
            <h2 className="text-[16px] font-semibold text-[#1f2328]">Connect wallet to begin</h2>
            <p className="text-[14px] text-[#57606a] mt-1 max-w-[320px] mx-auto">
              You need a Sui Testnet wallet connected to mint identities, delegate permissions, and sign demo txs.
            </p>
          </div>
          <ConnectButton className="!rounded-md !h-9 !px-5 !text-[14px] !font-medium !bg-[#0969da] !text-white hover:!bg-[#0550ae]" />
        </div>
      ) : (
        /* Two column layout */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column - Explainer */}
          <div className="lg:col-span-5 space-y-5">
            <div
              className="p-6 rounded-xl border space-y-4"
              style={{ background: '#ffffff', borderColor: '#d0d7de', boxShadow: '0 1px 3px rgba(31,35,40,0.08)' }}
            >
              <span
                className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wider"
                style={{ background: '#ddf4ff', color: '#0969da' }}
              >
                On-Chain Step Explainer
              </span>
              <div className="space-y-2">
                <h3 className="text-[18px] font-bold text-[#1f2328] leading-tight">
                  {currentExplainer.title}
                </h3>
                <p className="text-[13px] leading-relaxed text-[#57606a]">
                  {currentExplainer.subtitle}
                </p>
              </div>

              <div className="h-px bg-[#eaeef2]" />

              <ul className="space-y-2.5">
                {currentExplainer.bullets.map((b, idx) => (
                  <li key={idx} className="flex gap-2.5 text-[13px] leading-relaxed text-[#57606a]">
                    <span className="text-[#0969da] shrink-0 mt-0.5">▪</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Hint Box */}
            <div className="p-4 rounded-lg border text-[12px] leading-relaxed" style={{ background: '#f6f8fa', borderColor: '#eaeef2', color: '#57606a' }}>
              <strong>Note:</strong> All transactions are executed live on Sui Testnet. Make sure your connected wallet has Testnet SUI.
            </div>
          </div>

          {/* Right Column - Steps Wizard + Form Panel */}
          <div className="lg:col-span-7 space-y-5">
            {/* Step progress */}
            <div
              className="flex items-center gap-0 p-1 rounded-lg w-full justify-between"
              style={{ background: '#ffffff', border: '1px solid #d0d7de', boxShadow: '0 1px 3px rgba(31,35,40,0.08)' }}
            >
              {STEPS.map((s, i) => {
                const active = step === s.num;
                const done = step > s.num;
                return (
                  <div key={s.num} className="flex items-center flex-1 justify-center">
                    <div
                      className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[12px] font-medium transition-all duration-200"
                      style={{
                        background: active ? '#0969da' : done ? '#dafbe1' : 'transparent',
                        color: active ? '#ffffff' : done ? '#1a7f37' : '#57606a',
                      }}
                    >
                      {done
                        ? <CheckIcon className="w-3.5 h-3.5 shrink-0" strokeWidth={2.5} />
                        : (
                          <span
                            className="w-4.5 h-4.5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0"
                            style={{
                              background: active ? 'rgba(255,255,255,0.25)' : '#eaeef2',
                              color: active ? '#fff' : '#6e7781',
                            }}
                          >
                            {s.num}
                          </span>
                        )
                      }
                      <span className="hidden sm:block">{s.label}</span>
                    </div>
                    {i < STEPS.length - 1 && (
                      <div className="flex-1 h-px mx-2" style={{ background: done ? '#1a7f37' : '#d0d7de' }} />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Main Interactive card */}
            <div>
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div key="p1" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}>
                    <Panel1Mint onComplete={handleMintComplete} />
                  </motion.div>
                )}
                {step === 2 && (
                  <motion.div key="p2" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}>
                    <Panel2Capsule agentId={agentId} onComplete={handleCapsuleComplete} />
                  </motion.div>
                )}
                {step === 3 && (
                  <motion.div key="p3" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}>
                    <Panel3Authorized capsuleId={capsuleId || agentId} onComplete={handleTradeComplete} />
                  </motion.div>
                )}
                {step === 4 && (
                  <motion.div key="p4" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
                    <Panel4Rejection capsuleId={capsuleId || agentId} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}