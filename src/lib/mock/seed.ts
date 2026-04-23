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
    name: "Willtec東京サポート",
    type: "torokushien",
    city: "Tokyo",
    verified: true,
  },
  {
    id: "a2",
    name: "パートナー大阪ワーク",
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
    title: "特定技能 建設 — 鉄筋工",
    industry: "建設",
    city: "Tokyo",
    salary: "180,000円〜",
    shareCommission: "12%",
    ownerAgentId: "a1",
    requiredJlpt: "N4",
  },
  {
    id: "j2",
    title: "製造ライン作業員（食品）",
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
    name: "グエン・ヴァン・アー",
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
    name: "チャン・ティ・ビー",
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
    name: "ファム・ヴァン・シー",
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
    closedNote: "実務スキルが採用要件に満たないため。",
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
    closedNote: "本人の希望により取り下げ。",
    createdAt: "2026-04-15",
  },
  {
    id: "ap8",
    jobId: "j6",
    candidateId: "c1",
    source: "direct",
    stage: "screening",
    closed: "rejected",
    closedNote: "指定書の分野と応募職種が一致しないため。",
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
    title: "候補者紹介 — 建設案件A",
    participants: ["Willtec東京サポート", "パートナー大阪ワーク"],
    messages: [
      {
        id: "m1",
        threadId: "t1",
        from: "パートナー大阪ワーク",
        text: "JLPT N3の方の書類送付。建設勤務、指定書は食料品 — 分野の突合をお願いします。",
        at: "2026-04-21T09:00:00",
      },
      {
        id: "m2",
        threadId: "t1",
        from: "Willtec東京サポート",
        text: "所属機関欄をハイライト済み。顔写真は在留カードと同じものに更新願います。",
        at: "2026-04-21T09:20:00",
      },
    ],
  },
  {
    id: "t2",
    title: "手数料 — 宿泊求人（横浜）",
    participants: ["Willtec東京サポート", "自社支援企業 ABC Food"],
    messages: [
      {
        id: "m1",
        threadId: "t2",
        from: "自社支援企業 ABC Food",
        text: "B2B紹介で内定時の手数料11%で問題ないかご確認を。",
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
    name: "レー氏（Meta）",
    phone: "090-XXXX-0001",
    campaignId: "cmp1",
    source: "Meta Lead Ads",
    createdAt: "2026-04-22T08:12:00",
    draftProfile: true,
  },
  {
    id: "L-102",
    name: "ホアン（Instagram）",
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
    ref: "求人j3 有料掲載",
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
  { code: "const", labelJa: "建設", labelVi: "建設" },
  { code: "food", labelJa: "外食", labelVi: "外食" },
  { code: "care", labelJa: "介護", labelVi: "介護" },
  { code: "mfg", labelJa: "製造", labelVi: "製造" },
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
