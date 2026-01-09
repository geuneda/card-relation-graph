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
  Marine: '영웅',      // unit_name_0
  Turret: '터렛',      // unit_name_1
  Archon: '제우스',    // unit_name_2
  DrFrost: '눈사람',   // unit_name_3
  Marauder: '고릴라',  // unit_name_4
  Templer: '사도',     // unit_name_5
  Dragoon: '거북이',   // unit_name_6
  Vessel: '지우개',    // unit_name_7
  Carrier: '우주모함', // unit_name_8
  Ninja: '어쌔신',     // unit_name_9
  Thor: '또르',        // unit_name_10
  AirMan: '바람돌이',  // unit_name_11
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
