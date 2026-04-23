import type {
  Agent,
  Application,
  Candidate,
  ChatThread,
  CommissionRow,
  Job,
  MarketingCampaign,
  SocialLead,
} from "@/lib/types";

export const agents: Agent[] = [
  {
    id: "a1",
    name: "Willtec Hỗ trợ Tokyo",
    type: "torokushien",
    city: "Tokyo",
    verified: true,
  },
  {
    id: "a2",
    name: "Partner Osaka Work",
    type: "torokushien",
    city: "Osaka",
    verified: true,
  },
  {
    id: "a3",
    name: "自社支援企業 ABC Food",
    type: "jisha",
    city: "Yokohama",
    verified: true,
  },
];

export const jobs: Job[] = [
  {
    id: "j1",
    title: "特定技能 建設 — công nhân cốt thép",
    industry: "建設",
    city: "Tokyo",
    salary: "180,000円〜",
    shareCommission: "12%",
    ownerAgentId: "a1",
    requiredJlpt: "N4",
  },
  {
    id: "j2",
    title: "製造ライン作業員 (Thực phẩm)",
    industry: "食料品製造",
    city: "Saitama",
    salary: "175,000円〜",
    shareCommission: "15%",
    ownerAgentId: "a2",
    requiredJlpt: "N5",
  },
  {
    id: "j3",
    title: "介護職員 — 有料老人ホーム",
    industry: "介護",
    city: "Chiba",
    salary: "190,000円〜",
    shareCommission: "10%",
    ownerAgentId: "a1",
    requiredJlpt: "N3",
  },
  {
    id: "j4",
    title: "ホテル フロント / 受付 (宿泊)",
    industry: "宿泊",
    city: "Yokohama",
    salary: "185,000円〜",
    shareCommission: "11%",
    ownerAgentId: "a1",
    requiredJlpt: "N4",
  },
  {
    id: "j5",
    title: "農業 — 露地・ハウス収穫 (季節工)",
    industry: "農業",
    city: "Ibaraki",
    salary: "170,000円〜",
    shareCommission: "14%",
    ownerAgentId: "a2",
    requiredJlpt: "N5",
  },
  {
    id: "j6",
    title: "飲食 キッチン補助 — 弁当工場",
    industry: "飲食料品",
    city: "Kanagawa",
    salary: "178,000円〜",
    shareCommission: "12%",
    ownerAgentId: "a3",
    requiredJlpt: "N4",
  },
  {
    id: "j7",
    title: "倉庫 ピッキング・梱包 (物流)",
    industry: "物流倉庫",
    city: "Saitama",
    salary: "182,000円〜",
    shareCommission: "10%",
    ownerAgentId: "a1",
    requiredJlpt: "N4",
  },
  {
    id: "j8",
    title: "ビルクリーニング (夜間清掃)",
    industry: "清掃",
    city: "Tokyo",
    salary: "175,000円〜",
    shareCommission: "13%",
    ownerAgentId: "a2",
    requiredJlpt: "N5",
  },
  {
    id: "j9",
    title: "工場 溶接 (半自動) — 金属加工",
    industry: "金属加工",
    city: "Chiba",
    salary: "192,000円〜",
    shareCommission: "11%",
    ownerAgentId: "a1",
    requiredJlpt: "N3",
  },
];

export const candidates: Candidate[] = [
  {
    id: "c1",
    name: "Nguyễn Văn A",
    country: "VN",
    jlpt: "N4",
    visaCategory: "tokutei_1",
    legalOk: true,
    agentId: "a1",
    skills: ["建設", "溶接", "安全確認"],
    cqiScore: 88,
  },
  {
    id: "c2",
    name: "Trần Thị B",
    country: "VN",
    jlpt: "N3",
    visaCategory: "tokutei_1",
    legalOk: true,
    agentId: "a2",
    skills: ["介護", "移乗介助"],
    cqiScore: 92,
  },
  {
    id: "c3",
    name: "Phạm Văn C",
    country: "VN",
    jlpt: "N5",
    visaCategory: "tokutei_1",
    legalOk: false,
    agentId: "a1",
    skills: ["ライン作業", "検品"],
    cqiScore: 71,
  },
];

