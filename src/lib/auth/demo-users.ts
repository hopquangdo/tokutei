import type { Role } from "./types";

/** ステージング／開発用アカウント（平文パスワード・社内のみ） */
export type DemoUser = {
  id: string;
  email: string;
  password: string;
  name: string;
  role: Role;
};

export const DEMO_USERS: DemoUser[] = [
  {
    id: "u-candidate",
    email: "candidate@demo.willtec",
    password: "demo123",
    name: "ファム・ヴァン・アン（候補者）",
    role: "candidate",
  },
  {
    id: "u-agent",
    email: "agent@demo.willtec",
    password: "demo123",
    name: "グエン・ティ・バオ（登録支援機関）",
    role: "agent",
  },
];

export function findDemoUser(
  email: string,
  password: string
): DemoUser | undefined {
  return DEMO_USERS.find(
    (u) =>
      u.email.toLowerCase() === email.trim().toLowerCase() &&
      u.password === password
  );
}
