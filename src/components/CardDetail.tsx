'use client';

import {
  CardData,
  CARD_TYPE_COLORS,
  CARD_TYPE_KOREAN,
  parseCombineCondition,
  UNIT_KOREAN_NAMES,
} from '@/types/card';
import { getCardById } from '@/data/cards';

interface CardDetailProps {
  card: CardData;
  onClose: () => void;
}

export default function CardDetail({ card, onClose }: CardDetailProps) {
  const combineCondition = parseCombineCondition(card.combineCondition);
  const parentCards = card.parentCardIDs
    .map(id => getCardById(id))
    .filter((c): c is CardData => c !== undefined);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-gray-800 rounded-xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
        {/* Header */}
        <div
          className="px-6 py-4"
          style={{ backgroundColor: CARD_TYPE_COLORS[card.cardType] }}
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-white/80">
              {CARD_TYPE_KOREAN[card.cardType]} • 랭크 {card.cardRank}
            </span>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>
          <h2 className="text-xl font-bold text-white mt-1">{card.displayName}</h2>
        </div>

        {/* Body */}
        <div className="px-6 py-4 space-y-4">
          {/* Description */}
          <div>
            <h3 className="text-sm font-medium text-gray-400 mb-1">설명</h3>
            <p className="text-white whitespace-pre-wrap">{card.displayDescription}</p>
          </div>

          {/* Requirements */}
          {(parentCards.length > 0 || combineCondition) && (
            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-2">획득 조건</h3>

              {parentCards.length > 0 && (
                <div className="mb-2">
                  <span className="text-xs text-blue-400">연계 카드 필요:</span>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {parentCards.map(parent => (
                      <span
                        key={parent.cardID}
                        className="px-2 py-1 text-sm rounded bg-blue-900/50 text-blue-300"
                      >
                        {parent.displayName}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {combineCondition && (
                <div>
                  <span className="text-xs text-red-400">조합 조건:</span>
                  <div className="mt-1">
                    <span className="px-2 py-1 text-sm rounded bg-red-900/50 text-red-300">
                      {UNIT_KOREAN_NAMES[combineCondition.unit]} {combineCondition.rank}랭크 이상
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-400">유닛 레벨 제한</span>
              <p className="text-white font-medium">Lv.{card.unitLevelLimit}</p>
            </div>
            <div>
              <span className="text-gray-400">최대 선택 횟수</span>
              <p className="text-white font-medium">
                {card.maxCount === -1 ? '무제한' : card.maxCount}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