export const applications: Application[] = [
  {
    id: "ap1",
    jobId: "j1",
    candidateId: "c1",
    source: "direct",
    stage: "interview",
    createdAt: "2026-04-10",
  },
  {
    id: "ap2",
    jobId: "j2",
    candidateId: "c2",
    source: "referral",
    fromAgentId: "a2",
    stage: "visa",
    createdAt: "2026-03-22",
  },
  {
    id: "ap3",
    jobId: "j1",
    candidateId: "c3",
    source: "referral",
    fromAgentId: "a1",
    stage: "screening",
    createdAt: "2026-04-18",
  },
  /* c1: thêm ứng tuyển mẫu (từ chối / rút) */
  {
    id: "ap4",
    jobId: "j2",
    candidateId: "c1",
    source: "direct",
    stage: "screening",
    createdAt: "2026-04-12",
  },
  {
    id: "ap5",
    jobId: "j3",
    candidateId: "c1",
    source: "direct",
    stage: "offer",
    createdAt: "2026-04-01",
  },
  {
    id: "ap6",
    jobId: "j4",
    candidateId: "c1",
    source: "direct",
    stage: "interview",
    closed: "rejected",
    closedNote: "Kỹ năng tác nghiệp chưa đạt yêu cầu tuyển dụng.",
    createdAt: "2026-03-28",
  },
  {
    id: "ap7",
    jobId: "j5",
    candidateId: "c1",
    source: "referral",
    fromAgentId: "a1",
    stage: "screening",
    closed: "withdrawn",
    closedNote: "Bạn đã rút hồ sơ.",
    createdAt: "2026-04-15",
  },
  {
    id: "ap8",
    jobId: "j6",
    candidateId: "c1",
    source: "direct",
    stage: "screening",
    closed: "rejected",
    closedNote: "Ngành 指定書 không khớp với vị trí ứng tuyển.",
    createdAt: "2026-04-02",
  },
  {
    id: "ap9",
    jobId: "j7",
    candidateId: "c1",
    source: "direct",
    stage: "onboarded",
    createdAt: "2026-01-20",
  },
  {
    id: "ap10",
    jobId: "j8",
    candidateId: "c1",
    source: "direct",
    stage: "visa",
    createdAt: "2026-04-20",
  },
  {
    id: "ap11",
    jobId: "j9",
    candidateId: "c1",
    source: "referral",
    fromAgentId: "a2",
    stage: "screening",
    createdAt: "2026-04-21",
  },
];

export const b2bThreads: ChatThread[] = [
  {
    id: "t1",
    title: "Tiến cử ứng viên — công trình A",
    participants: ["Willtec Hỗ trợ Tokyo", "Partner Osaka Work"],
    messages: [
      {
        id: "m1",
        threadId: "t1",
        from: "Partner Osaka Work",
        text: "Gửi bạn hồ sơ JLPT N3, đang làm 建設, shiteisho 食料品 — cần xác minh thêm hạng mục ngành.",
        at: "2026-04-21T09:00:00",
      },
      {
        id: "m2",
        threadId: "t1",
        from: "Willtec Hỗ trợ Tokyo",
        text: "OK, đã highlight phần 所属機関. Vui lòng cập nhật ảnh chân dung trùng thẻ cư trú.",
        at: "2026-04-21T09:20:00",
      },
    ],
  },
  {
    id: "t2",
    title: "Hoa hồng — Job 宿泊 (Yokohama)",
    participants: ["Willtec Hỗ trợ Tokyo", "自社支援企業 ABC Food"],
    messages: [
      {
        id: "m1",
        threadId: "t2",
        from: "自社支援企業 ABC Food",
        text: "Xác nhận mức 11% hoa hồng khi ứng viên trúng tuyển qua B2B.",
        at: "2026-04-20T14:00:00",
      },
    ],
  },
];

export const campaigns: MarketingCampaign[] = [
  {
    id: "cmp1",
    name: "Meta Lead — Tokutei 建設 2026",
    platform: "meta",
    status: "active",
    spendJpy: 240000,
    leads: 42,
    conversion: 18,
  },
  {
    id: "cmp2",
    name: "Instagram — 介護 外国人採用",
    platform: "instagram",
    status: "paused",
    spendJpy: 120000,
    leads: 19,
    conversion: 12,
  },
];

export const socialLeads: SocialLead[] = [
  {
    id: "L-101",
    name: "Lê Thị (FB Lead)",
    phone: "090-XXXX-0001",
    campaignId: "cmp1",
    source: "Meta Lead Ads",
    createdAt: "2026-04-22T08:12:00",
    draftProfile: true,
  },
  {
    id: "L-102",
    name: "Hoàng (IG DM)",
    phone: "080-XXXX-2002",
    campaignId: "cmp2",
    source: "Instagram",
    createdAt: "2026-04-21T16:40:00",
    draftProfile: true,
  },
];

export const commissions: CommissionRow[] = [
  {
    id: "b1",
    kind: "listing",
    amountMan: 5,
    party: "Agent a1",
    ref: "Job j3 đăng tin 有料",
    status: "paid",
  },
  {
    id: "b2",
    kind: "success",
    amountMan: 12,
    party: "Agent a1 / Agent a2",
    ref: "紹介成功 ap2",
    status: "pending",
  },
];

export const masterIndustries = [
  { code: "const", labelJa: "建設", labelVi: "Xây dựng" },
  { code: "food", labelJa: "外食", labelVi: "Nhà hàng" },
  { code: "care", labelJa: "介護", labelVi: "Hộ lý" },
  { code: "mfg", labelJa: "製造", labelVi: "Chế tạo" },
];

export const masterVisa = [
  { code: "t1", label: "特定技能1号" },
  { code: "t2", label: "特定技能2号" },
  { code: "gino", label: "技能実習からの移行" },
];

export function getJob(id: string) {
  return jobs.find((j) => j.id === id);
}
export function getAgent(id: string) {
  return agents.find((a) => a.id === id);
}
export function getCandidate(id: string) {
  return candidates.find((c) => c.id === id);
}
