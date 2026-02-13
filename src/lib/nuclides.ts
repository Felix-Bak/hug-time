import type { Nuclide, NuclideId } from '../types';

export const NUCLIDES: Record<NuclideId, Nuclide> = {
  'I-131': {
    id: 'I-131',
    label: 'I-131 (요오드)',
    physicalHalfLifeHours: 8.02 * 24, // 192.48h
    gamma: 0.066,
    procedures: [
      {
        id: 'i131-ablation',
        label: '갑상선절제 후 잔여조직제거',
        nuclideId: 'I-131',
        effectiveHalfLifeHours: 16, // 0.67일
        doseRangeMin: 1110,
        doseRangeMax: 3700,
      },
      {
        id: 'i131-cancer-high',
        label: '갑상선암 치료 (고용량)',
        nuclideId: 'I-131',
        effectiveHalfLifeHours: 16,
        doseRangeMin: 3700,
        doseRangeMax: 7400,
      },
      {
        id: 'i131-hyperthyroid',
        label: '갑상선기능항진증',
        nuclideId: 'I-131',
        effectiveHalfLifeHours: 5.5 * 24, // 132h (5~6일 중간값)
        doseRangeMin: 185,
        doseRangeMax: 740,
      },
    ],
  },
  'Tc-99m': {
    id: 'Tc-99m',
    label: 'Tc-99m (테크네튬)',
    physicalHalfLifeHours: 6.01,
    gamma: 0.015,
    procedures: [
      {
        id: 'tc99m-bone',
        label: '뼈 스캔',
        nuclideId: 'Tc-99m',
        effectiveHalfLifeHours: 3.5, // 3~4시간 중간값
        doseRangeMin: 555,
        doseRangeMax: 1110,
      },
      {
        id: 'tc99m-cardiac',
        label: '심근관류 스캔',
        nuclideId: 'Tc-99m',
        effectiveHalfLifeHours: 5, // 4~6시간 중간값
        doseRangeMin: 370,
        doseRangeMax: 1110,
      },
    ],
  },
  'F-18': {
    id: 'F-18',
    label: 'F-18 (불소)',
    physicalHalfLifeHours: 109.77 / 60, // 1.8295h
    gamma: 0.143,
    procedures: [
      {
        id: 'f18-fdg',
        label: 'FDG PET',
        nuclideId: 'F-18',
        effectiveHalfLifeHours: 110 / 60, // ~1.833h
        doseRangeMin: 185,
        doseRangeMax: 370,
      },
    ],
  },
  'Lu-177': {
    id: 'Lu-177',
    label: 'Lu-177 (루테튬)',
    physicalHalfLifeHours: 6.65 * 24, // 159.6h
    gamma: 0.005,
    procedures: [
      {
        id: 'lu177-dotatate',
        label: 'DOTATATE 치료',
        nuclideId: 'Lu-177',
        effectiveHalfLifeHours: 3.5 * 24, // 84h (3~4일 중간값)
        doseRangeMin: 7400,
        doseRangeMax: 7400,
      },
    ],
  },
  'Ga-68': {
    id: 'Ga-68',
    label: 'Ga-68 (갈륨)',
    physicalHalfLifeHours: 67.71 / 60, // 1.1285h
    gamma: 0.13,
    procedures: [
      {
        id: 'ga68-pet',
        label: 'DOTATATE/PSMA PET',
        nuclideId: 'Ga-68',
        effectiveHalfLifeHours: 68 / 60, // ~1.133h
        doseRangeMin: 100,
        doseRangeMax: 200,
      },
    ],
  },
};

export const NUCLIDE_LIST = Object.values(NUCLIDES);

export function getNuclide(id: NuclideId): Nuclide {
  return NUCLIDES[id];
}

export function getProcedure(nuclideId: NuclideId, procedureId: string) {
  return NUCLIDES[nuclideId].procedures.find((p) => p.id === procedureId);
}
