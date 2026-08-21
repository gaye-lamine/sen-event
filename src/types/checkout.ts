import { EventItem, TicketTier } from './event';

export type CheckoutStep = 1 | 2 | 3;

export type PaymentMethodType = 'wave' | 'orange_money' | 'card' | 'free_money';

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

export interface CheckoutStepperProps {
  currentStep: CheckoutStep;
  onStepClick?: (step: CheckoutStep) => void;
}

export interface TicketSelectionStepProps {
  event: EventItem;
  tiers: TicketTier[];
  quantities: Record<string, number>;
  onUpdateQuantity: (tierId: string, delta: number) => void;
  onContinue: () => void;
}

export interface CustomerInfoStepProps {
  tiers: TicketTier[];
  quantities: Record<string, number>;
  customerFirstName: string;
  customerLastName: string;
  customerPhone: string;
  customerEmail: string;
  holders: TicketHolder[];
  onHoldersChange: (holders: TicketHolder[]) => void;
  onChangeFirstName: (value: string) => void;
  onChangeLastName: (value: string) => void;
  onChangePhone: (value: string) => void;
  onChangeEmail: (value: string) => void;
  onBack: () => void;
  onContinue: () => void;
}

export interface PaymentStepProps {
  event: EventItem;
  tiers: TicketTier[];
  quantities: Record<string, number>;
  holders: TicketHolder[];
  totalAmount: number;
  customerFirstName: string;
  customerLastName: string;
  customerPhone: string;
  customerEmail: string;
  onBack: () => void;
  onPaymentComplete?: (orderNumber: string) => void;
}

export interface OrderSummaryCardProps {
  event: EventItem;
  tiers: TicketTier[];
  quantities: Record<string, number>;
  onModifyTickets?: () => void;
}

export interface OrderConfirmationViewProps {
  orderNumber?: string;
  customerEmail?: string;
  onNavigateHome: () => void;
}

export interface CheckoutPageProps {
  event: EventItem;
  initialTiers?: SelectedTierItem[];
  onNavigateHome: () => void;
}
