# ACP STUDIO — COMPLETE BUILD DOCUMENT FOR KIMI AGENT
## Agent Credential Protocol · Frontend Product · June 2026

READ THIS ENTIRE DOCUMENT BEFORE CREATING ANY FILE. EVERY DECISION IS IN HERE.

---

## PART 1 — WHAT EXISTS AND WHAT YOU ARE BUILDING

You are building the frontend for a live, fully deployed Move protocol on Sui testnet called Agent Credential Protocol (ACP). The smart contracts are already deployed and working. Your job is to build ACP Studio — the complete web product that lets humans interact with the protocol visually.

**The deployed package:**
```
PACKAGE_ID = "0x9f6dd2d41950987cb4e9ad5ca36b124e0799a12ac60bbb10c16b034a936456ce"
```

**The two core protocol objects live on Sui testnet:**

`AgentIdentity` — the agent's onchain passport. Owned by a wallet address.
Fields: `id`, `owner: address`, `name: vector<u8>`, `created_epoch: u64`, `action_count: u64`

`PermissionCapsule` — the agent's mandate. Non-copyable Move object. Owned by wallet address (NOT wrapped inside AgentIdentity — this is critical).
Fields: `id`, `agent_id: ID`, `issuer: address`, `permissions: vector<u8>`, `protocol_whitelist: vector<address>`, `spend_per_tx: u64`, `daily_limit: u64`, `lifetime_limit: u64`, `spent_today: u64`, `spent_total: u64`, `last_reset_epoch: u64`, `expiry_epoch: u64`

**The 8 permission types encoded as u8:**
```
QUERY = 0
SWAP = 1
SUPPLY = 2
COLLECT = 3
STAKE = 4
TRANSFER_WHITELIST = 5
ORDER = 6
DELEGATE = 7
```

**The PermissionAttached event emitted by mint_permission_capsule:**
```typescript
interface PermissionAttachedEvent {
  capsule_id: string;
  agent_id: string;
  issuer: string;
  permissions: number[];
  expiry_epoch: string;
  spend_per_tx?: string;
  daily_limit?: string;
  lifetime_limit?: string;
}
```

**DeepBook adapter is deployed.** The demo can fire real DeepBook ORDER transactions.

**A live AgentIdentity already exists on testnet:**
Object ID: `0xaa9c081a42475fbd46bd831c3b51085c40d0d66099218069e845fffece5e84eb`
Name: `LiveTradingAgent_01`

---

## PART 2 — OPERATING RULES. NEVER BREAK THESE.

**Rule 1:** Create real files and folders. Do not output long code blocks in chat. Use your file creation tools to build the actual project structure.

**Rule 2:** Do not run any terminal commands. Create all files with correct complete content. The developer runs commands on their own machine.

**Rule 3:** Every component must be complete and functional. No placeholder components, no TODO comments, no skeleton screens with fake data. Every screen works end to end.

**Rule 4:** The design system defined in Part 3 is non-negotiable. Every color, every font, every spacing choice follows what is written there.

**Rule 5:** Mobile responsive everywhere. Every layout works at 375px width and 1440px width.

**Rule 6:** The rejection moment must be visually  the raw Move abort code appears in #ff4444 monospace, and one line below it reads: "Enforcement layer: Move type system. Not application logic." This is the product's most important UI moment.

**Rule 7:** The PermissionCapsule ownership model. The wallet owns ALL capsules. To find the capsule for a specific agent: call `useGetOwnedObjects` filtered by PermissionCapsule type, then client-side filter where `capsule.data.content.fields.agent_id === selectedAgent.id`. Never assume 1:1 wallet-to-capsule. A wallet can own many agents and many capsules.

**Rule 8:** All SUI amounts displayed to users are in SUI (not MIST). All amounts sent to Move functions are in MIST. 1 SUI = 1,000,000,000 MIST. Always convert at the boundary.

**Rule 9:** Pass Clock as `tx.object('0x6')` on every Move call that requires it.

**Rule 10:** After every successful transaction, call `waitForTransaction` with the digest, then refetch all affected objects. Never rely on optimistic UI. The UI must reflect confirmed onchain state.

---

## PART 3 — THE VISUAL DESIGN SYSTEM

This section is the single source of truth for every visual decision. Read it before writing a single line of CSS or Tailwind.

### The Product Identity

ACP Studio is a tactical control room for autonomous intelligence. It is not a DeFi dashboard. It is not a crypto wallet UI.

this website is in light mode through out not dark mode at all Thin grid lines and geometric crosshair markers appear as structural decoration — they suggest targeting, authorization, precision. This is the AV8·R aesthetic: a product made for people who need it to work, not just look good.

 Bold, editorial, large. Headlines are massive and unapologetic like the Sui.io website. use clean fonts, it will likely get changed but use a good font 

Tall, clean, minimal. Cards use thin borders, icon at top, label, description.like in the image attached to the prompt, look at  the image names for info on what to pick from each image

### Color Tokens

```
--bg-base: #0a0a0a          /* Page background */
--bg-surface: #111111        /* Card background */
--bg-elevated: #161616       /* Elevated surface, modals */
--bg-input: #0f0f0f          /* Input fields */

--border-subtle: #1e1e1e     /* Default card border */
--border-default: #2a2a2a    /* Interactive element border */
--border-active: #c8f050     /* Active/focused element border */
--border-red: #ff4444        /* Error state border */

--text-primary: #e8e8e8      /* Main text */
--text-secondary: #888888    /* Labels, metadata */
--text-muted: #444444        /* Placeholder, disabled */
--text-accent: #c8f050       /* Accent green — authorized, active, success */
--text-error: #ff4444        /* Rejection, error, revoked */
--text-warning: #f0a050      /* Expiring soon, warning states */

--accent: #c8f050            /* Primary accent — lime green */
--accent-dim: rgba(200, 240, 80, 0.1)   /* Accent glow background */
--accent-glow: rgba(200, 240, 80, 0.15) /* Hover glow */

--error: #ff4444
--error-dim: rgba(255, 68, 68, 0.1)
--error-glow: rgba(255, 68, 68, 0.2)   /* Rejection moment background pulse */

--amber-glow: rgba(200, 120, 40, 0.18) /* Hero atmospheric glow */
--grid-line: rgba(255, 255, 255, 0.04) /* Structural grid lines */
```

### Typography

header font is BDO Grotesk as main font, never use anything else if it 

Because BDO Grotesk is a custom typeface and not hosted on the Google Fonts API, you cannot request it directly via an @import URL. Instead, you must self-host the font files and call them in your CSS using the @font-face rule.Step 1: Obtain the font filesDownload the BDO Grotesk font files in WOFF or WOFF2 format (which are optimized for web browsers). You can find these files through design resource platforms like ⁠Befonts or extract them from the ⁠GitHub repository.Step 2: Upload files to your projectCreate a directory named fonts in your project folder and upload the extracted BDO Grotesk .woff2 or .woff files there.Step 3: Define the font in CSSAt the very top of your CSS file, define the @font-face rule to link the browser to your local font files:css@font-face {
    font-family: 'BDO Grotesk';
    src: url('fonts/BDOGrotesk-Regular.woff2') format('woff2'),
         url('fonts/BDOGrotesk-Regular.woff') format('woff');
    font-weight: 400;
    font-style: normal;
    font-display: swap;
}

