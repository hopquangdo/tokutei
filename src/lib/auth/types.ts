export type Role = "candidate" | "agent";

export type SessionPayload = {
  sub: string;
  name: string;
  email: string;
  role: Role;
};
