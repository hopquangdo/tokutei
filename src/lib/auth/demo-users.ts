import type { Role } from "./types";

/** Tài khoản staging / dev (mật khẩu plain, chỉ môi trường nội bộ). */
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
    name: "Phạm Văn An (Ứng viên)",
    role: "candidate",
  },
  {
    id: "u-agent",
    email: "agent@demo.willtec",
    password: "demo123",
    name: "Nguyễn Thị Bảo (登録支援機関)",
    role: "agent",
  },
  {
    id: "u-admin",
    email: "admin@demo.willtec",
    password: "demo123",
    name: "Willtec quản trị",
    role: "admin",
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