/* Example for Bold weight if you have the file */
@font-face {
    font-family: 'BDO Grotesk';
    src: url('fonts/BDOGrotesk-Bold.woff2') format('woff2'),
         url('fonts/BDOGrotesk-Bold.woff') format('woff');
    font-weight: 700;
    font-style: normal;
    font-display: swap;
}
Use code with caution.Step 4: Apply the fontOnce the @font-face rule is established, you can apply BDO Grotesk to your HTML elements just as you would with Google Fonts:cssbody {
    font-family: 'BDO Grotesk', sans-serif;
}

i will download the font and add it, dont use anyother font for header, even for thr body we should use bd grotesk

dm sans id a fall back and for thingis that we dont need to use bd grotesk for or need smmoth loading 

main font for body is dm sans through out and then

### Spacing Scale

```
2px, 4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px, 96px
```

Base unit: 4px. Never use arbitrary values not in this scale.

### Border Radius
but this is a 0 radius app, what had that shapr edge feeling so lknow when to use radius and what not 
```
--radius-sm: 4px    /* Badges, small chips */
--radius-md: 8px    /* Buttons, inputs */
--radius-lg: 12px   /* Cards */
--radius-xl: 16px   /* Modals, large panels */
```

### Structural Decorations

These geometric elements appear throughout the UI as atmospheric decoration. They are pure CSS/SVG — no images.

**Grid overlay:** A very subtle grid of lines at `--grid-line` opacity. Applied as a CSS background-image with linear-gradient pattern. Used on the landing page hero and Demo Mode.

**Crosshair marker:** A small `+` shape made of two thin lines, 8×8px, color `--border-default`. Placed at corners of hero sections and at key intersection points. Created as a CSS pseudo-element or small SVG.


**Corner brackets:** On selected cards (like the Agent Identity Card and Demo panels), thin L-shaped corner lines in `--border-active`. 12px long, 1px wide. CSS pseudo-elements on `::before` and `::after`.

### Component Visual Rules

**Buttons:**
- Primary: background `--accent`, text `#0a0a0a` (dark on light), font Inter 500, 14px, radius-md, height 40px, px 20px
- Secondary: background transparent, border `--border-default`, text `--text-primary`, same sizing. On hover: border `--accent`, text `--accent`
- Destructive: border `--error`, text `--error`. On hover: background `--error-dim`
- All buttons: no box-shadow, transition 150ms ease on border-color and background

**Cards:**
- Background `--bg-surface`, border `1px solid --border-subtle`, radius-lg
- On hover: border color transitions to `--border-default` in 150ms
- Active/selected cards: border `--accent`, left edge accent stripe (3px wide, full height, background `--accent`)
- Inner padding: 24px

**Badges/chips:**
- Permission type badges: small pill, radius-sm, 11px uppercase label, Inter 500
- Active permission: background `--accent-dim`, text `--accent`, border `1px solid rgba(200,240,80,0.3)`
- Inactive permission: background `rgba(255,255,255,0.04)`, text `--text-muted`, border `1px solid --border-subtle`
- Status badges: same pattern using appropriate color tokens

**Inputs:**
- Background `--bg-input`, border `1px solid --border-default`, radius-md, height 40px, px 12px
- Focus: border `--border-active`, no outline, box-shadow `0 0 0 3px rgba(200,240,80,0.1)`
- Font: Inter 14px, text `--text-primary`

**Progress bars (spend meters):**
- Track: background `rgba(255,255,255,0.06)`, radius 2px, height 4px
- Fill: background `--accent`, transitions width with CSS transition 300ms
- When fill > 80%: fill color becomes `--text-warning`
- When fill = 100%: fill color becomes `--text-error`

**Permission Grid:**
- 4×2 grid (4 columns, 2 rows) of permission cells
- Each cell: card background, border, radius-md, padding 16px
- Granted cell: border `rgba(200,240,80,0.3)`, top half has a very subtle `--accent-dim` background gradient, icon and label in `--accent`
- Locked cell: border `--border-subtle`, icon and label in `--text-muted`, a lock icon overlaid at top-right
- Below each granted cell: spend meter + label "X SUI / Y SUI today"
- Granted cells have a subtle pulsing glow animation (opacity 0.6 to 1.0, 2s ease-in-out infinite)

---

## PART 4 — APP STRUCTURE AND ROUTES

```
/                     Landing page (public, unauthenticated)
/app                  App shell — redirects to /app/agents if wallet connected
/app/agents           Command Center — My Agents list (wallet required)
/app/agents/:id       Agent detail view (wallet required)
/app/explorer         Agent Explorer (public, no wallet)
/app/integrations     Integration Directory (public)
/demo                 Demo Mode (fullscreen, no sidebar)
```

The app shell (`/app/*`) renders a persistent sidebar + top navbar layout. The landing page `/` and `/demo` render without the sidebar.

If a user navigates to `/app/*` without a wallet connected, show a full-screen wallet connection prompt — not a redirect.

---

## PART 5 — FOLDER STRUCTURE

Create this exactly:

```
acp-studio/
├── index.html
├── vite.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── package.json
├── .env.example
└── src/
    ├── main.tsx
    ├── App.tsx
    ├── constants/
    │   ├── package.ts
    │   └── permissions.ts
    ├── types/
    │   └── index.ts
    ├── hooks/
    │   ├── useAgentIdentities.ts
    │   ├── usePermissionCapsule.ts
    │   ├── useAgentHistory.ts
    │   └── useTransactions.ts
    ├── lib/
    │   └── utils.ts
    ├── components/
    │   ├── layout/
    │   │   ├── AppShell.tsx
    │   │   ├── Sidebar.tsx
    │   │   └── Navbar.tsx
    │   ├── ui/
    │   │   ├── Button.tsx
    │   │   ├── Card.tsx
    │   │   ├── Badge.tsx
    │   │   ├── SpendMeter.tsx
    │   │   ├── PermissionGrid.tsx
    │   │   ├── CountdownTimer.tsx
    │   │   ├── AddressDisplay.tsx
    │   │   ├── TransactionFeedback.tsx
    │   │   └── GeometricDecorations.tsx
    │   ├── agent/
    │   │   ├── AgentCard.tsx
    │   │   ├── AgentList.tsx
    │   │   ├── AgentDetail.tsx
    │   │   ├── MintAgentModal.tsx
    │   │   └── DelegationTree.tsx
    │   ├── capsule/
    │   │   ├── CapsuleVisualizer.tsx
    │   │   ├── AttachCapsuleModal.tsx
    │   │   ├── RevokeButton.tsx
    │   │   └── WhitelistManager.tsx
    │   ├── explorer/
    │   │   ├── ExplorerSearch.tsx
    │   │   └── AgentReadOnlyView.tsx
    │   ├── integrations/
    │   │   ├── IntegrationCard.tsx
    │   │   └── AdapterModal.tsx
    │   └── demo/
    │       ├── DemoShell.tsx
    │       ├── Panel1Mint.tsx
    │       ├── Panel2Capsule.tsx
    │       ├── Panel3Authorized.tsx
    │       ├── Panel4Rejection.tsx
    │       └── DemoEventFeed.tsx
    └── pages/
        ├── Landing.tsx
        ├── CommandCenter.tsx
        ├── AgentDetailPage.tsx
        ├── ExplorerPage.tsx
        ├── IntegrationsPage.tsx
        └── DemoPage.tsx
```

