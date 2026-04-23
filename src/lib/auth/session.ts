import { cookies } from "next/headers";
import type { SessionPayload } from "./types";
import { SESSION_COOKIE } from "./constants";
import { decodeSessionPayload } from "./cookie-payload";

export { encodeSessionPayload } from "./cookie-payload";

/** Server Component / Route Handler: đọc phiên từ cookie. */
export async function getSession(): Promise<SessionPayload | null> {
  const jar = await cookies();
  const v = jar.get(SESSION_COOKIE)?.value;
  return v ? decodeSessionPayload(v) : null;
}
