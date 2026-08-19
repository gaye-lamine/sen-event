import { EventItem, TicketTier, FaqItem } from './event';
import { SelectedTierItem } from './checkout';

export type EventTabType = 'overview' | 'location' | 'faq';

export interface EventBreadcrumbProps {
  event: EventItem;
  onNavigateHome: () => void;
  onNavigateCategory?: (category: string) => void;
}

export interface EventHeroBannerProps {
  event: EventItem;
  onScrollToTickets?: () => void;
}

export interface EventTabsProps {
  activeTab: EventTabType;
  onTabChange: (tab: EventTabType) => void;
}

export interface EventAboutSectionProps {
  event: EventItem;
}

export interface EventLocationMapProps {
  event: EventItem;
}

export interface SimilarEventsSectionProps {
  events: EventItem[];
  onSelectEvent: (event: EventItem) => void;
}

export interface TicketSelectionCardProps {
  event: EventItem;
  onProceedToCheckout?: (selectedTiers: SelectedTierItem[]) => void;
}

export interface EventFaqSectionProps {
  faq?: FaqItem[];
}

export interface EventDetailPageProps {
  event: EventItem;
  similarEvents: EventItem[];
  onNavigateHome: () => void;
  onSelectEvent: (event: EventItem) => void;
  onProceedToCheckout?: (selectedTiers: SelectedTierItem[]) => void;
}
