'use client';

import { EUnitType, UNIT_COLORS, UNIT_KOREAN_NAMES } from '@/types/card';
import { getAllUnits } from '@/data/cards';

interface UnitSelectorProps {
  selectedUnit: EUnitType;
  onSelectUnit: (unit: EUnitType) => void;
}

export default function UnitSelector({ selectedUnit, onSelectUnit }: UnitSelectorProps) {
  const units = getAllUnits();

  return (
    <div className="flex flex-wrap gap-2 p-4 bg-gray-800 border-b border-gray-700">
      {units.map(unit => (
        <button
          key={unit}
          onClick={() => onSelectUnit(unit)}
          className={`
            px-4 py-2 rounded-lg font-medium text-sm
            transition-all duration-200
            ${selectedUnit === unit
              ? 'ring-2 ring-offset-2 ring-offset-gray-800'
              : 'opacity-70 hover:opacity-100'
            }
          `}
          style={{
            backgroundColor: UNIT_COLORS[unit],
            color: unit === 'Ninja' ? '#fff' : unit === 'Thor' ? '#000' : '#fff',
            boxShadow: selectedUnit === unit ? `0 0 20px ${UNIT_COLORS[unit]}50` : 'none',
          }}
        >
          {UNIT_KOREAN_NAMES[unit]}
        </button>
      ))}
    </div>
  );
}
