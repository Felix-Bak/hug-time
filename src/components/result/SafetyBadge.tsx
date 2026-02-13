import type { ScenarioResult } from '../../types';
import { getScenario } from '../../lib/occupancy';
import { formatDuration } from './utils';

interface Props {
  result: ScenarioResult;
}

export default function SafetyBadge({ result }: Props) {
  const scenario = getScenario(result.scenarioId);
  if (!scenario) return null;

  return (
    <div
      className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-[13px] transition-colors duration-300 ${
        result.isSafeNow
          ? 'bg-safe/10'
          : 'bg-white/40'
      }`}
    >
      <span className="text-text-secondary">
        <span className="mr-1.5">{scenario.emoji}</span>
        {scenario.label}
        <span className="text-text-tertiary ml-1 text-[11px]">{scenario.distance}m</span>
      </span>
      <span className={`font-semibold ${result.isSafeNow ? 'text-safe-dark' : 'text-text'}`}>
        {result.isSafeNow
          ? '&#x2705; 가능'
          : `${formatDuration(result.remainingSeconds)} 후`}
      </span>
    </div>
  );
}
