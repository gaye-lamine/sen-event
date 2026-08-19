import { EventItem } from './event';

export interface CartItem {
  event: EventItem;
  quantity: number;
  tierName: string;
  price: number;
}
