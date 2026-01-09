'use client';

import { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import UnitSelector from '@/components/UnitSelector';
import { EUnitType, UNIT_KOREAN_NAMES } from '@/types/card';
import { getAllUnits } from '@/data/cards';

const CardGraph = dynamic(() => import('@/components/CardGraph'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full">
      <div className="text-gray-400">그래프 로딩 중...</div>
    </div>
  ),
});

export default function Home() {
  const [selectedUnits, setSelectedUnits] = useState<EUnitType[]>(['Marine']);

  const handleToggleUnit = useCallback((unit: EUnitType) => {
    setSelectedUnits(prev => {
      if (prev.includes(unit)) {
        return prev.filter(u => u !== unit);
      } else {
        return [...prev, unit];
      }
    });
  }, []);

  const handleSelectAll = useCallback(() => {
    setSelectedUnits(getAllUnits());
  }, []);

  const handleClearAll = useCallback(() => {
    setSelectedUnits([]);
  }, []);

  return (
    <div className="flex flex-col h-screen bg-gray-900">
      {/* Header */}
      <header className="px-6 py-4 bg-gray-800 border-b border-gray-700">
        <h1 className="text-2xl font-bold text-white">
          MarinRPG 카드 관계도
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          여러 유닛을 선택하여 조합카드 관계를 확인하세요. 카드를 클릭하면 연관 관계가 하이라이트됩니다.
        </p>
      </header>

      {/* Unit Selector */}
      <UnitSelector
        selectedUnits={selectedUnits}
        onToggleUnit={handleToggleUnit}
        onSelectAll={handleSelectAll}
        onClearAll={handleClearAll}
      />

      {/* Current Selection Info */}
      <div className="px-4 py-2 bg-gray-800/50 border-b border-gray-700 flex flex-wrap items-center gap-2">
        <span className="text-gray-400 text-sm">선택된 유닛:</span>
        {selectedUnits.length === 0 ? (
          <span className="text-gray-500 text-sm">없음</span>
        ) : (
          selectedUnits.map(unit => (
            <span
              key={unit}
              className="px-2 py-0.5 text-xs rounded-full text-white"
              style={{ backgroundColor: `${UNIT_KOREAN_NAMES[unit] ? '#374151' : '#374151'}` }}
            >
              {UNIT_KOREAN_NAMES[unit]}
            </span>
          ))
        )}
        {selectedUnits.length > 1 && (
          <span className="text-gray-500 text-xs ml-2">
            (점선: 유닛 간 조합카드 관계)
          </span>
        )}
      </div>

      {/* Graph */}
      <div className="flex-1 relative">
        <CardGraph selectedUnits={selectedUnits} />
      </div>

      {/* Footer */}
      <footer className="px-4 py-2 bg-gray-800 border-t border-gray-700 text-center">
        <p className="text-xs text-gray-500">
          <span className="text-blue-400">━</span> 연계: A → B → C (A가 있어야 B 획득 가능) |
          <span className="text-red-400 ml-2">┅</span> 조합: 해당 유닛이 특정 랭크 이상이어야 함
        </p>
      </footer>
    </div>
  );
}
