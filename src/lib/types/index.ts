export type LegalStatus = "ok" | "warning" | "reject";

export type PipelineStage =
  | "sourced"
  | "screening"
  | "interview"
  | "offer"
  | "visa"
  | "onboarded";

export type ApplicationSource = "direct" | "referral";

/** Kết thúc ứng tuyển (chỉ bản thân đơn). Không gán = vẫn xử lý. */
export type ApplicationClosedReason = "rejected" | "withdrawn";

export type VisaCategory = "tokutei_1" | "tokutei_2" | "other";

export interface Agent {
  id: string;
  name: string;
  type: "torokushien" | "jisha";
  city: string;
  verified: boolean;
}

export interface Job {
  id: string;
  title: string;
  industry: string;
  city: string;
  salary: string;
  shareCommission: string; // 例: 15%
  ownerAgentId: string;
  requiredJlpt: string;
}

export interface Candidate {
  id: string;
  name: string;
  country: string;
  jlpt: string;
  visaCategory: VisaCategory;
  legalOk: boolean;
  agentId: string;
  skills: string[];
  cqiScore: number; // 0-100
}

export interface Application {
  id: string;
  jobId: string;
  candidateId: string;
  source: ApplicationSource;
  fromAgentId?: string;
  stage: PipelineStage;
  createdAt: string;
  /** Dừng ở `stage` khi từ chối hoặc ứng viên rút. */
  closed?: ApplicationClosedReason;
  /** Ghi chú ngắn (lý do từ chối, rút, v.v.) */
  closedNote?: string;
}

export interface Message {
  id: string;
  threadId: string;
  from: string;
  text: string;
  at: string;
}

export interface ChatThread {
  id: string;
  title: string;
  participants: string[];
  messages: Message[];
}

export interface MarketingCampaign {
  id: string;
  name: string;
  platform: "meta" | "instagram" | "other";
  status: "active" | "paused";
  spendJpy: number;
  leads: number;
  conversion: number; // %
}

export interface SocialLead {
  id: string;
  name: string;
  phone: string;
  campaignId: string;
  source: string;
  createdAt: string;
  draftProfile: boolean;
}

export interface CommissionRow {
  id: string;
  kind: "listing" | "success";
  amountMan: number;
  party: string;
  ref: string;
  status: "pending" | "paid";
}
