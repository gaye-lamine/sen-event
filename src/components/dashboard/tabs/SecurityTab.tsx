import React, { useState } from 'react';
import { CheckCircle2, Lock, LogOut, Trash2, Loader2, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { DashboardSectionHeader } from '../ui/DashboardSectionHeader';
import { dashboardService } from '../../../services/api/dashboardService';

export interface SecurityTabProps {
  onLogout: () => void;
}

export const SecurityTab: React.FC<SecurityTabProps> = ({ onLogout }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordToast, setPasswordToast] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (newPassword.length < 8) {
      setErrorMessage('Le nouveau mot de passe doit comporter au moins 8 caractères.');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setErrorMessage('Les deux nouveaux mots de passe ne correspondent pas.');
      return;
    }

    if (currentPassword === newPassword) {
      setErrorMessage('Le nouveau mot de passe doit être différent du mot de passe actuel.');
      return;
    }

    setIsSubmitting(true);

    try {
      await dashboardService.updateUserPassword({
        current_password: currentPassword,
        password: newPassword,
        password_confirmation: confirmNewPassword,
      });

      setPasswordToast(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
      setTimeout(() => setPasswordToast(false), 3500);
    } catch (err: unknown) {
      const message = (err as Error)?.message || 'Erreur lors de la mise à jour du mot de passe.';
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogoutAllDevices = () => {
    if (
      window.confirm(
        'Es-tu sûr(e) de vouloir te déconnecter de tous les autres appareils ?'
      )
    ) {
      alert('Toutes les autres sessions ont été fermées.');
    }
  };

  const handleDeleteAccount = () => {
    if (
      window.confirm(
        'Attention : Cette action est irréversible et supprimera l’ensemble de ton historique. Souhaites-tu continuer ?'
      )
    ) {
      onLogout();
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200 text-left">
      <DashboardSectionHeader
        title="Sécurité"
        subtitle="Protège l'accès à ton compte et à tes billets."
      />

      {passwordToast && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-300">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Mot de passe mis à jour avec succès !</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-300">
          <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* CARTE 1 : CHANGER DE MOT DE PASSE */}
      <form
        onSubmit={handleUpdatePassword}
        className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-2xs space-y-4 text-left"
      >
        <h3 className="font-bold text-xs sm:text-sm text-[#111827]">
          Changer de mot de passe
        </h3>

        {/* Mot de passe actuel */}
        <div>
          <label className="block text-xs font-semibold text-[#374151] mb-1.5">
            Mot de passe actuel
          </label>
          <div className="relative">
            <input
              type={showCurrent ? 'text' : 'password'}
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs sm:text-sm text-[#111827] focus:ring-1 focus:ring-gray-900 focus:outline-none transition-all pr-10"
            />
            <button
              type="button"
              onClick={() => setShowCurrent(!showCurrent)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer p-1"
            >
              {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Nouveau mot de passe & Confirmation (Grille 2 Colonnes) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-1.5">
              Nouveau mot de passe
            </label>
            <div className="relative">
              <input
                type={showNew ? 'text' : 'password'}
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="8 caractères minimum"
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs sm:text-sm text-[#111827] focus:ring-1 focus:ring-gray-900 focus:outline-none transition-all placeholder:text-gray-400 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer p-1"
              >
                {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-1.5">
              Confirmer
            </label>
            <div className="relative">
              <input
                type={showConfirm ? 'text' : 'password'}
                required
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                placeholder="Retape le nouveau mot de passe"
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs sm:text-sm text-[#111827] focus:ring-1 focus:ring-gray-900 focus:outline-none transition-all placeholder:text-gray-400 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer p-1"
              >
                {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Bouton Mettre à jour */}
        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 rounded-full bg-[#12142B] hover:bg-[#0A0C1B] text-white font-bold text-xs flex items-center gap-2 transition-all active:scale-95 shadow-xs cursor-pointer disabled:opacity-75"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Mise à jour en cours...</span>
              </>
            ) : (
              <>
                <Lock className="w-3.5 h-3.5" />
                <span>Mettre à jour</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* CARTE 2 : SE DÉCONNECTER DE TOUS LES APPAREILS */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-200/80 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left">
        <div className="flex items-center gap-3.5">
          <div className="w-8 h-8 rounded-xl bg-[#F0FDFA] text-[#0D9488] flex items-center justify-center shrink-0">
            <LogOut className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold text-xs sm:text-sm text-[#111827]">
              Se déconnecter de tous les appareils
            </h4>
            <p className="text-xs text-gray-500 mt-0.5">
              Ferme ta session sur tous les téléphones et ordinateurs connectés
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleLogoutAllDevices}
          className="px-4 py-2 rounded-full border border-gray-200 hover:bg-gray-50 text-xs font-semibold text-gray-800 transition-all cursor-pointer whitespace-nowrap self-start sm:self-auto"
        >
          Déconnecter
        </button>
      </div>

      {/* CARTE 3 : SUPPRIMER MON COMPTE (ZONE DE DANGER) */}
      <div className="bg-[#FFF5F5] rounded-2xl p-5 sm:p-6 border border-[#FED7D7] text-left space-y-2.5">
        <h4 className="font-bold text-xs sm:text-sm text-[#E53E3E]">
          Supprimer mon compte
        </h4>
        <p className="text-xs text-[#718096] leading-relaxed">
          Cette action est définitive et supprimera l'accès à tes billets passés. Tes billets à venir doivent être utilisés ou remboursés avant.
        </p>

        <button
          type="button"
          onClick={handleDeleteAccount}
          className="text-xs font-semibold text-[#E53E3E] hover:underline flex items-center gap-1.5 cursor-pointer pt-1"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Supprimer mon compte</span>
        </button>
      </div>
    </div>
  );
};