---

## PART 6 — CONSTANTS AND TYPES

### src/constants/package.ts
```typescript
export const PACKAGE_ID = import.meta.env.VITE_PACKAGE_ID as string;
export const NETWORK = import.meta.env.VITE_NETWORK as string;
export const RPC_URL = import.meta.env.VITE_RPC_URL as string;
export const CLOCK_OBJECT_ID = '0x6';
export const DEEPBOOK_ADAPTER_ID = import.meta.env.VITE_DEEPBOOK_ADAPTER_ID as string;

export const MODULE_AGENT_IDENTITY = `${PACKAGE_ID}::agent_identity`;
export const MODULE_PERMISSION_CAPSULE = `${PACKAGE_ID}::permission_capsule`;

export const AGENT_IDENTITY_TYPE = `${MODULE_AGENT_IDENTITY}::AgentIdentity`;
export const PERMISSION_CAPSULE_TYPE = `${MODULE_PERMISSION_CAPSULE}::PermissionCapsule`;
```

### src/constants/permissions.ts
```typescript
export enum Permission {
  QUERY = 0,
  SWAP = 1,
  SUPPLY = 2,
  COLLECT = 3,
  STAKE = 4,
  TRANSFER_WHITELIST = 5,
  ORDER = 6,
  DELEGATE = 7,
}

export const PERMISSION_META: Record<Permission, { label: string; description: string; icon: string }> = {
  [Permission.QUERY]:              { label: 'QUERY',     description: 'Read public onchain state',          icon: 'Search' },
  [Permission.SWAP]:               { label: 'SWAP',      description: 'Token exchange on DEXs',             icon: 'ArrowLeftRight' },
  [Permission.SUPPLY]:             { label: 'SUPPLY',    description: 'Deposit into lending protocols',     icon: 'TrendingUp' },
  [Permission.COLLECT]:            { label: 'COLLECT',   description: 'Claim earned yield and rewards',     icon: 'Download' },
  [Permission.STAKE]:              { label: 'STAKE',     description: 'Native SUI staking operations',      icon: 'Lock' },
  [Permission.TRANSFER_WHITELIST]: { label: 'TRANSFER',  description: 'Send to pre-approved addresses',     icon: 'Send' },
  [Permission.ORDER]:              { label: 'ORDER',     description: 'Place orders on DeepBook',           icon: 'BookOpen' },
  [Permission.DELEGATE]:           { label: 'DELEGATE',  description: 'Create sub-agent capsules',          icon: 'GitBranch' },
};

export const ALL_PERMISSIONS = Object.values(Permission).filter(v => typeof v === 'number') as Permission[];
```

### src/types/index.ts
```typescript
export interface AgentIdentityObject {
  id: string;
  owner: string;
  name: string;
  createdEpoch: number;
  actionCount: number;
}

export interface PermissionCapsuleObject {
  id: string;
  agentId: string;
  issuer: string;
  permissions: number[];
  protocolWhitelist: string[];
  spendPerTx: bigint;
  dailyLimit: bigint;
  lifetimeLimit: bigint;
  spentToday: bigint;
  spentTotal: bigint;
  lastResetEpoch: number;
  expiryEpoch: number;
  isExpired: boolean;
  isActive: boolean;
}

export interface ActionEvent {
  id: string;
  type: string;
  agentId: string;
  txDigest: string;
  timestampMs: number;
  data: Record<string, unknown>;
}

export type CapsuleStatus = 'active' | 'expired' | 'revoked' | 'none';
```

### src/lib/utils.ts
```typescript
export const suiToMist = (sui: number): bigint => BigInt(Math.round(sui * 1_000_000_000));
export const mistToSui = (mist: bigint): number => Number(mist) / 1_000_000_000;
export const formatSui = (mist: bigint): string => `${mistToSui(mist).toFixed(4)} SUI`;
export const truncateAddress = (addr: string, chars = 6): string =>
  `${addr.slice(0, chars + 2)}...${addr.slice(-chars)}`;
export const suiscanTxUrl = (digest: string): string =>
  `https://suiscan.xyz/testnet/tx/${digest}`;
export const suiscanObjectUrl = (id: string): string =>
  `https://suiscan.xyz/testnet/object/${id}`;
export const epochToDate = (epoch: number): Date => new Date(epoch * 24 * 60 * 60 * 1000);
export const bytesToString = (bytes: number[]): string =>
  new TextDecoder().decode(new Uint8Array(bytes));
```

---

## PART 7 — HOOKS

### src/hooks/useAgentIdentities.ts

```typescript
import { useCurrentAccount, useSuiClientQuery } from '@mysten/dapp-kit';
import { AGENT_IDENTITY_TYPE } from '../constants/package';
import { AgentIdentityObject } from '../types';
import { bytesToString } from '../lib/utils';

export function useAgentIdentities(overrideAddress?: string) {
  const currentAccount = useCurrentAccount();
  const address = overrideAddress ?? currentAccount?.address;

  const { data, isLoading, error, refetch } = useSuiClientQuery(
    'getOwnedObjects',
    {
      owner: address ?? '',
      filter: { StructType: AGENT_IDENTITY_TYPE },
      options: { showContent: true, showType: true },
    },
    { enabled: !!address }
  );

  const agents: AgentIdentityObject[] = (data?.data ?? []).map((obj) => {
    const fields = (obj.data?.content as any)?.fields;
    return {
      id: obj.data?.objectId ?? '',
      owner: fields?.owner ?? '',
      name: Array.isArray(fields?.name) ? bytesToString(fields.name) : fields?.name ?? '',
      createdEpoch: Number(fields?.created_epoch ?? 0),
      actionCount: Number(fields?.action_count ?? 0),
    };
  });

  return { agents, isLoading, error, refetch };
}
```

### src/hooks/usePermissionCapsule.ts

```typescript
import { useCurrentAccount, useSuiClientQuery } from '@mysten/dapp-kit';
import { PERMISSION_CAPSULE_TYPE } from '../constants/package';
import { PermissionCapsuleObject } from '../types';

