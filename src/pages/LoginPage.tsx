import React, { useState } from 'react';
import { Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react';
import { AuthMode, AuthMethodType, LoginPageProps } from '../types';
import { CHECKOUT_CONSTANTS } from '../constants';
import { authService } from '../services/api/authService';

/**
 * @page LoginPage
 * @description Page de connexion sécurisée pour Sunu Events avec intégration API Laravel (Email ou Téléphone).
 * @param {LoginPageProps} props - Contrat de propriétés du composant
 */
export const LoginPage: React.FC<LoginPageProps> = ({
  initialMode = 'login',
  onLoginSuccess,
  onOpenOnboarding,
}) => {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [authMethod, setAuthMethod] = useState<AuthMethodType>('email');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    const loginIdentifier = authMethod === 'email' ? email.trim() : phone.trim();

    if (!loginIdentifier) {
      setIsSubmitting(false);
      setErrorMessage(
        authMethod === 'email'
          ? 'Veuillez saisir votre adresse email.'
          : 'Veuillez saisir votre numéro de téléphone.'
      );
      return;
    }

    if (!password) {
      setIsSubmitting(false);
      setErrorMessage('Veuillez saisir votre mot de passe.');
      return;
    }

    try {
      const response = await authService.login({
        login: loginIdentifier,
        password,
      });

      const user = response.data?.user;
      const accessToken = response.data?.access_token;

      // Redirection SSO immédiate vers le Back-Office si le rôle est organisateur
      if (user?.role === 'organizer') {
        const handoff = await authService.createHandoff(accessToken);
        authService.redirectToBackOfficeSso(handoff.handoff_token);
        return;
      }

      onLoginSuccess?.({
        email: user.email,
        name: `${user.first_name} ${user.last_name}`.trim() || 'Utilisateur Sunu Events',
        phone: user.phone,
      });
    } catch (err: unknown) {
      const message =
        (err as Error)?.message ||
        'Identifiant ou mot de passe incorrect.';
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = () => {
    setErrorMessage('Connexion Google momentanément indisponible.');
  };

  return (
    <div className="fixed inset-0 w-screen h-screen max-h-screen overflow-hidden flex flex-col lg:flex-row bg-white font-sans selection:bg-brand-300 selection:text-gray-900 z-50">
      {/* ========================================================================= */}
      {/* SECTION GAUCHE : VISUEL 3D NATIF (50% DESKTOP) */}
      {/* ========================================================================= */}
      <div
        className="hidden lg:flex lg:w-1/2 h-full max-h-screen relative overflow-hidden select-none flex-col justify-between p-8 sm:p-10 lg:p-12 text-white"
        style={{
          background: 'linear-gradient(155.21deg, #0E072A 0%, #1D1264 60%, #241C6E 100%)',
        }}
      >
        {/* Halos lumineux */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 -left-20 w-[360px] h-[360px] bg-purple-900/30 rounded-full blur-[100px]" />
          <div className="absolute bottom-1/4 right-0 w-[340px] h-[340px] bg-indigo-700/25 rounded-full blur-[100px]" />
        </div>

        {/* 1. Header Logo */}
        <div className="relative z-30">
          <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-white">
            Sunu Events
          </span>
        </div>

        {/* 2. COMPOSITION 3D DES CARTES ET BILLETS */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
          {/* A. GROUPE DU HAUT : FLYER WALLY SECK */}
          <div className="absolute top-8 sm:top-10 right-12 sm:right-20 lg:right-28">
            {/* Carte arrière floutée */}
            <div className="absolute -top-3 -left-8 w-24 sm:w-28 h-32 sm:h-36 rounded-2xl overflow-hidden shadow-lg transform rotate-[20deg] blur-[2px] opacity-70 border border-white/10">
              <img
                src="/images/senegal-algerir.png"
                alt="Combat Modou Lo"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Flyer Wally B. Seck */}
            <div className="relative w-28 sm:w-34 bg-white rounded-2xl p-1 shadow-[0_15px_30px_-8px_rgba(0,0,0,0.85)] transform -rotate-[24deg] border border-white/90">
              <div className="relative rounded-xl overflow-hidden bg-[#1E0D04]">
                <img
                  src="/images/wally.png"
                  alt="Wally B. Seck"
                  className="w-full h-20 sm:h-24 object-cover"
                />
                <div className="p-1.5 bg-[#120701] text-center">
                  <span className="inline-block bg-[#E52E2E] text-white text-[6px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-wider mb-0.5">
                    SAM 12 DEC
                  </span>
                  <p className="text-[6.5px] font-bold text-white leading-tight">
                    SIMPLE 10.000F | VIP 30.000F
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* B. GROUPE DU MILIEU : BILLETS COUPÉS SUR LE BORD DROIT */}
          <div className="absolute top-[36%] -right-8 sm:-right-10 lg:-right-12 z-20">
            {/* Billet Standard Sombre (Derrière) */}
            <div className="absolute -left-5 top-2 w-[105px] sm:w-[120px] h-[210px] sm:h-[235px] bg-[#141A29] rounded-2xl shadow-md transform -rotate-[8deg] p-2.5 text-white/50 border border-white/5 overflow-hidden">
              <span className="text-sm font-black text-white/15 uppercase tracking-widest block">
                STANDARD
              </span>
              <p className="text-[7.5px] font-bold text-white/40 mt-1">Wally B. Seck</p>
              <p className="text-[6.5px] text-white/25">Ven. 20 déc.</p>
              <div className="mt-2">
                <p className="text-[6.5px] font-bold text-white/40">AMINATA DIOP</p>
              </div>
            </div>

            {/* Billet VIP Doré #F2C12D */}
            <div
              className="relative w-[105px] sm:w-[120px] h-[210px] sm:h-[235px] text-[#111] rounded-2xl p-2.5 sm:p-3 shadow-[0_12px_28px_rgba(0,0,0,0.55)] transform rotate-[15deg] overflow-hidden flex flex-col justify-between"
              style={{ background: '#F2C12D' }}
            >
              {/* Encoches latérales */}
              <div className="absolute -left-2 top-2/3 w-3.5 h-3.5 bg-[#160E45] rounded-full" />
              <div className="absolute -right-2 top-2/3 w-3.5 h-3.5 bg-[#160E45] rounded-full" />

              <div>
                {/* Filigrane V.I.P */}
                <div className="text-right pr-0.5">
                  <span className="text-lg sm:text-xl font-black tracking-wider text-black/25">
                    V.I.P
                  </span>
                </div>

                {/* Titre & Date */}
                <div className="mt-0.5">
                  <h3 className="text-[8.5px] sm:text-[9.5px] font-black text-[#111] leading-tight">
                    Wally B. Seck
                  </h3>
                  <p className="text-[6.5px] sm:text-[7px] font-semibold text-black/75">
                    Ven. 20 déc. • Arena
                  </p>
                </div>

                {/* Titulaire */}
                <div className="mt-1.5 pt-1 border-t border-dashed border-black/20">
                  <p className="text-[7px] uppercase tracking-wider font-bold text-black/70">
                    Aminata Diop
                  </p>
                  <p className="text-[6px] text-black/85 font-medium">Billet nominatif</p>
                </div>

                <div className="mt-0.5 flex items-center justify-between text-[6px] font-mono font-bold text-black/80">
                  <span>#SN-2902</span>
                </div>
              </div>

              {/* QR Code */}
              <div className="pt-1 border-t border-dashed border-black/25 flex justify-start pl-0.5">
                <div className="p-0.5 flex flex-col items-center">
                  <svg className="w-10 h-10 sm:w-12 sm:h-12 text-black" viewBox="0 0 100 100" fill="currentColor">
                    <path d="M0 0h35v35H0V0zm5 5v25h25V5H5z" />
                    <path d="M10 10h15v15H10V10zM65 0h35v35H65V0zm5 5v25h25V5H70z" />
                    <path d="M75 10h15v15H75V10zM0 65h35v35H0V65zm5 5v25h25V70H5z" />
                    <path d="M10 75h15v15H10V75zM45 10h10v10H45V10zM45 25h10v10H45V25zM45 45h10v10H45V45zM25 45h10v10H25V45zM65 45h10v10H65V45zM85 45h10v10H85V45zM45 65h10v10H45V65zM45 85h10v10H45V85zM65 65h15v10H65V65zM65 85h10v15H65V85zM85 75h15v10H85V75zM85 90h15v10H85V90z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* C. GROUPE DU BAS : POSITIONNÉ AU-DESSUS DES STATS */}
          <div className="absolute bottom-20 sm:bottom-24 left-[44%] sm:left-[48%]">
            <div className="relative">
              {/* Carte floutée dorée à droite */}
              <div className="absolute top-2 left-16 sm:left-20 w-18 sm:w-22 h-24 sm:h-28 rounded-2xl overflow-hidden shadow-lg transform rotate-[22deg] blur-[2.5px] opacity-75">
                <img
                  src="/images/senegal-algerir.png"
                  alt="Événement"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Flyer principal inversé flottant */}
              <div className="relative w-22 sm:w-26 bg-white rounded-2xl p-1 shadow-[0_15px_30px_rgba(0,0,0,0.7)] transform rotate-[148deg] border border-white/80">
                <div className="rounded-xl overflow-hidden bg-[#1E0D04]">
                  <img
                    src="/images/wally.png"
                    alt="Wally Seck"
                    className="w-full h-16 sm:h-18 object-cover"
                  />
                  <div className="p-1 bg-[#120701] text-center text-[5px] text-white font-bold leading-tight">
                    WALLY B. SECK
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Bloc Textes (Content de te revoir !) */}
        <div className="relative z-30 my-auto py-4 max-w-sm">
          <h1 className="text-3xl sm:text-4xl lg:text-[40px] font-black text-white leading-[1.15] tracking-tight">
            Content de te <br />
            revoir !
          </h1>
          <p className="text-xs sm:text-sm text-gray-300 font-normal mt-3 leading-relaxed max-w-xs">
            Connecte-toi pour retrouver tes billets, tes évènements favoris et tes prochaines sorties au Sénégal.
          </p>
        </div>

        {/* 4. Barre de Statistiques en Bas */}
        <div className="relative z-30 pt-3 flex items-center gap-6 sm:gap-10">
          <div>
            <p className="text-lg sm:text-xl font-bold text-white tracking-tight">+180</p>
            <p className="text-[10px] text-gray-400 font-normal mt-0.5 whitespace-nowrap">
              évènements actifs
            </p>
          </div>
          <div>
            <p className="text-lg sm:text-xl font-bold text-white tracking-tight">32k</p>
            <p className="text-[10px] text-gray-400 font-normal mt-0.5 whitespace-nowrap">
              utilisateurs Sunu
            </p>
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="text-xs text-gray-300">☆</span>
              <span className="text-lg sm:text-xl font-bold text-white tracking-tight">4,8</span>
            </div>
            <p className="text-[10px] text-gray-400 font-normal mt-0.5 whitespace-nowrap">
              note moyenne
            </p>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION DROITE : FORMULAIRE D'ACCÈS SÉCURISÉ (50% DESKTOP) */}
      {/* ========================================================================= */}
      <div className="w-full lg:w-1/2 h-full max-h-screen bg-white flex flex-col justify-center px-6 sm:px-12 lg:px-16 xl:px-20 py-4 sm:py-6 overflow-y-auto lg:overflow-hidden">
        <div className="max-w-[380px] sm:max-w-[400px] w-full mx-auto my-auto">
          {/* Titre & Sous-titre */}
          <div className="mb-4 sm:mb-5 text-left">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight">
              {mode === 'login' ? 'Connexion' : 'Créer un compte'}
            </h2>
            <p className="text-xs sm:text-sm text-[#6B7280] mt-1">
              {mode === 'login'
                ? 'Accède à ton compte Sunu Events.'
                : 'Remplis les champs ci-dessous pour créer ton profil.'}
            </p>
          </div>

          {/* Message d'erreur générique sécurisé (zéro fuite d'identifiants) */}
          {errorMessage && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 flex items-center gap-2.5 text-xs text-red-700 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Sélecteur Segmenté [ Email | Téléphone ] */}
          <div className="p-1 bg-[#F3F4F6] rounded-full flex items-center mb-4 sm:mb-5">
            <button
              type="button"
              onClick={() => {
                setAuthMethod('email');
                setErrorMessage(null);
              }}
              className={`flex-1 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold rounded-full transition-all cursor-pointer ${
                authMethod === 'email'
                  ? 'bg-white text-[#111827] shadow-xs'
                  : 'text-[#6B7280] hover:text-[#111827]'
              }`}
            >
              Email
            </button>

            <button
              type="button"
              onClick={() => {
                setAuthMethod('phone');
                setErrorMessage(null);
              }}
              className={`flex-1 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold rounded-full transition-all cursor-pointer ${
                authMethod === 'phone'
                  ? 'bg-white text-[#111827] shadow-xs'
                  : 'text-[#6B7280] hover:text-[#111827]'
              }`}
            >
              Téléphone
            </button>
          </div>

          {/* Formulaire */}
          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-3.5 text-left">
            {mode === 'signup' && (
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-semibold text-[#374151] mb-1">
                    Prénom
                  </label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Ex: Aminata"
                    className="w-full px-3.5 py-2.5 bg-white border border-[#E5E7EB] rounded-xl text-xs sm:text-sm text-[#111827] focus:ring-1 focus:ring-[#111827] focus:outline-none transition-all placeholder:text-[#9CA3AF]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#374151] mb-1">
                    Nom
                  </label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Ex: Diop"
                    className="w-full px-3.5 py-2.5 bg-white border border-[#E5E7EB] rounded-xl text-xs sm:text-sm text-[#111827] focus:ring-1 focus:ring-[#111827] focus:outline-none transition-all placeholder:text-[#9CA3AF]"
                  />
                </div>
              </div>
            )}

            {authMethod === 'email' ? (
              <div>
                <label className="block text-xs font-semibold text-[#374151] mb-1">
                  Adresse email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  placeholder="exemple@email.com"
                  className="w-full px-3.5 py-2.5 bg-white border border-[#E5E7EB] rounded-xl text-xs sm:text-sm text-[#111827] focus:ring-1 focus:ring-[#111827] focus:outline-none transition-all placeholder:text-[#9CA3AF]"
                />
              </div>
            ) : (
              <div>
                <label className="block text-xs font-semibold text-[#374151] mb-1">
                  Numéro de téléphone
                </label>
                <div className="flex rounded-xl overflow-hidden border border-[#E5E7EB] focus-within:ring-1 focus-within:ring-[#111827] transition-all">
                  <span className="inline-flex items-center px-3.5 bg-[#F9FAFB] text-[#4B5563] text-xs sm:text-sm font-semibold border-r border-[#E5E7EB] select-none">
                    {CHECKOUT_CONSTANTS.PHONE_PREFIX}
                  </span>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      if (errorMessage) setErrorMessage(null);
                    }}
                    placeholder="77 000 00 00"
                    className="w-full px-3.5 py-2.5 bg-white text-xs sm:text-sm text-[#111827] focus:outline-none placeholder:text-[#9CA3AF]"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1">
                Mot de passe
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 bg-white border border-[#E5E7EB] rounded-xl text-xs sm:text-sm text-[#111827] focus:ring-1 focus:ring-[#111827] focus:outline-none transition-all placeholder:text-[#9CA3AF] pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#4B5563] cursor-pointer"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-0.5">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-3.5 h-3.5 rounded border-gray-300 text-gray-900 focus:ring-gray-900 cursor-pointer"
                />
                <span className="text-xs text-[#4B5563]">Se souvenir de moi</span>
              </label>

              {mode === 'login' && (
                <button
                  type="button"
                  className="text-xs font-semibold text-[#EA4335] hover:underline cursor-pointer"
                >
                  Mot de passe oublié ?
                </button>
              )}
            </div>

            {/* Bouton Principal de Connexion */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-6 bg-[#12142B] hover:bg-[#0A0C1B] text-white font-bold text-xs sm:text-sm rounded-full shadow-xs transition-all active:scale-98 cursor-pointer disabled:opacity-75 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Connexion en cours...</span>
                </>
              ) : mode === 'login' ? (
                'Se connecter'
              ) : (
                'Créer mon compte'
              )}
            </button>

            {/* Bouton Social Google */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isSubmitting}
              className="w-full py-2.5 px-6 bg-white border border-[#E5E7EB] hover:bg-[#F9FAFB] text-[#374151] font-semibold text-xs sm:text-sm rounded-full transition-all flex items-center justify-center gap-2.5 shadow-2xs active:scale-98 cursor-pointer disabled:opacity-70"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.03 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
              <span>Log in with Google</span>
            </button>
          </form>

          {/* Séparateur "ou" */}
          <div className="relative my-3.5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#E5E7EB]" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-3 text-[#9CA3AF]">ou</span>
            </div>
          </div>

          {/* Bascule Connexion / Inscription */}
          <div className="text-center text-xs text-[#4B5563]">
            {mode === 'login' ? (
              <p>
                Pas encore de compte ?{' '}
                <button
                  type="button"
                  onClick={() => {
                    if (onOpenOnboarding) {
                      onOpenOnboarding();
                    } else {
                      setMode('signup');
                    }
                  }}
                  className="font-bold text-[#EA4335] hover:underline cursor-pointer"
                >
                  Créer un compte
                </button>
              </p>
            ) : (
              <p>
                Déjà un compte ?{' '}
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="font-bold text-[#EA4335] hover:underline cursor-pointer"
                >
                  Se connecter
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
