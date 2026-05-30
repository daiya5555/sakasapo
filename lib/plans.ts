export type PlanType = "free" | "standard" | "coach";

export const PLAN_LIMITS = {
  free: {
    label: "無料",
    postsPerMonth: 10,
    aiSearchesPerMonth: 3,
    videoUpload: true,
    videoStorageGB: 1,
  },
  standard: {
    label: "スタンダード",
    postsPerMonth: null, // 無制限
    aiSearchesPerMonth: null,
    videoUpload: true,
    videoStorageGB: 5,
  },
  coach: {
    label: "コーチ",
    postsPerMonth: null,
    aiSearchesPerMonth: null,
    videoUpload: true,
    videoStorageGB: 20,
  },
} as const satisfies Record<PlanType, {
  label: string;
  postsPerMonth: number | null;
  aiSearchesPerMonth: number | null;
  videoUpload: boolean;
  videoStorageGB: number;
}>;

/** 今月の文字列 "YYYY-MM" を返す */
export function currentMonth(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}
