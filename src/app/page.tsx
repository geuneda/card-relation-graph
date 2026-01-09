'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import UnitSelector from '@/components/UnitSelector';
import { EUnitType, UNIT_KOREAN_NAMES } from '@/types/card';

const CardGraph = dynamic(() => import('@/components/CardGraph'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full">
      <div className="text-gray-400">그래프 로딩 중...</div>
    </div>
  ),
});

export default function Home() {
  const [selectedUnit, setSelectedUnit] = useState<EUnitType>('Marine');

  return (
    <div className="flex flex-col h-screen bg-gray-900">
      {/* Header */}
      <header className="px-6 py-4 bg-gray-800 border-b border-gray-700">
        <h1 className="text-2xl font-bold text-white">
          MarinRPG 카드 관계도
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          유닛을 선택하고 카드를 클릭하면 연계 관계를 확인할 수 있습니다
        </p>
      </header>

      {/* Unit Selector */}
      <UnitSelector selectedUnit={selectedUnit} onSelectUnit={setSelectedUnit} />

      {/* Current Unit Info */}
      <div className="px-4 py-2 bg-gray-800/50 border-b border-gray-700">
        <span className="text-gray-400 text-sm">
          현재 선택: <span className="text-white font-medium">{UNIT_KOREAN_NAMES[selectedUnit]}</span>
        </span>
      </div>

      {/* Graph */}
      <div className="flex-1 relative">
        <CardGraph selectedUnit={selectedUnit} />
      </div>

      {/* Footer */}
      <footer className="px-4 py-2 bg-gray-800 border-t border-gray-700 text-center">
        <p className="text-xs text-gray-500">
          연계카드: A → B → C (A가 있어야 B 획득 가능) | 조합카드: 해당 유닛이 특정 랭크 이상이어야 함
        </p>
      </footer>
    </div>
  );
}
