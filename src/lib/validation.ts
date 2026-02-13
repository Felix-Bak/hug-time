import type { PatientInfo, FamilyMember, NuclideId } from '../types';
import { getProcedure } from './nuclides';

export interface ValidationError {
  field: string;
  message: string;
}

export function validatePatient(patient: PatientInfo): ValidationError[] {
  const errors: ValidationError[] = [];

  if (patient.age === '' || patient.age < 0 || patient.age > 120) {
    errors.push({ field: 'age', message: '나이를 올바르게 입력해주세요 (0~120세)' });
  }

  if (patient.weight === '' || patient.weight < 1 || patient.weight > 300) {
    errors.push({ field: 'weight', message: '몸무게를 올바르게 입력해주세요 (1~300kg)' });
  }

  if (!patient.nuclideId) {
    errors.push({ field: 'nuclideId', message: '방사성의약품을 선택해주세요' });
  }

  if (!patient.procedureId) {
    errors.push({ field: 'procedureId', message: '시술 유형을 선택해주세요' });
  }

  if (patient.doseMBq === '' || patient.doseMBq <= 0) {
    errors.push({ field: 'doseMBq', message: '투여량을 입력해주세요' });
  }

  if (!patient.injectionTime) {
    errors.push({ field: 'injectionTime', message: '주사 일시를 입력해주세요' });
  } else {
    const injTime = new Date(patient.injectionTime).getTime();
    if (injTime > Date.now()) {
      errors.push({ field: 'injectionTime', message: '주사 일시가 미래입니다. 과거 시간을 입력해주세요' });
    }
  }

  return errors;
}

export function validateDoseRange(
  nuclideId: NuclideId,
  procedureId: string,
  doseMBq: number,
): { inRange: boolean; message: string } {
  const proc = getProcedure(nuclideId, procedureId);
  if (!proc) return { inRange: true, message: '' };

  if (doseMBq < proc.doseRangeMin || doseMBq > proc.doseRangeMax) {
    return {
      inRange: false,
      message: `일반 투여량 범위: ${proc.doseRangeMin.toLocaleString()}~${proc.doseRangeMax.toLocaleString()} MBq`,
    };
  }
  return { inRange: true, message: '' };
}

export function validateFamily(family: FamilyMember[]): ValidationError[] {
  const errors: ValidationError[] = [];

  if (family.length === 0) {
    errors.push({ field: 'family', message: '가족 구성원을 최소 1명 추가해주세요' });
  }

  family.forEach((member, i) => {
    if (!member.name.trim()) {
      errors.push({ field: `family-${i}-name`, message: `구성원 ${i + 1}의 호칭을 입력해주세요` });
    }
    if (member.age < 0 || member.age > 120) {
      errors.push({ field: `family-${i}-age`, message: `구성원 ${i + 1}의 나이를 올바르게 입력해주세요` });
    }
  });

  return errors;
}
