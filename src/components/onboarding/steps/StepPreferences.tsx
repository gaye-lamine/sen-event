import React from 'react';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { OnboardingFormData } from '../../../types/onboarding';
import {
  ONBOARDING_CATEGORIES,
  SENEGAL_CITIES,
} from '../../../data/onboardingData';

export interface StepPreferencesProps {
  formData: OnboardingFormData;
  setFormData: React.Dispatch<React.SetStateAction<OnboardingFormData>>;
  onNext: () => void;
  onPrev: () => void;
}

export const StepPreferences: React.FC<StepPreferencesProps> = ({
  formData,
  setFormData,
  onNext,
  onPrev,
}) => {
  const toggleCategory = (catId: string) => {
    setFormData((prev) => {
      const exists = prev.selectedCategories.includes(catId);
      return {
        ...prev,
        selectedCategories: exists
          ? prev.selectedCategories.filter((id) => id !== catId)
          : [...prev.selectedCategories, catId],
      };
    });
  };

  const isComplete = formData.selectedCategories.length >= 3;

  return (
    <div className="space-y-6 text-center animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
          Qu'est-ce qui te fait vibrer ?
        </h1>
        <p className="text-sm text-gray-500 mt-2">
          Sélectionne au moins 3 types d'évènements pour personnaliser tes recommandations.
        </p>
      </div>

      {/* Grille des badges catégories */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-2">
        {ONBOARDING_CATEGORIES.map((cat) => {
          const isSelected = formData.selectedCategories.includes(cat.id);
          const Icon = cat.icon;

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => toggleCategory(cat.id)}
              className={`p-4 rounded-2xl border-2 flex flex-col items-center justify-center gap-2.5 transition-all cursor-pointer ${
                isSelected
                  ? 'border-gray-900 bg-gray-900 text-white shadow-xs'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <Icon
                className={`w-6 h-6 ${
                  isSelected ? 'text-white' : 'text-gray-600'
                }`}
              />
              <span className="text-xs font-bold">{cat.label}</span>
              {isSelected && (
                <div className="w-4 h-4 rounded-full bg-white text-gray-900 flex items-center justify-center -mt-1">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </div>
              )}
            </button>
          );
        })}
      </div>

      <div className="text-xs text-gray-400 font-medium">
        {formData.selectedCategories.length} / 3 minimum sélectionnées
      </div>

      {/* Ville principale */}
      <div className="text-left bg-gray-50 p-4 rounded-2xl border border-gray-100 space-y-2">
        <label className="block text-xs font-bold text-gray-800">
          Ta ville principale au Sénégal
        </label>
        <select
          value={formData.city}
          onChange={(e) =>
            setFormData((p) => ({ ...p, city: e.target.value }))
          }
          className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-900 focus:ring-1 focus:ring-gray-900 outline-none"
        >
          {SENEGAL_CITIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-2">
        <button
          type="button"
          onClick={onPrev}
          className="w-12 h-12 rounded-full border border-gray-200 hover:bg-gray-50 flex items-center justify-center text-gray-600 shrink-0 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <button
          type="button"
          disabled={!isComplete}
          onClick={onNext}
          className={`flex-1 py-3.5 px-6 rounded-full font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-all ${
            isComplete
              ? 'bg-[#121526] hover:bg-[#090B14] text-white active:scale-98 cursor-pointer'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          <span>Terminer l'inscription</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
