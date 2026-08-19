import React from 'react';
import { Calendar, MapPin, ShieldCheck } from 'lucide-react';
import { OrderSummaryCardProps } from '../../types';
import { formatPrice } from '../../utils';
import { CHECKOUT_CONSTANTS } from '../../constants';

/**
 * @component OrderSummaryCard
 * @description Carte récapitulative taillée en forme de billet de concert avec encoches latérales,
 * détail des tarifs par palier, calcul des frais de service et montant global.
 * @param {OrderSummaryCardProps} props - Contrat de propriétés du composant
 */
export const OrderSummaryCard: React.FC<OrderSummaryCardProps> = ({
  event,
  tiers,
  quantities,
  onModifyTickets,
}) => {
  const selectedItems = tiers.filter((t) => (quantities[t.id] || 0) > 0);
  const totalTickets = Object.values(quantities).reduce((acc, q) => acc + q, 0);
  
  const subtotal = tiers.reduce((acc, tier) => {
    const qty = quantities[tier.id] || 0;
    return acc + tier.price * qty;
  }, 0);

  const serviceFees = totalTickets > 0 ? CHECKOUT_CONSTANTS.SERVICE_FEE : 0;
  const grandTotal = subtotal + serviceFees;

  return (
    <div className="relative bg-white rounded-3xl sm:rounded-[32px] border border-gray-100/90 shadow-sm p-6 sm:p-7 text-left overflow-hidden">
      <div className="flex items-start gap-3.5 pb-5 border-b border-gray-100">
        <img
          src={event.image}
          alt={event.title}
          className="w-12 h-12 rounded-xl object-cover flex-shrink-0 shadow-xs border border-gray-100"
        />
        <div className="flex-1 min-w-0">
          <h3 className="font-extrabold text-sm text-gray-900 truncate leading-snug">
            {event.title}
          </h3>
          <div className="flex items-center gap-1 text-[11px] text-gray-400 mt-1">
            <Calendar className="w-3 h-3 text-gray-400 flex-shrink-0" />
            <span className="truncate">{event.date}</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-gray-400 mt-0.5">
            <MapPin className="w-3 h-3 text-gray-400 flex-shrink-0" />
            <span className="truncate">{event.location}</span>
          </div>
        </div>
      </div>

      <div className="py-4 space-y-2.5">
        {selectedItems.length > 0 ? (
          selectedItems.map((tier) => {
            const qty = quantities[tier.id] || 0;
            const lineTotal = tier.price * qty;

            return (
              <div key={tier.id} className="flex justify-between items-center text-xs">
                <span className="text-gray-700">
                  <span className="font-medium">{tier.name}</span>
                  <span className="text-gray-400 mx-1">×</span>
                  <strong className="font-bold text-gray-900">{qty}</strong>
                </span>
                <span className="font-bold text-gray-900">
                  {formatPrice(lineTotal, event.currency)}
                </span>
              </div>
            );
          })
        ) : (
          <div className="text-xs text-gray-400 italic py-1">
            Aucun billet sélectionné
          </div>
        )}
      </div>

      <div className="relative my-3">
        <div className="absolute -left-9 -top-3 w-6 h-6 rounded-full bg-[#F9FAFB] border-r border-gray-100" />
        <div className="absolute -right-9 -top-3 w-6 h-6 rounded-full bg-[#F9FAFB] border-l border-gray-100" />
        <div className="w-full border-t border-dashed border-gray-200" />
      </div>

      <div className="pt-2 pb-4 space-y-2 text-xs">
        <div className="flex justify-between items-center text-gray-500">
          <span>Sous-total</span>
          <span className="font-semibold text-gray-800">
            {formatPrice(subtotal, event.currency)}
          </span>
        </div>
        <div className="flex justify-between items-center text-gray-500">
          <span>Frais de service</span>
          <span className="font-semibold text-gray-800">
            {formatPrice(serviceFees, event.currency)}
          </span>
        </div>

        <div className="flex justify-between items-center pt-3 border-t border-gray-100 text-sm font-extrabold text-gray-900">
          <span>Total</span>
          <span className="text-base font-black">
            {formatPrice(grandTotal, event.currency)}
          </span>
        </div>
      </div>

      <div className="pt-2 pb-3 flex items-center justify-between text-xs">
        <span className="text-gray-500">
          {totalTickets} {totalTickets > 1 ? 'billets sélectionnés' : 'billet sélectionné'}
        </span>
        {onModifyTickets && (
          <button
            onClick={onModifyTickets}
            type="button"
            className="text-[#FF4747] hover:underline font-bold text-xs cursor-pointer"
          >
            Modifier
          </button>
        )}
      </div>

      <div className="mt-2 pt-3 border-t border-gray-100 text-center flex items-center justify-center gap-1.5 text-[10px] text-gray-400">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
        <span>Paiement sécurisé • Wave • Orange Money • CB</span>
      </div>
    </div>
  );
};
