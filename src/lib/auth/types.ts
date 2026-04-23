export type Role = "candidate" | "agent" | "admin";

export type SessionPayload = {
  sub: string;
  name: string;
  email: string;
  role: Role;
};
