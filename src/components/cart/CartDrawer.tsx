import React from 'react';
import { X, ShoppingBag, ArrowRight, Trash2 } from 'lucide-react';
import { CartDrawerProps } from '../../types';
import { formatPrice } from '../../utils';

/**
 * @component CartDrawer
 * @description Tiroir latéral de gestion du panier avec liste des billets sélectionnés,
 * calcul dynamique du montant total et redirection vers le tunnel d'achat.
 * @param {CartDrawerProps} props - Contrat de propriétés du composant
 */
export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onRemoveItem,
  onCheckout,
}) => {
  if (!isOpen) return null;

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-slideInRight">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-gray-900" />
            <h3 className="font-extrabold text-base text-gray-900">Mon Panier</h3>
            <span className="px-2 py-0.5 bg-gray-100 rounded-full text-xs font-bold text-gray-600">
              {items.length}
            </span>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
            aria-label="Fermer le panier"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4 text-left">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-gray-400 py-12">
              <ShoppingBag className="w-12 h-12 stroke-1 mb-3 text-gray-300" />
              <p className="text-sm font-medium">Votre panier est vide</p>
              <p className="text-xs text-gray-400 mt-1">
                Explorez nos événements pour ajouter des billets.
              </p>
            </div>
          ) : (
            items.map((item, idx) => (
              <div
                key={`${item.event.id}-${item.tierName}-${idx}`}
                className="flex gap-3 p-3 bg-gray-50 rounded-2xl border border-gray-100 relative group"
              >
                <img
                  src={item.event.image}
                  alt={item.event.title}
                  className="w-16 h-16 rounded-xl object-cover"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-xs text-gray-900 truncate">
                    {item.event.title}
                  </h4>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    {item.tierName} × {item.quantity}
                  </p>
                  <p className="text-xs font-black text-gray-900 mt-1">
                    {formatPrice(item.price * item.quantity, item.event.currency)}
                  </p>
                </div>
                <button
                  onClick={() => onRemoveItem(idx)}
                  type="button"
                  className="text-gray-400 hover:text-red-500 p-1 self-start transition-colors"
                  aria-label="Supprimer du panier"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="p-5 border-t border-gray-100 bg-gray-50/50 space-y-3">
            <div className="flex justify-between items-center text-sm font-semibold text-gray-700">
              <span>Total estimé</span>
              <span className="font-black text-base text-gray-900">
                {formatPrice(total)}
              </span>
            </div>
            <button
              onClick={() => {
                onClose();
                onCheckout();
              }}
              type="button"
              className="w-full py-3.5 bg-[#0F141C] text-white font-bold text-xs sm:text-sm rounded-full hover:bg-black active:scale-98 transition-all flex items-center justify-center gap-2 shadow-lg"
            >
              <span>Passer la commande</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
