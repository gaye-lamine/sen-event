import React, { useState } from 'react';
import { X, Mail, Lock, Phone, User } from 'lucide-react';

/**
 * ============================================================================
 * MODULE D'AUTHENTIFICATION : CONNEXION (LOGIN) & CRÉATION DE COMPTE (SIGNUP)
 * ============================================================================
 * 
 * Cette modale gère à la fois :
 * 1. La connexion d'un utilisateur existant (Email / Mot de passe)
 * 2. L'inscription / Création d'un nouveau compte (Nom, Téléphone, Email, Mot de passe)
 * 
 * L'état `mode` permet de basculer instantanément entre "login" et "signup".
 */

interface AuthModalProps {
  /** Indique si la modale est visible à l'écran */
  isOpen: boolean;
  /** Mode initial à l'ouverture : 'login' (Connexion) ou 'signup' (Créer un compte) */
  initialMode?: 'login' | 'signup';
  /** Fonction de rappel pour fermer la modale */
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialMode = 'login',
  onClose,
}) => {
  if (!isOpen) return null;

  // Mode actif : 'login' = Se connecter | 'signup' = Créer un compte
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  
  // Champs de formulaire
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  
  // État de succès après soumission
  const [success, setSuccess] = useState(false);

  /**
   * Gestionnaire de soumission du formulaire (Connexion / Inscription)
   * Prêt pour la liaison avec une API backend d'authentification (ex: Firebase, Supabase, API REST).
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 sm:p-8 border border-gray-100 animate-fadeIn">
        
        {/* Bouton de fermeture de la modale */}
        <button
          onClick={onClose}
          type="button"
          className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-gray-900 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Fermer la fenêtre"
        >
          <X className="w-5 h-5" />
        </button>

        {/* ------------------------------------------------------------------ */}
        {/* EN-TÊTE : TITRE ET SOUS-TITRE SELON LE MODE (LOGIN VS SIGNUP)      */}
        {/* ------------------------------------------------------------------ */}
        <div className="text-center mb-6">
          <h3 className="text-2xl font-extrabold text-gray-900">
            {mode === 'login' ? 'Se connecter' : 'Créer un compte'}
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            {mode === 'login'
              ? 'Accédez à vos billets et réservations en un clic'
              : 'Rejoignez SunuEvents et réservez vos places partout au Sénégal'}
          </p>
        </div>

        {/* Message de confirmation de succès */}
        {success ? (
          <div className="p-6 text-center text-emerald-600 bg-emerald-50 rounded-2xl">
            <p className="font-bold text-sm">
              {mode === 'login' ? 'Connexion réussie !' : 'Compte créé avec succès !'}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* ============================================================= */}
            {/* PARTIE CRÉER UN COMPTE : CHAMPS NOM & TÉLÉPHONE SÉNÉGALAIS   */}
            {/* (Affichés uniquement en mode 'signup')                         */}
            {/* ============================================================= */}
            {mode === 'signup' && (
              <>
                {/* Champ Nom complet */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Nom complet
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ex: Awa Diop"
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-gray-900 focus:outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Champ Téléphone (Format Sénégal +221) */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Numéro de téléphone (Wave / Orange Money)
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="77 000 00 00"
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-gray-900 focus:outline-none transition-all"
                    />
                  </div>
                </div>
              </>
            )}

            {/* ============================================================= */}
            {/* PARTIE COMMUNE (LOGIN & SIGNUP) : EMAIL ET MOT DE PASSE       */}
            {/* ============================================================= */}
            {/* Champ Adresse Email */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Adresse email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre.email@exemple.sn"
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-gray-900 focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Champ Mot de passe */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-gray-900 focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Bouton d'action principal (Se connecter ou Créer mon compte) */}
            <button
              type="submit"
              className="w-full py-3 bg-[#111328] hover:bg-black text-white font-bold text-sm rounded-xl shadow-md transition-all active:scale-98 mt-2"
            >
              {mode === 'login' ? 'Se connecter' : 'Créer mon compte'}
            </button>
          </form>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* BASSERELLE : BASCULER ENTRE LOGIN ET CRÉER UN COMPTE               */}
        {/* ------------------------------------------------------------------ */}
        <div className="mt-6 pt-4 border-t border-gray-100 text-center">
          {mode === 'login' ? (
            <p className="text-xs text-gray-500">
              Pas encore de compte ?{' '}
              <button
                onClick={() => setMode('signup')}
                type="button"
                className="font-bold text-[#111328] hover:underline"
              >
                Créer un compte
              </button>
            </p>
          ) : (
            <p className="text-xs text-gray-500">
              Vous avez déjà un compte ?{' '}
              <button
                onClick={() => setMode('login')}
                type="button"
                className="font-bold text-[#111328] hover:underline"
              >
                Se connecter
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
