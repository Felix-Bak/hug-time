import { motion } from 'framer-motion';
import type { FamilyMember, FamilyResult } from '../../types';
import { formatCountdown } from './utils';

interface Props {
  family: FamilyMember[];
  results: FamilyResult[];
}

export default function MainCountdown({ family, results }: Props) {
  let maxRemainingSeconds = 0;
  let latestMemberId = '';

  for (const result of results) {
    const hugScenario = result.scenarios.find((s) => s.scenarioId === 'hug');
    if (hugScenario && hugScenario.remainingSeconds > maxRemainingSeconds) {
      maxRemainingSeconds = hugScenario.remainingSeconds;
      latestMemberId = result.memberId;
    }
  }

  const allSafe = maxRemainingSeconds <= 0;
  const latestMember = family.find((m) => m.id === latestMemberId);

  if (allSafe) {
    return (
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="glass-heavy rounded-3xl p-8 text-center"
        style={{
          background: 'linear-gradient(135deg, rgba(52,199,89,0.12) 0%, rgba(255,255,255,0.85) 50%, rgba(52,199,89,0.08) 100%)',
        }}
      >
        <motion.div
          animate={{ scale: [1, 1.15, 1], rotate: [0, 5, -5, 0] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
          className="text-6xl mb-4 inline-block"
        >
          &#x1F489;
        </motion.div>
        <h2 className="text-2xl font-bold text-safe-dark mb-1">
          모두 안아도 돼요!
        </h2>
        <p className="text-[14px] text-text-secondary">
          모든 가족에게 안전하게 다가갈 수 있습니다
        </p>
      </motion.div>
    );
  }

  const maxCircleSeconds = 7 * 86400;
  const progress = Math.min(1, maxRemainingSeconds / maxCircleSeconds);
  const circumference = 2 * Math.PI * 58;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <div className="glass-heavy rounded-3xl p-7 text-center">
      <p className="text-[14px] text-text-secondary mb-5">
        {latestMember ? `${latestMember.name}에게` : '가족에게'} 안아줄 수 있을 때까지
      </p>

      <div className="relative inline-block mb-5">
        <svg width="160" height="160" viewBox="0 0 128 128">
          {/* Background ring */}
          <circle
            cx="64"
            cy="64"
            r="58"
            fill="none"
            stroke="rgba(0,0,0,0.04)"
            strokeWidth="5"
          />
          {/* Progress ring */}
          <circle
            cx="64"
            cy="64"
            r="58"
            fill="none"
            stroke="url(#grad)"
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            transform="rotate(-90 64 64)"
            className="transition-all duration-1000"
          />
          <defs>
            <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF6B6B" />
              <stop offset="100%" stopColor="#FF9E9E" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-[10px] text-text-tertiary mb-0.5">남은 시간</span>
          <span className="text-[22px] font-bold font-mono tracking-tight text-text">
            {formatCountdown(maxRemainingSeconds)}
          </span>
        </div>
      </div>

      <p className="text-[11px] text-text-tertiary">
        가장 민감한 가족 구성원 기준
      </p>
    </div>
  );
}
