import { LucideIcon } from 'lucide-react';

export type DashboardTabType =
  | 'overview'
  | 'tickets'
  | 'favorites'
  | 'notifications'
  | 'payments'
  | 'profile'
  | 'security';

export type TicketFilterType = 'upcoming' | 'past';

export interface UserTicket {
  id: string;
  order_number?: string;
  event_id?: string | number;
  title: string;
  location: string;
  date: string;
  event_date?: string;
  image: string;
  quantity: number;
  tiers: string;
  status: 'upcoming' | 'past';
  holder_name?: string;
  customer_name?: string;
  qr_code_token?: string;
  pdf_download_url?: string;
  total_amount?: number;
  currency?: string;
}

export interface UserTicketsResponse {
  success: boolean;
  message?: string;
  data: {
    counts: {
      upcoming: number;
      past: number;
      total: number;
    };
    tickets: UserTicket[];
  };
}

export interface FavoriteEvent {
  id: string;
  event_id?: string | number;
  title: string;
  category: string;
  categoryIcon?: LucideIcon;
  location: string;
  date: string;
  image: string;
  price: string;
  min_price?: number;
  is_favorite?: boolean;
}

export interface UserFavoritesResponse {
  success: boolean;
  message?: string;
  data: {
    count: number;
    favorites: FavoriteEvent[];
  };
}

export interface ToggleFavoriteResponse {
  success: boolean;
  message?: string;
  data: {
    event_id: string | number;
    is_favorite: boolean;
    total_favorites?: number;
  };
}

export interface PaymentMethod {
  id: string;
  type: 'wave' | 'om' | 'card';
  title: string;
  detail: string;
  isDefault: boolean;
}

export interface UserProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  memberSince: string;
  avatarUrl: string;
}

export interface NotificationPreferences {
  reminder: boolean;
  newDates: boolean;
  promos: boolean;
  newsletter: boolean;
  email: boolean;
  sms: boolean;
}

export interface DashboardPageProps {
  onNavigateHome: () => void;
  onLogout: () => void;
  searchQuery?: string;
  onSearch?: (q: string) => void;
  cartCount?: number;
  onOpenCart?: () => void;
  onViewTicket?: (ticketId?: string) => void;
  onBookEvent?: (eventId: string) => void;
}
