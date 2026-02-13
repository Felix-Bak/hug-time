/**
 * 방사선 계산 엔진
 *
 * 단위 체계:
 * - 방사능: MBq
 * - 선량: μSv (내부), mSv (표시)
 * - 거리: m
 * - 시간: h (내부)
 * - Γ: μSv·m²/(MBq·h)
 */

/** 감쇠 상수 계산: λ = ln(2) / T_half */
export function calcDecayConstant(halfLifeHours: number): number {
  return Math.LN2 / halfLifeHours;
}

/** 시간 t에서의 잔여 방사능: A(t) = A₀ × e^(-λ × t) */
export function calcActivityAtTime(
  a0MBq: number,
  lambdaEff: number,
  tHours: number,
): number {
  return a0MBq * Math.exp(-lambdaEff * tHours);
}

/** 선량률: Ḋ(d, t) = Γ × A(t) / d² (μSv/h) */
export function calcDoseRate(
  gamma: number,
  activityMBq: number,
  distanceM: number,
): number {
  return (gamma * activityMBq) / (distanceM * distanceM);
}

/**
 * 시간 T부터 무한대까지 누적선량:
 * D = OF × Γ × A₀ × e^(-λ_eff × T) / (λ_eff × d²)
 * 단위: μSv
 */
export function calcCumulativeDoseFromTime(
  gamma: number,
  a0MBq: number,
  lambdaEff: number,
  tStartHours: number,
  distanceM: number,
  occupancyFactor: number,
): number {
  const atT = a0MBq * Math.exp(-lambdaEff * tStartHours);
  return (occupancyFactor * gamma * atT) / (lambdaEff * distanceM * distanceM);
}

/**
 * Hug Time 계산 (주사 시점부터 안전 접촉까지의 시간, 시간 단위):
 * T_hug = -(1/λ) × ln( D_limit × λ × d² / (OF × Γ × A₀) )
 *
 * D_limit은 μSv 단위 (mSv × 1000)
 * 반환: 시간 (hours). 음수면 이미 안전 → 0 반환.
 */
export function calcHugTime(
  gamma: number,
  a0MBq: number,
  lambdaEff: number,
  distanceM: number,
  occupancyFactor: number,
  doseLimitUSv: number,
): number {
  const argument =
    (doseLimitUSv * lambdaEff * distanceM * distanceM) /
    (occupancyFactor * gamma * a0MBq);

  if (argument >= 1) return 0; // 이미 안전
  if (argument <= 0) return Infinity; // 불가능한 케이스

  const tHug = -(1 / lambdaEff) * Math.log(argument);
  return Math.max(0, tHug);
}

/**
 * 현재 안전 거리 (시간 t에서):
 * d_safe = sqrt( OF × Γ × A(t) / (λ_eff × D_limit) )
 *
 * D_limit은 μSv 단위
 * 반환: m
 */
export function calcSafeDistance(
  gamma: number,
  activityMBq: number,
  lambdaEff: number,
  occupancyFactor: number,
  doseLimitUSv: number,
): number {
  const dSquared =
    (occupancyFactor * gamma * activityMBq) / (lambdaEff * doseLimitUSv);
  return Math.sqrt(Math.max(0, dSquared));
}

/** 잔여 방사능 비율 (%) */
export function calcRemainingActivityPercent(
  lambdaEff: number,
  tHours: number,
): number {
  return Math.exp(-lambdaEff * tHours) * 100;
}
