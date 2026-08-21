import React, { useState } from 'react';
import {
  LayoutGrid,
  Ticket,
  Heart,
  Bell,
  CreditCard,
  User,
  Shield,
  LogOut,
  MapPin,
  Camera,
  Calendar,
  Compass,
  Download,
  FileText,
  QrCode,
  CheckCircle2,
  Music,
  Trophy,
  ArrowRight,
} from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';

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

type TabType =
  | 'overview'
  | 'tickets'
  | 'favorites'
  | 'notifications'
  | 'payments'
  | 'profile'
  | 'security';

type TicketFilterType = 'upcoming' | 'past';

interface UserTicket {
  id: string;
  title: string;
  location: string;
  date: string;
  image: string;
  quantity: number;
  tiers: string;
  status: 'upcoming' | 'past';
}

interface FavoriteEvent {
  id: string;
  title: string;
  category: string;
  categoryIcon: typeof Music;
  location: string;
  date: string;
  image: string;
  price: string;
}

const USER_TICKETS: UserTicket[] = [
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

const INITIAL_FAVORITES: FavoriteEvent[] = [
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

/**
 * @page DashboardPage
 * @description Espace personnel / Tableau de bord d'Aminata Diop :
 * - Onglet "Vue d'ensemble" : KPI, billet prochain et activités récentes
 * - Onglet "Mes billets" : Billets à venir (3) et Passés (9) avec téléchargement PDF
 * - Onglet "Mes favoris" : Grille des évènements mis de côté avec actions de réservation
 * @param {DashboardPageProps} props - Propriétés du composant
 */
export const DashboardPage: React.FC<DashboardPageProps> = ({
  onNavigateHome,
  onLogout,
  searchQuery = '',
  onSearch,
  cartCount = 0,
  onOpenCart,
  onViewTicket,
  onBookEvent,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('favorites');
  const [ticketFilter, setTicketFilter] = useState<TicketFilterType>('upcoming');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<FavoriteEvent[]>(INITIAL_FAVORITES);

  const upcomingTickets = USER_TICKETS.filter((t) => t.status === 'upcoming');
  const pastTickets = USER_TICKETS.filter((t) => t.status === 'past');
  const displayedTickets = ticketFilter === 'upcoming' ? upcomingTickets : pastTickets;

  const handleDownloadPdf = (ticket: UserTicket) => {
    setDownloadingId(ticket.id);
    setTimeout(() => {
      setDownloadingId(null);
      alert(`Téléchargement du billet PDF pour "${ticket.title}" terminé !`);
    }, 800);
  };

  const handleRemoveFavorite = (favId: string) => {
    setFavorites(favorites.filter((f) => f.id !== favId));
  };

  return (
    <div className="min-h-screen bg-[#F8F9FB] flex flex-col justify-between font-sans selection:bg-brand-300 selection:text-gray-900">
      {/* ========================================================= */}
      {/* 1. EN-TÊTE / NAVBAR */}
      {/* ========================================================= */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16 sm:h-20 gap-4">
          <Navbar
            searchQuery={searchQuery}
            onSearch={onSearch}
            onNavigateHome={onNavigateHome}
            isAuthenticated={true}
            onLogout={onLogout}
            cartCount={cartCount}
            onOpenCart={onOpenCart}
          />
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. BANDEAU SUPÉRIEUR DÉGRADÉ VIOLET & STATISTIQUES */}
      {/* ========================================================= */}
      <div
        className="w-full text-white py-8 sm:py-10 px-4 sm:px-6 lg:px-8 shadow-sm relative overflow-hidden"
        style={{
          background: 'linear-gradient(90deg, #6347EA 0%, #5439DD 50%, #462DC9 100%)',
        }}
      >
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          {/* Profil Utilisateur */}
          <div className="flex items-center gap-4 sm:gap-5">
            <div className="relative">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 border-white/70 shadow-md bg-amber-100 flex items-center justify-center">
                <img
                  src="/images/wally.png"
                  alt="Aminata Diop"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                <User className="w-8 h-8 text-amber-800" />
              </div>
              <button
                type="button"
                className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-white text-gray-800 flex items-center justify-center shadow-xs hover:bg-gray-100 transition-colors cursor-pointer border border-gray-100"
                aria-label="Modifier la photo"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>

            <div>
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-snug">
                Aminata Diop
              </h1>
              <p className="text-xs sm:text-sm text-white/80 mt-1 flex items-center gap-1.5 font-medium">
                <MapPin className="w-3.5 h-3.5 text-white/70" />
                <span>Dakar</span>
                <span>•</span>
                <span>Membre depuis janvier 2025</span>
              </p>
            </div>
          </div>

          {/* 3 Statistiques Principales */}
          <div className="flex items-center gap-8 sm:gap-12 md:gap-14 border-t md:border-t-0 pt-4 md:pt-0 border-white/15">
            <div
              onClick={() => {
                setActiveTab('tickets');
                setTicketFilter('upcoming');
              }}
              className="cursor-pointer hover:opacity-90 transition-opacity"
            >
              <p className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                3
              </p>
              <p className="text-[11px] sm:text-xs text-white/75 font-normal mt-0.5 whitespace-nowrap">
                Billets à venir
              </p>
            </div>

            <div
              onClick={() => {
                setActiveTab('favorites');
              }}
              className="cursor-pointer hover:opacity-90 transition-opacity"
            >
              <p className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {favorites.length}
              </p>
              <p className="text-[11px] sm:text-xs text-white/75 font-normal mt-0.5 whitespace-nowrap">
                Évènements suivis
              </p>
            </div>

            <div>
              <p className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                76 500 F
              </p>
              <p className="text-[11px] sm:text-xs text-white/75 font-normal mt-0.5 whitespace-nowrap">
                Dépensé cette année
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 3. CORPS PRINCIPAL */}
      {/* ========================================================= */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* A. MENU LATÉRAL DE GAUCHE */}
          <aside className="lg:col-span-3 space-y-6">
            <nav className="space-y-1">
              <button
                type="button"
                onClick={() => setActiveTab('overview')}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer text-left ${
                  activeTab === 'overview'
                    ? 'bg-white text-[#FF5722] font-bold shadow-xs border border-gray-100'
                    : 'text-gray-600 hover:bg-white hover:text-gray-900'
                }`}
              >
                <LayoutGrid
                  className={`w-4 h-4 ${
                    activeTab === 'overview' ? 'text-[#FF5722]' : 'text-gray-500'
                  }`}
                />
                <span>Vue d'ensemble</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('tickets')}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer text-left ${
                  activeTab === 'tickets'
                    ? 'bg-white text-[#FF5722] font-bold shadow-xs border border-gray-100'
                    : 'text-gray-600 hover:bg-white hover:text-gray-900'
                }`}
              >
                <Ticket
                  className={`w-4 h-4 ${
                    activeTab === 'tickets' ? 'text-[#FF5722]' : 'text-gray-500'
                  }`}
                />
                <span>Mes billets</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('favorites')}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer text-left ${
                  activeTab === 'favorites'
                    ? 'bg-white text-[#FF5722] font-bold shadow-xs border border-gray-100'
                    : 'text-gray-600 hover:bg-white hover:text-gray-900'
                }`}
              >
                <Heart
                  className={`w-4 h-4 ${
                    activeTab === 'favorites' ? 'text-[#FF5722]' : 'text-gray-500'
                  }`}
                />
                <span>Mes favoris</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('notifications')}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer text-left ${
                  activeTab === 'notifications'
                    ? 'bg-white text-[#FF5722] font-bold shadow-xs border border-gray-100'
                    : 'text-gray-600 hover:bg-white hover:text-gray-900'
                }`}
              >
                <Bell className="w-4 h-4 text-gray-500" />
                <span>Notifications</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('payments')}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer text-left ${
                  activeTab === 'payments'
                    ? 'bg-white text-[#FF5722] font-bold shadow-xs border border-gray-100'
                    : 'text-gray-600 hover:bg-white hover:text-gray-900'
                }`}
              >
                <CreditCard className="w-4 h-4 text-gray-500" />
                <span>Moyens de paiement</span>
              </button>

              <div className="pt-3 pb-1 border-t border-gray-200/80 my-2" />

              <button
                type="button"
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer text-left ${
                  activeTab === 'profile'
                    ? 'bg-white text-[#FF5722] font-bold shadow-xs border border-gray-100'
                    : 'text-gray-600 hover:bg-white hover:text-gray-900'
                }`}
              >
                <User className="w-4 h-4 text-gray-500" />
                <span>Mes informations</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('security')}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer text-left ${
                  activeTab === 'security'
                    ? 'bg-white text-[#FF5722] font-bold shadow-xs border border-gray-100'
                    : 'text-gray-600 hover:bg-white hover:text-gray-900'
                }`}
              >
                <Shield className="w-4 h-4 text-gray-500" />
                <span>Sécurité</span>
              </button>

              <div className="pt-3 pb-1 border-t border-gray-200/80 my-2" />

              <button
                type="button"
                onClick={onLogout}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all cursor-pointer text-left"
              >
                <LogOut className="w-4 h-4" />
                <span>Se déconnecter</span>
              </button>
            </nav>

            {/* ENCART CTA ORGANISATEUR */}
            <div className="bg-gradient-to-br from-[#E64A19] to-[#FF5722] text-white p-5 rounded-2xl shadow-xs text-left">
              <h4 className="font-bold text-sm text-white">
                Envie d'organiser ?
              </h4>
              <p className="text-[11px] text-white/90 mt-1 leading-relaxed">
                Crée ta billetterie et vends tes propres évènements.
              </p>
              <button
                type="button"
                onClick={onNavigateHome}
                className="w-full py-2.5 bg-white text-[#E64A19] font-bold text-xs rounded-xl mt-3 text-center shadow-xs hover:bg-gray-50 transition-all active:scale-98 cursor-pointer"
              >
                Devenir organisateur
              </button>
            </div>
          </aside>

          {/* B. SECTION CENTRALE DYNAMIQUE */}
          <section className="lg:col-span-9 space-y-6 text-left">
            {/* ========================================================= */}
            {/* ONGLET 1 : MES FAVORIS */}
            {/* ========================================================= */}
            {activeTab === 'favorites' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                {/* En-tête */}
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-[#111827] tracking-tight">
                    Mes favoris
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1">
                    Les évènements que tu as mis de côté pour plus tard.
                  </p>
                </div>

                {/* Grille 3 colonnes des cartes d'évènements favoris */}
                {favorites.length === 0 ? (
                  <div className="bg-white rounded-3xl p-10 text-center border border-gray-100">
                    <Heart className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                    <p className="text-sm font-bold text-gray-700">
                      Aucun favori enregistré
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Explore les évènements et clique sur le cœur pour les retrouver ici.
                    </p>
                    <button
                      type="button"
                      onClick={onNavigateHome}
                      className="mt-4 px-5 py-2 rounded-full bg-[#121526] text-white text-xs font-bold"
                    >
                      Découvrir les évènements
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {favorites.map((event) => {
                      const CategoryIcon = event.categoryIcon;
                      return (
                        <div
                          key={event.id}
                          className="bg-white rounded-3xl p-3 border border-gray-200/70 shadow-2xs hover:shadow-md transition-all group flex flex-col justify-between"
                        >
                          {/* Image avec Badges flottants */}
                          <div className="relative rounded-2xl overflow-hidden aspect-[4/4.8] bg-gray-100">
                            <img
                              src={event.image}
                              alt={event.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />

                            {/* Badge Catégorie Top-Left */}
                            <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-[11px] font-bold text-gray-900 flex items-center gap-1 shadow-2xs">
                              <CategoryIcon className="w-3 h-3 text-gray-800" />
                              <span>{event.category}</span>
                            </div>

                            {/* Badge Cœur Top-Right (Actif en rouge) */}
                            <button
                              type="button"
                              onClick={() => handleRemoveFavorite(event.id)}
                              title="Retirer des favoris"
                              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white text-[#EF4444] flex items-center justify-center shadow-xs hover:scale-110 active:scale-95 transition-all cursor-pointer"
                            >
                              <Heart className="w-4 h-4 fill-[#EF4444]" />
                            </button>
                          </div>

                          {/* Détails de l'évènement */}
                          <div className="px-1.5 pt-3 pb-1">
                            <h3 className="font-bold text-sm sm:text-base text-[#111827] leading-snug line-clamp-1">
                              {event.title}
                            </h3>
                            <p className="text-xs text-gray-500 mt-1 flex items-center gap-1 line-clamp-1">
                              <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                              <span>{event.location}</span>
                            </p>
                            <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                              <span>{event.date}</span>
                            </p>
                          </div>

                          {/* Prix et Bouton Réserver */}
                          <div className="px-1.5 pt-3 border-t border-gray-100 flex items-center justify-between mt-2">
                            <div>
                              <p className="text-sm font-black text-[#111827] leading-none">
                                {event.price}
                              </p>
                              <span className="text-[10px] text-gray-400 font-medium">
                                à partir de
                              </span>
                            </div>

                            <button
                              type="button"
                              onClick={() => onBookEvent?.(event.id)}
                              className="px-4 py-2 rounded-full bg-[#121526] hover:bg-[#090B14] text-white font-bold text-xs flex items-center gap-1.5 transition-all active:scale-95 shadow-xs cursor-pointer"
                            >
                              <span>Réserver</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* ========================================================= */}
            {/* ONGLET 2 : MES BILLETS */}
            {/* ========================================================= */}
            {activeTab === 'tickets' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-[#111827] tracking-tight">
                    Mes billets
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1">
                    Retrouve ici tous tes billets électroniques, prêts à scanner.
                  </p>
                </div>

                <div className="flex items-center gap-6 border-b border-gray-200 text-xs sm:text-sm select-none">
                  <button
                    type="button"
                    onClick={() => setTicketFilter('upcoming')}
                    className={`pb-2.5 transition-all cursor-pointer relative ${
                      ticketFilter === 'upcoming'
                        ? 'font-bold text-[#111827] border-b-2 border-[#FF5722]'
                        : 'font-medium text-gray-400 hover:text-gray-700'
                    }`}
                  >
                    À venir ({upcomingTickets.length})
                  </button>

                  <button
                    type="button"
                    onClick={() => setTicketFilter('past')}
                    className={`pb-2.5 transition-all cursor-pointer relative ${
                      ticketFilter === 'past'
                        ? 'font-bold text-[#111827] border-b-2 border-[#FF5722]'
                        : 'font-medium text-gray-400 hover:text-gray-700'
                    }`}
                  >
                    Passés ({pastTickets.length + 7})
                  </button>
                </div>

                <div className="space-y-4">
                  {displayedTickets.map((ticket) => (
                    <div
                      key={ticket.id}
                      className="bg-white border border-gray-200/80 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs hover:shadow-xs transition-shadow"
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={ticket.image}
                          alt={ticket.title}
                          className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover shrink-0 shadow-xs border border-gray-100"
                        />
                        <div>
                          <h3 className="font-bold text-sm sm:text-base text-[#111827] leading-snug">
                            {ticket.title}
                          </h3>
                          <p className="text-xs text-gray-500 mt-1 flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                            <span>{ticket.location}</span>
                          </p>
                          <p className="text-xs text-gray-500 mt-1 flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                            <span>{ticket.date}</span>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-6 border-t sm:border-t-0 pt-3 sm:pt-0 border-gray-100">
                        <div className="text-left sm:text-right">
                          <p className="text-xl sm:text-2xl font-black text-[#111827] leading-tight">
                            {ticket.quantity}
                          </p>
                          <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block">
                            {ticket.quantity > 1 ? 'BILLETS' : 'BILLET'}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleDownloadPdf(ticket)}
                          disabled={downloadingId === ticket.id}
                          className="px-4 py-2 rounded-full border border-gray-200 hover:bg-gray-50 text-xs font-bold text-gray-800 flex items-center gap-1.5 transition-all cursor-pointer shrink-0 shadow-2xs active:scale-95"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>
                            {downloadingId === ticket.id ? 'Chargement...' : 'PDF'}
                          </span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ========================================================= */}
            {/* ONGLET 3 : VUE D'ENSEMBLE */}
            {/* ========================================================= */}
            {activeTab === 'overview' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-[#111827] tracking-tight">
                    Vue d'ensemble
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1">
                    Un aperçu rapide de ton activité sur Sunu Events.
                  </p>
                </div>

                {/* 3 Cartes KPI */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div
                    onClick={() => {
                      setActiveTab('tickets');
                      setTicketFilter('upcoming');
                    }}
                    className="bg-white rounded-2xl p-5 border border-gray-100 shadow-2xs cursor-pointer hover:border-gray-300 transition-all"
                  >
                    <div className="w-9 h-9 rounded-xl bg-[#F8F9FA] text-gray-600 flex items-center justify-center">
                      <Ticket className="w-4 h-4" />
                    </div>
                    <p className="text-2xl sm:text-3xl font-extrabold text-[#111827] mt-3 tracking-tight">
                      3
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5 font-medium">
                      Billets à venir
                    </p>
                  </div>

                  <div
                    onClick={() => {
                      setActiveTab('tickets');
                      setTicketFilter('past');
                    }}
                    className="bg-white rounded-2xl p-5 border border-gray-100 shadow-2xs cursor-pointer hover:border-gray-300 transition-all"
                  >
                    <div className="w-9 h-9 rounded-xl bg-[#F0FDF4] text-[#10B981] flex items-center justify-center">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <p className="text-2xl sm:text-3xl font-extrabold text-[#111827] mt-3 tracking-tight">
                      9
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5 font-medium">
                      Évènements passés
                    </p>
                  </div>

                  <div
                    onClick={() => setActiveTab('favorites')}
                    className="bg-white rounded-2xl p-5 border border-gray-100 shadow-2xs cursor-pointer hover:border-gray-300 transition-all"
                  >
                    <div className="w-9 h-9 rounded-xl bg-[#FFF1F2] text-[#F43F5E] flex items-center justify-center">
                      <Heart className="w-4 h-4" />
                    </div>
                    <p className="text-2xl sm:text-3xl font-extrabold text-[#111827] mt-3 tracking-tight">
                      {favorites.length}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5 font-medium">
                      Favoris enregistrés
                    </p>
                  </div>
                </div>

                {/* Billet en Vedette */}
                <div className="bg-white border border-gray-200/80 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
                  <div className="flex items-center gap-3.5 sm:gap-4">
                    <img
                      src="/images/wally.png"
                      alt="Wally B. Seck"
                      className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl object-cover shrink-0 shadow-xs"
                    />
                    <div>
                      <h3 className="font-bold text-sm sm:text-base text-[#111827] leading-snug">
                        Wally B. Seck en concert
                      </h3>
                      <p className="text-xs text-gray-500 mt-1 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        <span>Dakar Arena • Ven. 20 décembre 2026, 20h00</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-5 border-t sm:border-t-0 pt-3 sm:pt-0 border-gray-100">
                    <div className="text-left sm:text-right">
                      <p className="text-lg sm:text-xl font-black text-[#111827] leading-tight">
                        153
                      </p>
                      <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block">
                        JOURS RESTANTS
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => onViewTicket?.()}
                      className="px-4 py-2 rounded-full border border-gray-200 hover:bg-gray-50 text-xs font-semibold text-gray-800 transition-all cursor-pointer shrink-0"
                    >
                      Voir le billet
                    </button>
                  </div>
                </div>

                {/* Activité récente */}
                <div className="pt-2">
                  <h3 className="font-bold text-sm sm:text-base text-[#111827] mb-3">
                    Activité récente
                  </h3>

                  <div className="bg-white rounded-2xl border border-gray-100 shadow-2xs divide-y divide-gray-100">
                    <div className="p-4 sm:p-5 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3.5">
                        <div className="w-9 h-9 rounded-full bg-[#F0FDFA] text-[#0D9488] flex items-center justify-center shrink-0">
                          <Ticket className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-xs sm:text-sm text-[#111827]">
                            Achat de 3 billets — Wally B. Seck en concert
                          </h4>
                          <p className="text-xs text-gray-500 mt-0.5">
                            Standard × 2, VIP × 1
                          </p>
                        </div>
                      </div>
                      <span className="text-xs text-gray-400 whitespace-nowrap">
                        Il y a 2 jours
                      </span>
                    </div>

                    <div className="p-4 sm:p-5 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3.5">
                        <div className="w-9 h-9 rounded-full bg-[#ECFDF5] text-[#10B981] flex items-center justify-center shrink-0">
                          <Heart className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-xs sm:text-sm text-[#111827]">
                            Ajouté aux favoris — Festival International de Jazz
                          </h4>
                          <p className="text-xs text-gray-500 mt-0.5">
                            Saint-Louis, 5–8 mai
                          </p>
                        </div>
                      </div>
                      <span className="text-xs text-gray-400 whitespace-nowrap">
                        Il y a 5 jours
                      </span>
                    </div>

                    <div className="p-4 sm:p-5 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3.5">
                        <div className="w-9 h-9 rounded-full bg-[#F1F5F9] text-[#64748B] flex items-center justify-center shrink-0">
                          <User className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-xs sm:text-sm text-[#111827]">
                            Profil mis à jour
                          </h4>
                          <p className="text-xs text-gray-500 mt-0.5">
                            Numéro de téléphone modifié
                          </p>
                        </div>
                      </div>
                      <span className="text-xs text-gray-400 whitespace-nowrap">
                        Il y a 2 semaines
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>
      </main>

      {/* ========================================================= */}
      {/* 4. PIED DE PAGE GLOBAL */}
      {/* ========================================================= */}
      <Footer onNavigateHome={onNavigateHome} />
    </div>
  );
};
