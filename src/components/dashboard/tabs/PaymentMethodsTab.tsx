import React from 'react';
import { CreditCard, ShieldCheck } from 'lucide-react';
import { PaymentMethod } from '../../../types/dashboard';
import { DashboardSectionHeader } from '../ui/DashboardSectionHeader';

export interface PaymentMethodsTabProps {
  paymentMethods: PaymentMethod[];
  onSetDefaultPayment: (id: string) => void;
  onModifyPayment?: (method: PaymentMethod) => void;
  onAddPaymentMethod?: () => void;
}

export const PaymentMethodsTab: React.FC<PaymentMethodsTabProps> = ({
  paymentMethods,
  onSetDefaultPayment,
  onModifyPayment,
  onAddPaymentMethod,
}) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-200 text-left">
      <DashboardSectionHeader
        title="Moyens de paiement"
        subtitle="Gère tes méthodes de paiement enregistrées pour des achats plus rapides."
      />

      {/* Liste des Cartes de Moyens de Paiement */}
      <div className="space-y-4">
        {paymentMethods.map((method) => {
          return (
            <div
              key={method.id}
              className="bg-white border border-gray-200/80 rounded-2xl p-4 sm:p-5 flex items-center justify-between shadow-2xs hover:shadow-xs transition-shadow"
            >
              <div className="flex items-center gap-3.5 sm:gap-4">
                {method.type === 'wave' && (
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#1DC4FF] flex items-center justify-center shrink-0 shadow-xs">
                    <span className="text-white text-lg font-black select-none">
                      🐧
                    </span>
                  </div>
                )}

                {method.type === 'om' && (
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-black flex items-center justify-center shrink-0 shadow-xs p-1">
                    <span className="text-[#FF7900] font-black text-xs">
                      OM
                    </span>
                  </div>
                )}

                {method.type === 'card' && (
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#0F172A] text-white flex items-center justify-center shrink-0 shadow-xs">
                    <CreditCard className="w-5 h-5" />
                  </div>
                )}

                <div>
                  <h4 className="font-bold text-sm sm:text-base text-[#111827]">
                    {method.title}
                  </h4>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {method.detail}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {method.isDefault ? (
                  <span className="bg-[#ECFDF5] text-[#10B981] font-bold text-[11px] px-2.5 py-1 rounded-full whitespace-nowrap">
                    Par défaut
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => onSetDefaultPayment(method.id)}
                    className="px-4 py-1.5 rounded-full border border-gray-200 hover:bg-gray-50 text-xs font-semibold text-gray-800 transition-all cursor-pointer whitespace-nowrap"
                  >
                    Définir par défaut
                  </button>
                )}

                {method.isDefault && (
                  <button
                    type="button"
                    onClick={() =>
                      onModifyPayment
                        ? onModifyPayment(method)
                        : alert(`Modification du compte ${method.title}`)
                    }
                    className="px-4 py-1.5 rounded-full border border-gray-200 hover:bg-gray-50 text-xs font-semibold text-gray-800 transition-all cursor-pointer"
                  >
                    Modifier
                  </button>
                )}

                {!method.isDefault && method.type === 'card' && (
                  <button
                    type="button"
                    onClick={() =>
                      onModifyPayment
                        ? onModifyPayment(method)
                        : alert(`Modification de la carte ${method.title}`)
                    }
                    className="px-4 py-1.5 rounded-full border border-gray-200 hover:bg-gray-50 text-xs font-semibold text-gray-800 transition-all cursor-pointer"
                  >
                    Modifier
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {/* Bouton Ajouter un moyen de paiement */}
        <button
          type="button"
          onClick={() =>
            onAddPaymentMethod
              ? onAddPaymentMethod()
              : alert('Ajouter une méthode de paiement (Wave, OM ou Carte)')
          }
          className="w-full py-3.5 rounded-2xl border border-dashed border-gray-300 hover:border-gray-400 bg-white/60 hover:bg-white text-center text-xs sm:text-sm font-semibold text-gray-600 hover:text-gray-900 transition-all cursor-pointer shadow-2xs flex items-center justify-center gap-1.5"
        >
          <span>+ Ajouter un moyen de paiement</span>
        </button>
      </div>

      {/* Note de Sécurité Certifiée PCI-DSS */}
      <div className="pt-2 flex items-center gap-3 text-left">
        <div className="w-6 h-6 rounded-lg bg-[#ECFDF5] text-[#10B981] flex items-center justify-center shrink-0">
          <ShieldCheck className="w-4 h-4" />
        </div>
        <p className="text-xs text-gray-500 leading-relaxed">
          Sunu Events ne stocke aucune donnée bancaire — tout est géré par nos partenaires certifiés PCI-DSS.
        </p>
      </div>
    </div>
  );
};
