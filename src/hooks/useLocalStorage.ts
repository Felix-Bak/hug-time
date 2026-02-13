import { useEffect, useCallback } from 'react';
import type { AppData } from '../types';
import { saveData, loadData, clearData } from '../lib/storage';

export function useLocalStorage(data: AppData) {
  // 데이터 변경 시 자동 저장
  useEffect(() => {
    if (data.patient.nuclideId) {
      saveData(data);
    }
  }, [data]);

  return { saveData: () => saveData(data) };
}

export function useLoadData(): AppData | null {
  return loadData();
}

export function useClearData() {
  return useCallback(() => {
    clearData();
  }, []);
}
