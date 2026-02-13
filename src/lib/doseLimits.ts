import type { AgeCategory, DoseLimitEntry, DoseStandardType } from '../types';

const ICRP_LIMITS: DoseLimitEntry[] = [
  { category: 'adult', label: '성인 일반인', ageRange: '18세 이상', limitMSv: 1.0, description: 'ICRP 103 일반인 연간 한도' },
  { category: 'caregiver', label: '성인 간병인', ageRange: '18세 이상', limitMSv: 5.0, description: 'NCRP 155 환자 간병인' },
  { category: 'teenager', label: '청소년', ageRange: '13~17세', limitMSv: 1.0, description: 'ICRP 103' },
  { category: 'child', label: '어린이', ageRange: '3~12세', limitMSv: 0.5, description: '보수적 적용 (체구 차이)' },
  { category: 'infant', label: '영유아', ageRange: '0~2세', limitMSv: 0.3, description: '최대 보수적 기준' },
  { category: 'pregnant', label: '임산부', ageRange: '-', limitMSv: 1.0, description: 'ICRP 84 태아 보호' },
];

const KOREAN_LIMITS: DoseLimitEntry[] = [
  { category: 'adult', label: '일반인', ageRange: '18세 이상', limitMSv: 1.0, description: '원안위 고시 일반인' },
  { category: 'caregiver', label: '수시출입자', ageRange: '18세 이상', limitMSv: 6.0, description: '방사선 관리구역 수시 출입자' },
  { category: 'teenager', label: '청소년', ageRange: '13~17세', limitMSv: 1.0, description: '원안위 고시' },
  { category: 'child', label: '어린이', ageRange: '3~12세', limitMSv: 0.5, description: '보수적 적용' },
  { category: 'infant', label: '영유아', ageRange: '0~2세', limitMSv: 0.3, description: '보수적 적용' },
  { category: 'pregnant', label: '임산부', ageRange: '-', limitMSv: 1.0, description: '잔여 임신기간' },
];

const LIMITS_MAP: Record<DoseStandardType, DoseLimitEntry[]> = {
  icrp: ICRP_LIMITS,
  korean: KOREAN_LIMITS,
};

export function getDoseLimits(standard: DoseStandardType): DoseLimitEntry[] {
  return LIMITS_MAP[standard];
}

export function getDoseLimit(standard: DoseStandardType, category: AgeCategory): number {
  const entry = LIMITS_MAP[standard].find((e) => e.category === category);
  return entry ? entry.limitMSv : 1.0;
}

export function categorizeAge(age: number, isPregnant: boolean): AgeCategory {
  if (isPregnant) return 'pregnant';
  if (age <= 2) return 'infant';
  if (age <= 12) return 'child';
  if (age <= 17) return 'teenager';
  return 'adult';
}

export function getCategoryLabel(category: AgeCategory): string {
  const labels: Record<AgeCategory, string> = {
    adult: '성인',
    caregiver: '간병인',
    teenager: '청소년',
    child: '어린이',
    infant: '영유아',
    pregnant: '임산부',
  };
  return labels[category];
}
