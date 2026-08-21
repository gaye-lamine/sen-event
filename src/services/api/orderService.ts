/**
 * @file orderService.ts
 * @description Service d'intégration du tunnel de commande et de paiement InTouch (Wave, Orange Money).
 * Communique avec les endpoints du backend Laravel :
 * - POST /orders (Création de commande et génération des billets en attente)
 * - POST /payments/initiate (Déclenchement du paiement InTouch avec QR Code et DeepLink)
 * - GET /payments/status/{transactionId} (Polling du statut de paiement)
 * - GET /orders/{orderNumber} (Récupération des billets confirmés)
 */

import { apiClient } from './apiClient';
import {
  CreateOrderRequest,
  CreateOrderResponse,
  InitiatePaymentRequest,
  InitiatePaymentResponse,
  PaymentStatusResponse,
  OrderDetailsResponse,
} from '../../types/intouch-order';

export class OrderService {
  /**
   * Crée une nouvelle commande avec les lignes de tarifs et les titulaires nominatifs.
   */
  public async createOrder(payload: CreateOrderRequest): Promise<CreateOrderResponse> {
    return await apiClient.post<CreateOrderResponse, CreateOrderRequest>('/orders', payload);
  }

  /**
   * Déclenche la transaction de paiement auprès de la passerelle InTouch.
   */
  public async initiatePayment(payload: InitiatePaymentRequest): Promise<InitiatePaymentResponse> {
    return await apiClient.post<InitiatePaymentResponse, InitiatePaymentRequest>(
      '/payments/initiate',
      payload
    );
  }

  /**
   * Vérifie le statut de la transaction.
   */
  public async getPaymentStatus(transactionId: string): Promise<PaymentStatusResponse> {
    return await apiClient.get<PaymentStatusResponse>(`/payments/status/${transactionId}`);
  }

  /**
   * Récupère la commande validée et ses billets activés avec QR codes.
   */
  public async getOrderDetails(orderNumber: string): Promise<OrderDetailsResponse> {
    return await apiClient.get<OrderDetailsResponse>(`/orders/${orderNumber}`);
  }
}

export const orderService = new OrderService();
