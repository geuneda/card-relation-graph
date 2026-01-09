'use client';

interface TabNavigationProps {
  activeTab: 'graph' | 'deckbuilder';
  onTabChange: (tab: 'graph' | 'deckbuilder') => void;
}

export default function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  return (
    <div className="flex border-b border-gray-700 bg-gray-800">
      <button
        onClick={() => onTabChange('graph')}
        className={`
          px-6 py-3 text-sm font-medium transition-colors relative
          ${activeTab === 'graph'
            ? 'text-white'
            : 'text-gray-400 hover:text-gray-200'
          }
        `}
      >
        📊 카드 관계도
        {activeTab === 'graph' && (
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />
        )}
      </button>
      <button
        onClick={() => onTabChange('deckbuilder')}
        className={`
          px-6 py-3 text-sm font-medium transition-colors relative
          ${activeTab === 'deckbuilder'
            ? 'text-white'
            : 'text-gray-400 hover:text-gray-200'
          }
        `}
      >
        🃏 덱 빌더
        {activeTab === 'deckbuilder' && (
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />
        )}
      </button>
    </div>
  );
}
