import { useState, useEffect, useCallback } from 'react';
import type { FamilyMember, FamilyResult, PatientInfo, DoseStandardType } from '../types';
import { getNuclide, getProcedure } from '../lib/nuclides';
import { getDoseLimit } from '../lib/doseLimits';
import { CONTACT_SCENARIOS } from '../lib/occupancy';
import {
  calcDecayConstant,
  calcHugTime,
  calcSafeDistance,
  calcActivityAtTime,
  calcRemainingActivityPercent,
} from '../lib/radiation';

export function useCountdown(
  patient: PatientInfo,
  family: FamilyMember[],
  standard: DoseStandardType,
) {
  const [results, setResults] = useState<FamilyResult[]>([]);
  const [remainingPercent, setRemainingPercent] = useState(100);
  const [tick, setTick] = useState(0);

  const calculate = useCallback(() => {
    if (!patient.nuclideId || !patient.procedureId || !patient.doseMBq || !patient.injectionTime) {
      return;
    }

    const nuclide = getNuclide(patient.nuclideId);
    const procedure = getProcedure(patient.nuclideId, patient.procedureId);
    if (!nuclide || !procedure) return;

    const gamma = nuclide.gamma;
    const a0 = patient.doseMBq as number;
    const lambdaEff = calcDecayConstant(procedure.effectiveHalfLifeHours);
    const injTime = new Date(patient.injectionTime).getTime();
    const now = Date.now();
    const elapsedHours = (now - injTime) / (1000 * 60 * 60);

    if (elapsedHours < 0) return;

    const currentActivity = calcActivityAtTime(a0, lambdaEff, elapsedHours);
    setRemainingPercent(calcRemainingActivityPercent(lambdaEff, elapsedHours));

    const newResults: FamilyResult[] = family.map((member) => {
      const doseLimitUSv = getDoseLimit(standard, member.category) * 1000;

      const scenarios = CONTACT_SCENARIOS.map((scenario) => {
        const hugTimeHours = calcHugTime(
          gamma,
          a0,
          lambdaEff,
          scenario.distance,
          scenario.occupancyFactor,
          doseLimitUSv,
        );

        const hugTimeMs = injTime + hugTimeHours * 60 * 60 * 1000;
        const remainingMs = hugTimeMs - now;
        const isSafeNow = remainingMs <= 0;

        return {
          scenarioId: scenario.id,
          hugTimeHours,
          isSafeNow,
          remainingSeconds: isSafeNow ? 0 : Math.ceil(remainingMs / 1000),
        };
      });

      const safeDistance = calcSafeDistance(
        gamma,
        currentActivity,
        lambdaEff,
        0.25,
        doseLimitUSv,
      );

      return {
        memberId: member.id,
        scenarios,
        currentSafeDistanceM: safeDistance,
      };
    });

    setResults(newResults);
  }, [patient, family, standard]);

  // 1초마다 tick
  useEffect(() => {
    calculate();
    const interval = setInterval(() => {
      setTick((t) => t + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [calculate]);

  // tick 변경 시 재계산
  useEffect(() => {
    if (tick > 0) calculate();
  }, [tick, calculate]);

  return { results, remainingPercent };
}
