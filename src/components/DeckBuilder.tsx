'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
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

interface SavedDeckCard {
  cardID: number;
  count: number;
}

interface SavedState {
  unitConfigs: UnitConfig[];
  deck: SavedDeckCard[];
  typeFilter: ECardType | 'all';
  unitFilter: EUnitType | 'all';
  searchQuery: string;
  sortBy: 'unit' | 'rank' | 'type' | 'name';
}

const STORAGE_KEY = 'marinrpg-deckbuilder-state';

export default function DeckBuilder() {
  const [isLoaded, setIsLoaded] = useState(false);

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

  // Filter states
  const [typeFilter, setTypeFilter] = useState<ECardType | 'all'>('all');
  const [unitFilter, setUnitFilter] = useState<EUnitType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'unit' | 'rank' | 'type' | 'name'>('unit');
  const [showOnlyAvailable, setShowOnlyAvailable] = useState(false);

  // Cloud save/load states
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showLoadModal, setShowLoadModal] = useState(false);
  const [slotName, setSlotName] = useState('');
  const [password, setPassword] = useState('');
  const [cloudLoading, setCloudLoading] = useState(false);
  const [cloudMessage, setCloudMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Load saved state from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const state: SavedState = JSON.parse(saved);

        // Restore unit configs
        if (state.unitConfigs) {
          setUnitConfigs(state.unitConfigs);
        }

        // Restore deck (need to reconstruct CardData from cardID)
        if (state.deck) {
          const restoredDeck: DeckCard[] = [];
          state.deck.forEach(saved => {
            const card = getCardById(saved.cardID);
            if (card) {
              restoredDeck.push({ card, count: saved.count });
            }
          });
          setDeck(restoredDeck);
        }

        // Restore filters
        if (state.typeFilter) setTypeFilter(state.typeFilter);
        if (state.unitFilter) setUnitFilter(state.unitFilter);
        if (state.searchQuery) setSearchQuery(state.searchQuery);
        if (state.sortBy) setSortBy(state.sortBy);
      }
    } catch (e) {
      console.error('Failed to load saved state:', e);
    }
    setIsLoaded(true);
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    if (!isLoaded) return;

    try {
      const state: SavedState = {
        unitConfigs,
        deck: deck.map(d => ({ cardID: d.card.cardID, count: d.count })),
        typeFilter,
        unitFilter,
        searchQuery,
        sortBy,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Failed to save state:', e);
    }
  }, [isLoaded, unitConfigs, deck, typeFilter, unitFilter, searchQuery, sortBy]);

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

  // Get available cards for each enabled unit with filters
  const filteredCards = useMemo(() => {
    let cards: CardData[] = [];
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
      cards = cards.filter(card => card.cardType === typeFilter);
    }

    // Apply unit filter
    if (unitFilter !== 'all') {
      cards = cards.filter(card => card.targetUnit === unitFilter);
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      cards = cards.filter(
        card =>
          card.displayName.toLowerCase().includes(query) ||
          card.displayDescription.toLowerCase().includes(query)
      );
    }

    // Apply availability filter
    if (showOnlyAvailable) {
      cards = cards.filter(card => checkCardConditions(card).available);
    }

    // Sort cards
    cards.sort((a, b) => {
      switch (sortBy) {
        case 'unit':
          return a.targetUnit.localeCompare(b.targetUnit) || a.cardRank - b.cardRank;
        case 'rank':
          return a.cardRank - b.cardRank || a.targetUnit.localeCompare(b.targetUnit);
        case 'type':
          const typeOrder = ['Common', 'Chain', 'Promotion', 'Combo'];
          return typeOrder.indexOf(a.cardType) - typeOrder.indexOf(b.cardType);
        case 'name':
          return a.displayName.localeCompare(b.displayName);
        default:
          return 0;
      }
    });

    return cards;
  }, [enabledUnits, typeFilter, unitFilter, searchQuery, sortBy, showOnlyAvailable, checkCardConditions]);

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

  // Enable all units
  const enableAllUnits = () => {
    setUnitConfigs(prev => prev.map(c => ({ ...c, enabled: true })));
  };

  // Disable all units
  const disableAllUnits = () => {
    setUnitConfigs(prev => prev.map(c => ({ ...c, enabled: false })));
  };

  // Set all ranks
  const setAllRanks = (rank: number) => {
    setUnitConfigs(prev => prev.map(c => ({ ...c, rank })));
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

  // Reset all settings
  const resetAll = () => {
    setUnitConfigs(getAllUnits().map(unit => ({ unit, rank: 1, enabled: false })));
    setDeck([]);
    setTypeFilter('all');
    setUnitFilter('all');
    setSearchQuery('');
    setSortBy('unit');
    setShowOnlyAvailable(false);
    localStorage.removeItem(STORAGE_KEY);
  };

  // Cloud save
  const handleCloudSave = async () => {
    if (!slotName || !password) {
      setCloudMessage({ type: 'error', text: '슬롯 이름과 비밀번호를 입력하세요.' });
      return;
    }

    setCloudLoading(true);
    setCloudMessage(null);

    try {
      const response = await fetch('/api/deck/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slotName,
          password,
          data: {
            unitConfigs,
            deck: deck.map(d => ({ cardID: d.card.cardID, count: d.count })),
          },
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setCloudMessage({ type: 'success', text: result.message });
        setTimeout(() => {
          setShowSaveModal(false);
          setCloudMessage(null);
        }, 1500);
      } else {
        setCloudMessage({ type: 'error', text: result.error });
      }
    } catch (error) {
      setCloudMessage({ type: 'error', text: '저장 중 오류가 발생했습니다.' });
    } finally {
      setCloudLoading(false);
    }
  };

  // Cloud load
  const handleCloudLoad = async () => {
    if (!slotName || !password) {
      setCloudMessage({ type: 'error', text: '슬롯 이름과 비밀번호를 입력하세요.' });
      return;
    }

    setCloudLoading(true);
    setCloudMessage(null);

    try {
      const response = await fetch('/api/deck/load', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slotName, password }),
      });

      const result = await response.json();

      if (response.ok) {
        // Restore unit configs
        if (result.data.unitConfigs) {
          setUnitConfigs(result.data.unitConfigs);
        }

        // Restore deck
        if (result.data.deck) {
          const restoredDeck: DeckCard[] = [];
          result.data.deck.forEach((saved: SavedDeckCard) => {
            const card = getCardById(saved.cardID);
            if (card) {
              restoredDeck.push({ card, count: saved.count });
            }
          });
          setDeck(restoredDeck);
        }

        setCloudMessage({ type: 'success', text: '덱을 불러왔습니다!' });
        setTimeout(() => {
          setShowLoadModal(false);
          setCloudMessage(null);
        }, 1500);
      } else {
        setCloudMessage({ type: 'error', text: result.error });
      }
    } catch (error) {
      setCloudMessage({ type: 'error', text: '불러오기 중 오류가 발생했습니다.' });
    } finally {
      setCloudLoading(false);
    }
  };

  const [mobileTab, setMobileTab] = useState<'config' | 'cards' | 'deck'>('cards');

  // Calculate total cards in deck
  const totalCards = deck.reduce((sum, d) => sum + d.count, 0);

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-400">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row h-full relative">
      {/* Mobile Navigation */}
      <div className="md:hidden shrink-0 flex items-stretch bg-gray-800 border-b border-gray-700 h-10">
        <button
          onClick={() => setMobileTab('config')}
          className={`flex-1 text-xs font-medium border-b-2 transition-colors ${
            mobileTab === 'config'
              ? 'border-blue-500 text-white bg-gray-700/50'
              : 'border-transparent text-gray-400 hover:text-gray-300'
          }`}
        >
          유닛 설정
        </button>
        <button
          onClick={() => setMobileTab('cards')}
          className={`flex-1 text-xs font-medium border-b-2 transition-colors ${
            mobileTab === 'cards'
              ? 'border-blue-500 text-white bg-gray-700/50'
              : 'border-transparent text-gray-400 hover:text-gray-300'
          }`}
        >
          카드 목록
        </button>
        <button
          onClick={() => setMobileTab('deck')}
          className={`flex-1 text-xs font-medium border-b-2 transition-colors ${
            mobileTab === 'deck'
              ? 'border-blue-500 text-white bg-gray-700/50'
              : 'border-transparent text-gray-400 hover:text-gray-300'
          }`}
        >
          내 덱 <span className="text-blue-400">({totalCards})</span>
        </button>
      </div>

      {/* Save Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-sm border border-gray-700 shadow-xl">
            <h3 className="text-lg font-bold text-white mb-4">클라우드에 저장</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-gray-400 mb-1">슬롯 이름</label>
                <input
                  type="text"
                  value={slotName}
                  onChange={e => setSlotName(e.target.value)}
                  placeholder="예: 내덱1"
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                  maxLength={20}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">비밀번호</label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="4자 이상"
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                />
              </div>
              {cloudMessage && (
                <p className={`text-sm ${cloudMessage.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                  {cloudMessage.text}
                </p>
              )}
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => { setShowSaveModal(false); setCloudMessage(null); }}
                  className="flex-1 px-3 py-2 bg-gray-700 text-gray-300 rounded hover:bg-gray-600"
                  disabled={cloudLoading}
                >
                  취소
                </button>
                <button
                  onClick={handleCloudSave}
                  className="flex-1 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                  disabled={cloudLoading}
                >
                  {cloudLoading ? '저장 중...' : '저장'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Load Modal */}
      {showLoadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-sm border border-gray-700 shadow-xl">
            <h3 className="text-lg font-bold text-white mb-4">클라우드에서 불러오기</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-gray-400 mb-1">슬롯 이름</label>
                <input
                  type="text"
                  value={slotName}
                  onChange={e => setSlotName(e.target.value)}
                  placeholder="예: 내덱1"
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                  maxLength={20}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">비밀번호</label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="저장 시 설정한 비밀번호"
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                />
              </div>
              {cloudMessage && (
                <p className={`text-sm ${cloudMessage.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                  {cloudMessage.text}
                </p>
              )}
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => { setShowLoadModal(false); setCloudMessage(null); }}
                  className="flex-1 px-3 py-2 bg-gray-700 text-gray-300 rounded hover:bg-gray-600"
                  disabled={cloudLoading}
                >
                  취소
                </button>
                <button
                  onClick={handleCloudLoad}
                  className="flex-1 px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                  disabled={cloudLoading}
                >
                  {cloudLoading ? '불러오는 중...' : '불러오기'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Left Panel - Unit Configuration */}
      <div className={`${mobileTab === 'config' ? 'flex' : 'hidden'} md:flex flex-col w-full md:w-64 bg-gray-800 border-r border-gray-700 overflow-y-auto shrink-0 h-full`}>
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-bold text-white">유닛 설정</h2>
            <button
              onClick={resetAll}
              className="text-xs text-gray-400 hover:text-red-400"
              title="모든 설정 초기화"
            >
              초기화
            </button>
          </div>
          <p className="text-xs text-gray-400 mb-3">
            설정은 자동 저장됩니다
          </p>

          {/* Cloud save/load buttons */}
          <div className="flex gap-2 mb-3">
            <button
              onClick={() => { setShowSaveModal(true); setCloudMessage(null); }}
              className="flex-1 px-2 py-1.5 text-xs bg-blue-900/50 text-blue-300 rounded hover:bg-blue-900/70 flex items-center justify-center gap-1"
            >
              <span>☁️</span> 저장
            </button>
            <button
              onClick={() => { setShowLoadModal(true); setCloudMessage(null); }}
              className="flex-1 px-2 py-1.5 text-xs bg-green-900/50 text-green-300 rounded hover:bg-green-900/70 flex items-center justify-center gap-1"
            >
              <span>☁️</span> 불러오기
            </button>
          </div>

          {/* Quick actions */}
          <div className="flex gap-2 mb-3">
            <button
              onClick={enableAllUnits}
              className="flex-1 px-2 py-1 text-xs bg-gray-700 text-gray-300 rounded hover:bg-gray-600"
            >
              전체 선택
            </button>
            <button
              onClick={disableAllUnits}
              className="flex-1 px-2 py-1 text-xs bg-gray-700 text-gray-300 rounded hover:bg-gray-600"
            >
              전체 해제
            </button>
          </div>

          {/* Set all ranks */}
          <div className="flex items-center gap-2 mb-4 p-2 bg-gray-700/30 rounded">
            <span className="text-xs text-gray-400">전체 랭크:</span>
            <div className="flex gap-1">
              {[1, 2, 3].map(rank => (
                <button
                  key={rank}
                  onClick={() => setAllRanks(rank)}
                  className="w-6 h-6 text-xs bg-gray-600 text-gray-300 rounded hover:bg-blue-600 hover:text-white"
                >
                  {rank}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            {unitConfigs.map(config => (
              <div
                key={config.unit}
                className={`p-2 rounded-lg border transition-all ${
                  config.enabled
                    ? 'border-gray-600 bg-gray-700/50'
                    : 'border-gray-700 bg-gray-800/50 opacity-60'
                }`}
              >
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={config.enabled}
                    onChange={() => toggleUnit(config.unit)}
                    className="w-4 h-4 rounded"
                  />
                  <span
                    className="font-medium text-sm flex-1"
                    style={{ color: UNIT_COLORS[config.unit] }}
                  >
                    {UNIT_KOREAN_NAMES[config.unit]}
                  </span>
                  {config.enabled && (
                    <div className="flex gap-0.5">
                      {[1, 2, 3].map(rank => (
                        <button
                          key={rank}
                          onClick={() => setUnitRank(config.unit, rank)}
                          className={`w-5 h-5 text-[10px] rounded ${
                            config.rank >= rank
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-600 text-gray-400'
                          }`}
                        >
                          {rank}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Middle Panel - Card List */}
      <div className={`${mobileTab === 'cards' ? 'flex' : 'hidden'} md:flex flex-1 overflow-hidden flex-col bg-gray-900 h-full`}>
        {/* Filters */}
        <div className="p-4 border-b border-gray-700 space-y-3 shrink-0">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">
              카드 목록
              <span className="ml-2 text-sm font-normal text-gray-400">
                ({filteredCards.length}개)
              </span>
            </h2>
          </div>

          {/* Search */}
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="카드 이름 또는 설명 검색..."
            className="w-full px-3 py-2 text-sm bg-gray-800 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
          />

          {/* Filter row */}
          <div className="flex flex-wrap gap-2">
            <select
              value={unitFilter}
              onChange={e => setUnitFilter(e.target.value as EUnitType | 'all')}
              className="px-3 py-1.5 text-sm bg-gray-700 text-white rounded border border-gray-600"
            >
              <option value="all">전체 유닛</option>
              {enabledUnits.map(config => (
                <option key={config.unit} value={config.unit}>
                  {UNIT_KOREAN_NAMES[config.unit]}
                </option>
              ))}
            </select>

            <select
              value={typeFilter}
              onChange={e => setTypeFilter(e.target.value as ECardType | 'all')}
              className="px-3 py-1.5 text-sm bg-gray-700 text-white rounded border border-gray-600"
            >
              <option value="all">전체 타입</option>
              <option value="Common">일반</option>
              <option value="Chain">연계</option>
              <option value="Promotion">승급</option>
              <option value="Combo">조합</option>
            </select>

            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as 'unit' | 'rank' | 'type' | 'name')}
              className="px-3 py-1.5 text-sm bg-gray-700 text-white rounded border border-gray-600"
            >
              <option value="unit">유닛순</option>
              <option value="rank">랭크순</option>
              <option value="type">타입순</option>
              <option value="name">이름순</option>
            </select>

            <label className="flex items-center gap-2 px-3 py-1.5 text-sm bg-gray-700 text-white rounded border border-gray-600 cursor-pointer">
              <input
                type="checkbox"
                checked={showOnlyAvailable}
                onChange={e => setShowOnlyAvailable(e.target.checked)}
                className="w-3 h-3"
              />
              <span>선택 가능만</span>
            </label>
          </div>
        </div>

        {/* Card grid */}
        <div className="flex-1 overflow-y-auto p-4 min-h-0">
          {enabledUnits.length === 0 ? (
            <div className="text-center text-gray-500 py-12">
              왼쪽(설정)에서 유닛을 활성화해주세요
            </div>
          ) : filteredCards.length === 0 ? (
            <div className="text-center text-gray-500 py-12">
              조건에 맞는 카드가 없습니다
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {filteredCards.map(card => {
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
      <div className={`${mobileTab === 'deck' ? 'flex' : 'hidden'} md:flex flex-col w-full md:w-80 bg-gray-800 border-l border-gray-700 shrink-0 h-full`}>
        <div className="p-4 border-b border-gray-700 shrink-0">
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

        <div className="flex-1 overflow-y-auto p-4 min-h-0">
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
          <div className="p-4 border-t border-gray-700 bg-gray-800/50 shrink-0">
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
