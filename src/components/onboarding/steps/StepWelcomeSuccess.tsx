import React from 'react';
import {
  ArrowRight,
  Bell,
  Check,
  Compass,
  User,
  Users,
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
  const displayLastName = formData.lastName || 'Diop';
  const displayEmail = formData.email || 'aminata.diop@email.com';
  const displayCity = formData.city || 'Dakar';
  const roleLabel =
    formData.role === 'organizer'
      ? `ORGANISATEUR - ${displayCity.toUpperCase()}`
      : `ACHETEUR - ${displayCity.toUpperCase()}`;

  return (
    <div className="w-full flex flex-col items-center animate-in fade-in duration-300">
      {/* 1. GRAND BANDEAU SOMBRE SUPÉRIEUR (#12142B) */}
      <div className="bg-[#12142B] w-full py-12 sm:py-14 px-4 text-center text-white shadow-sm">
        <div className="max-w-xl mx-auto flex flex-col items-center">
          {/* Coche dégradée #FF5A36 -> #FFC23C */}
          <div
            className="w-13 h-13 sm:w-14 sm:h-14 rounded-full text-white flex items-center justify-center mb-4"
            style={{
              background: 'linear-gradient(135deg, #FF5A36 0%, #FFC23C 100%)',
              boxShadow: '0px 10px 30px 0px rgba(18, 20, 43, 0.08)',
            }}
          >
            <Check className="w-7 h-7 stroke-[3]" />
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Bienvenue, {displayName} !
          </h1>
          <p className="text-xs sm:text-sm text-gray-300 mt-2 max-w-md mx-auto leading-relaxed">
            Ton compte est prêt. Direction les meilleurs évènements du Sénégal.
          </p>
        </div>
      </div>

      {/* 2. CONTENU PRINCIPAL : CARTES EMPILÉES */}
      <div className="w-full max-w-xl px-4 sm:px-6 py-8 space-y-4">
        {/* CARTE PROFIL UTILISATEUR */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-100 shadow-sm flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 sm:gap-4">
            <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-full overflow-hidden bg-amber-100 flex items-center justify-center text-amber-800 shrink-0 font-bold border border-gray-100 shadow-2xs">
              <img
                src="/images/wally.png"
                alt={displayName}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <User className="w-6 h-6 text-amber-800" />
            </div>
            <div className="text-left">
              <h3 className="font-bold text-sm sm:text-base text-[#111827]">
                {displayName} {displayLastName}
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                {displayEmail}
              </p>
            </div>
          </div>

          {/* Badge Rôle & Ville */}
          <span className="px-3 py-1 rounded-full bg-[#FFF1EE] text-[#E64A19] text-[10px] sm:text-[11px] font-extrabold tracking-wide uppercase whitespace-nowrap">
            {roleLabel}
          </span>
        </div>

        {/* 3 CARTES HORIZONTALES EMPILÉES */}
        {/* Ligne 1 : Découvre des évènements */}
        <div className="bg-[#F9FAFB] rounded-2xl p-4 sm:p-5 flex items-center gap-4 text-left border border-gray-100/80 shadow-2xs">
          <div className="w-9 h-9 rounded-xl bg-[#F0FDFA] text-[#0D9488] flex items-center justify-center shrink-0">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold text-xs sm:text-sm text-[#111827]">
              Découvre des évènements près de toi
            </h4>
            <p className="text-xs text-gray-500 mt-0.5">
              Sélection personnalisée selon tes goûts et {displayCity}
            </p>
          </div>
        </div>

        {/* Ligne 2 : Active les alertes */}
        <div className="bg-[#F9FAFB] rounded-2xl p-4 sm:p-5 flex items-center gap-4 text-left border border-gray-100/80 shadow-2xs">
          <div className="w-9 h-9 rounded-xl bg-[#F0FDFA] text-[#0D9488] flex items-center justify-center shrink-0">
            <Bell className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold text-xs sm:text-sm text-[#111827]">
              Active les alertes
            </h4>
            <p className="text-xs text-gray-500 mt-0.5">
              Sois prévenu(e) dès qu'un artiste ou une équipe que tu suis programme une date
            </p>
          </div>
        </div>

        {/* Ligne 3 : Invite tes amis */}
        <div className="bg-[#F9FAFB] rounded-2xl p-4 sm:p-5 flex items-center gap-4 text-left border border-gray-100/80 shadow-2xs">
          <div className="w-9 h-9 rounded-xl bg-[#F0FDFA] text-[#0D9488] flex items-center justify-center shrink-0">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold text-xs sm:text-sm text-[#111827]">
              Invite tes amis
            </h4>
            <p className="text-xs text-gray-500 mt-0.5">
              Partage tes évènements favoris et sortez ensemble
            </p>
          </div>
        </div>

        {/* 3. BOUTONS D'ACTION INFÉRIEURS */}
        <div className="flex items-center justify-center gap-4 pt-4">
          <button
            type="button"
            onClick={onNavigateHome}
            className="px-6 py-3 rounded-full border border-gray-200 hover:bg-gray-50 font-bold text-xs text-gray-700 transition-all cursor-pointer shadow-2xs"
          >
            Retour à l'accueil
          </button>

          <button
            type="button"
            onClick={onOpenDashboard || onNavigateHome}
            className="px-7 py-3 rounded-full bg-[#12142B] hover:bg-[#0A0C1B] text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-all active:scale-95 cursor-pointer"
          >
            <span>Accéder à mon espace</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
