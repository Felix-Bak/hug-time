interface Props {
  percent: number;
}

export default function ActivityProgress({ percent }: Props) {
  const clamped = Math.max(0, Math.min(100, percent));

  // Gradient from danger → caution → safe
  const getColor = () => {
    if (clamped > 50) return 'from-danger to-caution';
    if (clamped > 20) return 'from-caution to-accent';
    return 'from-safe to-safe-dark';
  };

  return (
    <div className="glass rounded-2xl p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[13px] font-medium text-text">체내 잔여 방사능</span>
        <span className="text-[14px] font-bold tabular-nums text-text">
          {clamped.toFixed(1)}%
        </span>
      </div>
      <div className="h-2.5 bg-white/40 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${getColor()} transition-all duration-1000`}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
