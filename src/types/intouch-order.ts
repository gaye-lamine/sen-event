/**
 * @file intouch-order.ts
 * @description Types TypeScript correspondant exactement aux spécifications de l'API Laravel / InTouch.
 */

export interface HolderItem {
  firstName: string;
  lastName: string;
}

export interface OrderItemRequest {
  ticketTypeId: number | string;
  quantity: number;
  holders: HolderItem[];
}

export interface CustomerOrderData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface CreateOrderRequest {
  event_id: number | string;
  customer: CustomerOrderData;
  items: OrderItemRequest[];
}

export interface OrderItemResponse {
  id: number;
  ticketTypeId: number;
  ticketTypeName: string;
  ticketCategory: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface TicketResponseItem {
  id: number;
  ticketCode: string;
  qrCodeToken: string;
  holderFirstName: string;
  holderLastName: string;
  status: 'pending' | 'valid' | 'used' | 'cancelled';
  ticketType?: {
    name: string;
    category: string;
    price: number;
  };
}

export interface CreateOrderResponseData {
  orderNumber: string;
  eventId: number | string;
  customer: CustomerOrderData;
  amount: number;
  currency: string;
  status: string;
  items: OrderItemResponse[];
  tickets: TicketResponseItem[];
  createdAt: string;
}

export interface CreateOrderResponse {
  success: boolean;
  message: string;
  data: CreateOrderResponseData;
}

export type InTouchPaymentMethod = 'wave' | 'orange_money' | 'free_money' | 'card';

export interface InitiatePaymentRequest {
  order_number: string;
  recipientPhone: string;
  paymentMethod: InTouchPaymentMethod;
  recipientEmail: string;
  recipientFirstName: string;
  recipientLastName: string;
}

export interface InitiatePaymentResponseData {
  idFromClient: string;
  idFromGu?: string;
  serviceCode?: string;
  status: string;
  numTransaction?: string;
  qrCode?: string;
  deepLink?: string;
  MAXIT?: string;
  OM?: string;
  order?: {
    orderNumber: string;
    amount?: number;
    currency?: string;
    status: string;
  };
  createdAt?: string;
}

export interface InitiatePaymentResponse {
  success: boolean;
  data: InitiatePaymentResponseData;
}

export interface PaymentStatusResponseData {
  idFromClient: string;
  status: 'initiated' | 'success' | 'failed' | 'pending';
  order?: {
    orderNumber: string;
    amount?: number;
    currency?: string;
    status: string;
  };
}

export interface PaymentStatusResponse {
  success: boolean;
  data: PaymentStatusResponseData;
}

export interface OrderDetailsResponseData {
  orderNumber: string;
  status: string;
  amount: number;
  tickets: TicketResponseItem[];
}

export interface OrderDetailsResponse {
  success: boolean;
  data: OrderDetailsResponseData;
}