export function usePermissionCapsule(agentId: string, overrideOwner?: string) {
  const currentAccount = useCurrentAccount();
  const owner = overrideOwner ?? currentAccount?.address;

  const { data, isLoading, error, refetch } = useSuiClientQuery(
    'getOwnedObjects',
    {
      owner: owner ?? '',
      filter: { StructType: PERMISSION_CAPSULE_TYPE },
      options: { showContent: true },
    },
    { enabled: !!owner && !!agentId }
  );

  const allCapsules = data?.data ?? [];
  const match = allCapsules.find((obj) => {
    const fields = (obj.data?.content as any)?.fields;
    return fields?.agent_id === agentId;
  });

  let capsule: PermissionCapsuleObject | null = null;
  if (match) {
    const fields = (match.data?.content as any)?.fields;
    const expiryEpoch = Number(fields?.expiry_epoch ?? 0);
    // Sui epoch approximation: use checkpoint-based epoch. For display, compare to current time.
    const nowEpoch = Math.floor(Date.now() / (24 * 60 * 60 * 1000));
    const isExpired = expiryEpoch > 0 && nowEpoch > expiryEpoch;
    capsule = {
      id: match.data?.objectId ?? '',
      agentId: fields?.agent_id ?? '',
      issuer: fields?.issuer ?? '',
      permissions: fields?.permissions ?? [],
      protocolWhitelist: fields?.protocol_whitelist ?? [],
      spendPerTx: BigInt(fields?.spend_per_tx ?? 0),
      dailyLimit: BigInt(fields?.daily_limit ?? 0),
      lifetimeLimit: BigInt(fields?.lifetime_limit ?? 0),
      spentToday: BigInt(fields?.spent_today ?? 0),
      spentTotal: BigInt(fields?.spent_total ?? 0),
      lastResetEpoch: Number(fields?.last_reset_epoch ?? 0),
      expiryEpoch,
      isExpired,
      isActive: !isExpired,
    };
  }

  return {
    capsule,
    isLoading,
    error,
    refetch,
    hasCapsule: !!capsule,
    isExpired: capsule?.isExpired ?? false,
    isActive: capsule?.isActive ?? false,
  };
}
```

### src/hooks/useAgentHistory.ts

```typescript
import { useSuiClient } from '@mysten/dapp-kit';
import { useQuery } from '@tanstack/react-query';
import { ActionEvent } from '../types';
import { PACKAGE_ID } from '../constants/package';

export function useAgentHistory(agentId: string) {
  const client = useSuiClient();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['agentHistory', agentId],
    queryFn: async () => {
      if (!agentId) return [];
      const result = await client.queryEvents({
        query: { MoveModule: { package: PACKAGE_ID, module: 'permission_capsule' } },
        limit: 50,
        order: 'descending',
      });
      // Filter events related to this agent
      return result.data
        .filter((e) => {
          const parsed = e.parsedJson as any;
          return parsed?.agent_id === agentId || parsed?.capsule_id !== undefined;
        })
        .map((e): ActionEvent => ({
          id: e.id.txDigest + e.id.eventSeq,
          type: e.type.split('::').pop() ?? e.type,
          agentId: (e.parsedJson as any)?.agent_id ?? agentId,
          txDigest: e.id.txDigest,
          timestampMs: Number(e.timestampMs ?? 0),
          data: e.parsedJson as Record<string, unknown>,
        }));
    },
    enabled: !!agentId,
    refetchInterval: 10000,
  });

  return { events: data ?? [], isLoading, error, refetch };
}
```

### src/hooks/useTransactions.ts

```typescript
import { useSignAndExecuteTransaction, useSuiClient } from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';
import { PACKAGE_ID, CLOCK_OBJECT_ID, DEEPBOOK_ADAPTER_ID } from '../constants/package';
import { suiToMist } from '../lib/utils';

