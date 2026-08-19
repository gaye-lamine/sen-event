import React from 'react';
import { X, ShoppingBag, ArrowRight, Trash2 } from 'lucide-react';
import { CartDrawerProps } from '../../types';

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onRemoveItem,
  onCheckout,
}) => {
  if (!isOpen) return null;

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const formattedTotal = new Intl.NumberFormat('fr-FR').format(total);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-slideInRight">
        
        {/* Drawer Header */}
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
            className="p-1.5 text-gray-400 hover:text-gray-900 rounded-full hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-gray-400">
              <ShoppingBag className="w-12 h-12 stroke-1 mb-2 text-gray-300" />
              <p className="text-sm font-medium">Votre panier est vide</p>
              <p className="text-xs text-gray-400 mt-1 max-w-[200px]">
                Choisissez un événement et réservez vos billets en 2 clics.
              </p>
            </div>
          ) : (
            items.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl border border-gray-100"
              >
                <img
                  src={item.event.image}
                  alt={item.event.title}
                  className="w-14 h-18 object-cover rounded-xl flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-xs text-gray-900 truncate">
                    {item.event.title}
                  </h4>
                  <p className="text-[11px] text-gray-500 truncate">{item.event.location}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs font-extrabold text-gray-900">
                      {new Intl.NumberFormat('fr-FR').format(item.price * item.quantity)} F
                    </span>
                    <span className="text-[10px] text-gray-500 bg-white px-2 py-0.5 rounded-full border border-gray-200">
                      Qté: {item.quantity}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => onRemoveItem(idx)}
                  type="button"
                  className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-white"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer Checkout */}
        {items.length > 0 && (
          <div className="p-5 border-t border-gray-100 bg-gray-50 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500 font-medium">Total commande :</span>
              <span className="text-lg font-extrabold text-gray-900">{formattedTotal} F</span>
            </div>
            <button
              onClick={onCheckout}
              type="button"
              className="w-full py-3 bg-[#0F141C] text-white text-xs font-bold rounded-full hover:bg-black flex items-center justify-center gap-2 shadow-md"
            >
              <span>Valider et Payer avec Wave / OM</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
