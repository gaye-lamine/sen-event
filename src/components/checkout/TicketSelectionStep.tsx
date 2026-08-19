import React from 'react';
import { Minus, Plus, ArrowRight, X } from 'lucide-react';
import { EventItem, TicketTier } from '../../types';

interface TicketSelectionStepProps {
  event: EventItem;
  tiers: TicketTier[];
  quantities: Record<string, number>;
  onUpdateQuantity: (tierId: string, delta: number) => void;
  onContinue: () => void;
}

export const TicketSelectionStep: React.FC<TicketSelectionStepProps> = ({
  event,
  tiers,
  quantities,
  onUpdateQuantity,
  onContinue,
}) => {
  const totalTickets = Object.values(quantities).reduce((acc, q) => acc + q, 0);

  return (
    <div className="bg-white rounded-3xl sm:rounded-[32px] p-6 sm:p-8 lg:p-10 border border-gray-100/90 shadow-sm text-left">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
          Choisis tes billets
        </h1>
        <p className="text-xs sm:text-sm text-gray-400 mt-1">
          Modifie les quantités si besoin, tout est encore modifiable.
        </p>
      </div>

      {/* Ticket Tiers List */}
      <div className="space-y-3.5 sm:space-y-4 mb-8">
        {tiers.map((tier) => {
          const qty = quantities[tier.id] || 0;
          const isSoldOut = tier.isSoldOut || !tier.available;

          return (
            <div
              key={tier.id}
              className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                isSoldOut
                  ? 'bg-gray-50/50 border-gray-100 opacity-60'
                  : qty > 0
                  ? 'bg-white border-gray-900/40 ring-1 ring-gray-900/10 shadow-xs'
                  : 'bg-white border-gray-200/80 hover:border-gray-300'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm sm:text-base text-gray-900">
                      {tier.name}
                    </h3>
                  </div>
                  {tier.description && (
                    <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">
                      {tier.description}
                    </p>
                  )}
                  <div className="font-extrabold text-sm sm:text-base text-gray-900 mt-2">
                    {new Intl.NumberFormat('fr-FR').format(tier.price)} {event.currency || 'F'}
                  </div>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center self-center flex-shrink-0">
                  {isSoldOut ? (
                    <span className="text-xs font-medium text-gray-400 flex items-center gap-1">
                      <X className="w-3.5 h-3.5 text-gray-400" /> Épuisé
                    </span>
                  ) : (
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => onUpdateQuantity(tier.id, -1)}
                        disabled={qty === 0}
                        type="button"
                        className="w-8 h-8 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
                        aria-label="Diminuer"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-sm font-bold text-gray-900 w-5 text-center">
                        {qty}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(tier.id, 1)}
                        type="button"
                        className="w-8 h-8 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-600 hover:bg-gray-100 active:scale-95 transition-all cursor-pointer"
                        aria-label="Augmenter"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Action Row */}
      <div className="flex justify-end pt-2">
        <button
          onClick={onContinue}
          disabled={totalTickets === 0}
          type="button"
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#0F141C] text-white text-xs sm:text-sm font-bold rounded-full hover:bg-black disabled:opacity-40 disabled:cursor-not-allowed active:scale-98 transition-all shadow-md cursor-pointer"
        >
          <span>Continuer</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
