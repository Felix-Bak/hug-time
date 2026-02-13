import { useMemo } from 'react';
import type { PatientInfo, NuclideId } from '../../types';
import { NUCLIDE_LIST, getNuclide } from '../../lib/nuclides';
import { validateDoseRange } from '../../lib/validation';
import NuclideSelector from './NuclideSelector';

interface Props {
  patient: PatientInfo;
  onChange: (p: PatientInfo) => void;
  onNext: () => void;
}

const inputClass =
  'w-full rounded-xl glass px-4 py-3 text-[15px] text-text placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary/30 border-none';

export default function PatientForm({ patient, onChange, onNext }: Props) {
  const selectedNuclide = patient.nuclideId ? getNuclide(patient.nuclideId) : null;
  const selectedProcedure = selectedNuclide?.procedures.find(
    (p) => p.id === patient.procedureId,
  );

  const doseValidation = useMemo(() => {
    if (!patient.nuclideId || !patient.procedureId || !patient.doseMBq) return null;
    return validateDoseRange(patient.nuclideId, patient.procedureId, patient.doseMBq as number);
  }, [patient.nuclideId, patient.procedureId, patient.doseMBq]);

  const canProceed =
    patient.nuclideId &&
    patient.procedureId &&
    patient.doseMBq &&
    (patient.doseMBq as number) > 0 &&
    patient.injectionTime &&
    new Date(patient.injectionTime).getTime() <= Date.now();

  function handleNuclideChange(nuclideId: NuclideId) {
    onChange({ ...patient, nuclideId, procedureId: '', doseMBq: '' });
  }

  function handleProcedureChange(procedureId: string) {
    const proc = getNuclide(patient.nuclideId as NuclideId).procedures.find(
      (p) => p.id === procedureId,
    );
    onChange({ ...patient, procedureId, doseMBq: proc ? proc.doseRangeMin : '' });
  }

  return (
    <div className="space-y-5">
      {/* Section header */}
      <div className="text-center mb-2">
        <h2 className="text-2xl font-bold tracking-tight text-text">환자 정보 입력</h2>
        <p className="text-[13px] text-text-secondary mt-1">방사성의약품 투여 정보를 입력해주세요</p>
      </div>

      {/* Basic info card */}
      <div className="glass rounded-2xl p-5 space-y-4">
        <p className="text-[12px] font-medium text-text-secondary uppercase tracking-wider">기본 정보</p>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-[12px] font-medium text-text-secondary mb-1.5">성별</label>
            <select
              value={patient.gender}
              onChange={(e) => onChange({ ...patient, gender: e.target.value as PatientInfo['gender'] })}
              className={inputClass}
            >
              <option value="">선택</option>
              <option value="male">남성</option>
              <option value="female">여성</option>
            </select>
          </div>
          <div>
            <label className="block text-[12px] font-medium text-text-secondary mb-1.5">나이</label>
            <input
              type="number"
              min={0}
              max={120}
              placeholder="세"
              value={patient.age}
              onChange={(e) => onChange({ ...patient, age: e.target.value ? Number(e.target.value) : '' })}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-[12px] font-medium text-text-secondary mb-1.5">몸무게</label>
            <input
              type="number"
              min={1}
              max={300}
              placeholder="kg"
              value={patient.weight}
              onChange={(e) => onChange({ ...patient, weight: e.target.value ? Number(e.target.value) : '' })}
              className={inputClass}
            />
          </div>
        </div>
      </div>

      {/* Nuclide selection card */}
      <div className="glass rounded-2xl p-5 space-y-4">
        <p className="text-[12px] font-medium text-text-secondary uppercase tracking-wider">의약품 선택</p>
        <NuclideSelector
          nuclides={NUCLIDE_LIST}
          selectedNuclideId={patient.nuclideId || null}
          selectedProcedureId={patient.procedureId}
          onNuclideChange={handleNuclideChange}
          onProcedureChange={handleProcedureChange}
        />
      </div>

      {/* Dose + Time card */}
      <div className="glass rounded-2xl p-5 space-y-4">
        <p className="text-[12px] font-medium text-text-secondary uppercase tracking-wider">투여 정보</p>
        <div>
          <label className="block text-[12px] font-medium text-text-secondary mb-1.5">투여량 (MBq)</label>
          <input
            type="number"
            min={0}
            step={10}
            placeholder="MBq"
            value={patient.doseMBq}
            onChange={(e) => onChange({ ...patient, doseMBq: e.target.value ? Number(e.target.value) : '' })}
            className={inputClass}
          />
          {selectedProcedure && (
            <p className="text-[11px] text-text-tertiary mt-1.5 pl-1">
              일반 범위: {selectedProcedure.doseRangeMin.toLocaleString()}~{selectedProcedure.doseRangeMax.toLocaleString()} MBq
            </p>
          )}
          {doseValidation && !doseValidation.inRange && (
            <p className="text-[11px] text-caution mt-1.5 pl-1">
              &#x26A0;&#xFE0F; 일반 범위를 벗어납니다
            </p>
          )}
        </div>

        <div>
          <label className="block text-[12px] font-medium text-text-secondary mb-1.5">주사 일시</label>
          <input
            type="datetime-local"
            value={patient.injectionTime}
            onChange={(e) => onChange({ ...patient, injectionTime: e.target.value })}
            max={new Date().toISOString().slice(0, 16)}
            className={inputClass}
          />
          {patient.injectionTime && new Date(patient.injectionTime).getTime() > Date.now() && (
            <p className="text-[11px] text-danger mt-1.5 pl-1">주사 일시가 미래입니다.</p>
          )}
        </div>
      </div>

      <button
        onClick={onNext}
        disabled={!canProceed}
        className="w-full py-3.5 rounded-2xl font-semibold text-white text-[15px]
          bg-gradient-to-b from-primary to-primary-dark
          shadow-[0_4px_16px_rgba(255,107,107,0.3)]
          disabled:opacity-30 disabled:shadow-none disabled:cursor-not-allowed
          active:scale-[0.98] transition-all duration-200"
      >
        다음: 가족 등록
      </button>
    </div>
  );
}
