import type { SessionPayload } from "./types";

function isValidSession(data: unknown): data is SessionPayload {
  if (!data || typeof data !== "object") return false;
  const d = data as Record<string, unknown>;
  if (typeof d.sub !== "string" || typeof d.email !== "string" || typeof d.name !== "string")
    return false;
  const r = d.role;
  return r === "candidate" || r === "agent" || r === "admin";
}

/** Edge + Node, UTF-8 (tên hiển thị tiếng Việt). */
export function decodeSessionPayload(raw: string): SessionPayload | null {
  if (!raw?.trim()) return null;
  try {
    const b64 = raw.replace(/-/g, "+").replace(/_/g, "/");
    const pad = b64.length % 4;
    const padded = pad ? b64 + "====".slice(0, 4 - pad) : b64;
    const binary = atob(padded);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    const text = new TextDecoder().decode(bytes);
    const data = JSON.parse(text) as unknown;
    return isValidSession(data) ? data : null;
  } catch {
    return null;
  }
}

export function encodeSessionPayload(payload: SessionPayload): string {
  const utf8 = new TextEncoder().encode(JSON.stringify(payload));
  let bin = "";
  for (let i = 0; i < utf8.length; i++) {
    bin += String.fromCharCode(utf8[i]!);
  }
  const b64 = btoa(bin);
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
