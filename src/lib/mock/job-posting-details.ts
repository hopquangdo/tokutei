import type { Job } from "@/lib/types";

type JobPostingDetail = {
  workSummary: string;
  requirements: string[];
  updatedAt: string;
  publishedAt: string;
  contractType: string;
  workAddress: string;
};

const DETAIL_BY_JOB_ID: Record<string, JobPostingDetail> = {
  j1: {
    workSummary:
      "現場での鉄筋据付を指示通りに行い、安全基準に従う。日勤に加え、案件により夜勤あり。",
    requirements: [
      "JLPT N4以上",
      "特定技能1号（建設分野）",
      "建設現場の経験と基本の安全手順の理解を歓迎",
    ],
    updatedAt: "23/04/2026",
    publishedAt: "10/04/2026",
    contractType: "正社員",
    workAddress: "東京都 品川区",
  },
  j2: {
    workSummary:
      "食品の製造ライン操作、出荷前の品質確認、工場内の衛生整備。",
    requirements: [
      "JLPT N5以上",
      "シフト制の立ち仕事に対応できる方",
      "食品衛生の規則を遵守できる方",
    ],
    updatedAt: "23/04/2026",
    publishedAt: "12/04/2026",
    contractType: "有期契約社員",
    workAddress: "埼玉県 川口市",
  },
  j3: {
    workSummary:
      "有料老人ホームでの介護、生活支援、健康記録、看護主任との連携。",
    requirements: [
      "JLPT N3以上",
      "介護志向の方 — 資格保持者歓迎",
      "基礎的なコミュニケーションとケア力",
    ],
    updatedAt: "23/04/2026",
    publishedAt: "15/04/2026",
    contractType: "正社員",
    workAddress: "千葉県 千葉市",
  },
};

export function getJobPostingDetail(job: Job): JobPostingDetail {
  return (
    DETAIL_BY_JOB_ID[job.id] ?? {
      workSummary: `${job.industry}分野の業務（${job.city}エリア）。職場のルールと研修に従って業務に従事します。`,
      requirements: [
        `JLPT ${job.requiredJlpt} 以上`,
        "特定技能に即した有効な在留・手続き",
        "職場のチームと良好に連携できる方",
      ],
      updatedAt: "23/04/2026",
      publishedAt: "01/04/2026",
      contractType: "契約社員",
      workAddress: `${job.city}（日本）`,
    }
  );
}
