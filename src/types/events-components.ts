import { EventItem, DateFilterType, BookingConfirmation } from './event';

export type EventCardVariant = 'featured' | 'grid' | 'carousel' | 'date-section';

export interface EventCardProps {
  event: EventItem;
  variant?: EventCardVariant;
  onBook?: (event: EventItem) => void;
  onToggleFavorite?: (event: EventItem) => void;
}

export interface FeaturedEventsSectionProps {
  events: EventItem[];
  onBook: (event: EventItem) => void;
}

export interface DateFilterSectionProps {
  activeFilter: DateFilterType;
  onFilterChange: (filter: DateFilterType) => void;
  events: EventItem[];
  onBook: (event: EventItem) => void;
}

export interface AllEventsSectionProps {
  events: EventItem[];
  hasMore: boolean;
  onLoadMore: () => void;
  isLoadingMore?: boolean;
  onBook: (event: EventItem) => void;
  searchQuery?: string;
  onClearSearch?: () => void;
}

export interface BookingModalProps {
  event: EventItem | null;
  isOpen: boolean;
  onClose: () => void;
  onBookingSuccess?: (confirmation: BookingConfirmation) => void;
}
