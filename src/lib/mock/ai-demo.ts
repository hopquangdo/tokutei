/** 社内OCR＋ルールのモック（staging）— 外部API未接続 */

export type SimulatedOcr = {
  residence: {
    cardNo: string;
    statusText: string;
    expiry: string;
    zairyu: string;
  };
  shiteisho: {
    org: string;
    field: string;
    issued: string;
  };
  crossCheck: "match" | "mismatch" | "unknown";
  confidence: number;
  banner: "ok" | "warning" | "reject";
  notes: string[];
};

export function simulateOcrAndRules(): SimulatedOcr {
  return {
    residence: {
      cardNo: "AB12CD34E567",
      statusText: "有効（期限内）— 入管アプリ照会済",
      expiry: "2028-12-15",
      zairyu: "特定技能1号 — 建設",
    },
    shiteisho: {
      org: "株式会社サンプル建設",
      field: "建設",
      issued: "2025-10-01",
    },
    crossCheck: "match",
    confidence: 0.95,
    banner: "ok",
    notes: [
      "求人分野（Job）と指定書の分野（建設）が一致。",
      "指定書の印影：解像度・鮮明度が安定（CQI印影スコア良好）。",
    ],
  };
}

export function simulateMismatchOcr(): SimulatedOcr {
  return {
    residence: {
      cardNo: "ZZ99YY88X777",
      statusText: "警告：職種が求人と不整合",
      expiry: "2027-01-20",
      zairyu: "特定技能1号 — 食料品製造",
    },
    shiteisho: {
      org: "ABC Processing Co., Ltd.",
      field: "食料品製造",
      issued: "2024-11-20",
    },
    crossCheck: "mismatch",
    confidence: 0.78,
    banner: "warning",
    notes: [
      "求人: 外食、指定書: 食料品製造 — 業務内容の詳細確認を推奨。",
      "券面番号は整合 — 最終判断は登録支援機関が手動で確認。",
    ],
  };
}

export function simulateCvPolish(ja: string) {
  const pro =
    "【要約】\n" +
    "建設分野にて、安全管理・図面読取に基づき現場作業に従事。チーム内連携を重視。" +
    "\n\n【スキル】\n" +
    "型枠・鉄筋、足場併用、測量補助、JLPT N4" +
    "\n\n(※ AI Polish — 原文:)\n" +
    ja;
  return pro;
}

export function simulateMatching(criteria: { jlpt: string; field: string }) {
  return [
    {
      name: "グエン・ヴァン・アー",
      score: 91,
      reasons: [
        `JLPT ${criteria.jlpt} — 要件を満たす`,
        "スキル寄り: 建設",
        "CQI: チーム協調と時間管理（日本）+",
      ],
    },
    {
      name: "チャン・ティ・ビー",
      score: 86,
      reasons: [
        "JLPTは最低ライン超え",
        "分野は介護 — 職種変更時は要再審査",
      ],
    },
  ];
}

/** AIによるJD（PDF/Word）読取 — 掲載フォームへの提案 */
export type SimulatedJdParse = {
  title: string;
  industry: string;
  city: string;
  salary: string;
  requiredJlpt: string;
  shareCommission: string;
  workType: string;
  workContent: string;
  requirements: string;
  workHours: string;
  benefits: string;
  headcount: string;
  trialPeriod: string;
  notes: string;
};

export function emptyJdForm(): SimulatedJdParse {
  return {
    title: "",
    industry: "",
    city: "",
    salary: "",
    requiredJlpt: "N4",
    shareCommission: "12%",
    workType: "正社員",
    workContent: "",
    requirements: "",
    workHours: "8:00〜17:00（休憩1h）週5日",
    benefits: "社会保険完備、車通勤可（別途規定）",
    headcount: "1〜2名",
    trialPeriod: "3ヶ月",
    notes: "",
  };
}

export function simulateJdParse(): SimulatedJdParse {
  return {
    title: "特定技能 建設 — 躯体工事スタッフ",
    industry: "建設",
    city: "東京都 江東区",
    salary: "月給 18万円〜22万円（経験・能力による）＋ 残業代別途",
    requiredJlpt: "N4",
    shareCommission: "12%",
    workType: "正社員",
    workContent:
      "図面に基づき型枠・鉄筋据付、躯体検査、現場内安全管理補助。職长の指示下でチーム作業。",
    requirements:
      "特定技能1号（建設分野）\nジョイントまたは舗装の実務1年以上\n高所作業可（有資格者歓迎）\n日本語: 日報が書けるレベル（JLPT N4目安）",
    workHours: "8:00〜17:00（実働7h、休憩1h）\n週5日、土日祝（現場スケジュールに準ずる）",
    benefits: "社会保険・労災、制服貸与、社宅相談可（空き枠）",
    headcount: "2名",
    trialPeriod: "3ヶ月（同条件）",
    notes: "分野: 建設。外国人の方の受入れ実績あり。指定書 建設 と整合する配置を想定。",
  };
}
