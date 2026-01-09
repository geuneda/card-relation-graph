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
          flex-1 md:flex-none px-3 md:px-6 py-3 text-sm font-medium transition-colors relative text-center
          ${activeTab === 'graph'
            ? 'text-white'
            : 'text-gray-400 hover:text-gray-200'
          }
        `}
      >
        <span className="md:hidden">관계도</span>
        <span className="hidden md:inline">📊 카드 관계도</span>
        {activeTab === 'graph' && (
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />
        )}
      </button>
      <button
        onClick={() => onTabChange('deckbuilder')}
        className={`
          flex-1 md:flex-none px-3 md:px-6 py-3 text-sm font-medium transition-colors relative text-center
          ${activeTab === 'deckbuilder'
            ? 'text-white'
            : 'text-gray-400 hover:text-gray-200'
          }
        `}
      >
        <span className="md:hidden">덱 빌더</span>
        <span className="hidden md:inline">🃏 덱 빌더</span>
        {activeTab === 'deckbuilder' && (
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />
        )}
      </button>
    </div>
  );
}
