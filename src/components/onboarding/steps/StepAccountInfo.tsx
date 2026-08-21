import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Check, Eye, EyeOff } from 'lucide-react';
import { OnboardingFormData } from '../../../types/onboarding';

export interface StepAccountInfoProps {
  formData: OnboardingFormData;
  setFormData: React.Dispatch<React.SetStateAction<OnboardingFormData>>;
  onNext: () => void;
  onPrev: () => void;
}

export const StepAccountInfo: React.FC<StepAccountInfoProps> = ({
  formData,
  setFormData,
  onNext,
  onPrev,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Password rules validation
  const hasMinLength = formData.password.length >= 8;
  const hasUppercase = /[A-Z]/.test(formData.password);
  const hasNumber = /[0-9]/.test(formData.password);
  const hasSpecial = /[^A-Za-z0-9]/.test(formData.password);
  const strengthScore =
    [hasMinLength, hasUppercase, hasNumber, hasSpecial].filter(Boolean).length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      setErrorMsg('Veuillez renseigner votre prénom et nom.');
      return;
    }
    if (!formData.email.trim()) {
      setErrorMsg('Veuillez renseigner votre adresse email.');
      return;
    }
    if (!formData.phone.trim()) {
      setErrorMsg('Veuillez renseigner votre numéro de téléphone.');
      return;
    }
    if (formData.password.length < 8) {
      setErrorMsg('Le mot de passe doit comporter au moins 8 caractères.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setErrorMsg('Les mots de passe ne correspondent pas.');
      return;
    }
    if (!formData.acceptTerms) {
      setErrorMsg('Veuillez accepter les conditions générales d’utilisation.');
      return;
    }
    setErrorMsg('');
    onNext();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 text-left animate-in fade-in duration-300"
    >
      <div className="text-center">
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
          Créons ton compte
        </h1>
        <p className="text-sm text-gray-500 mt-2">
          Quelques informations pour démarrer.
        </p>
      </div>

      {errorMsg && (
        <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-semibold">
          {errorMsg}
        </div>
      )}

      {/* Prénom & Nom */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">
            Prénom
          </label>
          <input
            type="text"
            required
            value={formData.firstName}
            onChange={(e) =>
              setFormData((p) => ({ ...p, firstName: e.target.value }))
            }
            placeholder="Aminata"
            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:ring-1 focus:ring-gray-900 focus:outline-none transition-all"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">
            Nom
          </label>
          <input
            type="text"
            required
            value={formData.lastName}
            onChange={(e) =>
              setFormData((p) => ({ ...p, lastName: e.target.value }))
            }
            placeholder="Diop"
            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:ring-1 focus:ring-gray-900 focus:outline-none transition-all"
          />
        </div>
      </div>

      {/* Email */}
      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-1.5">
          Adresse email
        </label>
        <input
          type="email"
          required
          value={formData.email}
          onChange={(e) =>
            setFormData((p) => ({ ...p, email: e.target.value }))
          }
          placeholder="aminata.diop@email.com"
          className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:ring-1 focus:ring-gray-900 focus:outline-none transition-all"
        />
      </div>

      {/* Téléphone (+221) */}
      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-1.5">
          Numéro de téléphone
        </label>
        <div className="flex rounded-xl overflow-hidden border border-gray-200 focus-within:ring-1 focus-within:ring-gray-900 transition-all">
          <span className="inline-flex items-center px-4 bg-gray-50 text-gray-600 text-sm font-semibold border-r border-gray-200 select-none">
            +221
          </span>
          <input
            type="tel"
            required
            value={formData.phone}
            onChange={(e) =>
              setFormData((p) => ({ ...p, phone: e.target.value }))
            }
            placeholder="77 123 45 67"
            className="w-full px-4 py-3 bg-white text-sm focus:outline-none"
          />
        </div>
      </div>

      {/* Mot de passe */}
      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-1.5">
          Mot de passe
        </label>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            required
            value={formData.password}
            onChange={(e) =>
              setFormData((p) => ({ ...p, password: e.target.value }))
            }
            placeholder="••••••••••••"
            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:ring-1 focus:ring-gray-900 focus:outline-none pr-11 transition-all"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Jauge de complexité */}
        {formData.password && (
          <div className="mt-2.5 space-y-2">
            <div className="flex gap-1.5 h-1.5">
              {[1, 2, 3, 4].map((step) => (
                <div
                  key={step}
                  className={`flex-1 rounded-full transition-all ${
                    strengthScore >= step
                      ? strengthScore <= 2
                        ? 'bg-amber-400'
                        : 'bg-emerald-500'
                      : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
            <div className="grid grid-cols-2 gap-1.5 text-[11px] text-gray-500">
              <span className={hasMinLength ? 'text-emerald-600 font-medium' : ''}>
                ✓ 8 caractères min.
              </span>
              <span className={hasUppercase ? 'text-emerald-600 font-medium' : ''}>
                ✓ 1 majuscule
              </span>
              <span className={hasNumber ? 'text-emerald-600 font-medium' : ''}>
                ✓ 1 chiffre
              </span>
              <span className={hasSpecial ? 'text-emerald-600 font-medium' : ''}>
                ✓ 1 caractère spécial
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Mot de passe */}
      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-1.5">
          Confirmer le mot de passe
        </label>
        <div className="relative">
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            required
            value={formData.confirmPassword}
            onChange={(e) =>
              setFormData((p) => ({ ...p, confirmPassword: e.target.value }))
            }
            placeholder="••••••••••••"
            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:ring-1 focus:ring-gray-900 focus:outline-none pr-11 transition-all"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showConfirmPassword ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Conditions Générales */}
      <div className="flex items-start gap-3 pt-1">
        <input
          type="checkbox"
          id="terms"
          checked={formData.acceptTerms}
          onChange={(e) =>
            setFormData((p) => ({ ...p, acceptTerms: e.target.checked }))
          }
          className="mt-1 w-4 h-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900 cursor-pointer"
        />
        <label htmlFor="terms" className="text-xs text-gray-500 leading-relaxed">
          J'accepte les{' '}
          <span className="font-semibold text-gray-800 underline cursor-pointer">
            Conditions Générales d'Utilisation
          </span>{' '}
          et la{' '}
          <span className="font-semibold text-gray-800 underline cursor-pointer">
            Politique de Confidentialité
          </span>{' '}
          de Sunu Events.
        </label>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-3">
        <button
          type="button"
          onClick={onPrev}
          className="w-12 h-12 rounded-full border border-gray-200 hover:bg-gray-50 flex items-center justify-center text-gray-600 shrink-0 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <button
          type="submit"
          className="flex-1 py-3.5 px-6 rounded-full bg-[#121526] hover:bg-[#090B14] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-all active:scale-98 cursor-pointer"
        >
          <span>Continuer</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </form>
  );
};