export function useTransactions() {
  const { mutateAsync: signAndExecute } = useSignAndExecuteTransaction();
  const client = useSuiClient();

  const execute = async (tx: Transaction) => {
    const result = await signAndExecute({ transaction: tx });
    await client.waitForTransaction({ digest: result.digest });
    return result;
  };

  const mintAgentIdentity = async (name: string, agentAddress: string) => {
    const tx = new Transaction();
    tx.moveCall({
      target: `${PACKAGE_ID}::agent_identity::mint_agent_identity`,
      arguments: [
        tx.pure.vector('u8', Array.from(new TextEncoder().encode(name))),
        tx.pure.address(agentAddress),
        tx.object(CLOCK_OBJECT_ID),
      ],
    });
    return execute(tx);
  };

  const attachPermissionCapsule = async (params: {
    agentId: string;
    permissions: number[];
    protocolWhitelist: string[];
    spendPerTxSui: number;
    dailyLimitSui: number;
    lifetimeLimitSui: number;
    expiryEpoch: number;
  }) => {
    const tx = new Transaction();
    tx.moveCall({
      target: `${PACKAGE_ID}::permission_capsule::mint_permission_capsule`,
      arguments: [
        tx.pure.id(params.agentId),
        tx.pure.vector('u8', params.permissions),
        tx.pure.vector('address', params.protocolWhitelist),
        tx.pure.u64(suiToMist(params.spendPerTxSui)),
        tx.pure.u64(suiToMist(params.dailyLimitSui)),
        tx.pure.u64(suiToMist(params.lifetimeLimitSui)),
        tx.pure.u64(params.expiryEpoch),
        tx.object(CLOCK_OBJECT_ID),
      ],
    });
    return execute(tx);
  };

  const revokePermission = async (capsuleId: string) => {
    const tx = new Transaction();
    tx.moveCall({
      target: `${PACKAGE_ID}::permission_capsule::revoke_permission`,
      arguments: [tx.object(capsuleId)],
    });
    return execute(tx);
  };

  // Demo: authorized DeepBook trade
  const executeAuthorizedTrade = async (capsuleId: string) => {
    const tx = new Transaction();
    tx.moveCall({
      target: `${DEEPBOOK_ADAPTER_ID}::deepbook_adapter::execute_order`,
      arguments: [
        tx.object(capsuleId),
        tx.object(CLOCK_OBJECT_ID),
      ],
    });
    return execute(tx);
  };

  // Demo: unauthorized action — calls a function that will abort
  const executeUnauthorizedTransfer = async (capsuleId: string) => {
    const tx = new Transaction();
    // This calls validate_and_charge with TRANSFER_WHITELIST (5) permission.
    // If the capsule doesn't have permission 5, Move will abort with an error code.
    tx.moveCall({
      target: `${PACKAGE_ID}::permission_capsule::validate_and_charge`,
      arguments: [
        tx.object(capsuleId),
        tx.pure.u8(5), // TRANSFER_WHITELIST — not in demo capsule
        tx.pure.u64(suiToMist(1)),
        tx.object(CLOCK_OBJECT_ID),
      ],
    });
    return execute(tx);
  };

  return {
    mintAgentIdentity,
    attachPermissionCapsule,
    revokePermission,
    executeAuthorizedTrade,
    executeUnauthorizedTransfer,
  };
}
```

---

## PART 8 — REUSABLE UI COMPONENTS

### TransactionFeedback Component

This component is used after every transaction. It has three states:

**Loading:** Dark card, pulsing border in `--accent`, spinner icon, text "Submitting to Sui testnet..."

**Success:** Green checkmark that scales in with framer-motion (scale: 0→1, duration 0.3s). Text "Transaction confirmed" in `--accent`. Below it: the digest in `IBM Plex Mono` 12px, truncated to first 8 chars + `...` + last 8 chars, with a copy icon and a link icon that opens `suiscanTxUrl(digest)` in a new tab.

**Error:** Red X that shakes with framer-motion (x: 0→-4→4→-4→4→0, duration 0.4s). Text "Transaction failed" in `--error`. Below it: the raw error message in `IBM Plex Mono` 12px, max-height 120px, overflow-y scroll. If the error contains an abort code pattern (e.g., `MoveAbort(..., X)`), parse X and show "Abort code: X" prominently above the full error.

### PermissionGrid Component

An 8-cell grid: 4 columns × 2 rows on desktop, 2 columns × 4 rows on mobile.

Each cell receives: `permissionType: Permission`, `isGranted: boolean`, `spentToday?: bigint`, `dailyLimit?: bigint`

Granted cell layout (top to bottom):
- Permission icon from lucide-react (20px, color `--accent`)
- Permission label (QUERY, SWAP, etc.) — Inter 500 12px uppercase, color `--accent`
- If dailyLimit > 0: SpendMeter component below label
- Pulsing glow animation: `@keyframes permGlow { 0%,100% { opacity:0.7 } 50% { opacity:1 } }` applied to the icon

Locked cell layout:
- Permission icon (20px, color `--text-muted`)
- Permission label — `--text-muted`
- Lock icon (12px) at top-right corner of cell, color `--text-muted`
- No spend meter

### SpendMeter Component

Props: `spent: bigint`, `limit: bigint`, `label: string`

Renders: label on left, `X.XX / Y.YY SUI` on right in `IBM Plex Mono` 11px, progress bar below spanning full width.

Fill percentage = `Number(spent) / Number(limit) * 100` — clamped to 0–100.

Color logic:
- 0–79%: fill `--accent`
- 80–99%: fill `--text-warning` + show small warning icon next to label
- 100%: fill `--text-error` + label changes to "LIMIT REACHED"

### CountdownTimer Component

Props: `expiryEpoch: number`

Displays time remaining as `Xd Xh Xm`. Refreshes every 60 seconds.

When under 24 hours: text color `--text-warning`, blinking dot indicator
When expired: text "EXPIRED", color `--text-error`

Note: Since Sui epochs are checkpoint-based and vary in duration, calculate remaining time from current timestamp as an approximation. Use `expiryEpoch * 24 * 60 * 60 * 1000` as expiry timestamp in ms.

### AddressDisplay Component

Props: `address: string`, `chars?: number`, `showCopy?: boolean`, `showLink?: boolean`

Renders address truncated. Copy button copies full address to clipboard. Link button opens suiscan. Font: `IBM Plex Mono` 13px, color `--text-secondary`.

### GeometricDecorations Component

SVG-based decorative elements used in landing and demo.

`<CrosshairMarker />` — SVG 8×8, two lines forming a +, stroke `--border-default`, strokeWidth 1

`<CornerBrackets />` — four L-shapes in CSS positioned absolute at corners of a parent. Use with `position: relative` on parent. Size prop defaults to 12px.

`<AmbientGlow color="amber" | "red" | "green" />` — an absolutely positioned div, 600×600px, borderRadius 50%, using radial-gradient from the appropriate token color to transparent. Pointer-events none. Used behind hero content.

---

## PART 9 — PAGES IN FULL DETAIL

### Landing Page (`/`)

Full-width, no sidebar. Background `--bg-base`.

**Navbar (landing only):**
- Fixed top, height 56px, background `rgba(10,10,10,0.8)`, backdrop-filter blur 12px
- Left: ACP logo — a small geometric shield icon (SVG, color `--accent`) + text "ACP Studio" in Space Grotesk 600 18px
- Right: Two buttons — "Explore Agents" (secondary) + "Launch App" (primary, `--accent`)
- On mobile: hamburger menu

**Hero Section:**
- Padding top 140px, centered
- Eyebrow label: small pill, text "Agent Credential Protocol", background `--bg-surface`, border `--border-default`
- `<AmbientGlow color="amber" />` centered behind the hero text
- Headline H1: Space Grotesk 700, 72px desktop / 44px mobile, line-height 1.05, color `--text-primary`
  Text: "Authorization infrastructure for autonomous agents on Sui."
  The word "autonomous" gets a dark pill highlight background (`--bg-elevated`) inline, like the Sui.io keyword treatment.
- Subheadline: Inter 400 18px, color `--text-secondary`, max-width 560px, centered, margin-top 24px
  Text: "ACP gives every AI agent a verifiable onchain identity and a permission capsule whose scope is enforced by Move's type system — not application logic."
- CTA row: two buttons, centered, gap 12px, margin-top 40px
  - "Launch App" (primary large — height 48px, px 28px)
  - "Read Whitepaper →" (secondary, links to Mirror)
- Below CTAs: onchain proof line in `IBM Plex Mono` 12px, color `--text-muted`
  Text: `Package: 0x9f6dd2d4...456ce · Sui Testnet · Deployed June 2026`
  With crosshair markers on either side
- `<CrosshairMarker />` placed at 4 corners of the hero section

**Three-Column Feature Cards Section:**
Three tall cards, thin border, radius-lg, padding 32px. Vertical stagger: middle card is 24px lower than the two side cards (CSS translateY).

Card 1 — "Identity Layer": icon (User), headline, 2-line description about AgentIdentity
Card 2 — "Permission Capsule": icon (Shield), headline, description about type-enforced authorization
Card 3 — "Subset Delegation": icon (GitBranch), headline, description about sub-agent privilege escalation prevention

Below cards: a divider line, then a horizontal stats row:
`1 Live Integration · 8 Permission Types · Type-System Enforcement · Open Protocol`

**The Rejection Moment Section:**
A full-width dark panel, background `--bg-surface`, border-top `--border-subtle`. Padding 80px vertical.
Left side: headline "The moment that matters." + paragraph text explaining the rejection concept.
Right side: a mock terminal window (dark card, radius-md, monospace font) showing a simulated abort code:
```
> Attempting external transfer...
  PermissionCapsule: TRANSFER_WHITELIST not granted
  MoveAbort(MoveLocation { module: ..., function: 2, instruction: 14 }, 1)

