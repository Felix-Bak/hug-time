import { useState, useCallback, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { AppStep, PatientInfo, FamilyMember, DoseStandardType, AppData } from './types';
import { loadData, saveData, clearData } from './lib/storage';
import { categorizeAge, getDoseLimit } from './lib/doseLimits';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Landing from './components/Landing';
import PatientForm from './components/input/PatientForm';
import FamilyForm from './components/input/FamilyForm';
import StandardSelector from './components/input/StandardSelector';
import Dashboard from './components/result/Dashboard';

const defaultPatient: PatientInfo = {
  gender: '',
  age: '',
  weight: '',
  nuclideId: '',
  procedureId: '',
  doseMBq: '',
  injectionTime: '',
};

function toLocalDateTimeString(date: Date): string {
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export default function App() {
  const [step, setStep] = useState<AppStep>('landing');
  const [patient, setPatient] = useState<PatientInfo>({
    ...defaultPatient,
    injectionTime: toLocalDateTimeString(new Date()),
  });
  const [family, setFamily] = useState<FamilyMember[]>([]);
  const [standard, setStandard] = useState<DoseStandardType>('icrp');
  const [hasSaved, setHasSaved] = useState(false);

  // 초기 로드
  useEffect(() => {
    const saved = loadData();
    if (saved) {
      setPatient(saved.patient);
      setFamily(saved.family);
      setStandard(saved.standard);
      setHasSaved(true);
    }
  }, []);

  // 자동 저장
  useEffect(() => {
    if (step === 'result' && patient.nuclideId) {
      const data: AppData = { patient, family, standard, version: 1 };
      saveData(data);
    }
  }, [step, patient, family, standard]);

  const handleContinue = useCallback(() => {
    setStep('result');
  }, []);

  const handleStart = useCallback(() => {
    setStep('patient');
  }, []);

  const handleReset = useCallback(() => {
    if (window.confirm('모든 데이터를 초기화하시겠습니까?')) {
      clearData();
      setPatient({ ...defaultPatient, injectionTime: toLocalDateTimeString(new Date()) });
      setFamily([]);
      setStandard('icrp');
      setHasSaved(false);
      setStep('landing');
    }
  }, []);

  // 가족 변경 시 카테고리 재계산
  const handleFamilyChange = useCallback(
    (newFamily: FamilyMember[]) => {
      const updated = newFamily.map((m) => {
        const category = categorizeAge(m.age, m.isPregnant);
        const doseLimitMSv = getDoseLimit(standard, category);
        return { ...m, category, doseLimitMSv };
      });
      setFamily(updated);
    },
    [standard],
  );

  // 기준 변경 시 가족 한도선량 재계산
  const handleStandardChange = useCallback(
    (newStandard: DoseStandardType) => {
      setStandard(newStandard);
      setFamily((prev) =>
        prev.map((m) => {
          const category = categorizeAge(m.age, m.isPregnant);
          const doseLimitMSv = getDoseLimit(newStandard, category);
          return { ...m, category, doseLimitMSv };
        }),
      );
    },
    [],
  );

  const pageVariants = {
    enter: { opacity: 0, x: 30 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -30 },
  };

  return (
    <>
      <Header />
      <main className="flex-1 max-w-lg mx-auto w-full px-4 py-6">
        <AnimatePresence mode="wait">
          {step === 'landing' && (
            <motion.div key="landing" variants={pageVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.2 }}>
              <Landing
                hasSaved={hasSaved}
                onStart={handleStart}
                onContinue={handleContinue}
              />
            </motion.div>
          )}
          {step === 'patient' && (
            <motion.div key="patient" variants={pageVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.2 }}>
              <PatientForm
                patient={patient}
                onChange={setPatient}
                onNext={() => setStep('family')}
              />
            </motion.div>
          )}
          {step === 'family' && (
            <motion.div key="family" variants={pageVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.2 }}>
              <FamilyForm
                family={family}
                standard={standard}
                onChange={handleFamilyChange}
                onNext={() => setStep('standard')}
                onBack={() => setStep('patient')}
              />
            </motion.div>
          )}
          {step === 'standard' && (
            <motion.div key="standard" variants={pageVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.2 }}>
              <StandardSelector
                standard={standard}
                family={family}
                onChange={handleStandardChange}
                onNext={() => setStep('result')}
                onBack={() => setStep('family')}
              />
            </motion.div>
          )}
          {step === 'result' && (
            <motion.div key="result" variants={pageVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.2 }}>
              <Dashboard
                patient={patient}
                family={family}
                standard={standard}
                onEdit={() => setStep('patient')}
                onReset={handleReset}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      <Footer />
    </>
  );
}
