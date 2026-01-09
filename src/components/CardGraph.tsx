'use client';

import { useCallback, useMemo, useState } from 'react';
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
  UNIT_COLORS,
  CARD_TYPE_COLORS,
  parseCombineCondition,
  UNIT_KOREAN_NAMES,
} from '@/types/card';
import { getCardById, getCardsByUnit } from '@/data/cards';

const nodeTypes = {
  cardNode: CardNode,
};

interface CardGraphProps {
  selectedUnit: EUnitType;
}

export default function CardGraph({ selectedUnit }: CardGraphProps) {
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const [highlightedCards, setHighlightedCards] = useState<Set<number>>(new Set());

  const cards = useMemo(() => getCardsByUnit(selectedUnit), [selectedUnit]);

  // Build nodes and edges
  const { initialNodes, initialEdges } = useMemo(() => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];

    // Group cards by rank and type for positioning
    const cardsByRank: Map<number, CardData[]> = new Map();
    cards.forEach(card => {
      const rank = card.cardRank;
      if (!cardsByRank.has(rank)) {
        cardsByRank.set(rank, []);
      }
      cardsByRank.get(rank)!.push(card);
    });

    // Sort cards within each rank by type order
    const typeOrder = ['Spawn', 'Common', 'Chain', 'Promotion', 'Combo'];
    cardsByRank.forEach((rankCards, rank) => {
      rankCards.sort((a, b) => {
        const aOrder = typeOrder.indexOf(a.cardType);
        const bOrder = typeOrder.indexOf(b.cardType);
        if (aOrder !== bOrder) return aOrder - bOrder;
        return a.cardID - b.cardID;
      });
    });

    // Position nodes
    const ySpacing = 180;
    const xSpacing = 200;

    cardsByRank.forEach((rankCards, rank) => {
      const totalWidth = (rankCards.length - 1) * xSpacing;
      const startX = -totalWidth / 2;

      rankCards.forEach((card, index) => {
        nodes.push({
          id: card.cardID.toString(),
          type: 'cardNode',
          position: {
            x: startX + index * xSpacing,
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

    // Create edges for chain relationships (parentCardIDs)
    cards.forEach(card => {
      card.parentCardIDs.forEach(parentId => {
        const parentCard = getCardById(parentId);
        if (parentCard && parentCard.targetUnit === selectedUnit) {
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
            label: '연계',
            labelStyle: { fill: CARD_TYPE_COLORS.Chain, fontSize: 10 },
            labelBgStyle: { fill: '#1f2937', fillOpacity: 0.8 },
          });
        }
      });

      // Create edges for combo relationships
      const combineCondition = parseCombineCondition(card.combineCondition);
      if (combineCondition) {
        // Find spawn card of required unit
        const spawnCard = cards.find(
          c => c.targetUnit === combineCondition.unit && c.cardType === 'Spawn'
        );
        if (spawnCard) {
          // This is a cross-unit dependency, we'll show it with a different style
          edges.push({
            id: `combo-${combineCondition.unit}-${card.cardID}`,
            source: 'combo-condition',
            target: card.cardID.toString(),
            type: 'smoothstep',
            style: {
              stroke: CARD_TYPE_COLORS.Combo,
              strokeWidth: 2,
              strokeDasharray: '5,5',
            },
            markerEnd: {
              type: MarkerType.ArrowClosed,
              color: CARD_TYPE_COLORS.Combo,
            },
          });
        }
      }
    });

    return { initialNodes: nodes, initialEdges: edges };
  }, [cards, selectedUnit]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Update nodes when selection/highlight changes
  useMemo(() => {
    setNodes(nds =>
      nds.map(node => ({
        ...node,
        data: {
          ...node.data,
          isSelected: node.id === selectedCard?.toString(),
          isHighlighted:
            highlightedCards.size === 0 || highlightedCards.has(parseInt(node.id)),
        },
      }))
    );
  }, [selectedCard, highlightedCards, setNodes]);

  // Reset when unit changes
  useMemo(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
    setSelectedCard(null);
    setHighlightedCards(new Set());
  }, [selectedUnit, initialNodes, initialEdges, setNodes, setEdges]);

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      const cardId = parseInt(node.id);
      if (selectedCard === cardId) {
        setSelectedCard(null);
        setHighlightedCards(new Set());
        return;
      }

      setSelectedCard(cardId);

      // Find all related cards (parent chain, children chain)
      const related = new Set<number>([cardId]);

      const findParents = (id: number) => {
        const card = getCardById(id);
        if (card) {
          card.parentCardIDs.forEach(parentId => {
            if (!related.has(parentId)) {
              related.add(parentId);
              findParents(parentId);
            }
          });
        }
      };

      const findChildren = (id: number) => {
        cards.forEach(card => {
          if (card.parentCardIDs.includes(id) && !related.has(card.cardID)) {
            related.add(card.cardID);
            findChildren(card.cardID);
          }
        });
      };

      findParents(cardId);
      findChildren(cardId);
      setHighlightedCards(related);
    },
    [selectedCard, cards]
  );

  const onPaneClick = useCallback(() => {
    setSelectedCard(null);
    setHighlightedCards(new Set());
  }, []);

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
            const card = node.data?.card as CardData;
            return card ? UNIT_COLORS[card.targetUnit] : '#6b7280';
          }}
          className="!bg-gray-800 !border-gray-700"
        />
      </ReactFlow>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 p-3 bg-gray-800/90 rounded-lg text-xs">
        <h4 className="font-bold text-white mb-2">범례</h4>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: CARD_TYPE_COLORS.Chain }}></div>
            <span className="text-gray-300">→ 연계 (A가 있어야 B 획득 가능)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: CARD_TYPE_COLORS.Combo }}></div>
            <span className="text-gray-300">조합 (다른 유닛 랭크 필요)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
