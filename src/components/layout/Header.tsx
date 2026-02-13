export default function Header() {
  return (
    <header className="sticky top-0 z-50">
      <div className="glass-heavy">
        <div className="max-w-lg mx-auto px-5 py-3.5 flex items-center justify-center">
          <h1 className="text-lg font-semibold tracking-tight text-text">
            <span className="mr-1.5 text-xl">&#x1F489;</span>
            Hug Time
          </h1>
        </div>
      </div>
      <div className="glass-subtle">
        <p className="max-w-lg mx-auto px-5 py-2 text-[11px] text-text-secondary text-center leading-relaxed">
          &#x26A0;&#xFE0F; 이 앱은 참고용이며, 실제 방사선 안전 조치는 담당 의료진의 지시를 따르십시오.
        </p>
      </div>
    </header>
  );
}
