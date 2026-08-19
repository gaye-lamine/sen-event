import { EventItem } from './event';

export interface CartItem {
  event: EventItem;
  quantity: number;
  tierName: string;
  price: number;
}

export interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onRemoveItem: (index: number) => void;
  onCheckout: () => void;
}
