import React from 'react';
import { User, Phone, Mail, ArrowRight, ArrowLeft } from 'lucide-react';

interface CustomerInfoStepProps {
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  onChangeName: (value: string) => void;
  onChangePhone: (value: string) => void;
  onChangeEmail: (value: string) => void;
  onBack: () => void;
  onContinue: () => void;
}

export const CustomerInfoStep: React.FC<CustomerInfoStepProps> = ({
  customerName,
  customerPhone,
  customerEmail,
  onChangeName,
  onChangePhone,
  onChangeEmail,
  onBack,
  onContinue,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customerName.trim() && customerPhone.trim() && customerEmail.trim()) {
      onContinue();
    }
  };

  return (
    <div className="bg-white rounded-3xl sm:rounded-[32px] p-6 sm:p-8 lg:p-10 border border-gray-100/90 shadow-sm text-left">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
          Vos informations
        </h1>
        <p className="text-xs sm:text-sm text-gray-400 mt-1">
          Ces coordonnées serviront à l'envoi de vos billets électroniques sécurisés.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Nom & Prénom */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">
            Nom complet
          </label>
          <div className="relative">
            <User className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              required
              value={customerName}
              onChange={(e) => onChangeName(e.target.value)}
              placeholder="Ex: Moussa Diop"
              className="w-full pl-11 pr-4 py-3 bg-gray-50/70 border border-gray-200 rounded-2xl text-xs sm:text-sm focus:bg-white focus:ring-2 focus:ring-gray-900 focus:outline-none transition-all"
            />
          </div>
        </div>

        {/* Numéro de téléphone */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">
            Numéro de téléphone (Wave / Orange Money)
          </label>
          <div className="relative">
            <Phone className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="tel"
              required
              value={customerPhone}
              onChange={(e) => onChangePhone(e.target.value)}
              placeholder="77 000 00 00"
              className="w-full pl-11 pr-4 py-3 bg-gray-50/70 border border-gray-200 rounded-2xl text-xs sm:text-sm focus:bg-white focus:ring-2 focus:ring-gray-900 focus:outline-none transition-all"
            />
          </div>
        </div>

        {/* Adresse e-mail */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">
            Adresse email
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              required
              value={customerEmail}
              onChange={(e) => onChangeEmail(e.target.value)}
              placeholder="moussa.diop@exemple.sn"
              className="w-full pl-11 pr-4 py-3 bg-gray-50/70 border border-gray-200 rounded-2xl text-xs sm:text-sm focus:bg-white focus:ring-2 focus:ring-gray-900 focus:outline-none transition-all"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-100 mt-6">
          <button
            onClick={onBack}
            type="button"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 text-xs font-semibold text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour</span>
          </button>

          <button
            type="submit"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#0F141C] text-white text-xs sm:text-sm font-bold rounded-full hover:bg-black active:scale-98 transition-all shadow-md cursor-pointer"
          >
            <span>Continuer</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};
