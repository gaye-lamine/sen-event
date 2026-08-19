import { EventItem, TicketTier } from './event';

export type CheckoutStep = 1 | 2 | 3;

export type PaymentMethodType = 'wave' | 'orange_money' | 'card';

export interface TicketHolder {
  id: string;
  tierName: string;
  ticketIndex: number;
  fullName: string;
}

export interface SelectedTierItem {
  tier: TicketTier;
  quantity: number;
}

export interface CustomerFormData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  newsletterOptIn?: boolean;
}

export interface OrderConfirmationData {
  orderNumber: string;
  customerEmail: string;
  event: EventItem;
  totalAmount: number;
}
