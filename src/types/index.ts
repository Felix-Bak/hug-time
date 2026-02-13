/** 핵종 식별자 */
export type NuclideId = 'I-131' | 'Tc-99m' | 'F-18' | 'Lu-177' | 'Ga-68';

/** 시술 유형 */
export interface Procedure {
  id: string;
  label: string;
  nuclideId: NuclideId;
  effectiveHalfLifeHours: number;
  /** 일반 투여량 범위 (MBq) */
  doseRangeMin: number;
  doseRangeMax: number;
}

/** 핵종 데이터 */
export interface Nuclide {
  id: NuclideId;
  label: string;
  /** 물리적 반감기 (시간) */
  physicalHalfLifeHours: number;
  /** 감마선량률 상수 (μSv·m²/MBq·h) */
  gamma: number;
  procedures: Procedure[];
}

/** 선량 기준 체계 */
export type DoseStandardType = 'icrp' | 'korean';

/** 연령 카테고리 */
export type AgeCategory = 'adult' | 'caregiver' | 'teenager' | 'child' | 'infant' | 'pregnant';

/** 한도선량 항목 */
export interface DoseLimitEntry {
  category: AgeCategory;
  label: string;
  ageRange: string;
  limitMSv: number;
  description: string;
}

/** 접촉 시나리오 */
export interface ContactScenario {
  id: string;
  label: string;
  emoji: string;
  distance: number;
  occupancyFactor: number;
  description: string;
}

/** 가족 구성원 */
export interface FamilyMember {
  id: string;
  name: string;
  age: number;
  isPregnant: boolean;
  category: AgeCategory;
  doseLimitMSv: number;
}

/** 환자 정보 */
export interface PatientInfo {
  gender: 'male' | 'female' | '';
  age: number | '';
  weight: number | '';
  nuclideId: NuclideId | '';
  procedureId: string;
  doseMBq: number | '';
  injectionTime: string; // ISO string
}

/** 가족별 시나리오 결과 */
export interface ScenarioResult {
  scenarioId: string;
  hugTimeHours: number; // 주사 시점부터의 시간 (h)
  isSafeNow: boolean;
  remainingSeconds: number; // 현재부터 남은 시간 (s)
}

/** 가족 구성원별 계산 결과 */
export interface FamilyResult {
  memberId: string;
  scenarios: ScenarioResult[];
  currentSafeDistanceM: number;
}

/** 앱 전체 저장 데이터 */
export interface AppData {
  patient: PatientInfo;
  family: FamilyMember[];
  standard: DoseStandardType;
  version: number;
}

/** 앱 화면 단계 */
export type AppStep = 'landing' | 'patient' | 'family' | 'standard' | 'result';
