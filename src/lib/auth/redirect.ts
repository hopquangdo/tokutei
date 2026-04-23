import type { Role } from "./types";

export function defaultHomeForRole(role: Role): string {
  switch (role) {
    case "candidate":
      return "/candidate";
    case "agent":
      return "/agent";
  }
}

/** `next` chỉ được tin khi cùng khu với role sau khi login. */
export function safeRedirectPath(
  next: string | null | undefined,
  role: Role
): string {
  if (!next || !next.startsWith("/") || next.startsWith("//")) {
    return defaultHomeForRole(role);
  }
  const prefix = `/${role}`;
  if (next === prefix || next.startsWith(`${prefix}/`)) return next;
  return defaultHomeForRole(role);
}
