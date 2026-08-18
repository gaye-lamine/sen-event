import React from 'react';

export type EventTabType = 'overview' | 'location' | 'faq';

interface EventTabsProps {
  activeTab: EventTabType;
  onTabChange: (tab: EventTabType) => void;
}

export const EventTabs: React.FC<EventTabsProps> = ({
  activeTab,
  onTabChange,
}) => {
  const tabs: { id: EventTabType; label: string }[] = [
    { id: 'overview', label: 'Aperçu' },
    { id: 'location', label: 'Lieu & accès' },
    { id: 'faq', label: 'FAQ' },
  ];

  return (
    <div className="w-full border-b border-gray-100 mt-2 mb-8">
      <div className="flex items-center justify-center gap-8 sm:gap-12">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              type="button"
              className={`
                relative py-3.5 text-xs sm:text-sm font-semibold transition-colors cursor-pointer
                ${isActive ? 'text-gray-900 font-bold' : 'text-gray-500 hover:text-gray-800'}
              `}
            >
              <span>{tab.label}</span>
              {isActive && (
                <span
                  className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#FFC23C] rounded-full"
                  aria-hidden="true"
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
