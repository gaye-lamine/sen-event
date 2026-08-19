/**
 * @file checkout.ts
 * @description Constantes métier pour le tunnel d'achat et la billetterie Sunu Events.
 */

export const CHECKOUT_CONSTANTS = {
  SERVICE_FEE: 1500,
  DEFAULT_CURRENCY: 'F',
  PHONE_PREFIX: '+221',
  DEFAULT_ORDER_NUMBER: 'SN-284916',
  DEFAULT_DEMO_BUYER: {
    FIRST_NAME: 'Aminata',
    LAST_NAME: 'Diop',
    PHONE: '77 123 45 67',
    EMAIL: 'aminata.diop@email.com',
  },
} as const;

export const APP_CONSTANTS = {
  COMPANY_NAME: 'NIANE TECHNOLOGIES SUARL',
  LOCATION: 'Dakar, Sénégal',
  APP_NAME: 'Sunu Events',
} as const;
