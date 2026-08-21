import React, { useState } from 'react';
import {
  ArrowRight,
  ChevronDown,
  Clapperboard,
  GraduationCap,
  Loader2,
  Moon,
  Music,
  Presentation,
  Smile,
  Sparkles,
  Trophy,
} from 'lucide-react';
import { OnboardingFormData } from '../../../types/onboarding';
import { SENEGAL_CITIES } from '../../../data/onboardingData';
import { authService } from '../../../services/api/authService';

export interface StepPreferencesProps {
  formData: OnboardingFormData;
  setFormData: React.Dispatch<React.SetStateAction<OnboardingFormData>>;
  onNext: () => void;
  onPrev: () => void;
}

const CATEGORIES = [
  { id: 'concert', label: 'Concert', icon: Music },
  { id: 'humour', label: 'Humour', icon: Smile },
  { id: 'soiree', label: 'Soirée', icon: Moon },
  { id: 'formation', label: 'Formation', icon: GraduationCap },
  { id: 'festival', label: 'Festival', icon: Sparkles },
  { id: 'conference', label: 'Conférence', icon: Presentation },
  { id: 'theatre', label: 'Théâtre', icon: Clapperboard },
  { id: 'sport', label: 'Sport', icon: Trophy },
];

export const StepPreferences: React.FC<StepPreferencesProps> = ({
  formData,
  setFormData,
  onNext,
  onPrev,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

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

  const count = formData.selectedCategories.length;
  const isComplete = count >= 3;

  const handleFinish = async () => {
    if (!isComplete) return;
    setIsSubmitting(true);
    setErrorMsg('');

    try {
      await authService.updatePreferences({
        categories: formData.selectedCategories,
        city: formData.city || 'Dakar',
      });
      onNext();
    } catch (err: unknown) {
      const message =
        (err as Error)?.message ||
        "Impossible d'enregistrer les préférences. Veuillez réessayer.";
      setErrorMsg(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 text-left animate-in fade-in duration-300">
      {/* 1. Titre & Sous-titre alignés à gauche */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-[#111827] tracking-tight">
          Qu’est-ce qui te fait vibrer ?
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1.5 leading-relaxed">
          Sélectionne au moins 3 catégories pour des recommandations sur mesure.
        </p>
      </div>

      {errorMsg && (
        <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-semibold">
          {errorMsg}
        </div>
      )}

      {/* 2. Badge Compteur Pilule aligné à gauche */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F3F4F6] text-xs text-gray-600 font-medium select-none">
          <span
            className={`font-bold ${
              count >= 3 ? 'text-emerald-600' : 'text-[#EF4444]'
            }`}
          >
            {count}
          </span>
          <span>/ 3 minimum sélectionnées</span>
        </div>
      </div>

      {/* 3. Catégories en Pilules Capsules (alignées à gauche) */}
      <div className="flex flex-wrap items-center gap-2.5 py-1">
        {CATEGORIES.map((cat) => {
          const isSelected = formData.selectedCategories.includes(cat.id);
          const Icon = cat.icon;

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => toggleCategory(cat.id)}
              className={`px-4 py-2 rounded-full border text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer select-none ${
                isSelected
                  ? 'bg-[#12142B] border-[#12142B] text-white shadow-xs'
                  : 'bg-white border-gray-200 hover:border-gray-300 text-gray-700 hover:bg-gray-50 shadow-2xs'
              }`}
            >
              <Icon
                className={`w-3.5 h-3.5 ${
                  isSelected ? 'text-white' : 'text-gray-700'
                }`}
              />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* 4. Sélecteur Ta ville */}
      <div className="space-y-1.5 pt-2">
        <label className="block text-xs font-bold text-gray-700">
          Ta ville
        </label>
        <div className="relative">
          <select
            value={formData.city}
            onChange={(e) =>
              setFormData((p) => ({ ...p, city: e.target.value }))
            }
            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-xs sm:text-sm font-semibold text-gray-900 focus:ring-1 focus:ring-gray-900 focus:outline-none cursor-pointer appearance-none shadow-2xs"
          >
            {SENEGAL_CITIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* 5. Actions : Retour, Terminer & Passer cette étape */}
      <div className="pt-4 space-y-3">
        <div className="flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={onPrev}
            className="px-6 py-2.5 rounded-full border border-gray-200 hover:bg-gray-50 text-xs font-bold text-gray-800 transition-all cursor-pointer"
          >
            ← Retour
          </button>

          <button
            type="button"
            disabled={!isComplete || isSubmitting}
            onClick={handleFinish}
            className={`px-7 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 shadow-xs ${
              isComplete && !isSubmitting
                ? 'bg-[#12142B] hover:bg-[#0A0C1B] text-white active:scale-95 cursor-pointer'
                : 'bg-[#7F8694] text-white cursor-not-allowed'
            }`}
          >
            {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            <span>{isSubmitting ? 'Enregistrement...' : 'Terminer'}</span>
            {!isSubmitting && <ArrowRight className="w-3.5 h-3.5" />}
          </button>
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={onNext}
            className="text-xs text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          >
            Passer cette étape
          </button>
        </div>
      </div>
    </div>
  );
};
