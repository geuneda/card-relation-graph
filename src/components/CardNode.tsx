'use client';

import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { CardData, CARD_TYPE_COLORS, CARD_TYPE_KOREAN, parseCombineCondition, UNIT_KOREAN_NAMES } from '@/types/card';

interface CardNodeData {
  card: CardData;
  isSelected: boolean;
  isHighlighted: boolean;
}

function CardNode({ data }: NodeProps<CardNodeData>) {
  const { card, isSelected, isHighlighted } = data;
  const combineCondition = parseCombineCondition(card.combineCondition);

  const borderColor = CARD_TYPE_COLORS[card.cardType];
  const opacity = isHighlighted || isSelected ? 1 : 0.4;

  return (
    <div
      className={`
        relative px-3 py-2 rounded-lg shadow-lg
        transition-all duration-200
        ${isSelected ? 'ring-2 ring-yellow-400 ring-offset-2' : ''}
      `}
      style={{
        backgroundColor: '#1f2937',
        borderLeft: `4px solid ${borderColor}`,
        opacity,
        minWidth: '140px',
        maxWidth: '180px',
      }}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="w-2 h-2 !bg-gray-500"
      />

      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <span
            className="text-[10px] px-1.5 py-0.5 rounded font-medium"
            style={{ backgroundColor: borderColor, color: '#fff' }}
          >
            {CARD_TYPE_KOREAN[card.cardType]}
          </span>
          <span className="text-[10px] text-gray-400">
            R{card.cardRank}
          </span>
        </div>

        <h3 className="text-sm font-bold text-white leading-tight">
          {card.displayName}
        </h3>

        <p className="text-[10px] text-gray-300 leading-snug whitespace-pre-wrap">
          {card.displayDescription}
        </p>

        {combineCondition && (
          <div className="mt-1 text-[10px] px-1.5 py-0.5 rounded bg-red-900/50 text-red-300">
            필요: {UNIT_KOREAN_NAMES[combineCondition.unit]} {combineCondition.rank}랭크
          </div>
        )}
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="w-2 h-2 !bg-gray-500"
      />
    </div>
  );
}

export default memo(CardNode);
