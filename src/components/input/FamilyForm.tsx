import { motion, AnimatePresence } from 'framer-motion';
import type { FamilyMember, DoseStandardType } from '../../types';
import { categorizeAge, getCategoryLabel, getDoseLimit } from '../../lib/doseLimits';

interface Props {
  family: FamilyMember[];
  standard: DoseStandardType;
  onChange: (family: FamilyMember[]) => void;
  onNext: () => void;
  onBack: () => void;
}

const inputClass =
  'w-full rounded-xl bg-white/50 px-3.5 py-2.5 text-[15px] text-text placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary/30 border border-white/60';

export default function FamilyForm({ family, standard, onChange, onNext, onBack }: Props) {
  function addMember() {
    const id = Date.now().toString(36);
    const newMember: FamilyMember = {
      id,
      name: '',
      age: 30,
      isPregnant: false,
      category: 'adult',
      doseLimitMSv: 1.0,
    };
    onChange([...family, newMember]);
  }

  function updateMember(id: string, updates: Partial<FamilyMember>) {
    onChange(
      family.map((m) => {
        if (m.id !== id) return m;
        const updated = { ...m, ...updates };
        const category = categorizeAge(updated.age, updated.isPregnant);
        const doseLimitMSv = getDoseLimit(standard, category);
        return { ...updated, category, doseLimitMSv };
      }),
    );
  }

  function removeMember(id: string) {
    onChange(family.filter((m) => m.id !== id));
  }

  return (
    <div className="space-y-5">
      <div className="text-center mb-2">
        <h2 className="text-2xl font-bold tracking-tight text-text">가족 구성원 등록</h2>
        <p className="text-[13px] text-text-secondary mt-1">함께 사는 가족을 등록해주세요</p>
      </div>

      <AnimatePresence mode="popLayout">
        {family.map((member) => {
          const category = categorizeAge(member.age, member.isPregnant);
          const limit = getDoseLimit(standard, category);
          return (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: -80, scale: 0.9 }}
              transition={{ type: 'spring', duration: 0.4 }}
              className="glass rounded-2xl p-5 space-y-3.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-medium text-text-secondary">
                  {getCategoryLabel(category)} · {limit} mSv
                </span>
                <button
                  onClick={() => removeMember(member.id)}
                  className="text-[12px] text-danger/70 hover:text-danger transition-colors"
                >
                  삭제
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-text-tertiary mb-1">호칭 (이름)</label>
                  <input
                    type="text"
                    placeholder="예: 아내, 아들"
                    value={member.name}
                    onChange={(e) => updateMember(member.id, { name: e.target.value })}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-text-tertiary mb-1">나이</label>
                  <input
                    type="number"
                    min={0}
                    max={120}
                    value={member.age}
                    onChange={(e) => updateMember(member.id, { age: Number(e.target.value) || 0 })}
                    className={inputClass}
                  />
                </div>
              </div>
              <label className="flex items-center gap-2.5 text-[14px] text-text-secondary cursor-pointer">
                <input
                  type="checkbox"
                  checked={member.isPregnant}
                  onChange={(e) => updateMember(member.id, { isPregnant: e.target.checked })}
                  className="w-4.5 h-4.5 rounded accent-primary"
                />
                임산부
              </label>
            </motion.div>
          );
        })}
      </AnimatePresence>

      {family.length === 0 && (
        <div className="glass rounded-2xl text-center py-12 text-text-tertiary">
          <p className="text-4xl mb-3">&#x1F46A;</p>
          <p className="text-[14px]">가족 구성원을 추가해주세요</p>
        </div>
      )}

      <button
        onClick={addMember}
        className="w-full py-3 rounded-2xl text-[15px] font-medium text-primary
          glass hover:bg-white/80
          active:scale-[0.98] transition-all duration-200"
      >
        + 가족 추가
      </button>

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
          disabled={family.length === 0 || family.some((m) => !m.name.trim())}
          className="flex-1 py-3.5 rounded-2xl font-semibold text-white text-[15px]
            bg-gradient-to-b from-primary to-primary-dark
            shadow-[0_4px_16px_rgba(255,107,107,0.3)]
            disabled:opacity-30 disabled:shadow-none disabled:cursor-not-allowed
            active:scale-[0.98] transition-all duration-200"
        >
          다음
        </button>
      </div>
    </div>
  );
}
