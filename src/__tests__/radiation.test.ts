import { describe, it, expect } from 'vitest';
import {
  calcDecayConstant,
  calcActivityAtTime,
  calcDoseRate,
  calcCumulativeDoseFromTime,
  calcHugTime,
  calcSafeDistance,
  calcRemainingActivityPercent,
} from '../lib/radiation';

describe('calcDecayConstant', () => {
  it('반감기 16시간에 대한 감쇠상수', () => {
    const lambda = calcDecayConstant(16);
    expect(lambda).toBeCloseTo(Math.LN2 / 16, 6);
  });

  it('반감기 1시간에 대한 감쇠상수', () => {
    const lambda = calcDecayConstant(1);
    expect(lambda).toBeCloseTo(Math.LN2, 6);
  });
});

describe('calcActivityAtTime', () => {
  it('반감기 시간이 지나면 방사능이 절반으로', () => {
    const halfLife = 16; // hours
    const lambda = calcDecayConstant(halfLife);
    const activity = calcActivityAtTime(1000, lambda, halfLife);
    expect(activity).toBeCloseTo(500, 0);
  });

  it('t=0에서 초기 방사능 유지', () => {
    const lambda = calcDecayConstant(16);
    const activity = calcActivityAtTime(3700, lambda, 0);
    expect(activity).toBeCloseTo(3700, 0);
  });
});

describe('calcDoseRate', () => {
  it('역제곱 법칙: 거리 2배 → 선량률 1/4', () => {
    const rate1m = calcDoseRate(0.066, 1000, 1);
    const rate2m = calcDoseRate(0.066, 1000, 2);
    expect(rate2m).toBeCloseTo(rate1m / 4, 4);
  });
});

describe('calcHugTime', () => {
  it('I-131 갑상선절제 3700 MBq, 성인 1mSv, 밀착 0.3m — 수일~1주', () => {
    const gamma = 0.066;
    const a0 = 3700;
    const lambdaEff = calcDecayConstant(16);
    const distance = 0.3;
    const of = 0.05;
    const doseLimitUSv = 1000; // 1 mSv

    const hugTimeHours = calcHugTime(gamma, a0, lambdaEff, distance, of, doseLimitUSv);
    const hugTimeDays = hugTimeHours / 24;

    // 수일~1주 범위 확인
    expect(hugTimeDays).toBeGreaterThan(0.5);
    expect(hugTimeDays).toBeLessThan(14);
  });

  it('I-131 항진증 555 MBq, 성인 1mSv, 밀착 — 수시간~수일', () => {
    const gamma = 0.066;
    const a0 = 555;
    const lambdaEff = calcDecayConstant(132); // 5.5일
    const distance = 0.3;
    const of = 0.05;
    const doseLimitUSv = 1000;

    const hugTimeHours = calcHugTime(gamma, a0, lambdaEff, distance, of, doseLimitUSv);
    const hugTimeDays = hugTimeHours / 24;

    expect(hugTimeDays).toBeGreaterThan(0);
    expect(hugTimeDays).toBeLessThan(30);
  });

  it('Tc-99m 뼈 스캔 740 MBq, 성인 1mSv, 밀착 — 수시간 이내', () => {
    const gamma = 0.015;
    const a0 = 740;
    const lambdaEff = calcDecayConstant(3.5);
    const distance = 0.3;
    const of = 0.05;
    const doseLimitUSv = 1000;

    const hugTimeHours = calcHugTime(gamma, a0, lambdaEff, distance, of, doseLimitUSv);

    // 수시간 이내
    expect(hugTimeHours).toBeLessThan(24);
  });

  it('F-18 FDG PET 370 MBq, 성인 1mSv, 밀착 — 즉시~수시간', () => {
    const gamma = 0.143;
    const a0 = 370;
    const lambdaEff = calcDecayConstant(110 / 60);
    const distance = 0.3;
    const of = 0.05;
    const doseLimitUSv = 1000;

    const hugTimeHours = calcHugTime(gamma, a0, lambdaEff, distance, of, doseLimitUSv);

    expect(hugTimeHours).toBeLessThan(24);
  });

  it('I-131 고용량 7400 MBq, 영유아 0.3mSv, 밀착 — 가장 보수적', () => {
    const gamma = 0.066;
    const a0 = 7400;
    const lambdaEff = calcDecayConstant(16);
    const distance = 0.3;
    const of = 0.05;
    const doseLimitUSv = 300; // 0.3 mSv

    const hugTimeHours = calcHugTime(gamma, a0, lambdaEff, distance, of, doseLimitUSv);
    const hugTimeDays = hugTimeHours / 24;

    // 가장 보수적 → 장기간
    expect(hugTimeDays).toBeGreaterThan(1);
  });

  it('이미 안전한 경우 0 반환', () => {
    const gamma = 0.005;
    const a0 = 10; // 매우 적은 용량
    const lambdaEff = calcDecayConstant(1);
    const distance = 3;
    const of = 0.05;
    const doseLimitUSv = 5000;

    const hugTime = calcHugTime(gamma, a0, lambdaEff, distance, of, doseLimitUSv);
    expect(hugTime).toBe(0);
  });
});

describe('calcSafeDistance', () => {
  it('방사능이 높을수록 안전거리가 멀다', () => {
    const gamma = 0.066;
    const lambda = calcDecayConstant(16);
    const of = 0.25;
    const limit = 1000;

    const d1 = calcSafeDistance(gamma, 3700, lambda, of, limit);
    const d2 = calcSafeDistance(gamma, 1000, lambda, of, limit);

    expect(d1).toBeGreaterThan(d2);
  });

  it('안전거리는 양수', () => {
    const d = calcSafeDistance(0.066, 3700, calcDecayConstant(16), 0.25, 1000);
    expect(d).toBeGreaterThan(0);
  });
});

describe('calcRemainingActivityPercent', () => {
  it('반감기 시간 후 50%', () => {
    const lambda = calcDecayConstant(16);
    expect(calcRemainingActivityPercent(lambda, 16)).toBeCloseTo(50, 0);
  });

  it('t=0에서 100%', () => {
    const lambda = calcDecayConstant(16);
    expect(calcRemainingActivityPercent(lambda, 0)).toBeCloseTo(100, 0);
  });
});

describe('calcCumulativeDoseFromTime', () => {
  it('T=0에서 총 누적선량은 유한값', () => {
    const gamma = 0.066;
    const a0 = 3700;
    const lambda = calcDecayConstant(16);
    const dose = calcCumulativeDoseFromTime(gamma, a0, lambda, 0, 1, 0.25);
    expect(dose).toBeGreaterThan(0);
    expect(Number.isFinite(dose)).toBe(true);
  });

  it('시간이 지날수록 잔여 누적선량 감소', () => {
    const gamma = 0.066;
    const a0 = 3700;
    const lambda = calcDecayConstant(16);

    const d0 = calcCumulativeDoseFromTime(gamma, a0, lambda, 0, 1, 0.25);
    const d24 = calcCumulativeDoseFromTime(gamma, a0, lambda, 24, 1, 0.25);

    expect(d24).toBeLessThan(d0);
  });
});
