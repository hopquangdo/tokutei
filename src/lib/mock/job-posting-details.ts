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
      "Làm việc tại công trường, lắp dựng cốt thép theo hướng dẫn và tuân thủ tiêu chuẩn an toàn. Có ca ngày và một số ca đêm theo kế hoạch dự án.",
    requirements: [
      "JLPT N4 trở lên",
      "Tư cách 特定技能1号 — ngành 建設",
      "Ưu tiên ứng viên có kinh nghiệm xây dựng, hiểu quy trình an toàn cơ bản",
    ],
    updatedAt: "23/04/2026",
    publishedAt: "10/04/2026",
    contractType: "Nhân viên toàn thời gian",
    workAddress: "Shinagawa, Tokyo",
  },
  j2: {
    workSummary:
      "Vận hành dây chuyền chế biến thực phẩm, kiểm tra chất lượng thành phẩm và thực hiện vệ sinh khu vực theo tiêu chuẩn nhà máy.",
    requirements: ["JLPT N5 trở lên", "Sức khỏe tốt, có thể đứng làm việc theo ca", "Tuân thủ quy định vệ sinh thực phẩm"],
    updatedAt: "23/04/2026",
    publishedAt: "12/04/2026",
    contractType: "Nhân viên hợp đồng dài hạn",
    workAddress: "Kawaguchi, Saitama",
  },
  j3: {
    workSummary:
      "Chăm sóc người cao tuổi tại viện dưỡng lão, hỗ trợ sinh hoạt hằng ngày, ghi chép sức khỏe và phối hợp với điều dưỡng trưởng.",
    requirements: ["JLPT N3 trở lên", "Định hướng nghề 介護, ưu tiên có chứng chỉ", "Kỹ năng giao tiếp và chăm sóc cơ bản"],
    updatedAt: "23/04/2026",
    publishedAt: "15/04/2026",
    contractType: "Nhân viên toàn thời gian",
    workAddress: "Chiba-shi, Chiba",
  },
};

export function getJobPostingDetail(job: Job): JobPostingDetail {
  return (
    DETAIL_BY_JOB_ID[job.id] ?? {
      workSummary: `Nội dung công việc theo ngành ${job.industry} tại khu vực ${job.city}. Ứng viên cần tuân thủ quy trình đào tạo và nội quy tại nơi làm việc.`,
      requirements: [`JLPT ${job.requiredJlpt} trở lên`, "Giấy tờ pháp lý hợp lệ theo chương trình 特定技能", "Phối hợp tốt với đội nhóm tại nơi làm việc"],
      updatedAt: "23/04/2026",
      publishedAt: "01/04/2026",
      contractType: "Nhân viên hợp đồng",
      workAddress: `${job.city}, Japan`,
    }
  );
}
