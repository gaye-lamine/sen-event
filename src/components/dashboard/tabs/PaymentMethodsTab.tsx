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
      {/* 1. Titre & Sous-titre */}
      <DashboardSectionHeader
        title="Moyens de paiement"
        subtitle="Gère tes méthodes de paiement enregistrées pour des achats plus rapides."
      />

      {/* 2. Liste des Cartes de Moyens de Paiement */}
      <div className="space-y-4">
        {paymentMethods.map((method) => {
          return (
            <div
              key={method.id}
              className="bg-white border border-gray-200/80 rounded-[20px] p-5 sm:p-6 flex items-center justify-between shadow-2xs hover:shadow-xs transition-shadow"
            >
              <div className="flex items-center gap-4">
                {/* Icône Wave */}
                {method.type === 'wave' && (
                  <div className="w-12 h-12 rounded-2xl bg-[#1DC4FF] flex items-center justify-center shrink-0 shadow-2xs overflow-hidden p-2">
                    <img
                      src="/images/wave.png"
                      alt="Wave"
                      className="w-full h-full object-contain"
                    />
                  </div>
                )}

                {/* Icône Orange Money (sur fond blanc / logo direct) */}
                {method.type === 'om' && (
                  <div className="w-12 h-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center shrink-0 shadow-2xs overflow-hidden p-1.5">
                    <img
                      src="/images/orange-money.png"
                      alt="Orange Money"
                      className="w-full h-full object-contain"
                    />
                  </div>
                )}

                {/* Icône Carte Visa (Cercle sombre #12142B) */}
                {method.type === 'card' && (
                  <div className="w-12 h-12 rounded-full bg-[#12142B] text-white flex items-center justify-center shrink-0 shadow-xs">
                    <CreditCard className="w-5 h-5" />
                  </div>
                )}

                <div>
                  <h4 className="font-bold text-sm sm:text-base text-[#12142B]">
                    {method.title}
                  </h4>
                  <p className="text-xs text-gray-400 font-medium mt-0.5">
                    {method.detail}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* Badge Par défaut */}
                {method.isDefault ? (
                  <span className="bg-[#ECFDF5] text-[#0D9488] font-bold text-[11px] px-3.5 py-1.5 rounded-full whitespace-nowrap">
                    Par défaut
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => onSetDefaultPayment(method.id)}
                    className="px-5 py-2 rounded-full border border-gray-200 hover:bg-gray-50 text-xs font-bold text-[#12142B] transition-all cursor-pointer whitespace-nowrap"
                  >
                    Définir par défaut
                  </button>
                )}

                {/* Bouton Modifier */}
                {method.isDefault && (
                  <button
                    type="button"
                    onClick={() =>
                      onModifyPayment
                        ? onModifyPayment(method)
                        : alert(`Modification du compte ${method.title}`)
                    }
                    className="px-5 py-2 rounded-full border border-gray-200 hover:bg-gray-50 text-xs font-bold text-[#12142B] transition-all cursor-pointer"
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
                    className="px-5 py-2 rounded-full border border-gray-200 hover:bg-gray-50 text-xs font-bold text-[#12142B] transition-all cursor-pointer"
                  >
                    Modifier
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {/* 3. Bouton Ajouter un moyen de paiement (Bordure pointillée) */}
        <button
          type="button"
          onClick={() =>
            onAddPaymentMethod
              ? onAddPaymentMethod()
              : alert('Ajouter une méthode de paiement (Wave, OM ou Carte)')
          }
          className="w-full py-4 rounded-[20px] border border-dashed border-gray-300 hover:border-gray-400 bg-white/60 hover:bg-white text-center text-xs sm:text-sm font-semibold text-gray-500 hover:text-gray-800 transition-all cursor-pointer shadow-2xs flex items-center justify-center gap-1.5"
        >
          <span>+ Ajouter un moyen de paiement</span>
        </button>
      </div>

      {/* 4. Note de Sécurité Certifiée PCI-DSS */}
      <div className="pt-2 flex items-center gap-3 text-left">
        <div className="w-8 h-8 rounded-xl bg-[#F0FDF4] border border-[#DCFCE7] text-[#16A34A] flex items-center justify-center shrink-0 shadow-2xs">
          <ShieldCheck className="w-4 h-4" />
        </div>
        <p className="text-xs text-gray-500 leading-relaxed font-medium">
          Sunu Events ne stocke aucune donnée bancaire — tout est géré par nos partenaires certifiés PCI-DSS.
        </p>
      </div>
    </div>
  );
};