Enforcement layer: Move type system.
Not application logic.
```
Text in the terminal: `--text-error` for the abort line, `--text-secondary` for the rest.

**Footer:** Simple, dark. Left: ACP Studio + tagline. Right: links (GitHub, Mirror, Suiscan package link).

---

### App Shell (`/app/*`)

Persistent layout. The outer container is `display: flex, height: 100vh`.

**Sidebar:** Fixed left, width 220px, background `rgba(10,10,10,0.95)`, border-right `--border-subtle`. Top: ACP logo. Navigation items below with 8px gap:

- My Agents (Cpu icon) — routes to `/app/agents`
- Agent Explorer (Search icon) — routes to `/app/explorer`
- Integrations (Grid icon) — routes to `/app/integrations`
- Demo Mode (Play icon) — routes to `/demo`, opens in same tab

At bottom of sidebar: wallet address display (AddressDisplay component), disconnect button.

Active nav item: left border 3px `--accent`, background `--accent-dim`, text `--accent`.

**Navbar:** Fixed top, height 52px, background `rgba(10,10,10,0.9)`, backdrop-filter blur 8px, border-bottom `--border-subtle`. Left: current page title. Right: network badge (pill: "Testnet", background `--bg-elevated`, text `--text-secondary`) + wallet address chip.

**Main content:** `margin-left: 220px`, padding 32px, overflow-y auto.

**No wallet state:** If wallet not connected, render full-screen overlay inside the content area with centered wallet connect button and message "Connect a wallet to manage your agents."

---

### Command Center — My Agents (`/app/agents`)

**List state:**

Top bar: "My Agents" heading in Space Grotesk 600 28px + "Create Agent" primary button (right-aligned).

Real-time event feed at the very bottom (renders last): horizontal strip, background `--bg-surface`, border-top `--border-subtle`, height 48px, showing the 3 most recent events across all agents as scrolling text chips. Refreshes every 10 seconds via `useAgentHistory`.

Agent grid: 2 columns on desktop, 1 column on mobile. Uses `AgentCard` component.

`AgentCard` component — Card with left accent stripe when capsule is active:
- Top row: agent name (Space Grotesk 600 16px) + status badge right-aligned
- Status badges: "ACTIVE" (`--accent`), "EXPIRED" (`--text-warning`), "NO CAPSULE" (`--text-muted`)
- Object ID below name: AddressDisplay component
- Metrics row: "Created epoch X · Y actions"
- Permission preview: if capsule exists, show mini permission icons (just the icon, no label) for granted permissions in a row, max 4 visible
- Bottom: "View Details" link, right-aligned

Click anywhere on card → navigate to `/app/agents/:id`

Empty state (no agents): centered, icon (Bot), headline "No agents yet", subtext, "Create your first agent" button.

**Detail state (`/app/agents/:id`):**

Back button top-left. Then five vertical panels:

**Panel 1 — Agent Identity Card**
Card with corner bracket decorations. Top row: agent name large + status badge. Grid below (2×2): Object ID, Owner Address, Created Epoch, Action Count. Each cell: label in `--text-muted` uppercase 11px, value below.

**Panel 2 — Permission Capsule**
If no capsule: empty state with "Attach Permission Capsule" button → opens AttachCapsuleModal.
If capsule: CapsuleVisualizer component (PermissionGrid) + below it in a row: expiry countdown, issuer address. Bottom right: "Update Capsule" and "Revoke Agent" buttons.

**Panel 3 — Protocol Whitelist**
Heading "Authorized Protocols". Renders whitelisted addresses as named cards. Known addresses map:
- DeepBook mainnet/testnet package → "DeepBook · ORDER"
- NAVI → "NAVI Protocol · SUPPLY, COLLECT"
- Unknown addresses: show truncated address + "Unknown Protocol"

Each card: protocol name, supported permissions as mini badges, a checkmark icon. "Edit Whitelist" button top-right (future feature, disabled state is fine for hackathon).

**Panel 4 — Delegation Tree**
Only shown if agent has permission 7 (DELEGATE). If DELEGATE not in capsule permissions, do not render this panel.
If DELEGATE is granted but no sub-agents exist: muted message "No sub-agents delegated yet."
If sub-agents exist: render tree using a simple SVG-based tree layout. Parent node at top, lines downward, child nodes below. Each node: small card with agent name, permission count badge.

**Panel 5 — Action History**
Heading "Action History". List of ActionEvent objects from `useAgentHistory`. Each row:
- Event type on left (colored chip based on type)
- Timestamp (relative: "3 minutes ago")
- Tx digest (monospace, truncated, link to Suiscan)
- Right: external link icon

Infinite empty state: "No actions recorded yet. Actions appear here as the agent operates."

**MintAgentModal (5-step):**

Step 1 — Name: text input "Agent name", placeholder "LiveTradingAgent_01"
Step 2 — Permissions: 8-cell grid (same visual as PermissionGrid but checkboxes). Toggle each on/off.
Step 3 — Limits: Three sliders, each labeled in SUI. "Max per transaction", "Daily limit", "Lifetime limit". Min: 0.1 SUI, Max: 1000 SUI.
Step 4 — Expiry: date picker. Min: tomorrow. Max: 1 year from now. Converts to approximate epoch.
Step 5 — Review: summary of all selections. "Agent Address" field (where to deploy — defaults to connected wallet). "Confirm & Deploy" primary button.

TransactionFeedback component renders below the confirm button when transaction is in flight.

**AttachCapsuleModal:** Same steps 2–5 as above (permission selection, limits, expiry, review). Pre-fills with current capsule values if updating.

**RevokeButton:**
Secondary destructive button "Revoke Agent". Click opens a modal: heading "Revoke this agent?", subtext "The PermissionCapsule will be permanently deleted. The agent will become structurally incapable of any authorized action.", two buttons: "Cancel" and "Revoke" (destructive). On confirm: fire revokePermission transaction. On success: transition the agent card in the background to a grayed-out revoked state (opacity 0.4, grayscale filter, "REVOKED" badge replaces status).

---

### Agent Explorer (`/app/explorer`)

No wallet required.

**Search bar:** Large, centered, placeholder "Search by Agent ID or wallet address". Below: subtext "Any agent on the ACP protocol is publicly auditable." Search button or press Enter.

Input validation: if value starts with `0x` and length > 20, treat as object/address query.

**Results:**
- If wallet address → fetch all AgentIdentity objects owned by that address → show grid of AgentCard (read-only variant, no action buttons)
- If object ID → fetch single object → if it's an AgentIdentity, show detail directly; if not found, show "Agent not found" error state

**AgentReadOnlyView:** Same panels as the detail view in Command Center but with all action buttons removed. Read-only badge at top: "Read-only · Public Explorer". "Connect wallet to manage this agent" shown if the agent is owned by the connected wallet.

---

### Integration Directory (`/app/integrations`)

**Stats bar:** Three numbers in a horizontal row, separated by dots:
`1 live integration · 3 coming soon · 8 permission types`

**Developer callout banner:** Full-width, background `--bg-surface`, border `--border-subtle`, padding 24px. Text: "Building on Sui? Add one Move module and your protocol becomes accessible to every ACP-credentialed agent." GitHub link button right-aligned.

**Protocol card grid:** 2 columns desktop, 1 column mobile. `IntegrationCard` component.

Static config (hardcode in a file `src/data/integrations.ts`):
```typescript
const INTEGRATIONS = [
  {
    name: 'DeepBook',
    description: "Sui's native central limit order book. Place and manage limit orders with ACP authorization.",
    permissions: [6], // ORDER
    adapterId: PACKAGE_ID, // using mock for hackathon
    status: 'live',
    color: '#4f9cf9',
  },
  {
    name: 'NAVI Protocol',
    description: 'Leading lending and borrowing protocol on Sui.',
    permissions: [2, 3], // SUPPLY, COLLECT
    adapterId: null,
    status: 'coming_soon',
    color: '#9b59b6',
  },
  {
    name: 'Cetus',
    description: 'Concentrated liquidity DEX on Sui.',
    permissions: [1], // SWAP
    adapterId: null,
    status: 'coming_soon',
    color: '#27ae60',
  },
  {
    name: 'Scallop',
    description: 'Institutional-grade lending on Sui.',
    permissions: [2, 3], // SUPPLY, COLLECT
    adapterId: null,
    status: 'coming_soon',
    color: '#e67e22',
  },
];
```

Each card: protocol name (Space Grotesk 600 18px) + colored initial avatar top-left + status badge top-right. Description text. Permission badges row. Adapter ID or "Integration pending" in monospace. "View Adapter Pattern" button → opens AdapterModal.

AdapterModal: shows a TypeScript code snippet demonstrating how a protocol would build an adapter. Dark code block, syntax highlighted by color.

---

### Demo Mode (`/demo`)

Full-screen takeover. No sidebar. Background `--bg-base` with grid overlay.

**Top bar:** "ACP STUDIO · DEMO MODE" in uppercase monospace left-aligned. Back to app link right-aligned. Progress indicator: four dots, active one glows `--accent`.

**Main area:** One active panel at a time, centered, max-width 640px. Panels are tall cards with corner bracket decorations.

**Panel 1 — Mint Identity:**
Heading "STEP 01 · MINT AGENT IDENTITY"
Pre-filled agent name: "LiveTradingAgent_01"
Description: "Create a permanent onchain identity for the agent."
`<AmbientGlow color="amber" />` behind card.
Large primary button "Mint Agent Identity →".
TransactionFeedback renders below on click.
On success: "Next: Attach Permission →" button appears. Auto-advance after 3 seconds.

**Panel 2 — Attach Capsule:**
Heading "STEP 02 · ATTACH PERMISSION CAPSULE"
Shows pre-configured capsule summary:
- Permissions: ORDER only (shown as active badge)
- Spend limit: 20 SUI per transaction
- Expiry: 24 hours
- Whitelist: DeepBook
Description: "The capsule defines exactly what this agent can do. Nothing more."
Large primary button "Attach Permission Capsule →".
TransactionFeedback below.
On success: auto-advance after 3 seconds.

**Panel 3 — Authorized Trade:**
Heading "STEP 03 · EXECUTE AUTHORIZED TRADE"
PermissionGrid showing the active capsule (ORDER lit green, rest locked).
Description: "The agent attempts a DeepBook order — within its mandate."
Large primary button "Execute Trade on DeepBook →".
TransactionFeedback below.
On success: green success state, tx digest link, auto-advance after 4 seconds.

**Panel 4 — Unauthorized Transfer:**
Heading "STEP 04 · ATTEMPT UNAUTHORIZED TRANSFER"
Description: "The agent attempts an action outside its permission scope."
Warning accent: "This will fail. That is the proof."
Button: "Attempt External Transfer →" — styled with `--error` border, `--error` text.

On click:
1. Button shows loading state
2. Transaction fires (calls validate_and_charge with TRANSFER_WHITELIST = 5)
3. Transaction aborts (Move blocks it)
4. **THE REJECTION MOMENT:**
   - The panel card does a shake animation (framer-motion: x keyframes 0→-6→6→-6→6→-3→3→0, duration 0.5s)
   - Background of the panel pulses: `--error-glow` overlay flashes in (opacity 0→0.4→0 over 0.8s)
   - Red X icon appears, scaled from 0→1 (framer-motion, duration 0.3s)
   - Bold red text: "UNAUTHORIZED ATTEMPT BLOCKED"
   - Below: raw abort code in `IBM Plex Mono` 13px `--error` color (e.g., `MoveAbort(..., 1)`)
   - 3-second pause (important — let it land)
   - Then fade in: "Enforcement layer: Move type system. Not application logic." — Inter 400 15px, `--text-secondary`
   - Then fade in: Suiscan link to the failed transaction

**Demo event feed:** Fixed bottom strip, height 44px, background `--bg-surface`, border-top `--border-subtle`. Shows live events from `useAgentHistory` for the demo agent. Auto-refreshes every 10 seconds. Chips scroll left-to-right as new events arrive.

---

## PART 10 — TECH STACK AND CONFIG

### package.json
```json
{
  "name": "acp-studio",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "@mysten/dapp-kit": "^0.14.0",
    "@mysten/sui": "^1.0.0",
    "@tanstack/react-query": "^5.0.0",
    "framer-motion": "^11.0.0",
    "lucide-react": "^0.383.0",
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "react-router-dom": "^6.23.0"
  },
  "devDependencies": {
    "@types/react": "^18.3.0",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0",
    "tailwindcss": "^3.4.0",
    "typescript": "^5.4.0",
    "vite": "^5.3.0"
  }
}
```

### tailwind.config.ts
Extend the theme with all color tokens from Part 3. Map them as CSS custom properties via the `extend.colors` and `extend.fontFamily` sections. Use `content: ['./index.html', './src/**/*.{ts,tsx}']`.

