import { Music, Trophy } from 'lucide-react';
import {
  UserTicket,
  FavoriteEvent,
  PaymentMethod,
  UserProfileData,
} from '../types/dashboard';

export const MOCK_USER_PROFILE: UserProfileData = {
  firstName: 'Aminata',
  lastName: 'Diop',
  email: 'aminata.diop@email.com',
  phone: '77 123 45 67',
  city: 'Dakar',
  memberSince: 'janvier 2025',
  avatarUrl: '/images/wally.png',
};

export const MOCK_USER_TICKETS: UserTicket[] = [
  {
    id: 't-1',
    title: 'Wally B. Seck en concert',
    location: 'Dakar Arena, Diamniadio',
    date: 'Ven. 20 décembre 2026, 20h00',
    image: '/images/wally.png',
    quantity: 3,
    tiers: 'Standard × 2, VIP × 1',
    status: 'upcoming',
  },
  {
    id: 't-2',
    title: 'Sénégal vs Rwanda — Éliminatoires CAN',
    location: 'Stade Abdoulaye Wade',
    date: 'Sam. 15 novembre 2026, 18h00',
    image: '/images/match.png',
    quantity: 1,
    tiers: 'Tribune Latérale × 1',
    status: 'upcoming',
  },
  {
    id: 't-3',
    title: 'Nuit du Sabar — Just4U Live',
    location: 'Just4U, Dakar',
    date: 'Sam. 30 novembre 2026, 23h00',
    image: '/images/diner.png',
    quantity: 2,
    tiers: 'Pass Couple VIP × 1',
    status: 'upcoming',
  },
  {
    id: 't-4',
    title: 'Festival International de Jazz',
    location: 'Place Faidherbe, Saint-Louis',
    date: 'Dim. 8 mai 2025, 21h00',
    image: '/images/comedy.png',
    quantity: 2,
    tiers: 'Pass 3 Jours × 2',
    status: 'past',
  },
  {
    id: 't-5',
    title: 'Dakar Music Festival 2025',
    location: 'Monument de la Renaissance',
    date: 'Sam. 12 avril 2025, 19h00',
    image: '/images/concert.png',
    quantity: 1,
    tiers: 'Pass Général × 1',
    status: 'past',
  },
];

export const MOCK_FAVORITE_EVENTS: FavoriteEvent[] = [
  {
    id: 'fav-1',
    title: 'Jeeba en concert',
    category: 'Concert',
    categoryIcon: Music,
    location: 'Jardin de la Mairie , Tambacounda',
    date: 'Dim. 31 décembre, 20h00',
    image: '/images/concert.png',
    price: '10 000 F',
  },
  {
    id: 'fav-2',
    title: 'Match Sénégal vs Algérie',
    category: 'Sport',
    categoryIcon: Trophy,
    location: 'Stade Abdoulaye Wade, Diamniadio',
    date: 'Ven. 12 Sept, 19h00',
    image: '/images/match.png',
    price: '10 000 F',
  },
  {
    id: 'fav-3',
    title: 'Wally B. Seck en concert',
    category: 'Concert',
    categoryIcon: Music,
    location: 'Gare TER de Dakar',
    date: 'Sam. 05 Nov, 18h00',
    image: '/images/wally.png',
    price: '10 000 F',
  },
];

export const MOCK_PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: 'pm-1',
    type: 'wave',
    title: 'Wave',
    detail: '+221 77 •• •• 67',
    isDefault: true,
  },
  {
    id: 'pm-2',
    type: 'om',
    title: 'Orange Money',
    detail: '+221 78 •• •• 12',
    isDefault: false,
  },
  {
    id: 'pm-3',
    type: 'card',
    title: 'Carte Visa',
    detail: '•••• •••• •••• 4821 — Exp. 08/28',
    isDefault: false,
  },
];
