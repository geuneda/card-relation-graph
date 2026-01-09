'use client';

import { useState, useMemo, useCallback } from 'react';
import {
  CardData,
  EUnitType,
  ECardType,
  UNIT_COLORS,
  UNIT_KOREAN_NAMES,
  CARD_TYPE_COLORS,
  CARD_TYPE_KOREAN,
  parseCombineCondition,
} from '@/types/card';
import { getCardsByUnit, getCardById, getAllUnits } from '@/data/cards';

interface UnitConfig {
  unit: EUnitType;
  rank: number;
  enabled: boolean;
}

interface DeckCard {
  card: CardData;
  count: number;
}

export default function DeckBuilder() {
  // Unit configurations with ranks
  const [unitConfigs, setUnitConfigs] = useState<UnitConfig[]>(
    getAllUnits().map(unit => ({
      unit,
      rank: 1,
      enabled: false,
    }))
  );

  // Selected deck cards
  const [deck, setDeck] = useState<DeckCard[]>([]);

  // Filter state
  const [typeFilter, setTypeFilter] = useState<ECardType | 'all'>('all');

  // Get enabled units
  const enabledUnits = useMemo(
    () => unitConfigs.filter(c => c.enabled),
    [unitConfigs]
  );

  // Check if a card's conditions are met
  const checkCardConditions = useCallback(
    (card: CardData): { available: boolean; reason?: string } => {
      const unitConfig = unitConfigs.find(c => c.unit === card.targetUnit);
      if (!unitConfig?.enabled) {
        return { available: false, reason: '유닛이 활성화되지 않음' };
      }

      // Check rank requirement
      if (card.cardRank > unitConfig.rank) {
        return {
          available: false,
          reason: `${UNIT_KOREAN_NAMES[card.targetUnit]} ${card.cardRank}랭크 필요`,
        };
      }

      // Check chain card requirements (parentCardIDs)
      if (card.parentCardIDs.length > 0) {
        const missingParents = card.parentCardIDs.filter(parentId => {
          const deckHasParent = deck.some(d => d.card.cardID === parentId);
          return !deckHasParent;
        });

        if (missingParents.length > 0) {
          const parentNames = missingParents
            .map(id => getCardById(id)?.displayName || `ID:${id}`)
            .join(', ');
          return {
            available: false,
            reason: `선행 카드 필요: ${parentNames}`,
          };
        }
      }

      // Check combo card requirements
      const combineCondition = parseCombineCondition(card.combineCondition);
      if (combineCondition) {
        const requiredUnitConfig = unitConfigs.find(
          c => c.unit === combineCondition.unit
        );
        if (!requiredUnitConfig?.enabled) {
          return {
            available: false,
            reason: `${UNIT_KOREAN_NAMES[combineCondition.unit]} 유닛 필요`,
          };
        }
        if (requiredUnitConfig.rank < combineCondition.rank) {
          return {
            available: false,
            reason: `${UNIT_KOREAN_NAMES[combineCondition.unit]} ${combineCondition.rank}랭크 필요 (현재: ${requiredUnitConfig.rank}랭)`,
          };
        }
      }

      // Check max count
      const currentCount = deck.find(d => d.card.cardID === card.cardID)?.count || 0;
      if (card.maxCount !== -1 && currentCount >= card.maxCount) {
        return {
          available: false,
          reason: `최대 선택 횟수 도달 (${card.maxCount}회)`,
        };
      }

      return { available: true };
    },
    [unitConfigs, deck]
  );

  // Get available cards for each enabled unit
  const availableCards = useMemo(() => {
    const cards: CardData[] = [];
    enabledUnits.forEach(config => {
      const unitCards = getCardsByUnit(config.unit);
      // Filter out Spawn cards and cards above current rank
      unitCards
        .filter(card => card.cardType !== 'Spawn')
        .filter(card => card.cardRank <= config.rank)
        .forEach(card => cards.push(card));
    });

    // Apply type filter
    if (typeFilter !== 'all') {
      return cards.filter(card => card.cardType === typeFilter);
    }

    return cards;
  }, [enabledUnits, typeFilter]);

  // Toggle unit
  const toggleUnit = (unit: EUnitType) => {
    setUnitConfigs(prev =>
      prev.map(c => (c.unit === unit ? { ...c, enabled: !c.enabled } : c))
    );
  };

  // Set unit rank
  const setUnitRank = (unit: EUnitType, rank: number) => {
    setUnitConfigs(prev =>
      prev.map(c => (c.unit === unit ? { ...c, rank } : c))
    );
  };

  // Add card to deck
  const addCardToDeck = (card: CardData) => {
    const condition = checkCardConditions(card);
    if (!condition.available) return;

    setDeck(prev => {
      const existing = prev.find(d => d.card.cardID === card.cardID);
      if (existing) {
        return prev.map(d =>
          d.card.cardID === card.cardID ? { ...d, count: d.count + 1 } : d
        );
      }
      return [...prev, { card, count: 1 }];
    });
  };

  // Remove card from deck
  const removeCardFromDeck = (cardId: number) => {
    setDeck(prev => {
      const existing = prev.find(d => d.card.cardID === cardId);
      if (existing && existing.count > 1) {
        return prev.map(d =>
          d.card.cardID === cardId ? { ...d, count: d.count - 1 } : d
        );
      }
      return prev.filter(d => d.card.cardID !== cardId);
    });
  };

  // Clear deck
  const clearDeck = () => setDeck([]);

  // Calculate total cards in deck
  const totalCards = deck.reduce((sum, d) => sum + d.count, 0);

  return (
    <div className="flex h-full">
      {/* Left Panel - Unit Configuration */}
      <div className="w-64 bg-gray-800 border-r border-gray-700 overflow-y-auto">
        <div className="p-4">
          <h2 className="text-lg font-bold text-white mb-4">유닛 설정</h2>
          <p className="text-xs text-gray-400 mb-4">
            유닛을 활성화하고 랭크를 설정하세요
          </p>

          <div className="space-y-3">
            {unitConfigs.map(config => (
              <div
                key={config.unit}
                className={`p-3 rounded-lg border transition-all ${
                  config.enabled
                    ? 'border-gray-600 bg-gray-700/50'
                    : 'border-gray-700 bg-gray-800/50 opacity-60'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="checkbox"
                    checked={config.enabled}
                    onChange={() => toggleUnit(config.unit)}
                    className="w-4 h-4 rounded"
                  />
                  <span
                    className="font-medium text-sm"
                    style={{ color: UNIT_COLORS[config.unit] }}
                  >
                    {UNIT_KOREAN_NAMES[config.unit]}
                  </span>
                </div>

                {config.enabled && (
                  <div className="flex items-center gap-2 ml-6">
                    <span className="text-xs text-gray-400">랭크:</span>
                    <div className="flex gap-1">
                      {[1, 2, 3].map(rank => (
                        <button
                          key={rank}
                          onClick={() => setUnitRank(config.unit, rank)}
                          className={`w-6 h-6 text-xs rounded ${
                            config.rank >= rank
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-600 text-gray-400'
                          }`}
                        >
                          {rank}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Middle Panel - Card List */}
      <div className="flex-1 overflow-y-auto bg-gray-900">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white">카드 목록</h2>
            <div className="flex gap-2">
              <select
                value={typeFilter}
                onChange={e => setTypeFilter(e.target.value as ECardType | 'all')}
                className="px-3 py-1 text-sm bg-gray-700 text-white rounded border border-gray-600"
              >
                <option value="all">전체 타입</option>
                <option value="Common">일반</option>
                <option value="Chain">연계</option>
                <option value="Promotion">승급</option>
                <option value="Combo">조합</option>
              </select>
            </div>
          </div>

          {enabledUnits.length === 0 ? (
            <div className="text-center text-gray-500 py-12">
              왼쪽에서 유닛을 활성화해주세요
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {availableCards.map(card => {
                const condition = checkCardConditions(card);
                const inDeckCount =
                  deck.find(d => d.card.cardID === card.cardID)?.count || 0;

                return (
                  <div
                    key={card.cardID}
                    className={`p-3 rounded-lg border transition-all ${
                      condition.available
                        ? 'border-gray-600 bg-gray-800 hover:border-gray-500 cursor-pointer'
                        : 'border-gray-700 bg-gray-800/50 opacity-50'
                    }`}
                    onClick={() => condition.available && addCardToDeck(card)}
                  >
                    <div className="flex items-start justify-between mb-1">
                      <span
                        className="text-[10px] px-1.5 py-0.5 rounded font-medium"
                        style={{
                          backgroundColor: CARD_TYPE_COLORS[card.cardType],
                        }}
                      >
                        {CARD_TYPE_KOREAN[card.cardType]}
                      </span>
                      <div className="flex items-center gap-1">
                        <span
                          className="text-[10px] px-1 rounded"
                          style={{
                            backgroundColor: UNIT_COLORS[card.targetUnit] + '40',
                            color: UNIT_COLORS[card.targetUnit],
                          }}
                        >
                          {UNIT_KOREAN_NAMES[card.targetUnit]}
                        </span>
                        <span className="text-[10px] text-gray-500">
                          R{card.cardRank}
                        </span>
                      </div>
                    </div>

                    <h3 className="text-sm font-bold text-white mb-1">
                      {card.displayName}
                      {inDeckCount > 0 && (
                        <span className="ml-2 text-blue-400">×{inDeckCount}</span>
                      )}
                    </h3>

                    <p className="text-[10px] text-gray-400 mb-2 line-clamp-2">
                      {card.displayDescription}
                    </p>

                    {!condition.available && condition.reason && (
                      <p className="text-[10px] text-red-400">
                        ⚠ {condition.reason}
                      </p>
                    )}

                    {card.maxCount !== -1 && (
                      <p className="text-[10px] text-gray-500">
                        최대 {card.maxCount}회 선택 가능
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Right Panel - Deck */}
      <div className="w-80 bg-gray-800 border-l border-gray-700 flex flex-col">
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-bold text-white">내 덱</h2>
            <span className="text-sm text-gray-400">{totalCards}장</span>
          </div>
          <button
            onClick={clearDeck}
            className="w-full px-3 py-1 text-sm bg-red-900/50 text-red-300 rounded hover:bg-red-900/70 transition-colors"
          >
            덱 비우기
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {deck.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              카드를 클릭하여 덱에 추가하세요
            </div>
          ) : (
            <div className="space-y-2">
              {deck.map(({ card, count }) => (
                <div
                  key={card.cardID}
                  className="flex items-center gap-2 p-2 bg-gray-700/50 rounded-lg group"
                >
                  <div
                    className="w-1 h-8 rounded"
                    style={{ backgroundColor: UNIT_COLORS[card.targetUnit] }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                      <span
                        className="text-[8px] px-1 rounded"
                        style={{
                          backgroundColor: CARD_TYPE_COLORS[card.cardType],
                        }}
                      >
                        {CARD_TYPE_KOREAN[card.cardType]}
                      </span>
                      <span className="text-xs font-medium text-white truncate">
                        {card.displayName}
                      </span>
                    </div>
                    <span className="text-[10px] text-gray-400">
                      {UNIT_KOREAN_NAMES[card.targetUnit]} R{card.cardRank}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-sm text-white font-medium">×{count}</span>
                    <button
                      onClick={() => removeCardFromDeck(card.cardID)}
                      className="w-5 h-5 text-xs bg-gray-600 hover:bg-red-600 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      −
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Deck Summary */}
        {deck.length > 0 && (
          <div className="p-4 border-t border-gray-700 bg-gray-800/50">
            <h3 className="text-sm font-medium text-white mb-2">덱 구성</h3>
            <div className="space-y-1 text-xs">
              {(['Common', 'Chain', 'Promotion', 'Combo'] as ECardType[]).map(type => {
                const typeCount = deck
                  .filter(d => d.card.cardType === type)
                  .reduce((sum, d) => sum + d.count, 0);
                if (typeCount === 0) return null;
                return (
                  <div key={type} className="flex items-center gap-2">
                    <div
                      className="w-2 h-2 rounded"
                      style={{ backgroundColor: CARD_TYPE_COLORS[type] }}
                    />
                    <span className="text-gray-400">{CARD_TYPE_KOREAN[type]}</span>
                    <span className="text-white">{typeCount}장</span>
                  </div>
                );
              })}
            </div>

            <div className="mt-3 pt-3 border-t border-gray-700">
              <h4 className="text-xs text-gray-400 mb-1">유닛별</h4>
              <div className="flex flex-wrap gap-1">
                {enabledUnits.map(config => {
                  const unitCount = deck
                    .filter(d => d.card.targetUnit === config.unit)
                    .reduce((sum, d) => sum + d.count, 0);
                  if (unitCount === 0) return null;
                  return (
                    <span
                      key={config.unit}
                      className="text-[10px] px-2 py-0.5 rounded"
                      style={{
                        backgroundColor: UNIT_COLORS[config.unit] + '30',
                        color: UNIT_COLORS[config.unit],
                      }}
                    >
                      {UNIT_KOREAN_NAMES[config.unit]} {unitCount}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
