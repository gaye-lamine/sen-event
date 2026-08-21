import { apiClient } from './apiClient';
import {
  CreateOrderRequest,
  CreateOrderResponse,
  InitiatePaymentRequest,
  InitiatePaymentResponse,
  PaymentStatusResponse,
  OrderDetailsResponse,
} from '../../types/intouch-order';

/**
 * @class OrderService
 * @description Service d'intégration du tunnel de commande et de paiement InTouch (Wave, Orange Money, Free Money).
 * Communique avec les endpoints du backend Laravel :
 * - POST /orders (Création de commande et génération des billets en attente)
 * - POST /payments/initiate (Déclenchement du paiement InTouch avec QR Code et DeepLink)
 * - GET /payments/status/{transactionId} (Polling du statut de paiement)
 * - GET /orders/{orderNumber} (Récupération des billets confirmés)
 */
export class OrderService {
  /**
   * Crée une nouvelle commande avec les lignes de tarifs et les titulaires nominatifs.
   * @param payload - Données de la commande
   * @returns Réponse contenant le numéro de commande et les billets générés
   */
  public async createOrder(payload: CreateOrderRequest): Promise<CreateOrderResponse> {
    if (apiClient.getIsMockMode()) {
      const orderNumber = `SN-${Math.floor(100000 + Math.random() * 900000)}`;
      const totalAmount = payload.items.reduce(
        (sum, item) => sum + (item.quantity || 1) * 10000,
        0
      );

      return {
        success: true,
        message: 'Commande créée avec succès. En attente de paiement.',
        data: {
          orderNumber,
          eventId: payload.event_id,
          customer: payload.customer,
          amount: totalAmount,
          currency: 'XOF',
          status: 'pending_payment',
          items: payload.items.map((item, idx) => ({
            id: idx + 1,
            ticketTypeId: typeof item.ticketTypeId === 'number' ? item.ticketTypeId : idx + 1,
            ticketTypeName: `Billet ${idx + 1}`,
            ticketCategory: 'standard',
            quantity: item.quantity,
            unitPrice: 10000,
            totalPrice: item.quantity * 10000,
          })),
          tickets: payload.items.flatMap((item, idx) =>
            item.holders.map((holder, hIdx) => ({
              id: (idx + 1) * 10 + (hIdx + 1),
              ticketCode: `TKT-SN-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
              qrCodeToken: `SUNUEVENTS-${payload.event_id}-${holder.firstName}-${holder.lastName}`,
              holderFirstName: holder.firstName,
              holderLastName: holder.lastName,
              status: 'pending' as const,
            }))
          ),
          createdAt: new Date().toISOString(),
        },
      };
    }

    return await apiClient.post<CreateOrderResponse, CreateOrderRequest>('/orders', payload);
  }

  /**
   * Déclenche la transaction de paiement auprès de la passerelle InTouch.
   * @param payload - Informations de paiement (moyen, numéro de téléphone, acheteur)
   * @returns Données de transaction (DeepLink, QR Code base64, transactionId)
   */
  public async initiatePayment(payload: InitiatePaymentRequest): Promise<InitiatePaymentResponse> {
    if (apiClient.getIsMockMode()) {
      const numTransaction = `${Date.now()}`;
      return {
        success: true,
        data: {
          idFromClient: `${Date.now()}_client`,
          idFromGu: numTransaction,
          serviceCode:
            payload.paymentMethod === 'orange_money'
              ? 'PAIEMENTMARCHANDOMQRCODE'
              : 'PAIEMENTMARCHANDWAVE',
          status: 'initiated',
          numTransaction,
          deepLink:
            payload.paymentMethod === 'wave'
              ? 'https://wave.com/send'
              : 'https://sugu.orange-sonatel.com/mp/sample',
          order: {
            orderNumber: payload.order_number,
            amount: 15000,
            currency: 'XOF',
            status: 'pending_payment',
          },
          createdAt: new Date().toISOString(),
        },
      };
    }

    return await apiClient.post<InitiatePaymentResponse, InitiatePaymentRequest>(
      '/payments/initiate',
      payload
    );
  }

  /**
   * Vérifie le statut de la transaction (Polling toutes les 3 secondes).
   * @param transactionId - Identifiant de transaction InTouch
   * @returns Statut actuel ('initiated' | 'success' | 'failed')
   */
  public async getPaymentStatus(transactionId: string): Promise<PaymentStatusResponse> {
    if (apiClient.getIsMockMode()) {
      return {
        success: true,
        data: {
          idFromClient: transactionId,
          status: 'success',
          order: {
            orderNumber: 'SN-666354',
            amount: 15000,
            currency: 'XOF',
            status: 'confirmed',
          },
        },
      };
    }

    return await apiClient.get<PaymentStatusResponse>(`/payments/status/${transactionId}`);
  }

  /**
   * Récupère la commande validée et ses billets activés ('valid') avec QR codes.
   * @param orderNumber - Numéro de commande certifié (ex: 'SN-666354')
   * @returns Détails de la commande et billets
   */
  public async getOrderDetails(orderNumber: string): Promise<OrderDetailsResponse> {
    if (apiClient.getIsMockMode()) {
      return {
        success: true,
        data: {
          orderNumber,
          status: 'confirmed',
          amount: 15000,
          tickets: [
            {
              id: 1,
              ticketCode: 'TKT-SN-A8B9C1D2E3',
              qrCodeToken: 'SUNUEVENTS-DEMO-QR-TOKEN',
              holderFirstName: 'Aminata',
              holderLastName: 'Diop',
              status: 'valid',
              ticketType: {
                name: 'Pass Standard',
                category: 'standard',
                price: 10000,
              },
            },
          ],
        },
      };
    }

    return await apiClient.get<OrderDetailsResponse>(`/orders/${orderNumber}`);
  }
}

export const orderService = new OrderService();
