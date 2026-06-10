export const PACKAGE_ID = import.meta.env.VITE_PACKAGE_ID as string;
export const NETWORK = import.meta.env.VITE_NETWORK as string;
export const RPC_URL = import.meta.env.VITE_RPC_URL as string;
export const CLOCK_OBJECT_ID = '0x6';
export const DEEPBOOK_ADAPTER_ID = import.meta.env.VITE_DEEPBOOK_ADAPTER_ID as string;

export const MODULE_AGENT_IDENTITY = `${PACKAGE_ID}::agent_identity`;
export const MODULE_PERMISSION_CAPSULE = `${PACKAGE_ID}::permission_capsule`;

export const AGENT_IDENTITY_TYPE = `${MODULE_AGENT_IDENTITY}::AgentIdentity`;
export const PERMISSION_CAPSULE_TYPE = `${MODULE_PERMISSION_CAPSULE}::PermissionCapsule`;