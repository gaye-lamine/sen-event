import React, { useState } from 'react';
import { Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react';
import { authService } from '../../services/api/authService';

interface ProtectedAccessGateProps {
  children: React.ReactNode;
}

export const ProtectedAccessGate: React.FC<ProtectedAccessGateProps> = ({ children }) => {
  const [isUnlocked, setIsUnlocked] = useState<boolean>(() => {
    const isLocalUnlocked = localStorage.getItem('sen_event_gate_unlocked') === 'true';
    const isSessionUnlocked = sessionStorage.getItem('sen_event_gate_unlocked') === 'true';
    const currentUser = authService.getCurrentUser();
    const isNtUser = currentUser?.email?.toLowerCase() === 'nt@gmail.com';

    return (isLocalUnlocked || isSessionUnlocked) && isNtUser;
  });

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (cleanEmail !== 'nt@gmail.com') {
      setErrorMessage('Adresse email ou mot de passe incorrect.');
      setIsLoading(false);
      return;
    }

    try {
      await authService.login({
        login: cleanEmail,
        password: cleanPassword,
      });

      localStorage.setItem('sen_event_gate_unlocked', 'true');
      sessionStorage.setItem('sen_event_gate_unlocked', 'true');
      localStorage.setItem('sunu_events_auth', 'true');
      setIsUnlocked(true);
    } catch (err: unknown) {
      const message = (err as Error)?.message || 'Adresse email ou mot de passe incorrect.';
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isUnlocked) {
    return <>{children}</>;
  }

  return (
    <div className="fixed inset-0 w-screen h-screen max-h-screen overflow-hidden flex flex-col lg:flex-row bg-white font-sans selection:bg-brand-300 selection:text-gray-900 z-50">
      {/* ========================================================================= */}
      {/* SECTION GAUCHE : VISUEL 3D OFFICIEL SUNU EVENTS */}
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

        {/* 2. Composition visuelle des cartes et billets */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
          {/* Flyer Wally Seck */}
          <div className="absolute top-10 right-20 lg:right-28">
            <div className="relative w-28 sm:w-34 bg-white rounded-2xl p-1 shadow-2xl transform -rotate-[22deg] border border-white/90">
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

          {/* Billets 3D */}
          <div className="absolute top-[38%] -right-6 lg:-right-8 z-20">
            {/* Billet Standard */}
            <div className="absolute -left-5 top-2 w-[110px] h-[220px] bg-[#141A29] rounded-2xl shadow-md transform -rotate-[8deg] p-2.5 text-white/50 border border-white/5 overflow-hidden">
              <span className="text-sm font-black text-white/15 uppercase tracking-widest block">
                STANDARD
              </span>
              <p className="text-[7.5px] font-bold text-white/40 mt-1">Wally B. Seck</p>
              <p className="text-[6.5px] text-white/25">Ven. 20 déc.</p>
            </div>

            {/* Billet VIP Doré */}
            <div
              className="relative w-[120px] h-[240px] rounded-2xl shadow-2xl transform rotate-[10deg] p-3 text-[#120701] overflow-hidden border border-amber-300"
              style={{
                background: 'linear-gradient(135deg, #F2C12D 0%, #D4A21A 100%)',
              }}
            >
              <span className="text-base font-black text-black/25 uppercase tracking-widest block">
                V.I.P
              </span>
              <p className="text-[8.5px] font-extrabold text-[#120701] mt-1">Wally B. Seck</p>
              <p className="text-[7.5px] font-bold text-[#120701]/70">Dakar Arena</p>
            </div>
          </div>
        </div>

        {/* 3. Baseline */}
        <div className="relative z-30 space-y-2 max-w-sm">
          <h2 className="text-xl sm:text-2xl font-black leading-snug">
            Vivez vos événements au Sénégal en toute simplicité.
          </h2>
          <p className="text-xs text-white/70">
            Concerts, festivals, sports et spectacles à portée de main.
          </p>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION DROITE : FORMULAIRE DE CONNEXION ÉPURÉ */}
      {/* ========================================================================= */}
      <div className="w-full lg:w-1/2 h-full flex items-center justify-center p-6 sm:p-10 lg:p-16 overflow-y-auto">
        <div className="w-full max-w-md space-y-6">
          {/* Logo Mobile */}
          <div className="lg:hidden">
            <span className="font-extrabold text-2xl tracking-tight text-gray-900">
              Sunu Events
            </span>
          </div>

          <div className="space-y-1.5 text-left">
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
              Connexion
            </h1>
            <p className="text-xs sm:text-sm text-gray-500">
              Entre tes identifiants pour accéder à ton espace.
            </p>
          </div>

          {/* Message d'erreur épuré */}
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2 text-left animate-in fade-in duration-200">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Formulaire */}
          <form onSubmit={handleUnlock} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Adresse email
              </label>
              <input
                type="email"
                required
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nom@exemple.com"
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-xs sm:text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-gray-900 focus:border-transparent focus:outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Mot de passe
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-xs sm:text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-gray-900 focus:border-transparent focus:outline-none transition-all pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 rounded-xl bg-[#12142B] hover:bg-[#0A0C1B] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md active:scale-98 cursor-pointer disabled:opacity-50 mt-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Connexion en cours...</span>
                </>
              ) : (
                <span>Se connecter</span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
