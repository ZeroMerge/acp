/**
 * Demo.tsx
 *
 * Dependencies:
 * npm install @tabler/icons-react
 *
 * Google Fonts (add to your index.html <head>):
 * <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet">
 */

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import type {
  CSSProperties,
  ReactNode,
} from "react";
import {
  IconFiles,
  IconSearch,
  IconGitBranch,
  IconSettings,
  IconChevronDown,
  IconFolder,
  IconFileCode,
  IconFile,
  IconCheck,
  IconClock,
  IconLoader,
  IconShieldCheck,
  IconBolt,
  IconPackage,
  IconX,
} from "@tabler/icons-react";

// ─── Types ──────────────────────────────────────────────────────────────────

type HlType = "green" | "red" | "blue" | "";

type PillState = "idle" | "run" | "ok" | "err";

interface PillInfo {
  state: PillState;
  label: string;
  icon: "package" | "loader" | "check" | "shield-check" | "bolt" | "x";
}

interface Run2Info {
  badge: string;
  badgeCls: "red" | "";
  color: string;
  icon: "clock" | "x";
}

interface LogLine {
  id: number;
  text: string;
  cls: string;
  partial?: boolean;
}

interface GutterInfo {
  dot: boolean;
  color: string;
}

interface DemoProps {
  onPhaseChange?: (phase: string) => void;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const FONT_UI   = "'DM Sans', sans-serif";
const FONT_MONO = "'IBM Plex Mono', monospace";

const w = (ms: number): Promise<void> =>
  new Promise((r) => setTimeout(r, ms));

// ─── Inline keyframes (injected once) ────────────────────────────────────────

const GLOBAL_STYLES = `
  @keyframes b1    { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(35px,25px) scale(1.05)} }
  @keyframes b2    { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(-30px,35px) scale(0.95)} }
  @keyframes b3    { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(25px,-30px) scale(1.08)} }
  @keyframes b4    { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(-20px,20px) scale(0.97)} }
  
  @keyframes vsc-pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
  @keyframes vsc-blink { 0%,100%{opacity:1} 50%{opacity:0} }
  @keyframes vsc-spin  { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }

  /* The subtle directional light sheen that travels around the glass border */
  @keyframes glass-shimmer {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }

  .vsc-blob1 { animation: b1 12s ease-in-out infinite; }
  .vsc-blob2 { animation: b2 15s ease-in-out infinite; }
  .vsc-blob3 { animation: b3 10s ease-in-out infinite; }
  .vsc-blob4 { animation: b4 13s ease-in-out infinite; }
  .vsc-pulse { animation: vsc-pulse 1s infinite; }
  .vsc-spin  { animation: vsc-spin  1s linear  infinite; }
  .vsc-cursor {
    display: inline-block;
    width: 6px; height: 12px;
    background: #64748b;
    vertical-align: middle;
    margin-left: 1px;
    animation: vsc-blink 0.65s step-start infinite;
  }

  /* Layer 2: The Liquid Glass Frame with moving gradient border */
  .glass-frame {
    position: relative;
    padding: 16px;
    border-radius: 28px;
    background: rgba(255, 255, 255, 0.45);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    box-shadow: inset 0 0 0 1px rgba(255,255,255,0.2), 0 8px 32px rgba(0, 0, 0, 0.05);
  }
  
  .glass-frame::before {
    content: "";
    position: absolute;
    inset: -1px;
    border-radius: 29px; /* Outer Radius = Inner Radius (12) + Padding (16) + Border (1) */
    padding: 1px;
    background: linear-gradient(120deg, rgba(255,255,255,0.9), rgba(255,255,255,0.1), rgba(255,255,255,0.9));
    background-size: 200% 200%;
    animation: glass-shimmer 4s ease infinite;
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    pointer-events: none;
  }

  /* Responsive Constraints to Prevent Mobile Clipping */
  @media (max-width: 800px) {
    .vsc-sidebar     { display: none !important; }
    .vsc-activity    { display: none !important; }
    .vsc-code-half   { display: none !important; }
    .vsc-split       { grid-template-columns: 1fr !important; }
  }

  @media (max-width: 640px) {
    .layer-4         { padding: 24px 12px !important; }
    .glass-frame     { padding: 8px !important; border-radius: 20px !important; }
    .glass-frame::before { border-radius: 21px !important; }
    .mac-window      { height: 450px !important; border-radius: 12px !important; }
  }
`;

// ─── Code lines (static JSX) ─────────────────────────────────────────────────

interface CodeLine {
  id: string;
  ln: number;
  html: ReactNode;
  hasGutter?: boolean;
}

const kw  = (t: string) => <span style={{ color: "#af00db" }}>{t}</span>;
const ty  = (t: string) => <span style={{ color: "#267f99" }}>{t}</span>;
const fn  = (t: string) => <span style={{ color: "#795e26" }}>{t}</span>;
const nu  = (t: string) => <span style={{ color: "#098658" }}>{t}</span>;
const co  = (t: string) => <span style={{ color: "#008000", fontStyle: "italic" }}>{t}</span>;
const pa  = (t: string) => <span style={{ color: "#001080" }}>{t}</span>;

const CODE_LINES: CodeLine[] = [
  { id: "c76", ln: 76, html: <>{kw("module")} {ty("sui_agent")}::{ty("permission_capsule")} {"{"}</> },
  { id: "c77", ln: 77, html: <>{"  "}{kw("use")} {ty("sui")}::{fn("object")}::{"{Self, UID}"};</> },
  { id: "c78", ln: 78, html: <>{"  "}{kw("use")} {ty("sui")}::{fn("tx_context")}::{ty("TxContext")};</> },
  { id: "c79", ln: 79, html: <></> },
  { id: "c80", ln: 80, html: <>{"  "}{co("// permitted scope constants")}</> },
  { id: "c81", ln: 81, html: <>{"  "}{kw("const")} {ty("ORDER")}: {ty("u8")} = {nu("1")};</> },
  { id: "c82", ln: 82, html: <>{"  "}{kw("const")} {ty("CANCEL")}: {ty("u8")} = {nu("2")};</> },
  { id: "c83", ln: 83, html: <>{"  "}{co("// external_transfer: not in scope")}</> },
  { id: "c84", ln: 84, html: <></> },
  { id: "c85", ln: 85, html: <>{"  "}{kw("public")} {kw("fun")} {fn("validate")}(</> },
  { id: "c86", ln: 86, html: <>{"    "}{pa("scope")}: &amp;{ty("Scope")},</> },
  { id: "c87", ln: 87, html: <>{"    "}{pa("action")}: {ty("ActionType")},</> },
  { id: "c88", ln: 88, html: <>{"    "}{pa("ctx")}: &amp;{kw("mut")} {ty("TxContext")}</> },
  { id: "c89", ln: 89, html: <>{"  ) {"}</> },
  { id: "c90", ln: 90, html: <>{"    "}{fn("assert!")}(</>,          hasGutter: true },
  { id: "c91", ln: 91, html: <>{"      "}{pa("scope")}.{fn("permits")}({pa("action")}),</>, hasGutter: true },
  { id: "c92", ln: 92, html: <>{"      "}{nu("E_UNAUTHORIZED")}</>,  hasGutter: true },
  { id: "c93", ln: 93, html: <>{"    )"}</> },
  { id: "c94", ln: 94, html: <>{"  }"}</> },
  { id: "c95", ln: 95, html: <>{"}"}</> },
];

// ─── Helper: pill icon ────────────────────────────────────────────────────────

function PillIcon({ name, state }: { name: PillInfo["icon"]; state: PillState }) {
  const sz = 12;
  const spin = state === "run";
  const cls  = spin ? "vsc-spin" : undefined;
  if (name === "loader")       return <IconLoader       size={sz} className={cls} />;
  if (name === "check")        return <IconCheck        size={sz} />;
  if (name === "package")      return <IconPackage      size={sz} />;
  if (name === "shield-check") return <IconShieldCheck  size={sz} />;
  if (name === "bolt")         return <IconBolt         size={sz} />;
  if (name === "x")            return <IconX            size={sz} />;
  return null;
}

// ─── Helper: pill style ───────────────────────────────────────────────────────

function pillStyle(state: PillState): CSSProperties {
  if (state === "run") return { background: "#eff6ff", border: "1px solid #bfdbfe", color: "#1d4ed8" };
  if (state === "ok")  return { background: "#f0fdf4", border: "1px solid #bbf7d0", color: "#15803d" };
  if (state === "err") return { background: "#fef2f2", border: "1px solid #fecaca", color: "#b91c1c" };
  return { background: "#fff", border: "1px solid #e0e0e0", color: "#888" };
}

// ─── Helper: highlight background ────────────────────────────────────────────

function hlBg(type: HlType): string {
  if (type === "green") return "#f0fdf4";
  if (type === "red")   return "#fff1f2";
  if (type === "blue")  return "#eff6ff";
  return "transparent";
}

// ─── Log line colours ─────────────────────────────────────────────────────────

const LOG_COLOR: Record<string, CSSProperties> = {
  "lg-prompt": { color: "#6b7280" },
  "lg-cmd":    { color: "#1e293b", fontWeight: 500 },
  "lg-ok":     { color: "#15803d" },
  "lg-dim":    { color: "#94a3b8" },
  "lg-warn":   { color: "#b45309" },
  "lg-err":    { color: "#dc2626", fontWeight: 600 },
  "lg-err2":   { color: "#dc2626", fontSize: "10.5px" },
};

// ─── Sidebar ──────────────────────────────────────────────────────────────────

interface SidebarProps {
  logFileBadge: boolean;
  run2: Run2Info;
}

function Sidebar({ logFileBadge, run2 }: SidebarProps) {
  const headStyle: CSSProperties = {
    fontSize: 10, fontWeight: 700, color: "#aaa",
    letterSpacing: "0.12em", padding: "10px 12px 4px",
    textTransform: "uppercase", fontFamily: FONT_UI,
  };

  const rowBase: CSSProperties = {
    display: "flex", alignItems: "center", gap: 6,
    padding: "3px 12px", color: "#3b3b3b",
    cursor: "default", whiteSpace: "nowrap", overflow: "hidden",
    fontFamily: FONT_UI,
  };

  const badge = (label: string, bg: string) => (
    <span style={{
      marginLeft: "auto", fontSize: 9,
      background: bg, color: "#fff",
      borderRadius: 3, padding: "1px 5px",
      flexShrink: 0, fontFamily: FONT_UI,
    }}>{label}</span>
  );

  const icoStyle = (color?: string): CSSProperties => ({
    fontSize: 14, flexShrink: 0, color: color ?? "#888",
  });

  return (
    <>
      <div style={headStyle}>Explorer</div>

      <div style={rowBase}>
        <IconChevronDown size={11} style={icoStyle()} />
        <span style={{ fontSize: 11, fontWeight: 600, color: "#1a1a1a" }}>permission-capsule</span>
      </div>

      <div style={{ ...rowBase, paddingLeft: 20 }}>
        <IconFolder size={14} style={icoStyle()} />
        <span style={{ fontSize: 11 }}>move</span>
      </div>
      <div style={{ ...rowBase, paddingLeft: 32, background: "#e8f0fe", color: "#0066b8" }}>
        <IconFileCode size={14} style={icoStyle("#0066b8")} />
        <span style={{ fontSize: 11, overflow: "hidden", textOverflow: "ellipsis" }}>permission_capsule.move</span>
      </div>
      <div style={{ ...rowBase, paddingLeft: 32 }}>
        <IconFileCode size={14} style={icoStyle()} />
        <span style={{ fontSize: 11 }}>deepbook_pool.move</span>
      </div>
      <div style={{ ...rowBase, paddingLeft: 32 }}>
        <IconFileCode size={14} style={icoStyle()} />
        <span style={{ fontSize: 11 }}>agent.move</span>
      </div>

      <div style={{ ...rowBase, paddingLeft: 20 }}>
        <IconFolder size={14} style={icoStyle()} />
        <span style={{ fontSize: 11 }}>logs</span>
      </div>
      <div style={{ ...rowBase, paddingLeft: 32 }}>
        <IconFile size={14} style={icoStyle()} />
        <span style={{ fontSize: 11, flex: 1 }}>agent.log</span>
        {logFileBadge && badge("!", "#ef4444")}
      </div>

      <div style={{ ...rowBase, paddingLeft: 20, marginTop: 4 }}>
        <IconFolder size={14} style={icoStyle()} />
        <span style={{ fontSize: 11 }}>tests</span>
      </div>
      <div style={{ ...rowBase, paddingLeft: 32 }}>
        <IconFile size={14} style={icoStyle()} />
        <span style={{ fontSize: 11 }}>enforce_test.move</span>
      </div>

      <div style={{ ...headStyle, marginTop: 6 }}>Runs</div>
      <div style={{ ...rowBase, paddingLeft: 20 }}>
        <IconCheck size={14} style={icoStyle("#16a34a")} />
        <span style={{ fontSize: 10.5, flex: 1 }}>build #41</span>
        {badge("ok", "#16a34a")}
      </div>
      <div style={{ ...rowBase, paddingLeft: 20, color: run2.color || "#3b3b3b" }}>
        {run2.icon === "x"
          ? <IconX    size={14} style={icoStyle(run2.color || "#f59e0b")} />
          : <IconClock size={14} style={icoStyle(run2.color || "#f59e0b")} />}
        <span style={{ fontSize: 10.5, flex: 1 }}>enforce #42</span>
        {badge(run2.badge, run2.badgeCls === "red" ? "#ef4444" : "#94a3b8")}
      </div>
    </>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function VSCodeRejection({ onPhaseChange }: DemoProps) {
  const [highlights, setHighlights] = useState<Record<string, HlType>>({});
  const [gutters,    setGutters]    = useState<Record<string, GutterInfo>>({});
  const [logLines,   setLogLines]   = useState<LogLine[]>([]);
  const [logStatus,  setLogStatus]  = useState<"" | "running" | "ok" | "err">("");
  const [logPhase,   setLogPhase]   = useState<string>("");

  const [pill1, setPill1] = useState<PillInfo>({ state: "idle", label: "Build",       icon: "package" });
  const [pill2, setPill2] = useState<PillInfo>({ state: "idle", label: "Scope check", icon: "shield-check" });
  const [pill3, setPill3] = useState<PillInfo>({ state: "idle", label: "Enforce",     icon: "bolt" });

  const [run2,         setRun2]         = useState<Run2Info>({ badge: "…", badgeCls: "", color: "", icon: "clock" });
  const [logFileBadge, setLogFileBadge] = useState<boolean>(false);
  const [showAbort,    setShowAbort]    = useState<boolean>(false);
  const [vscOpacity,   setVscOpacity]   = useState<number>(1);

  const lineCountRef = useRef<number>(0);
  const activeRef    = useRef<boolean>(true);
  const logScrollRef = useRef<HTMLDivElement>(null);
  
  // THE LATCH: Permanently kills the React 18 Strict Mode double-typing bug
  const isRunningRef = useRef<boolean>(false);

  // ── state helpers ──────────────────────────────────────────────────────────

  const hl = useCallback((id: string, type: HlType) =>
    setHighlights(h => ({ ...h, [id]: type })), []);

  const clrHl = useCallback((...ids: string[]) =>
    setHighlights(h => { const n = { ...h }; ids.forEach(id => delete n[id]); return n; }), []);

  const setGutter = useCallback((id: string, dot: boolean, color: string) =>
    setGutters(g => ({ ...g, [id]: { dot, color } })), []);

  const addLog = useCallback((text: string, cls: string) => {
    const id = ++lineCountRef.current;
    setLogLines(l => [...l, { id, text, cls }]);
  }, []);

  const typeLine = useCallback(async (text: string, cls: string, spd = 22) => {
    const id = ++lineCountRef.current;
    setLogLines(l => [...l, { id, text: "", cls, partial: true }]);
    for (let i = 1; i <= text.length; i++) {
      if (!activeRef.current) return;
      setLogLines(l => l.map(ln => ln.id === id ? { ...ln, text: text.slice(0, i) } : ln));
      await w(spd);
    }
    setLogLines(l => l.map(ln => ln.id === id ? { ...ln, partial: false } : ln));
  }, []);

  const resetAll = useCallback(() => {
    setHighlights({});
    setGutters({});
    setLogLines([]);
    lineCountRef.current = 0;
    setLogStatus("");
    setLogPhase("");
    setPill1({ state: "idle", label: "Build",       icon: "package" });
    setPill2({ state: "idle", label: "Scope check", icon: "shield-check" });
    setPill3({ state: "idle", label: "Enforce",     icon: "bolt" });
    setRun2({ badge: "…", badgeCls: "", color: "", icon: "clock" });
    setLogFileBadge(false);
    setShowAbort(false);
  }, []);

  // ── animation loop ─────────────────────────────────────────────────────────

  useEffect(() => {
    // Safety Latch checks if a loop is already running and kills the duplicate
    if (isRunningRef.current) return;
    
    isRunningRef.current = true;
    activeRef.current = true;

    async function run() {
      while (activeRef.current) {
        resetAll();
        await w(400); if (!activeRef.current) break;

        // PHASE 1 — Build -> Maps to 'delegate' tab
        onPhaseChange?.('delegate');
        setLogStatus("running");
        setLogPhase("building...");
        setPill1({ state: "run", label: "Build", icon: "loader" });
        hl("c76", "blue"); hl("c77", "blue"); hl("c78", "blue");

        await typeLine("$ agent-permission-check.yml · run #42", "lg-prompt");
        await typeLine("$ initializing build pipeline...", "lg-cmd");
        await w(150); if (!activeRef.current) break;
        await typeLine("  compiling permission_capsule.move", "lg-dim", 18);
        await typeLine("  ✓  compiled  (0 errors, 0 warnings)", "lg-ok", 18);
        await typeLine("  linking 3 modules...", "lg-dim", 18);
        await typeLine("  ✓  linked successfully", "lg-ok", 18);
        await typeLine("  → build complete · 1m 42s", "lg-dim");
        clrHl("c76", "c77", "c78");
        setPill1({ state: "ok", label: "Build", icon: "check" });
        await w(500); if (!activeRef.current) break;

        // PHASE 2 — Scope check -> Maps to 'inbox' tab
        onPhaseChange?.('inbox');
        setLogPhase("validating scope...");
        setPill2({ state: "run", label: "Scope check", icon: "loader" });
        hl("c80", "blue"); hl("c81", "blue"); hl("c82", "blue"); hl("c83", "blue");

        addLog("", "");
        await typeLine("$ validating agent scope permissions...", "lg-cmd");
        await w(150); if (!activeRef.current) break;
        await typeLine("  reading capsule manifest", "lg-dim", 20);
        ["c85","c86","c87","c88","c89","c90","c91","c92","c93"].forEach(id => hl(id, "green"));
        await typeLine("  ✓  ORDER         permitted", "lg-ok", 16);
        await typeLine("  ✓  CANCEL        permitted", "lg-ok", 16);
        await typeLine("  → validation complete · 0m 04s", "lg-dim");
        clrHl("c80","c81","c82","c83","c85","c86","c87","c88","c89","c90","c91","c92","c93");
        setPill2({ state: "ok", label: "Scope check", icon: "check" });
        await w(500); if (!activeRef.current) break;

        // PHASE 3 — Enforce -> Maps to 'execute' tab
        onPhaseChange?.('execute');
        setLogPhase("enforcing...");
        setPill3({ state: "run", label: "Enforce", icon: "loader" });

        addLog("", "");
        await typeLine("$ enforcing transaction batch...", "lg-cmd");
        await w(150); if (!activeRef.current) break;
        await typeLine("  checking  →  Publish ORDER", "lg-dim", 18);
        hl("c90", "green"); hl("c91", "green"); hl("c92", "green");
        await typeLine("  ✓  ORDER cleared", "lg-ok", 16);
        clrHl("c90","c91","c92");
        await typeLine("  checking  →  Publish CANCEL", "lg-dim", 18);
        hl("c90", "green"); hl("c91", "green"); hl("c92", "green");
        await typeLine("  ✓  CANCEL cleared", "lg-ok", 16);
        clrHl("c90","c91","c92");
        await typeLine("  checking  →  external_transfer...", "lg-warn", 22);
        hl("c83", "red"); hl("c90", "red"); hl("c91", "red"); hl("c92", "red");
        await w(600); if (!activeRef.current) break;

        // PHASE 4 — Rejection
        setLogPhase("ABORTED");
        setLogStatus("err");
        setGutter("c90", true, "#ef4444");
        setGutter("c91", true, "#ef4444");
        setGutter("c92", true, "#ef4444");
        setLogFileBadge(true);

        addLog("", "");
        addLog("  ✗  ENFORCEMENT TRIPPED", "lg-err");
        await w(80); if (!activeRef.current) break;
        addLog("", "");
        addLog("  MoveAbort(MoveLocation {", "lg-err2");
        await w(55); addLog("    module:   permission_capsule,", "lg-err2");
        await w(55); addLog("    function: 2", "lg-err2");
        await w(55); addLog("  }, 1)", "lg-err2");
        await w(80); if (!activeRef.current) break;
        addLog("", "");
        addLog("  → run halted · no state committed.", "lg-err");

        setPill3({ state: "err", label: "Enforce", icon: "x" });
        setRun2({ badge: "fail", badgeCls: "red", color: "#dc2626", icon: "x" });
        setShowAbort(true);

        await w(4000); if (!activeRef.current) break;

        // fade & reset
        setVscOpacity(0);
        await w(420); if (!activeRef.current) break;
        setVscOpacity(1);
        await w(200);
      }
    }

    run();
    return () => { 
      activeRef.current = false; 
      isRunningRef.current = false; 
    };
  }, [onPhaseChange]);

  // ── auto-scroll log ────────────────────────────────────────────────────────

  useEffect(() => {
    if (logScrollRef.current) {
      logScrollRef.current.scrollTop = logScrollRef.current.scrollHeight;
    }
  }, [logLines]);

  // ── render ─────────────────────────────────────────────────────────────────

  return (
    <>
      <style>{GLOBAL_STYLES}</style>

      {/* LAYER 4: The Anchor Container
          Expands fluidly based on the grid box in Landing.tsx. 
          Padding gives the physical volume needed to show the outer gradient canvas.
      */}
      <div className="layer-4" style={{
        position: "relative",
        width: "100%",
        boxSizing: "border-box",
        padding: "48px 32px",
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center",
        overflow: "hidden",
        fontFamily: FONT_UI,
      }}>

        {/* LAYER 3: The Gradient Canvas */}
        <div style={{ position: "absolute", inset: 0, zIndex: 0, background: "#dbeafe", overflow: "hidden" }}>
          <div className="vsc-blob1" style={{ position:"absolute", borderRadius:"50%", opacity:0.6, width:400, height:400, background:"#bfdbfe", top:-100, left:-80 }} />
          <div className="vsc-blob2" style={{ position:"absolute", borderRadius:"50%", opacity:0.6, width:350, height:350, background:"#c7d2fe", top:0, right:-60 }} />
          <div className="vsc-blob3" style={{ position:"absolute", borderRadius:"50%", opacity:0.6, width:300, height:300, background:"#a5f3fc", bottom:-80, left:"20%" }} />
          <div className="vsc-blob4" style={{ position:"absolute", borderRadius:"50%", opacity:0.6, width:250, height:250, background:"#e0e7ff", bottom:-40, right:"5%" }} />
        </div>

        {/* LAYER 2: The Liquid Glass Frame */}
        <div className="glass-frame" style={{
          zIndex: 1,
          width: "100%",
          maxWidth: "1080px",
          display: "flex",
          margin: "0 auto",
          boxSizing: "border-box"
        }}>

          {/* LAYER 1: The MacBook App Core */}
          <div className="mac-window" style={{
            position: "relative",
            width: "100%",
            height: "600px", 
            display: "flex",
            flexDirection: "column",
            background: "#ffffff",
            borderRadius: "12px", 
            overflow: "hidden",
            boxShadow: "0 30px 60px rgba(0,0,0,0.15), 0 4px 12px rgba(0,0,0,0.05)",
            opacity: vscOpacity,
            transition: "opacity 0.4s ease",
          }}>

            {/* Title bar (Fixed Height) */}
            <div style={{
              height: 36, background: "#f3f3f3",
              borderBottom: "1px solid #e8e8e8",
              display: "flex", alignItems: "center",
              padding: "0 14px", gap: 8,
              userSelect: "none",
              flexShrink: 0
            }}>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <div style={{ width:12, height:12, minWidth:12, minHeight:12, borderRadius:"50%", background:"#FF5F56", flexShrink:0 }} />
                <div style={{ width:12, height:12, minWidth:12, minHeight:12, borderRadius:"50%", background:"#FFBD2E", flexShrink:0 }} />
                <div style={{ width:12, height:12, minWidth:12, minHeight:12, borderRadius:"50%", background:"#27C93F", flexShrink:0 }} />
              </div>
              <span style={{ fontSize:12, color:"#666", margin:"0 auto", fontWeight:500, letterSpacing:"0.02em", fontFamily:FONT_UI }}>
                permission-capsule.yml
              </span>
            </div>

            {/* Editor area (Fluid Height inside the wrapper) */}
            <div style={{ display: "flex", flex: 1, minHeight: 0 }}>

              {/* Activity bar */}
              <div className="vsc-activity" style={{
                width:44, background:"#f3f3f3",
                borderRight:"1px solid #e8e8e8",
                display:"flex", flexDirection:"column",
                alignItems:"center", paddingTop:8, gap:4, flexShrink:0,
              }}>
                <div style={{ width:32, height:32, borderRadius:5, display:"flex", alignItems:"center", justifyContent:"center", color:"#0066b8", background:"#e8f0fe", cursor:"default", fontSize:17 }}>
                  <IconFiles size={17} />
                </div>
                <div style={{ width:32, height:32, borderRadius:5, display:"flex", alignItems:"center", justifyContent:"center", color:"#666", cursor:"default" }}>
                  <IconSearch size={17} />
                </div>
                <div style={{ width:32, height:32, borderRadius:5, display:"flex", alignItems:"center", justifyContent:"center", color:"#666", cursor:"default" }}>
                  <IconGitBranch size={17} />
                </div>
                <div style={{ width:32, height:32, borderRadius:5, display:"flex", alignItems:"center", justifyContent:"center", color:"#666", cursor:"default", marginTop:"auto", marginBottom:8 }}>
                  <IconSettings size={17} />
                </div>
              </div>

              {/* Sidebar */}
              <div className="vsc-sidebar" style={{
                width:160, background:"#f8f8f8",
                borderRight:"1px solid #e8e8e8",
                overflow:"hidden", flexShrink:0, fontSize:11.5,
                display: "flex", flexDirection: "column"
              }}>
                <div style={{ flex: 1, overflowY: "auto" }}>
                  <Sidebar logFileBadge={logFileBadge} run2={run2} />
                </div>
              </div>

              {/* Main editor */}
              <div style={{ flex:1, display:"flex", flexDirection:"column", minWidth:0, overflow:"hidden" }}>

                {/* Tabs */}
                <div style={{ display:"flex", background:"#ececec", borderBottom:"1px solid #e0e0e0", height:32, overflow:"hidden", flexShrink:0 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:6, padding:"0 14px", fontSize:11.5, fontFamily:FONT_UI, color:"#1a1a1a", borderRight:"1px solid #e0e0e0", background:"#fff", fontWeight:500, borderBottom:"1px solid transparent", cursor:"default", whiteSpace:"nowrap", flexShrink:0 }}>
                    <IconFileCode size={12} style={{ color:"#af00db" }} />
                    permission_capsule.move
                  </div>
                  <div style={{ display:"flex", alignItems:"center", gap:6, padding:"0 14px", fontSize:11.5, fontFamily:FONT_UI, color:"#888", borderRight:"1px solid #e0e0e0", cursor:"default", whiteSpace:"nowrap", flexShrink:0 }}>
                    <IconFile size={12} style={{ color:"#888" }} />
                    agent.log
                  </div>
                  <div style={{ display:"flex", alignItems:"center", gap:6, padding:"0 14px", fontSize:11.5, fontFamily:FONT_UI, color:"#888", borderRight:"1px solid #e0e0e0", cursor:"default", whiteSpace:"nowrap", flexShrink:0 }}>
                    <IconFile size={12} style={{ color:"#888" }} />
                    Makefile
                  </div>
                </div>

                {/* Breadcrumb */}
                <div style={{ fontSize:11, color:"#888", padding:"4px 14px", borderBottom:"1px solid #f0f0f0", background:"#fff", fontFamily:FONT_MONO, flexShrink:0 }}>
                  move / <span style={{ color:"#0066b8" }}>permission_capsule</span> / validate
                </div>

                {/* Split: code + log */}
                <div className="vsc-split" style={{ flex:1, display:"grid", gridTemplateColumns:"1fr 1fr", overflow:"hidden", minHeight:0 }}>

                  {/* Code pane */}
                  <div className="vsc-code-half" style={{ borderRight:"1px solid #e8e8e8", overflow:"hidden", background:"#fff", display:"flex", flexDirection:"column" }}>
                    <div style={{ overflowY:"auto", flex:1, fontFamily:FONT_MONO, fontSize:11.5, lineHeight:1.7 }}>
                      {CODE_LINES.map(({ id, ln, html }) => {
                        const hlType = highlights[id] as HlType | undefined;
                        const gtr    = gutters[id];
                        return (
                          <div key={id} style={{ display:"flex", minHeight:19.6, background:hlBg(hlType ?? ""), transition:"background 0.25s" }}>
                            <span style={{ width:38, textAlign:"right", paddingRight:10, color:"#bbb", fontSize:10.5, paddingTop:2, flexShrink:0, userSelect:"none", fontFamily:FONT_MONO }}>
                              {ln}
                            </span>
                            <span style={{ width:14, flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center", fontSize:9, color: gtr?.color ?? "transparent" }}>
                              {gtr?.dot ? "●" : ""}
                            </span>
                            <span style={{ flex:1, paddingRight:8, whiteSpace:"pre" }}>
                              {html}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Log pane */}
                  <div style={{ overflow:"hidden", display:"flex", flexDirection:"column", background:"#fff" }}>
                    {/* Log header */}
                    <div style={{ flexShrink:0, fontSize:10, fontWeight:600, color:"#aaa", letterSpacing:"0.1em", padding:"6px 12px 4px", borderBottom:"1px solid #f0f0f0", background:"#f8f8f8", textTransform:"uppercase", display:"flex", alignItems:"center", gap:8, fontFamily:FONT_UI }}>
                      <span
                        className={logStatus === "running" ? "vsc-pulse" : undefined}
                        style={{
                          width:7, height:7, borderRadius:"50%", flexShrink:0, transition:"background 0.3s",
                          background: logStatus === "err" ? "#ef4444" : logStatus === "running" ? "#f59e0b" : logStatus === "ok" ? "#16a34a" : "#ccc",
                        }}
                      />
                      Agent log
                      <span style={{ fontSize:10, color:"#aaa", fontWeight:400, textTransform:"none", letterSpacing:0, marginLeft:"auto", fontFamily:FONT_UI }}>
                        {logPhase}
                      </span>
                    </div>

                    {/* Log scroll */}
                    <div ref={logScrollRef} style={{ flex:1, overflowY:"auto", overflowX:"hidden" }}>
                      <div style={{ fontFamily:FONT_MONO, fontSize:11, lineHeight:1.75, padding:"10px 12px" }}>
                        {logLines.map((line) => (
                          <span key={line.id} style={{ display:"block", whiteSpace:"pre", minHeight:19.25, ...(LOG_COLOR[line.cls] ?? {}) }}>
                            {line.text}
                            {line.partial && <span className="vsc-cursor" />}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status bar */}
                <div style={{ height:22, background:"#0066b8", display:"flex", alignItems:"center", padding:"0 12px", gap:16, flexShrink:0 }}>
                  <span style={{ fontSize:10.5, color:"rgba(255,255,255,0.85)", display:"flex", alignItems:"center", gap:4, fontFamily:FONT_UI }}>
                    <IconGitBranch size={12} /> main
                  </span>
                  <span style={{ fontSize:10.5, color:"rgba(255,255,255,0.85)", display:"flex", alignItems:"center", gap:4, fontFamily:FONT_UI }}>
                    <IconCheck size={12} /> 0 errors
                  </span>
                  <span style={{ fontSize:10.5, color:"rgba(255,255,255,0.85)", display:"flex", alignItems:"center", gap:4, marginLeft:"auto", fontFamily:FONT_UI }}>
                    <IconLoader size={12} /> Move 1.0
                  </span>
                </div>

                {/* Pill strip */}
                <div style={{ borderTop:"1px solid #e8e8e8", background:"#fafafa", padding:"7px 14px", display:"flex", alignItems:"center", gap:5, flexWrap:"wrap", flexShrink:0 }}>
                  {([pill1, pill2, pill3] as PillInfo[]).map((pill, i) => (
                    <React.Fragment key={i}>
                      {i > 0 && <span style={{ color:"#d1d5db", fontSize:13, flexShrink:0 }}>›</span>}
                      <div style={{ fontSize:10.5, fontFamily:FONT_UI, fontWeight:500, padding:"3px 11px 3px 9px", borderRadius:100, display:"flex", alignItems:"center", gap:5, transition:"all 0.35s", ...pillStyle(pill.state) }}>
                        <PillIcon name={pill.icon} state={pill.state} />
                        {pill.label}
                      </div>
                    </React.Fragment>
                  ))}
                  {showAbort && (
                    <div style={{ marginLeft:"auto", fontSize:10, fontFamily:FONT_UI, fontWeight:600, padding:"2px 9px", borderRadius:100, background:"#fef2f2", border:"1px solid #fecaca", color:"#b91c1c", letterSpacing:"0.04em" }}>
                      ABORTED
                    </div>
                  )}
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}