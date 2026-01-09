export type ECardType = 'Common' | 'Chain' | 'Promotion' | 'Combo' | 'Spawn';

export type EUnitType =
  | 'Marine'
  | 'Turret'
  | 'Archon'
  | 'DrFrost'
  | 'Marauder'
  | 'Templer'
  | 'Dragoon'
  | 'Vessel'
  | 'Carrier'
  | 'Ninja'
  | 'Thor'
  | 'AirMan';

export interface CardData {
  cardID: number;
  cardName: string;
  cardDescription: string;
  cardType: ECardType;
  targetUnit: EUnitType;
  effectTypes: string[];
  effectValues: number[];
  weight: number;
  maxCount: number;
  cardRank: number;
  unitLevelLimit: number;
  parentCardIDs: number[];
  combineCondition: string;
  displayName: string;
  displayDescription: string;
}

export interface UnitRankCondition {
  unit: EUnitType;
  rank: number;
}

export function parseCombineCondition(condition: string): UnitRankCondition | null {
  if (!condition || condition === 'None') return null;

  // 예: "Archon2" -> { unit: "Archon", rank: 2 }
  const match = condition.match(/^([A-Za-z]+)(\d+)$/);
  if (match) {
    return {
      unit: match[1] as EUnitType,
      rank: parseInt(match[2], 10)
    };
  }
  return null;
}

export const UNIT_COLORS: Record<EUnitType, string> = {
  Marine: '#3b82f6',      // blue
  Turret: '#f59e0b',      // amber
  Archon: '#8b5cf6',      // violet
  DrFrost: '#06b6d4',     // cyan
  Marauder: '#ef4444',    // red
  Templer: '#a855f7',     // purple
  Dragoon: '#10b981',     // emerald
  Vessel: '#6366f1',      // indigo
  Carrier: '#f97316',     // orange
  Ninja: '#1f2937',       // gray-800
  Thor: '#eab308',        // yellow
  AirMan: '#22c55e',      // green
};

export const UNIT_KOREAN_NAMES: Record<EUnitType, string> = {
  Marine: '마린',
  Turret: '터렛',
  Archon: '제우스',
  DrFrost: '눈사람',
  Marauder: '고릴라',
  Templer: '사도',
  Dragoon: '거북이',
  Vessel: '지우개',
  Carrier: '우주모함',
  Ninja: '어썌신',
  Thor: '토르',
  AirMan: '바람돌이',
};

export const CARD_TYPE_COLORS: Record<ECardType, string> = {
  Spawn: '#6b7280',       // gray
  Common: '#22c55e',      // green
  Chain: '#3b82f6',       // blue
  Promotion: '#f59e0b',   // amber
  Combo: '#ef4444',       // red
};

export const CARD_TYPE_KOREAN: Record<ECardType, string> = {
  Spawn: '스폰',
  Common: '일반',
  Chain: '연계',
  Promotion: '승급',
  Combo: '조합',
};
