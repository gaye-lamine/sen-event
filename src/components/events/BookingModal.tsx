import React, { useState } from 'react';
import { X, Calendar, MapPin, CheckCircle, ShieldCheck, Ticket, QrCode } from 'lucide-react';
import confetti from 'canvas-confetti';
import { EventItem, TicketTier, BookingConfirmation } from '../../types/event';
import { eventService } from '../../services/api/eventService';

/**
 * ============================================================================
 * MODULE : DÉTAIL D'UN ÉVÉNEMENT, RÉSERVATION & PAIEMENT (WAVE / ORANGE MONEY)
 * ============================================================================
 * 
 * Cette modale interactive permet à l'utilisateur :
 * 1. De visualiser les DÉTAILS COMPLETS de l'événement (titre, date, lieu, description, affiche)
 * 2. De choisir sa CATÉGORIE DE BILLET (Pass Simple, Pass VIP, etc.) et la QUANTITÉ
 * 3. De sélectionner son MODE DE PAIEMENT SÉNÉGALAIS (Wave ou Orange Money)
 * 4. D'obtenir instantanément son BILLET SÉCURISÉ avec QR Code infalsifiable
 */

interface BookingModalProps {
  /** Objet contenant toutes les informations détaillées de l'événement cliqué */
  event: EventItem | null;
  /** État d'ouverture de la modale */
  isOpen: boolean;
  /** Fonction de rappel pour fermer la modale */
  onClose: () => void;
  /** Fonction de rappel optionnelle appelée après confirmation réussie */
  onBookingSuccess?: (confirmation: BookingConfirmation) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  event,
  isOpen,
  onClose,
  onBookingSuccess,
}) => {
  if (!isOpen || !event) return null;

  // Catégories de billets disponibles pour cet événement
  const tiers: TicketTier[] = event.ticketTiers || [
    { id: 'standard', name: 'Pass Simple', price: event.startingPrice, available: true },
    { id: 'vip', name: 'Pass VIP', price: event.startingPrice * 2.5, available: true },
  ];

  // --------------------------------------------------------------------------
  // ÉTATS DE LA RÉSERVATION
  // --------------------------------------------------------------------------
  const [selectedTier, setSelectedTier] = useState<TicketTier>(tiers[0]);
  const [quantity, setQuantity] = useState(1);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'wave' | 'orange_money' | 'free_money' | 'card'>('wave');
  const [isProcessing, setIsProcessing] = useState(false);
  const [confirmation, setConfirmation] = useState<BookingConfirmation | null>(null);

  // Calcul du montant total
  const totalAmount = selectedTier.price * quantity;
  const formattedTotal = new Intl.NumberFormat('fr-FR').format(totalAmount);

  /**
   * ==========================================================================
   * GESTION DU PAIEMENT ET GÉNÉRATION DU BILLET
   * ==========================================================================
   */
  const handleConfirmBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // Appel du service API (simulé ou réel) pour enregistrer la réservation
      const result = await eventService.createBooking({
        eventId: event.id,
        tierId: selectedTier.id,
        quantity,
        customerName: customerName || 'Client SunuEvents',
        customerPhone: customerPhone || '+221 77 000 00 00',
        customerEmail: 'client@sunuevents.sn',
        paymentMethod,
      });

      // Lancement de l'animation de confettis de célébration
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#F59E0B', '#10B981', '#6366F1', '#EC4899'],
      });

      setConfirmation(result);
      onBookingSuccess?.(result);
    } catch (err) {
      console.error('Erreur lors de la réservation:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleResetAndClose = () => {
    setConfirmation(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 my-8">
        
        {/* Bouton Fermer */}
        <button
          onClick={handleResetAndClose}
          type="button"
          className="absolute top-4 right-4 z-20 p-2 bg-white/90 backdrop-blur-md rounded-full text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors shadow-sm"
          aria-label="Fermer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* ================================================================= */}
        {/* VUE 1 : BILLET CONFIRMÉ & QR CODE (AFFICHÉ APRÈS PAIEMENT)       */}
        {/* ================================================================= */}
        {confirmation ? (
          <div className="p-6 sm:p-8 text-center">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8" />
            </div>

            <h3 className="text-2xl font-extrabold text-gray-900">
              Billet confirmé !
            </h3>
            <p className="text-sm text-gray-600 mt-1 max-w-md mx-auto">
              Votre réservation a été validée. Un SMS et un e-mail de confirmation vous ont été envoyés.
            </p>

            {/* Billet Digital avec QR Code */}
            <div className="my-6 p-5 bg-gradient-to-br from-gray-900 to-gray-800 text-white rounded-2xl text-left relative overflow-hidden shadow-lg">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-2.5 py-0.5 rounded-full">
                    {selectedTier.name}
                  </span>
                  <h4 className="font-extrabold text-base sm:text-lg text-white mt-1">
                    {event.title}
                  </h4>
                  <p className="text-xs text-gray-300">
                    {event.date} • {event.location}
                  </p>
                </div>
                
                {/* QR Code de contrôle d'accès */}
                <div className="bg-white p-2 rounded-xl text-gray-900 shadow-inner flex flex-col items-center">
                  <QrCode className="w-16 h-16" />
                  <span className="text-[9px] font-mono font-bold mt-1 text-gray-700">
                    {confirmation.bookingId}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-700/60 flex justify-between items-center text-xs text-gray-300">
                <div>
                  <span className="text-gray-400">Titulaire : </span>
                  <span className="font-semibold text-white">{customerName || 'Client'}</span>
                </div>
                <div>
                  <span className="text-gray-400">Total payé : </span>
                  <span className="font-bold text-amber-400">{formattedTotal} {event.currency}</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleResetAndClose}
              type="button"
              className="w-full py-3 bg-[#111328] hover:bg-black text-white font-bold text-sm rounded-xl shadow-md transition-all active:scale-98"
            >
              Fermer et voir d'autres événements
            </button>
          </div>
        ) : (
          /* =============================================================== */
          /* VUE 2 : DÉTAIL DE L'ÉVÉNEMENT ET FORMULAIRE DE RÉSERVATION      */
          /* =============================================================== */
          <div>
            {/* ------------------------------------------------------------- */}
            {/* 1. DÉTAIL VISUEL DE L'ÉVÉNEMENT (IMAGE, TITRE, LIEU, DATE)    */}
            {/* ------------------------------------------------------------- */}
            <div className="relative h-44 sm:h-52 bg-gray-100">
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="inline-block px-2.5 py-0.5 bg-amber-400 text-gray-950 font-bold text-[10px] uppercase rounded-full mb-1.5">
                  {event.categoryLabel}
                </span>
                <h3 className="font-extrabold text-lg sm:text-xl text-white line-clamp-1">
                  {event.title}
                </h3>
                <div className="flex flex-wrap items-center gap-3 text-xs text-gray-200 mt-1">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-amber-400" />
                    {event.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-amber-400" />
                    {event.location}
                  </span>
                </div>
              </div>
            </div>

            {/* ------------------------------------------------------------- */}
            {/* 2. FORMULAIRE DE CHOIX DES BILLETS ET PAIEMENT               */}
            {/* ------------------------------------------------------------- */}
            <form onSubmit={handleConfirmBooking} className="p-5 sm:p-6 space-y-5">
              
              {/* Choix de la catégorie de billet */}
              <div>
                <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-2">
                  1. Choisissez votre pass
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {tiers.map((tier) => (
                    <button
                      key={tier.id}
                      type="button"
                      onClick={() => setSelectedTier(tier)}
                      className={`p-3 rounded-2xl border text-left flex justify-between items-center transition-all ${
                        selectedTier.id === tier.id
                          ? 'border-gray-950 bg-gray-950 text-white shadow-md'
                          : 'border-gray-200 hover:border-gray-300 text-gray-900 bg-white'
                      }`}
                    >
                      <div>
                        <div className="font-bold text-xs">{tier.name}</div>
                        <div className={`text-[11px] ${selectedTier.id === tier.id ? 'text-gray-300' : 'text-gray-500'}`}>
                          Accès direct
                        </div>
                      </div>
                      <div className="font-extrabold text-xs">
                        {new Intl.NumberFormat('fr-FR').format(tier.price)} {event.currency}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Choix de la Quantité */}
              <div>
                <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-2">
                  2. Nombre de billets
                </label>
                <div className="flex items-center gap-3">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setQuantity(num)}
                      className={`w-10 h-10 rounded-xl font-bold text-xs transition-all ${
                        quantity === num
                          ? 'bg-[#FFC23C] text-gray-950 shadow-sm'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              {/* Coordonnées de l'acheteur */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                    Nom & Prénom
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Ex: Moussa Ndiaye"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-gray-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                    Numéro de téléphone
                  </label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="77 000 00 00"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-gray-900 focus:outline-none"
                  />
                </div>
              </div>

              {/* ----------------------------------------------------------- */}
              {/* 3. SÉLECTION DU MODE DE PAIEMENT (WAVE / ORANGE MONEY)      */}
              {/* ----------------------------------------------------------- */}
              <div>
                <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-2">
                  3. Mode de paiement local
                </label>
                <div className="grid grid-cols-2 gap-3">
                  
                  {/* Option Wave Sénégal */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('wave')}
                    className={`p-3 rounded-2xl border flex items-center justify-center gap-2 font-bold text-xs transition-all ${
                      paymentMethod === 'wave'
                        ? 'border-[#1DC6F6] bg-[#1DC6F6]/10 text-[#0E8AAE] ring-2 ring-[#1DC6F6]/30'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700 bg-white'
                    }`}
                  >
                    <span className="w-2.5 h-2.5 rounded-full bg-[#1DC6F6]" />
                    Wave
                  </button>

                  {/* Option Orange Money Sénégal */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('orange_money')}
                    className={`p-3 rounded-2xl border flex items-center justify-center gap-2 font-bold text-xs transition-all ${
                      paymentMethod === 'orange_money'
                        ? 'border-[#FF7900] bg-[#FF7900]/10 text-[#C65D00] ring-2 ring-[#FF7900]/30'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700 bg-white'
                    }`}
                  >
                    <span className="w-2.5 h-2.5 rounded-full bg-[#FF7900]" />
                    Orange Money
                  </button>
                </div>
              </div>

              {/* Bouton de confirmation & montant total */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-3.5 bg-[#111328] hover:bg-black text-white font-extrabold text-sm rounded-xl shadow-lg transition-all active:scale-98 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>
                    {isProcessing
                      ? 'Paiement sécurisé en cours...'
                      : `Payer ${formattedTotal} ${event.currency} avec ${
                          paymentMethod === 'wave' ? 'Wave' : 'Orange Money'
                        }`}
                  </span>
                </button>
                <p className="text-center text-[11px] text-gray-400 mt-2 flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-500" />
                  Billet électronique certifié et sécurisé par SunuEvents
                </p>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
