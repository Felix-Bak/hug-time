import type { ContactScenario } from '../types';

export const CONTACT_SCENARIOS: ContactScenario[] = [
  {
    id: 'hug',
    label: '밀착/허그',
    emoji: '\uD83E\uDD17',
    distance: 0.3,
    occupancyFactor: 0.05,
    description: '하루 ~1.2시간 밀착 접촉',
  },
  {
    id: 'same-room',
    label: '같은 방',
    emoji: '\uD83D\uDECB\uFE0F',
    distance: 1.0,
    occupancyFactor: 0.25,
    description: '하루 ~6시간 같은 방',
  },
  {
    id: 'same-house',
    label: '같은 집',
    emoji: '\uD83C\uDFE0',
    distance: 2.0,
    occupancyFactor: 0.25,
    description: '일상적 거리 유지',
  },
];

export function getScenario(id: string): ContactScenario | undefined {
  return CONTACT_SCENARIOS.find((s) => s.id === id);
}
