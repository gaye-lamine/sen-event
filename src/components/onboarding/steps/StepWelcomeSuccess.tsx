import React from 'react';
import {
  ArrowRight,
  Bell,
  CheckCircle2,
  Compass,
  QrCode,
  Ticket,
  User,
} from 'lucide-react';
import { OnboardingFormData } from '../../../types/onboarding';

export interface StepWelcomeSuccessProps {
  formData: OnboardingFormData;
  onNavigateHome: () => void;
  onOpenDashboard?: () => void;
}

export const StepWelcomeSuccess: React.FC<StepWelcomeSuccessProps> = ({
  formData,
  onNavigateHome,
  onOpenDashboard,
}) => {
  const displayName = formData.firstName || 'Aminata';
  const displayCity = formData.city || 'Dakar';

  return (
    <div className="space-y-6 text-center animate-in zoom-in-95 duration-500 max-w-xl mx-auto">
      {/* Grand bandeau sombre de confirmation */}
      <div className="bg-[#121526] text-white p-6 sm:p-8 rounded-3xl relative overflow-hidden shadow-lg">
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-brand-500 text-white flex items-center justify-center mb-4 shadow-md">
            <CheckCircle2 className="w-9 h-9 stroke-[2.5]" />
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Bienvenue, {displayName} !
          </h1>
          <p className="text-sm text-gray-300 mt-2 max-w-md">
            Ton compte Sunu Events est prêt. Prépare-toi à vivre les meilleurs évènements au Sénégal.
          </p>

          <div className="mt-5 w-full bg-white/10 backdrop-blur-md rounded-2xl p-4 flex items-center gap-4 text-left border border-white/10">
            <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-800 shrink-0 font-black text-lg">
              {displayName.charAt(0)}
            </div>
            <div>
              <p className="font-bold text-sm text-white">
                {displayName} {formData.lastName || 'Diop'}
              </p>
              <p className="text-xs text-gray-400">
                {displayCity}, Sénégal • Rôle :{' '}
                {formData.role === 'organizer' ? 'Organisateur' : 'Participant'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 3 Cartes de découverte rapides */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
        <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-2xs space-y-2">
          <div className="w-8 h-8 rounded-xl bg-orange-50 text-brand-500 flex items-center justify-center">
            <Compass className="w-4 h-4" />
          </div>
          <h4 className="font-bold text-xs text-gray-900">Explore & Réserve</h4>
          <p className="text-[11px] text-gray-500 leading-relaxed">
            Parcours les concerts, sports et festivals populaires.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-2xs space-y-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <QrCode className="w-4 h-4" />
          </div>
          <h4 className="font-bold text-xs text-gray-900">Billets QR instantanés</h4>
          <p className="text-[11px] text-gray-500 leading-relaxed">
            Accède à tes tickets hors ligne sur ton téléphone.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-2xs space-y-2">
          <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Bell className="w-4 h-4" />
          </div>
          <h4 className="font-bold text-xs text-gray-900">Alertes Rappels</h4>
          <p className="text-[11px] text-gray-500 leading-relaxed">
            Ne manque aucun évènement grâce aux notifications SMS/Email.
          </p>
        </div>
      </div>

      {/* Boutons d'action */}
      <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
        <button
          type="button"
          onClick={onNavigateHome}
          className="w-full sm:flex-1 py-3.5 px-6 rounded-full border border-gray-200 hover:bg-gray-50 font-bold text-xs text-gray-700 transition-all cursor-pointer"
        >
          Retour à l'accueil
        </button>

        <button
          type="button"
          onClick={onOpenDashboard || onNavigateHome}
          className="w-full sm:flex-1 py-3.5 px-6 rounded-full bg-[#121526] hover:bg-[#090B14] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all active:scale-98 cursor-pointer"
        >
          <span>Accéder à mon espace</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
