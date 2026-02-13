export default function Footer() {
  return (
    <footer className="mt-auto">
      <div className="glass-subtle">
        <div className="max-w-lg mx-auto px-5 py-5 text-center space-y-1.5">
          <p className="text-[11px] text-text-secondary leading-relaxed">
            본 앱의 계산 결과는 참고용이며, 실제 방사선 안전 조치는 담당 의료진의 지시를 따르십시오.
          </p>
          <p className="text-[10px] text-text-tertiary">
            참고 기준: ICRP 103 · NCRP 155 · ICRP 128
          </p>
        </div>
      </div>
    </footer>
  );
}
