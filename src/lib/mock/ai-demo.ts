/** Dữ liệu OCR + rule nội bộ (staging) — chưa gọi API nhà cung cấp */

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
      statusText: "有効 (đang còn hạn) — tra cứu App Cục",
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
      "Ngành tuyển (Job) khớp 建設 với 指定書.",
      "Dấu trên 指定書: độ nét/đóng băng ổn định (điểm CQI dấu).",
    ],
  };
}

export function simulateMismatchOcr(): SimulatedOcr {
  return {
    residence: {
      cardNo: "ZZ99YY88X777",
      statusText: "Cảnh báo: sai ngành công việc so với Job",
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
      "Job mở: 外食; Shiteisho: 食料品製造 — cần xem xét 業務内容 chi tiết.",
      "Dữ liệu ổn về bản số — nhưng cần Agent xác nhận bằng tay.",
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
      name: "Nguyễn Văn A",
      score: 91,
      reasons: [
        `JLPT ${criteria.jlpt} — đủ điều kiện`,
        "Skill stack gần 建設",
        "CQI: hòa đồng team & kỷ luật thời gian Nhật Bản: +",
      ],
    },
    {
      name: "Trần Thị B",
      score: 86,
      reasons: [
        "JLPT cao hơn mức tối thiểu",
        "Ngành khác 介護 — chỉ nếu chuyển 職種 thì cần xét lại",
      ],
    },
  ];
}

/** Gợi ý AI đọc JD (PDF/Word) — điền form đăng tin. */
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