### vite.config.ts
Standard React + TypeScript Vite config. No special plugins needed.

### .env.example
```
VITE_PACKAGE_ID=0x9f6dd2d41950987cb4e9ad5ca36b124e0799a12ac60bbb10c16b034a936456ce
VITE_NETWORK=testnet
VITE_RPC_URL=https://fullnode.testnet.sui.io:443
VITE_DEEPBOOK_ADAPTER_ID=YOUR_DEEPBOOK_ADAPTER_ID_HERE
```

### src/main.tsx
```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SuiClientProvider, WalletProvider, createNetworkConfig } from '@mysten/dapp-kit';
import { getFullnodeUrl } from '@mysten/sui/client';
import '@mysten/dapp-kit/dist/index.css';
import './index.css';
import App from './App';

const { networkConfig } = createNetworkConfig({
  testnet: { url: getFullnodeUrl('testnet') },
});

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider networks={networkConfig} defaultNetwork="testnet">
        <WalletProvider autoConnect>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </WalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
```

### src/App.tsx
```tsx
import { Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import AppShell from './components/layout/AppShell';
import CommandCenter from './pages/CommandCenter';
import AgentDetailPage from './pages/AgentDetailPage';
import ExplorerPage from './pages/ExplorerPage';
import IntegrationsPage from './pages/IntegrationsPage';
import DemoPage from './pages/DemoPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/demo" element={<DemoPage />} />
      <Route path="/app" element={<AppShell />}>
        <Route index element={<Navigate to="/app/agents" replace />} />
        <Route path="agents" element={<CommandCenter />} />
        <Route path="agents/:id" element={<AgentDetailPage />} />
        <Route path="explorer" element={<ExplorerPage />} />
        <Route path="integrations" element={<IntegrationsPage />} />
      </Route>
    </Routes>
  );
}
```

---

## PART 11 — GLOBAL CSS

