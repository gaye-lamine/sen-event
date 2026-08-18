export type EventCategory =
  | 'all'
  | 'concert'
  | 'sport'
  | 'festival'
  | 'theatre'
  | 'formation'
  | 'conference'
  | 'soiree'
  | 'humour';

export type DateFilterType = 'today' | 'this_week' | 'this_weekend' | 'this_month';

export interface TicketTier {
  id: string;
  name: string;
  price: number;
  description?: string;
  available: boolean;
}

export interface EventItem {
  id: string;
  title: string;
  subtitle?: string;
  category: EventCategory;
  categoryLabel: string;
  categoryIcon?: string;
  image: string;
  location: string;
  venue: string;
  city: string;
  date: string;
  time: string;
  rawDate: string; // ISO date format for backend sorting/filtering
  startingPrice: number;
  currency: string;
  isFeatured?: boolean;
  dateCategory?: DateFilterType[];
  organizer?: {
    name: string;
    verified: boolean;
    phone?: string;
  };
  ticketTiers?: TicketTier[];
  description?: string;
}

export interface CategoryItem {
  id: EventCategory;
  label: string;
  iconName: string;
}

export interface FilterParams {
  category?: EventCategory;
  dateFilter?: DateFilterType;
  query?: string;
  city?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface BookingRequest {
  eventId: string;
  tierId: string;
  quantity: number;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  paymentMethod: 'wave' | 'orange_money' | 'free_money' | 'card';
}

export interface BookingConfirmation {
  bookingId: string;
  qrCodeUrl: string;
  totalAmount: number;
  status: 'confirmed' | 'pending';
  event: EventItem;
  tierName: string;
  quantity: number;
}
