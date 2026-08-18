import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { EventItem } from '../../types/event';

interface EventBreadcrumbProps {
  event: EventItem;
  onNavigateHome: () => void;
  onNavigateCategory?: (category: string) => void;
}

export const EventBreadcrumb: React.FC<EventBreadcrumbProps> = ({
  event,
  onNavigateHome,
  onNavigateCategory,
}) => {
  return (
    <nav aria-label="Breadcrumb" className="py-4">
      <ol className="flex items-center space-x-2 text-xs sm:text-sm text-gray-500">
        <li>
          <button
            onClick={onNavigateHome}
            type="button"
            className="hover:text-gray-900 transition-colors cursor-pointer"
          >
            Accueil
          </button>
        </li>
        <li className="flex items-center">
          <ChevronRight className="w-3.5 h-3.5 text-gray-400 mx-1" />
          <button
            onClick={() => onNavigateCategory?.(event.category)}
            type="button"
            className="hover:text-gray-900 transition-colors cursor-pointer capitalize"
          >
            {event.categoryLabel}s
          </button>
        </li>
        <li className="flex items-center text-gray-900 font-medium truncate">
          <ChevronRight className="w-3.5 h-3.5 text-gray-400 mx-1 flex-shrink-0" />
          <span className="truncate">{event.title}</span>
        </li>
      </ol>
    </nav>
  );
};
