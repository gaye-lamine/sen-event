import React, { useState } from 'react';
import { Lock, ShieldCheck, Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react';
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

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    setTimeout(() => {
      if (cleanEmail === 'nt@gmail.com' && cleanPassword === 'password123') {
        localStorage.setItem('sen_event_gate_unlocked', 'true');
        sessionStorage.setItem('sen_event_gate_unlocked', 'true');
        localStorage.setItem('sunu_events_auth', 'true');

        const authorizedUser = {
          id: 999,
          first_name: 'NT',
          last_name: 'Technologies',
          email: 'nt@gmail.com',
          phone: '+221772238013',
          role: 'attendee' as const,
          is_verified: true,
          onboarding_completed: true,
        };

        localStorage.setItem('sen_event_user', JSON.stringify(authorizedUser));
        localStorage.setItem('sen_event_auth_token', 'nt_authorized_session_token');

        setIsUnlocked(true);
      } else {
        setErrorMessage(
          'Accès refusé. Seul le compte autorisé (nt@gmail.com) peut accéder à cette plateforme.'
        );
      }
      setIsLoading(false);
    }, 400);
  };

  if (isUnlocked) {
    return <>{children}</>;
  }

  return (
    <div className="fixed inset-0 z-[9999] w-screen h-screen bg-[#0A0C1B] flex items-center justify-center p-4 sm:p-6 select-none overflow-hidden font-sans">
      {/* Halos lumineux d'arrière-plan */}
      <div
        className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#7C5CFC] opacity-20 blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-[#FF5722] opacity-15 blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative w-full max-w-md bg-[#12142B]/90 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl text-center space-y-6">
        {/* Badge & Cadenas */}
        <div className="flex flex-col items-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#7C5CFC] to-[#FF5722] p-0.5 shadow-lg">
            <div className="w-full h-full bg-[#0A0C1B] rounded-2xl flex items-center justify-center text-white">
              <Lock className="w-6 h-6 text-[#FFC23C]" />
            </div>
          </div>

          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-gray-300 text-[11px] font-bold tracking-wide uppercase border border-white/10">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Accès Restreint & Sécurisé</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Sunu Events Démo
            </h1>
            <p className="text-xs text-gray-400 max-w-xs mx-auto leading-relaxed">
              Cet environnement de pré-production est strictement réservé aux personnes autorisées.
            </p>
          </div>
        </div>

        {/* Message d'erreur */}
        {errorMessage && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs font-semibold flex items-center gap-2 text-left animate-in fade-in duration-200">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Formulaire d'authentification unique */}
        <form onSubmit={handleUnlock} className="space-y-4 text-left">
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">
              Adresse Email Autorisée
            </label>
            <input
              type="email"
              required
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nt@gmail.com"
              className="w-full px-4 py-3 bg-[#0A0C1B] border border-white/10 rounded-xl text-xs sm:text-sm text-white placeholder-gray-500 focus:ring-2 focus:ring-[#7C5CFC] focus:outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">
              Mot de passe
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-4 py-3 bg-[#0A0C1B] border border-white/10 rounded-xl text-xs sm:text-sm text-white placeholder-gray-500 focus:ring-2 focus:ring-[#7C5CFC] focus:outline-none transition-all pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white p-1 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#7C5CFC] to-[#FF5722] hover:opacity-95 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-lg active:scale-98 cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Vérification...</span>
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                <span>Déverrouiller l'accès</span>
              </>
            )}
          </button>
        </form>

        <p className="text-[10px] text-gray-500 font-mono tracking-wider">
          PROTECTION DE DÉPLOIEMENT · SENEVENT.NETLIFY.APP
        </p>
      </div>
    </div>
  );
};
