'use client';

import { useCallback, useMemo, useState, useEffect } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  MarkerType,
  ConnectionLineType,
} from 'reactflow';
import 'reactflow/dist/style.css';
import CardNode from './CardNode';
import {
  CardData,
  EUnitType,
  ECardType,
  UNIT_COLORS,
  CARD_TYPE_COLORS,
  CARD_TYPE_KOREAN,
  parseCombineCondition,
  UNIT_KOREAN_NAMES,
} from '@/types/card';
import { getCardById, getCardsByUnit, cardData } from '@/data/cards';

const nodeTypes = {
  cardNode: CardNode,
};

const CARD_TYPES: ECardType[] = ['Spawn', 'Common', 'Chain', 'Promotion', 'Combo'];

type SortMode = 'default' | 'dependency';

const SORT_MODE_LABELS: Record<SortMode, string> = {
  default: '기본 정렬',
  dependency: '의존 유닛별',
};

interface CardGraphProps {
  selectedUnits: EUnitType[];
}

export default function CardGraph({ selectedUnits }: CardGraphProps) {
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const [highlightedCards, setHighlightedCards] = useState<Set<number>>(new Set());
  const [selectedCardTypes, setSelectedCardTypes] = useState<Set<ECardType>>(new Set(CARD_TYPES));
  const [sortMode, setSortMode] = useState<SortMode>('default');

  // Get cards for all selected units
  const cards = useMemo(() => {
    const allCards: CardData[] = [];
    selectedUnits.forEach(unit => {
      allCards.push(...getCardsByUnit(unit));
    });
    return allCards;
  }, [selectedUnits]);

  // Filter cards by selected card types
  const filteredCards = useMemo(() => {
    return cards.filter(card => selectedCardTypes.has(card.cardType));
  }, [cards, selectedCardTypes]);

  // Set of filtered card IDs for quick lookup
  const filteredCardIds = useMemo(() => {
    return new Set(filteredCards.map(c => c.cardID));
  }, [filteredCards]);

  // Build nodes and edges
  const { initialNodes, initialEdges } = useMemo(() => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];

    if (selectedUnits.length === 0) {
      return { initialNodes: nodes, initialEdges: edges };
    }

    // Group cards by unit and rank
    const cardsByUnitAndRank: Map<EUnitType, Map<number, CardData[]>> = new Map();

    selectedUnits.forEach(unit => {
      const unitCards = getCardsByUnit(unit).filter(card => selectedCardTypes.has(card.cardType));
      const rankMap = new Map<number, CardData[]>();

      unitCards.forEach(card => {
        const rank = card.cardRank;
        if (!rankMap.has(rank)) {
          rankMap.set(rank, []);
        }
        rankMap.get(rank)!.push(card);
      });

      // Sort cards within each rank
      const typeOrder = ['Spawn', 'Common', 'Chain', 'Promotion', 'Combo'];

      rankMap.forEach((rankCards) => {
        rankCards.sort((a, b) => {
          // 의존 유닛별 정렬 모드
          if (sortMode === 'dependency') {
            const aCondition = parseCombineCondition(a.combineCondition);
            const bCondition = parseCombineCondition(b.combineCondition);

            // 둘 다 의존 조건이 있는 경우
            if (aCondition && bCondition) {
              // 1차: 의존 유닛 이름순
              const unitCompare = aCondition.unit.localeCompare(bCondition.unit);
              if (unitCompare !== 0) return unitCompare;

              // 2차: 필요 랭크순
              if (aCondition.rank !== bCondition.rank) {
                return aCondition.rank - bCondition.rank;
              }
            }
            // 의존 조건이 있는 카드를 뒤로
            if (aCondition && !bCondition) return 1;
            if (!aCondition && bCondition) return -1;
          }

          // 기본 정렬: 타입순 → ID순
          const aOrder = typeOrder.indexOf(a.cardType);
          const bOrder = typeOrder.indexOf(b.cardType);
          if (aOrder !== bOrder) return aOrder - bOrder;
          return a.cardID - b.cardID;
        });
      });

      cardsByUnitAndRank.set(unit, rankMap);
    });

    // Position nodes - arrange units horizontally, ranks vertically
    const ySpacing = 200;
    const xSpacing = 180;
    const unitSpacing = 400; // Space between unit groups

    let unitIndex = 0;
    const unitStartX: Map<EUnitType, number> = new Map();

    selectedUnits.forEach(unit => {
      const rankMap = cardsByUnitAndRank.get(unit);
      if (!rankMap) return;

      // Calculate max cards in any rank for this unit
      let maxCardsInRank = 0;
      rankMap.forEach(rankCards => {
        maxCardsInRank = Math.max(maxCardsInRank, rankCards.length);
      });

      const unitWidth = maxCardsInRank * xSpacing;
      const startX = unitIndex * unitSpacing;
      unitStartX.set(unit, startX);

      // Add unit label node
      nodes.push({
        id: `unit-label-${unit}`,
        type: 'default',
        position: { x: startX + unitWidth / 2 - 60, y: -80 },
        data: { label: UNIT_KOREAN_NAMES[unit] },
        style: {
          backgroundColor: UNIT_COLORS[unit],
          color: unit === 'Thor' ? '#000' : '#fff',
          fontWeight: 'bold',
          fontSize: '14px',
          padding: '8px 16px',
          borderRadius: '8px',
          border: 'none',
        },
        selectable: false,
        draggable: false,
      });

      rankMap.forEach((rankCards, rank) => {
        const totalWidth = (rankCards.length - 1) * xSpacing;
        const rankStartX = startX + (unitWidth - totalWidth) / 2;

        rankCards.forEach((card, index) => {
          nodes.push({
            id: card.cardID.toString(),
            type: 'cardNode',
            position: {
              x: rankStartX + index * xSpacing,
              y: rank * ySpacing,
            },
            data: {
              card,
              isSelected: false,
              isHighlighted: true,
            },
          });
        });
      });

      unitIndex++;
    });

    // Create edges for chain relationships (parentCardIDs)
    filteredCards.forEach(card => {
      card.parentCardIDs.forEach(parentId => {
        const parentCard = getCardById(parentId);
        // Only create edge if both cards are in the filtered set
        if (parentCard && selectedUnits.includes(parentCard.targetUnit) && filteredCardIds.has(parentId)) {
          edges.push({
            id: `chain-${parentId}-${card.cardID}`,
            source: parentId.toString(),
            target: card.cardID.toString(),
            type: 'smoothstep',
            animated: true,
            style: {
              stroke: CARD_TYPE_COLORS.Chain,
              strokeWidth: 2,
            },
            markerEnd: {
              type: MarkerType.ArrowClosed,
              color: CARD_TYPE_COLORS.Chain,
            },
          });
        }
      });

      // Create edges for combo relationships
      const combineCondition = parseCombineCondition(card.combineCondition);
      if (combineCondition && selectedUnits.includes(combineCondition.unit)) {
        // Find spawn card of required unit
        const spawnCard = cardData.find(
          c => c.targetUnit === combineCondition.unit && c.cardType === 'Spawn'
        );
        // Only create edge if spawn card is in the filtered set
        if (spawnCard && filteredCardIds.has(spawnCard.cardID)) {
          edges.push({
            id: `combo-${spawnCard.cardID}-${card.cardID}`,
            source: spawnCard.cardID.toString(),
            target: card.cardID.toString(),
            type: 'smoothstep',
            animated: false,
            style: {
              stroke: CARD_TYPE_COLORS.Combo,
              strokeWidth: 3,
              strokeDasharray: '8,4',
            },
            markerEnd: {
              type: MarkerType.ArrowClosed,
              color: CARD_TYPE_COLORS.Combo,
            },
            label: `${UNIT_KOREAN_NAMES[combineCondition.unit]} ${combineCondition.rank}랭`,
            labelStyle: {
              fill: CARD_TYPE_COLORS.Combo,
              fontSize: 10,
              fontWeight: 'bold',
            },
            labelBgStyle: {
              fill: '#1f2937',
              fillOpacity: 0.9,
            },
            labelBgPadding: [4, 4] as [number, number],
            labelBgBorderRadius: 4,
          });
        }
      }
    });

    return { initialNodes: nodes, initialEdges: edges };
  }, [filteredCards, filteredCardIds, selectedUnits, selectedCardTypes, sortMode]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Reset when units or card type filter changes
  useEffect(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
    setSelectedCard(null);
    setHighlightedCards(new Set());
  }, [selectedUnits, initialNodes, initialEdges, setNodes, setEdges]);

  // Update nodes when selection/highlight changes
  useEffect(() => {
    setNodes(nds =>
      nds.map(node => {
        if (node.id.startsWith('unit-label-')) return node;
        return {
          ...node,
          data: {
            ...node.data,
            isSelected: node.id === selectedCard?.toString(),
            isHighlighted:
              highlightedCards.size === 0 || highlightedCards.has(parseInt(node.id)),
          },
        };
      })
    );
  }, [selectedCard, highlightedCards, setNodes]);

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      if (node.id.startsWith('unit-label-')) return;

      const cardId = parseInt(node.id);
      if (selectedCard === cardId) {
        setSelectedCard(null);
        setHighlightedCards(new Set());
        return;
      }

      setSelectedCard(cardId);

      // Find all related cards (parent chain, children chain, combo relations)
      const related = new Set<number>([cardId]);
      const card = getCardById(cardId);

      // Find chain parents
      const findParents = (id: number) => {
        const c = getCardById(id);
        if (c) {
          c.parentCardIDs.forEach(parentId => {
            const parent = getCardById(parentId);
            if (parent && selectedUnits.includes(parent.targetUnit) && !related.has(parentId)) {
              related.add(parentId);
              findParents(parentId);
            }
          });
        }
      };

      // Find chain children
      const findChildren = (id: number) => {
        cards.forEach(c => {
          if (c.parentCardIDs.includes(id) && !related.has(c.cardID)) {
            related.add(c.cardID);
            findChildren(c.cardID);
          }
        });
      };

      // Find combo relations
      if (card) {
        const combineCondition = parseCombineCondition(card.combineCondition);
        if (combineCondition && selectedUnits.includes(combineCondition.unit)) {
          const spawnCard = cardData.find(
            c => c.targetUnit === combineCondition.unit && c.cardType === 'Spawn'
          );
          if (spawnCard) {
            related.add(spawnCard.cardID);
          }
        }

        // If this is a spawn card, find combo cards that depend on this unit
        if (card.cardType === 'Spawn') {
          cards.forEach(c => {
            const cond = parseCombineCondition(c.combineCondition);
            if (cond && cond.unit === card.targetUnit) {
              related.add(c.cardID);
            }
          });
        }
      }

      findParents(cardId);
      findChildren(cardId);
      setHighlightedCards(related);
    },
    [selectedCard, cards, selectedUnits]
  );

  const onPaneClick = useCallback(() => {
    setSelectedCard(null);
    setHighlightedCards(new Set());
  }, []);

  const toggleCardType = useCallback((cardType: ECardType) => {
    setSelectedCardTypes(prev => {
      const next = new Set(prev);
      if (next.has(cardType)) {
        // Don't allow deselecting if it's the last one
        if (next.size > 1) {
          next.delete(cardType);
        }
      } else {
        next.add(cardType);
      }
      return next;
    });
    // Reset selection when filter changes
    setSelectedCard(null);
    setHighlightedCards(new Set());
  }, []);

  const selectAllCardTypes = useCallback(() => {
    setSelectedCardTypes(new Set(CARD_TYPES));
    setSelectedCard(null);
    setHighlightedCards(new Set());
  }, []);

  if (selectedUnits.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-gray-500 text-lg">유닛을 선택해주세요</div>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        connectionLineType={ConnectionLineType.SmoothStep}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.1}
        maxZoom={2}
        defaultEdgeOptions={{
          type: 'smoothstep',
        }}
      >
        <Background color="#374151" gap={20} />
        <Controls className="!bg-gray-800 !border-gray-700" />
        <MiniMap
          nodeColor={node => {
            if (node.id.startsWith('unit-label-')) {
              const unit = node.id.replace('unit-label-', '') as EUnitType;
              return UNIT_COLORS[unit];
            }
            const card = node.data?.card as CardData;
            return card ? UNIT_COLORS[card.targetUnit] : '#6b7280';
          }}
          className="!bg-gray-800 !border-gray-700"
        />
      </ReactFlow>

      {/* Card Type Filter & Sort Options */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
        {/* Card Type Filter */}
        <div className="bg-gray-800/90 rounded-lg overflow-hidden border border-gray-700">
          <div className="p-2 md:p-3">
            <div className="flex items-center gap-2 mb-2">
              <h4 className="font-bold text-white text-xs">카드 타입 필터</h4>
              <button
                onClick={selectAllCardTypes}
                className="text-[10px] text-gray-400 hover:text-white transition-colors"
              >
                전체 선택
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {CARD_TYPES.map(cardType => (
                <button
                  key={cardType}
                  onClick={() => toggleCardType(cardType)}
                  className={`px-2 py-1 text-[10px] md:text-xs rounded transition-all ${
                    selectedCardTypes.has(cardType)
                      ? 'text-white font-medium'
                      : 'bg-gray-700/50 text-gray-500'
                  }`}
                  style={{
                    backgroundColor: selectedCardTypes.has(cardType)
                      ? CARD_TYPE_COLORS[cardType]
                      : undefined,
                  }}
                >
                  {CARD_TYPE_KOREAN[cardType]}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Sort Options */}
        <div className="bg-gray-800/90 rounded-lg overflow-hidden border border-gray-700">
          <div className="p-2 md:p-3">
            <h4 className="font-bold text-white text-xs mb-2">정렬</h4>
            <div className="flex flex-wrap gap-1.5">
              {(Object.keys(SORT_MODE_LABELS) as SortMode[]).map(mode => (
                <button
                  key={mode}
                  onClick={() => setSortMode(mode)}
                  className={`px-2 py-1 text-[10px] md:text-xs rounded transition-all ${
                    sortMode === mode
                      ? 'bg-blue-600 text-white font-medium'
                      : 'bg-gray-700/50 text-gray-400 hover:text-white'
                  }`}
                >
                  {SORT_MODE_LABELS[mode]}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 max-w-[200px] z-10">
        <div className="bg-gray-800/90 rounded-lg overflow-hidden border border-gray-700">
          <div className="p-2 md:p-3 text-xs">
            <h4 className="font-bold text-white mb-2 flex items-center justify-between pointer-events-none md:pointer-events-auto">
              <span>범례</span>
            </h4>
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2">
                <div className="w-6 md:w-8 h-0.5" style={{ backgroundColor: CARD_TYPE_COLORS.Chain }}></div>
                <span className="text-gray-300 text-[10px] md:text-xs">연계 (획득 순서)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 md:w-8 h-0.5 border-t-2 border-dashed" style={{ borderColor: CARD_TYPE_COLORS.Combo }}></div>
                <span className="text-gray-300 text-[10px] md:text-xs">조합 (랭크 조건)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