In `src/index.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --bg-base: #0a0a0a;
  --bg-surface: #111111;
  --bg-elevated: #161616;
  --bg-input: #0f0f0f;
  --border-subtle: #1e1e1e;
  --border-default: #2a2a2a;
  --border-active: #c8f050;
  --border-red: #ff4444;
  --text-primary: #e8e8e8;
  --text-secondary: #888888;
  --text-muted: #444444;
  --text-accent: #c8f050;
  --text-error: #ff4444;
  --text-warning: #f0a050;
  --accent: #c8f050;
  --accent-dim: rgba(200, 240, 80, 0.1);
  --accent-glow: rgba(200, 240, 80, 0.15);
  --error: #ff4444;
  --error-dim: rgba(255, 68, 68, 0.1);
  --error-glow: rgba(255, 68, 68, 0.2);
  --amber-glow: rgba(200, 120, 40, 0.18);
  --grid-line: rgba(255, 255, 255, 0.04);
}

* { box-sizing: border-box; margin: 0; padding: 0; }

body {
  background-color: var(--bg-base);
  color: var(--text-primary);
  font-family: 'Inter', sans-serif;
  -webkit-font-smoothing: antialiased;
}

.font-mono { font-family: 'IBM Plex Mono', monospace; }
.font-display { font-family: 'Space Grotesk', sans-serif; }

/* Grid overlay */
.grid-overlay {
  background-image:
    linear-gradient(var(--grid-line) 1px, transparent 1px),
    linear-gradient(90deg, var(--grid-line) 1px, transparent 1px);
  background-size: 48px 48px;
}

/* Permission glow pulse */
@keyframes permGlow {
  0%, 100% { opacity: 0.7; }
  50% { opacity: 1; }
}
.perm-glow { animation: permGlow 2s ease-in-out infinite; }

/* Scrollbar */
::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-track { background: var(--bg-base); }
::-webkit-scrollbar-thumb { background: var(--border-default); border-radius: 2px; }
```

---

## PART 12 — IMPLEMENTATION ORDER

Follow this exactly. Do not skip phases.

**Phase 1 — Project scaffolding**
Create: package.json, vite.config.ts, tailwind.config.ts, tsconfig.json, .env.example, index.html, src/index.css, src/main.tsx, src/App.tsx

**Phase 2 — Constants, types, utils, hooks**
Create: all files in src/constants/, src/types/index.ts, src/lib/utils.ts, all four hooks

**Phase 3 — Base UI components**
Create: Button, Card, Badge, SpendMeter, CountdownTimer, AddressDisplay, TransactionFeedback, PermissionGrid, GeometricDecorations

**Phase 4 — Layout components**
Create: AppShell (with Outlet), Sidebar, Navbar

**Phase 5 — Landing page**
Create: pages/Landing.tsx with all three sections (hero, feature cards, rejection moment)

**Phase 6 — Command Center**
Create: agent/* components, capsule/* components, pages/CommandCenter.tsx, pages/AgentDetailPage.tsx

**Phase 7 — Demo Mode**
Create: all demo/* components, pages/DemoPage.tsx. The rejection moment animation is the priority.

**Phase 8 — Explorer and Integrations**
Create: explorer/* components, integrations/* components, pages/ExplorerPage.tsx, pages/IntegrationsPage.tsx, src/data/integrations.ts

**Phase 9 — Polish pass**
Every loading state, every empty state, every error boundary. Mobile responsive check. Confirm all TransactionFeedback usages are wired. Confirm all transactions pass Clock.

---

## PART 13 — SELF-REVIEW CHECKLIST

Before you end your session, verify every item:

- [ ] Every Move call that requires Clock passes `tx.object('0x6')` — not a string, the actual object reference
- [ ] Every SUI input from a user is multiplied by 1,000,000,000 before being passed to Move functions
- [ ] PermissionGrid correctly shows 8 cells. Granted cells glow. Locked cells show lock icon.
- [ ] Demo Mode Panel 4 shows the raw abort code in `--error` color after the rejection
- [ ] The panel card shakes (framer-motion) on rejection. The background pulses red.
- [ ] TransactionFeedback links to `https://suiscan.xyz/testnet/tx/${digest}` — testnet URL, not mainnet
- [ ] Background is `--bg-base` (#0a0a0a) on every page
- [ ] `usePermissionCapsule` filters capsules by `agent_id` client-side — not assumes first capsule = current agent's capsule
- [ ] `waitForTransaction` is called after every `signAndExecuteTransaction` before refetching objects
- [ ] The landing page hero has the ambient glow effect
- [ ] Font is Space Grotesk for all H1/H2 headings, IBM Plex Mono for all onchain data
- [ ] Mobile layout works at 375px — sidebar collapses to a bottom nav or hamburger
- [ ] Empty states exist for: no agents, no capsule, no events, no search results
- [ ] The Integration Directory card for DeepBook shows "live" status. The other three show "coming soon"
- [ ] The Demo Mode progress indicator shows which step is active
- [ ] All address displays are truncated by default with copy-to-clipboard button

Fix every failure before ending the session.

---

## PART 14 — README

Create `README.md` in the project root:

```markdown
# ACP Studio

The management dashboard for Agent Credential Protocol — the authorization primitive for AI agents on Sui.

ACP gives every autonomous agent a verifiable onchain identity (AgentIdentity) and a permission capsule (PermissionCapsule) whose scope is enforced by Move's type system. Unauthorized actions are structurally impossible — not blocked by application logic.

## Protocol

Package ID: `0x9f6dd2d41950987cb4e9ad5ca36b124e0799a12ac60bbb10c16b034a936456ce`
Network: Sui Testnet

## Setup

```bash
npm install
cp .env.example .env
# Fill in VITE_DEEPBOOK_ADAPTER_ID in .env
npm run dev
```

## Pages

- **My Agents** — Create and manage agent identities and permission capsules
- **Agent Explorer** — Public, no wallet needed. Audit any agent's mandate and history
- **Integrations** — Protocols with ACP adapters
- **Demo Mode** — Four-panel live demonstration for hackathon judges

## Links

- [Move Protocol Repo](https://github.com/YOUR_REPO)
- [Whitepaper on Mirror](https://mirror.xyz/YOUR_MIRROR_LINK)
- [Protocol on Suiscan](https://suiscan.xyz/testnet/object/0x9f6dd2d41950987cb4e9ad5ca36b124e0799a12ac60bbb10c16b034a936456ce)
```

---

*That is everything. The Move protocol is live on testnet. The package ID is real. Build the product. Start with Phase 1.*

*Agent Credential Protocol · Raven North Studio · June 2026*


MOST IMPORTAND PART OF THE INSTRUCTION {{{ THE APP MAIN COLOR IS BLUE rgb(25, 0, 255) AND USES MORE OF CLASSIC NEUTRALS Classic Neutrals White: Provides a crisp, clean, and modern look that highlights other colors beautifully.Gray: A sleek, versatile choice that balances vibrant or dark palettes.Black: Adds an elegant, bold, and grounding effect, WHILE THE AI PD MIGHT SUGGEST DIGFFRENTN, THE APP IS MORE OF 80 PERCENT CLASSINE NEUTRALS, NO NVER PURE WHITE OR BLACK USE CREAM OR LIGHT GREY, NO PURE BLACK, NO PURE WHITE, THEN ALSO FINALLY KNOW WHEN TO USE THE MAIN BLUE COLOR TON MAKE IT TOO OVER POWERING AS IT IS A VERY SATURATED BLUE

NVERE USE GENERIC PILLS CHECK THE IAGES SENT FOR PILLS, NO GENERIC SCHADCN ICON ,USE HERO ICONS ONLY}}}