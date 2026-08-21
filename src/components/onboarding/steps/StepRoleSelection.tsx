import React from 'react';
import { ArrowRight, Ticket, Users } from 'lucide-react';
import { OnboardingFormData } from '../../../types/onboarding';

export interface StepRoleSelectionProps {
  formData: OnboardingFormData;
  setFormData: React.Dispatch<React.SetStateAction<OnboardingFormData>>;
  onNext: () => void;
  onNavigateLogin?: () => void;
}

export const StepRoleSelection: React.FC<StepRoleSelectionProps> = ({
  formData,
  setFormData,
  onNext,
  onNavigateLogin,
}) => {
  return (
    <div className="space-y-6 text-center animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
          Bienvenue sur Sunu Events
        </h1>
        <p className="text-sm text-gray-500 mt-2">
          Comment souhaites-tu utiliser la plateforme ?
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left pt-2">
        {/* Carte 1 : Je découvre des évènements */}
        <div
          onClick={() => setFormData((prev) => ({ ...prev, role: 'attendee' }))}
          className={`p-6 rounded-2xl border-2 transition-all cursor-pointer relative flex flex-col justify-between ${
            formData.role === 'attendee'
              ? 'border-gray-900 bg-white shadow-md ring-1 ring-gray-900/5'
              : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-xs'
          }`}
        >
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-xl bg-orange-50 text-brand-500 flex items-center justify-center">
              <Ticket className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-gray-900 text-base">
              Je découvre des évènements
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Achète tes billets en quelques clics via Wave ou Orange Money, reçois tes QR codes instantanément.
            </p>
          </div>
          <div className="mt-6 flex items-center justify-end">
            <div
              className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                formData.role === 'attendee'
                  ? 'border-gray-900 bg-gray-900'
                  : 'border-gray-300'
              }`}
            >
              {formData.role === 'attendee' && (
                <div className="w-2 h-2 rounded-full bg-white" />
              )}
            </div>
          </div>
        </div>

        {/* Carte 2 : J'organise des évènements */}
        <div
          onClick={() => setFormData((prev) => ({ ...prev, role: 'organizer' }))}
          className={`p-6 rounded-2xl border-2 transition-all cursor-pointer relative flex flex-col justify-between ${
            formData.role === 'organizer'
              ? 'border-gray-900 bg-white shadow-md ring-1 ring-gray-900/5'
              : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-xs'
          }`}
        >
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-gray-900 text-base">
              J'organise des évènements
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Crée ta billetterie en 5 minutes, scanne à l'entrée avec ton téléphone et reçois tes fonds directement.
            </p>
          </div>
          <div className="mt-6 flex items-center justify-end">
            <div
              className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                formData.role === 'organizer'
                  ? 'border-gray-900 bg-gray-900'
                  : 'border-gray-300'
              }`}
            >
              {formData.role === 'organizer' && (
                <div className="w-2 h-2 rounded-full bg-white" />
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="pt-4">
        <button
          type="button"
          onClick={onNext}
          className="w-full py-3.5 px-6 rounded-full bg-[#12142B] hover:bg-[#0A0C1B] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-all active:scale-98 cursor-pointer"
        >
          <span>Continuer</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {onNavigateLogin && (
        <p className="text-xs text-gray-500 pt-2">
          Tu as déjà un compte ?{' '}
          <button
            type="button"
            onClick={onNavigateLogin}
            className="font-bold text-gray-900 hover:underline cursor-pointer"
          >
            Se connecter
          </button>
        </p>
      )}
    </div>
  );
};
