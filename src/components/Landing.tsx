import { motion } from 'framer-motion';

interface Props {
  hasSaved: boolean;
  onStart: () => void;
  onContinue: () => void;
}

export default function Landing({ hasSaved, onStart, onContinue }: Props) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[65vh] text-center space-y-10">
      {/* Hero icon + title */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', duration: 0.8, bounce: 0.3 }}
        className="space-y-5"
      >
        <div className="relative inline-block">
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
            className="w-28 h-28 glass-heavy rounded-[2rem] flex items-center justify-center mx-auto shadow-lg"
          >
            <span className="text-5xl">&#x1F489;</span>
          </motion.div>
        </div>

        <div>
          <h1 className="text-[2.5rem] font-bold tracking-tight text-text leading-tight">
            Hug Time
          </h1>
          <p className="text-text-secondary text-[15px] mt-3 max-w-[280px] mx-auto leading-relaxed">
            방사성의약품 투여 후<br />
            가족에게 안전하게 다가갈 수 있는<br />
            시간을 알려드려요
          </p>
        </div>
      </motion.div>

      {/* Action buttons */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="w-full max-w-xs space-y-3"
      >
        <button
          onClick={onStart}
          className="w-full py-3.5 rounded-2xl font-semibold text-white text-[15px]
            bg-gradient-to-b from-primary to-primary-dark
            shadow-[0_4px_16px_rgba(255,107,107,0.3)]
            hover:shadow-[0_6px_24px_rgba(255,107,107,0.4)]
            active:scale-[0.98] transition-all duration-200"
        >
          시작하기
        </button>
        {hasSaved && (
          <button
            onClick={onContinue}
            className="w-full py-3.5 rounded-2xl font-semibold text-primary text-[15px]
              glass hover:bg-white/80
              active:scale-[0.98] transition-all duration-200"
          >
            이어서 보기
          </button>
        )}
      </motion.div>

      {/* Disclaimer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="glass rounded-2xl px-5 py-3.5 max-w-xs"
      >
        <p className="text-[11px] text-text-secondary leading-relaxed">
          &#x26A0;&#xFE0F; 이 앱은 참고용이며, 의료기기가 아닙니다.
          실제 방사선 안전 판단은 반드시 담당 의료 전문가의 지시를 따르세요.
        </p>
      </motion.div>
    </div>
  );
}
