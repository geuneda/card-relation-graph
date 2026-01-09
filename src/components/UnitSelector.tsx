'use client';

import { EUnitType, UNIT_COLORS, UNIT_KOREAN_NAMES } from '@/types/card';
import { getAllUnits } from '@/data/cards';

interface UnitSelectorProps {
  selectedUnits: EUnitType[];
  onToggleUnit: (unit: EUnitType) => void;
  onSelectAll: () => void;
  onClearAll: () => void;
}

export default function UnitSelector({
  selectedUnits,
  onToggleUnit,
  onSelectAll,
  onClearAll
}: UnitSelectorProps) {
  const units = getAllUnits();

  return (
    <div className="flex flex-col gap-2 p-4 bg-gray-800 border-b border-gray-700">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-sm text-gray-400">유닛 선택 (복수 선택 가능):</span>
        <button
          onClick={onSelectAll}
          className="px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 rounded transition-colors"
        >
          전체 선택
        </button>
        <button
          onClick={onClearAll}
          className="px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 rounded transition-colors"
        >
          전체 해제
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {units.map(unit => {
          const isSelected = selectedUnits.includes(unit);
          return (
            <button
              key={unit}
              onClick={() => onToggleUnit(unit)}
              className={`
                px-4 py-2 rounded-lg font-medium text-sm
                transition-all duration-200
                ${isSelected
                  ? 'ring-2 ring-offset-2 ring-offset-gray-800'
                  : 'opacity-40 hover:opacity-70'
                }
              `}
              style={{
                backgroundColor: UNIT_COLORS[unit],
                color: unit === 'Ninja' ? '#fff' : unit === 'Thor' ? '#000' : '#fff',
                boxShadow: isSelected ? `0 0 20px ${UNIT_COLORS[unit]}50` : 'none',
              }}
            >
              {UNIT_KOREAN_NAMES[unit]}
              {isSelected && <span className="ml-1">✓</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
