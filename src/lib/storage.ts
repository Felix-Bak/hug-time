import type { AppData } from '../types';

const STORAGE_KEY = 'hug-time-data';
const CURRENT_VERSION = 1;

export function saveData(data: AppData): boolean {
  try {
    const json = JSON.stringify({ ...data, version: CURRENT_VERSION });
    localStorage.setItem(STORAGE_KEY, json);
    return true;
  } catch {
    return false;
  }
}

export function loadData(): AppData | null {
  try {
    const json = localStorage.getItem(STORAGE_KEY);
    if (!json) return null;
    const data = JSON.parse(json) as AppData;
    if (data.version !== CURRENT_VERSION) return null;
    return data;
  } catch {
    return null;
  }
}

export function clearData(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function hasData(): boolean {
  return localStorage.getItem(STORAGE_KEY) !== null;
}
