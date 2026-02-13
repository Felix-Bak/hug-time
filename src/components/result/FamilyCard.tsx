import { motion } from 'framer-motion';
import type { FamilyMember, FamilyResult } from '../../types';
import { getCategoryLabel } from '../../lib/doseLimits';
import SafetyBadge from './SafetyBadge';
import { formatCountdown } from './utils';

interface Props {
  member: FamilyMember;
  result: FamilyResult;
}

export default function FamilyCard({ member, result }: Props) {
  const hugScenario = result.scenarios.find((s) => s.scenarioId === 'hug');
  const allSafe = result.scenarios.every((s) => s.isSafeNow);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={`glass rounded-2xl p-5 space-y-3 transition-all duration-500 ${
        allSafe ? 'ring-1 ring-safe/30' : ''
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-text text-[17px] tracking-tight">{member.name}</h3>
          <p className="text-[11px] text-text-tertiary mt-0.5">
            {member.age}세 · {getCategoryLabel(member.category)} · {member.doseLimitMSv} mSv
          </p>
        </div>
        {allSafe && (
          <motion.div
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', bounce: 0.5 }}
            className="w-10 h-10 rounded-full bg-safe/10 flex items-center justify-center"
          >
            <span className="text-xl">&#x1F917;</span>
          </motion.div>
        )}
      </div>

      {/* Hug countdown */}
      {hugScenario && !hugScenario.isSafeNow && (
        <div className="text-center py-2.5 bg-white/40 rounded-xl">
          <p className="text-[11px] text-text-tertiary mb-1">허그까지</p>
          <p className="text-[24px] font-bold font-mono tracking-tight text-primary-dark">
            {formatCountdown(hugScenario.remainingSeconds)}
          </p>
        </div>
      )}
      {hugScenario && hugScenario.isSafeNow && (
        <div className="text-center py-3 bg-safe/8 rounded-xl">
          <p className="text-safe-dark font-semibold text-[15px]">&#x1F917; 안아도 돼요!</p>
        </div>
      )}

      {/* Scenario badges */}
      <div className="space-y-1.5">
        {result.scenarios.map((s) => (
          <SafetyBadge key={s.scenarioId} result={s} />
        ))}
      </div>

      {/* Safe distance */}
      <div className="text-center text-[11px] text-text-tertiary pt-2 border-t border-divider">
        현재 안전 거리:
        <span className="font-mono font-semibold text-text ml-1.5">
          {result.currentSafeDistanceM.toFixed(1)}m
        </span>
      </div>
    </motion.div>
  );
}
