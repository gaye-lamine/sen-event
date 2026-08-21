import React, { useState, useEffect } from 'react';
import { CheckCircle2, Edit3, Loader2, AlertCircle } from 'lucide-react';
import { UserProfileData } from '../../../types/dashboard';
import { DashboardSectionHeader } from '../ui/DashboardSectionHeader';

export interface ProfileInfoTabProps {
  profile: UserProfileData;
  onUpdateProfile: (updated: Partial<UserProfileData>) => Promise<void> | void;
}

export const ProfileInfoTab: React.FC<ProfileInfoTabProps> = ({
  profile,
  onUpdateProfile,
}) => {
  const [firstName, setFirstName] = useState(profile.firstName);
  const [lastName, setLastName] = useState(profile.lastName);
  const [email, setEmail] = useState(profile.email);
  const [phone, setPhone] = useState(profile.phone.replace(/^\+221/, '').trim());
  const [city, setCity] = useState(profile.city);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [savedToast, setSavedToast] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    setFirstName(profile.firstName);
    setLastName(profile.lastName);
    setEmail(profile.email);
    setPhone(profile.phone.replace(/^\+221/, '').trim());
    setCity(profile.city);
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const cleanPhone = phone.startsWith('+221') ? phone : `+221${phone.replace(/\s+/g, '')}`;
      await onUpdateProfile({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        phone: cleanPhone,
        city: city.trim(),
      });
      setSavedToast(true);
      setTimeout(() => setSavedToast(false), 3500);
    } catch (err: unknown) {
      const message = (err as Error)?.message || 'Erreur lors de la mise à jour du profil.';
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFirstName(profile.firstName);
    setLastName(profile.lastName);
    setEmail(profile.email);
    setPhone(profile.phone.replace(/^\+221/, '').trim());
    setCity(profile.city);
    setErrorMessage(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200 text-left">
      <DashboardSectionHeader
        title="Mes informations"
        subtitle="Ces informations servent à personnaliser ton compte et tes billets."
      />

      {savedToast && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-300">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Tes informations ont été mises à jour avec succès !</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-300">
          <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-2xs space-y-5"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-1.5">
              Prénom
            </label>
            <input
              type="text"
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Lamine"
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs sm:text-sm text-[#111827] focus:ring-1 focus:ring-gray-900 focus:outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-1.5">
              Nom
            </label>
            <input
              type="text"
              required
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Gaye"
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs sm:text-sm text-[#111827] focus:ring-1 focus:ring-gray-900 focus:outline-none transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#374151] mb-1.5">
            Adresse email
          </label>
          <input
            type="email"
            disabled
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="lamineg049@gmail.com"
            title="L'adresse email est liée à vos billets et ne peut être modifiée directement."
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm text-gray-500 cursor-not-allowed transition-all"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#374151] mb-1.5">
            Téléphone
          </label>
          <div className="flex rounded-xl overflow-hidden border border-gray-200 focus-within:ring-1 focus-within:ring-gray-900 transition-all">
            <span className="inline-flex items-center px-4 bg-[#F9FAFB] text-[#4B5563] text-xs sm:text-sm font-semibold border-r border-gray-200 select-none">
              +221
            </span>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="77 223 80 13"
              className="w-full px-4 py-2.5 bg-white text-xs sm:text-sm text-[#111827] focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#374151] mb-1.5">
            Ville
          </label>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Dakar"
            className="w-full px-4 py-3 bg-[#F3F4F6] border border-transparent rounded-xl text-xs sm:text-sm text-[#111827] focus:ring-1 focus:ring-gray-900 focus:outline-none transition-all"
          />
        </div>

        <div className="pt-3 flex items-center justify-end gap-3 border-t border-gray-100">
          <button
            type="button"
            onClick={handleReset}
            disabled={isSubmitting}
            className="px-5 py-2.5 rounded-full border border-gray-200 hover:bg-gray-50 text-xs font-semibold text-gray-800 transition-all cursor-pointer disabled:opacity-50"
          >
            Annuler
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 rounded-full bg-[#12142B] hover:bg-[#0A0C1B] text-white font-bold text-xs flex items-center gap-2 transition-all active:scale-95 shadow-xs cursor-pointer disabled:opacity-75"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Enregistrement...</span>
              </>
            ) : (
              <>
                <Edit3 className="w-3.5 h-3.5" />
                <span>Enregistrer</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
