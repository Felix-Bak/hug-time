import type { Nuclide, NuclideId } from '../../types';

interface Props {
  nuclides: Nuclide[];
  selectedNuclideId: NuclideId | null;
  selectedProcedureId: string;
  onNuclideChange: (id: NuclideId) => void;
  onProcedureChange: (id: string) => void;
}

const selectClass =
  'w-full rounded-xl glass px-4 py-3 text-[15px] text-text focus:outline-none focus:ring-2 focus:ring-primary/30 border-none appearance-none bg-[url("data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2012%2012%22%3E%3Cpath%20d%3D%22M2%204l4%204%204-4%22%20fill%3D%22none%22%20stroke%3D%22%236E6E73%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%2F%3E%3C%2Fsvg%3E")] bg-no-repeat bg-[right_12px_center]';

export default function NuclideSelector({
  nuclides,
  selectedNuclideId,
  selectedProcedureId,
  onNuclideChange,
  onProcedureChange,
}: Props) {
  const selectedNuclide = nuclides.find((n) => n.id === selectedNuclideId);

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-[12px] font-medium text-text-secondary mb-1.5">
          방사성의약품
        </label>
        <select
          value={selectedNuclideId || ''}
          onChange={(e) => onNuclideChange(e.target.value as NuclideId)}
          className={selectClass}
        >
          <option value="">선택해주세요</option>
          {nuclides.map((n) => (
            <option key={n.id} value={n.id}>{n.label}</option>
          ))}
        </select>
      </div>

      {selectedNuclide && (
        <div>
          <label className="block text-[12px] font-medium text-text-secondary mb-1.5">
            시술 유형
          </label>
          <select
            value={selectedProcedureId}
            onChange={(e) => onProcedureChange(e.target.value)}
            className={selectClass}
          >
            <option value="">선택해주세요</option>
            {selectedNuclide.procedures.map((p) => (
              <option key={p.id} value={p.id}>{p.label}</option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}
