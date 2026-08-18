import React, { useState } from 'react';
import { X, Calendar, MapPin, CheckCircle, ShieldCheck, Ticket, QrCode } from 'lucide-react';
import confetti from 'canvas-confetti';
import { EventItem, TicketTier, BookingConfirmation } from '../../types/event';
import { eventService } from '../../services/api/eventService';

interface BookingModalProps {
  event: EventItem | null;
  isOpen: boolean;
  onClose: () => void;
  onBookingSuccess?: (confirmation: BookingConfirmation) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  event,
  isOpen,
  onClose,
  onBookingSuccess,
}) => {
  if (!isOpen || !event) return null;

  const tiers: TicketTier[] = event.ticketTiers || [
    { id: 'standard', name: 'Pass Simple', price: event.startingPrice, available: true },
    { id: 'vip', name: 'Pass VIP', price: event.startingPrice * 2.5, available: true },
  ];

  const [selectedTier, setSelectedTier] = useState<TicketTier>(tiers[0]);
  const [quantity, setQuantity] = useState(1);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'wave' | 'orange_money' | 'free_money' | 'card'>('wave');
  const [isProcessing, setIsProcessing] = useState(false);
  const [confirmation, setConfirmation] = useState<BookingConfirmation | null>(null);

  const totalAmount = selectedTier.price * quantity;
  const formattedTotal = new Intl.NumberFormat('fr-FR').format(totalAmount);

  const handleConfirmBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const result = await eventService.createBooking({
        eventId: event.id,
        tierId: selectedTier.id,
        quantity,
        customerName: customerName || 'Client SunuEvents',
        customerPhone: customerPhone || '+221 77 000 00 00',
        customerEmail: 'client@sunuevents.sn',
        paymentMethod,
      });

      // Trigger celebratory confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#F59E0B', '#10B981', '#6366F1', '#EC4899'],
      });

      setConfirmation(result);
      onBookingSuccess?.(result);
    } catch (error) {
      console.error('Booking failed', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    setConfirmation(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 transition-all">
        
        {/* Modal Header */}
        <div className="relative bg-[#0F141C] text-white p-5 sm:p-6 flex items-start justify-between">
          <div>
            <span className="inline-block px-2.5 py-0.5 bg-brand-500/20 text-brand-400 border border-brand-500/30 rounded-full text-[10px] font-bold uppercase tracking-wider mb-2">
              Billetterie Officielle
            </span>
            <h3 className="font-extrabold text-lg sm:text-xl leading-snug">
              {event.title}
            </h3>
            <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-brand-400" />
                {event.venue || event.location}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-brand-400" />
                {event.date}
              </span>
            </div>
          </div>

          <button
            onClick={handleClose}
            type="button"
            className="p-1.5 text-gray-400 hover:text-white rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Confirmation State */}
        {confirmation ? (
          <div className="p-6 sm:p-8 text-center space-y-5">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle className="w-10 h-10" />
            </div>

            <div>
              <h4 className="text-xl font-extrabold text-gray-900">
                Paiement Réussi !
              </h4>
              <p className="text-xs text-gray-500 mt-1">
                Votre billet électronique est prêt à être scanné à l'entrée.
              </p>
            </div>

            {/* Simulated Digital Ticket */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50/60 border border-amber-200/80 rounded-2xl p-4 text-left shadow-sm">
              <div className="flex items-center justify-between border-b border-amber-200/60 pb-3 mb-3">
                <div>
                  <span className="text-[10px] font-bold uppercase text-amber-800">
                    Billet #{confirmation.bookingId}
                  </span>
                  <div className="font-bold text-sm text-gray-900">{event.title}</div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-extrabold text-amber-700 bg-white px-2.5 py-1 rounded-full border border-amber-200">
                    {confirmation.tierName} x{confirmation.quantity}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-xs text-gray-600 space-y-1">
                  <div><strong>Lieu:</strong> {event.location}</div>
                  <div><strong>Date:</strong> {event.date}</div>
                  <div><strong>Montant payé:</strong> {new Intl.NumberFormat('fr-FR').format(confirmation.totalAmount)} F</div>
                </div>
                <img
                  src={confirmation.qrCodeUrl}
                  alt="Billet QR Code"
                  className="w-20 h-20 bg-white p-1 rounded-lg border border-amber-300 shadow-xs"
                />
              </div>
            </div>

            <button
              onClick={handleClose}
              type="button"
              className="w-full py-3 bg-[#0F141C] text-white text-xs font-bold rounded-full hover:bg-black transition-colors"
            >
              Terminer
            </button>
          </div>
        ) : (
          /* Booking Form */
          <form onSubmit={handleConfirmBooking} className="p-5 sm:p-6 space-y-5">
            
            {/* Step 1: Select Ticket Tier */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                1. Choisissez votre pass
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {tiers.map((tier) => {
                  const isSelected = selectedTier.id === tier.id;
                  return (
                    <div
                      key={tier.id}
                      onClick={() => setSelectedTier(tier)}
                      className={`
                        p-3 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between
                        ${
                          isSelected
                            ? 'border-brand-500 bg-brand-50/40 ring-1 ring-brand-500/20'
                            : 'border-gray-200 bg-white hover:border-gray-300'
                        }
                      `}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-gray-900">{tier.name}</span>
                        {isSelected && <CheckCircle className="w-4 h-4 text-brand-600" />}
                      </div>
                      <div className="mt-2 text-sm font-extrabold text-gray-900">
                        {new Intl.NumberFormat('fr-FR').format(tier.price)} F
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Quantity Selector */}
            <div className="flex items-center justify-between bg-gray-50 p-3.5 rounded-2xl border border-gray-200/80">
              <div>
                <span className="text-xs font-bold text-gray-900">Nombre de billets</span>
                <span className="text-[11px] text-gray-500 block">Maximum 10 par commande</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 rounded-full bg-white border border-gray-200 text-gray-700 font-bold hover:bg-gray-100 flex items-center justify-center"
                >
                  -
                </button>
                <span className="font-extrabold text-sm text-gray-900 w-4 text-center">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(Math.min(10, quantity + 1))}
                  className="w-8 h-8 rounded-full bg-white border border-gray-200 text-gray-700 font-bold hover:bg-gray-100 flex items-center justify-center"
                >
                  +
                </button>
              </div>
            </div>

            {/* Step 3: Payment Method Selection */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                2. Mode de paiement local
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('wave')}
                  className={`
                    p-3 rounded-2xl border-2 flex items-center gap-2.5 transition-all
                    ${
                      paymentMethod === 'wave'
                        ? 'border-blue-500 bg-blue-50/50 text-blue-900'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                    }
                  `}
                >
                  <span className="w-6 h-6 rounded-full bg-[#1AA9E8] text-white text-xs font-black flex items-center justify-center">
                    W
                  </span>
                  <span className="text-xs font-bold">Wave Sénégal</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('orange_money')}
                  className={`
                    p-3 rounded-2xl border-2 flex items-center gap-2.5 transition-all
                    ${
                      paymentMethod === 'orange_money'
                        ? 'border-orange-500 bg-orange-50/50 text-orange-900'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                    }
                  `}
                >
                  <span className="w-6 h-6 rounded-full bg-[#FF7900] text-white text-xs font-black flex items-center justify-center">
                    OM
                  </span>
                  <span className="text-xs font-bold">Orange Money</span>
                </button>
              </div>
            </div>

            {/* Customer Information Form */}
            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                  Nom et Prénom
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Ex: Cheikh Ndiaye"
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gray-900/20"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                  Numéro de téléphone (Wave / Orange Money)
                </label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="Ex: 77 123 45 67"
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gray-900/20"
                />
              </div>
            </div>

            {/* Total & Submit Button */}
            <div className="pt-3 border-t border-gray-100 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500 font-medium">Total à régler :</span>
                <span className="text-lg font-extrabold text-gray-900">
                  {formattedTotal} F
                </span>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-3.5 bg-[#0F141C] text-white text-xs sm:text-sm font-bold rounded-full hover:bg-black active:scale-98 transition-all flex items-center justify-center gap-2 shadow-lg shadow-gray-900/20 cursor-pointer disabled:opacity-50"
              >
                {isProcessing ? (
                  <span>Génération du ticket sécurisé...</span>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4 text-brand-400" />
                    <span>Payer {formattedTotal} F et Recevoir le Billet</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
