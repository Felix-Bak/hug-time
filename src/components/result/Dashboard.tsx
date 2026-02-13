import type { FamilyMember, PatientInfo, DoseStandardType } from '../../types';
import { useCountdown } from '../../hooks/useCountdown';
import MainCountdown from './MainCountdown';
import FamilyCard from './FamilyCard';
import ActivityProgress from './ActivityProgress';

interface Props {
  patient: PatientInfo;
  family: FamilyMember[];
  standard: DoseStandardType;
  onEdit: () => void;
  onReset: () => void;
}

export default function Dashboard({ patient, family, standard, onEdit, onReset }: Props) {
  const { results, remainingPercent } = useCountdown(patient, family, standard);

  return (
    <div className="space-y-4">
      <MainCountdown family={family} results={results} />

      <ActivityProgress percent={remainingPercent} />

      <div className="space-y-3">
        {family.map((member) => {
          const result = results.find((r) => r.memberId === member.id);
          if (!result) return null;
          return <FamilyCard key={member.id} member={member} result={result} />;
        })}
      </div>

      <div className="glass rounded-2xl p-3.5 text-center">
        <p className="text-[11px] text-text-tertiary leading-relaxed">
          &#x26A0;&#xFE0F; 본 계산 결과는 참고용입니다. 실제 방사선 안전 조치는 담당 의료진의 지시를 따르십시오.
        </p>
      </div>

      <div className="flex gap-3 pt-1">
        <button
          onClick={onEdit}
          className="flex-1 py-3.5 rounded-2xl font-semibold text-text-secondary text-[15px]
            glass hover:bg-white/80
            active:scale-[0.98] transition-all duration-200"
        >
          정보 수정
        </button>
        <button
          onClick={onReset}
          className="flex-1 py-3.5 rounded-2xl font-semibold text-danger text-[15px]
            glass hover:bg-white/80
            active:scale-[0.98] transition-all duration-200"
        >
          초기화
        </button>
      </div>
    </div>
  );
}
