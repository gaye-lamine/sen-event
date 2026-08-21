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
  title: string;
  location: string;
  date: string;
  image: string;
  quantity: number;
  tiers: string;
  status: 'upcoming' | 'past';
}

export interface FavoriteEvent {
  id: string;
  title: string;
  category: string;
  categoryIcon: LucideIcon;
  location: string;
  date: string;
  image: string;
  price: string;
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
