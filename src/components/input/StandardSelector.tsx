import type { DoseStandardType, FamilyMember } from '../../types';
import { getDoseLimits } from '../../lib/doseLimits';

interface Props {
  standard: DoseStandardType;
  family: FamilyMember[];
  onChange: (s: DoseStandardType) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function StandardSelector({ standard, family, onChange, onNext, onBack }: Props) {
  const limits = getDoseLimits(standard);
  const relevantCategories = new Set(family.map((m) => m.category));

  return (
    <div className="space-y-5">
      <div className="text-center mb-2">
        <h2 className="text-2xl font-bold tracking-tight text-text">선량 기준 선택</h2>
        <p className="text-[13px] text-text-secondary mt-1">적용할 선량 한도 기준을 선택해주세요</p>
      </div>

      {/* Segmented control */}
      <div className="glass rounded-2xl p-1.5 flex">
        <button
          onClick={() => onChange('icrp')}
          className={`flex-1 py-2.5 rounded-xl text-[14px] font-medium transition-all duration-200 ${
            standard === 'icrp'
              ? 'bg-white text-text shadow-sm'
              : 'text-text-secondary hover:text-text'
          }`}
        >
          ICRP/NCRP 국제기준
        </button>
        <button
          onClick={() => onChange('korean')}
          className={`flex-1 py-2.5 rounded-xl text-[14px] font-medium transition-all duration-200 ${
            standard === 'korean'
              ? 'bg-white text-text shadow-sm'
              : 'text-text-secondary hover:text-text'
          }`}
        >
          원안위 국내기준
        </button>
      </div>

      {/* Limits table */}
      <div className="glass rounded-2xl overflow-hidden">
        <div className="px-5 py-3 border-b border-divider">
          <div className="flex items-center justify-between text-[11px] font-medium text-text-tertiary uppercase tracking-wider">
            <span>카테고리</span>
            <span>한도 (mSv)</span>
          </div>
        </div>
        {limits.map((entry, i) => (
          <div
            key={entry.category}
            className={`flex items-center justify-between px-5 py-3.5 ${
              i < limits.length - 1 ? 'border-b border-divider' : ''
            } ${relevantCategories.has(entry.category) ? 'bg-primary/5' : ''}`}
          >
            <div className="flex items-center gap-2.5">
              <span className="text-[14px] font-medium text-text">{entry.label}</span>
              <span className="text-[11px] text-text-tertiary">{entry.ageRange}</span>
              {relevantCategories.has(entry.category) && (
                <span className="text-[10px] bg-primary/15 text-primary-dark px-2 py-0.5 rounded-full font-medium">
                  적용
                </span>
              )}
            </div>
            <span className="text-[15px] font-semibold tabular-nums text-text">
              {entry.limitMSv}
            </span>
          </div>
        ))}
      </div>

      <p className="text-[11px] text-text-tertiary text-center">
        {standard === 'icrp'
          ? 'ICRP 103 / NCRP 155 기반 국제 권고 기준'
          : '원자력안전위원회 고시 기반 국내 기준'}
      </p>

      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="flex-1 py-3.5 rounded-2xl font-semibold text-text-secondary text-[15px]
            glass hover:bg-white/80
            active:scale-[0.98] transition-all duration-200"
        >
          이전
        </button>
        <button
          onClick={onNext}
          className="flex-1 py-3.5 rounded-2xl font-semibold text-white text-[15px]
            bg-gradient-to-b from-primary to-primary-dark
            shadow-[0_4px_16px_rgba(255,107,107,0.3)]
            active:scale-[0.98] transition-all duration-200"
        >
          결과 보기
        </button>
      </div>
    </div>
  );
}
