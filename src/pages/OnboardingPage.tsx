import React, { useState, useEffect, useRef } from 'react';
import {
  Users,
  Ticket,
  Check,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Eye,
  EyeOff,
  Phone,
  ShieldCheck,
  Music,
  Smile,
  Moon,
  GraduationCap,
  Sparkles,
  Presentation,
  Clapperboard,
  Trophy,
  ChevronDown,
  Compass,
  Bell,
  UserPlus,
} from 'lucide-react';
import { OnboardingPageProps, OnboardingRole } from '../types';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { CHECKOUT_CONSTANTS } from '../constants';

// Catégories disponibles pour les préférences (Étape 4)
const CATEGORIES_LIST = [
  { id: 'concert', label: 'Concert', icon: Music },
  { id: 'humour', label: 'Humour', icon: Smile },
  { id: 'soiree', label: 'Soirée', icon: Moon },
  { id: 'formation', label: 'Formation', icon: GraduationCap },
  { id: 'festival', label: 'Festival', icon: Sparkles },
  { id: 'conference', label: 'Conférence', icon: Presentation },
  { id: 'theatre', label: 'Théâtre', icon: Clapperboard },
  { id: 'sport', label: 'Sport', icon: Trophy },
];

const SENEGAL_CITIES = [
  'Dakar',
  'Thiès',
  'Saint-Louis',
  'Mbour / Saly',
  'Ziguinchor',
  'Touba',
  'Kaolack',
  'Autre',
];

/**
 * @page OnboardingPage
 * @description Écran d'inscription & intégration Sunu Events 5 étapes :
 * - Étape 1 : Choix du profil (Découverte / Organisation)
 * - Étape 2 : Informations personnelles ("Créons ton compte")
 * - Étape 3 : Vérification OTP du numéro ("Vérifie ton numéro")
 * - Étape 4 : Préférences ("Qu'est-ce qui te fait vibrer ?")
 * - Étape 5 : Écran de Bienvenue & Confirmation ("Bienvenue, Aminata !")
 * @param {OnboardingPageProps} props - Propriétés du composant
 */
export const OnboardingPage: React.FC<OnboardingPageProps> = ({
  onNavigateHome,
  onOpenLogin,
  onComplete,
  searchQuery = '',
  onSearch,
  cartCount = 0,
  onOpenCart,
}) => {
  // Étape active du stepper (1 à 5)
  const [currentStep, setCurrentStep] = useState<number>(5);

  // État Étape 1 (Profil)
  const [selectedRole, setSelectedRole] = useState<OnboardingRole>('attendee');

  // État Étape 2 (Informations)
  const [firstName, setFirstName] = useState('Aminata');
  const [lastName, setLastName] = useState('Diop');
  const [email, setEmail] = useState('aminata.diop@email.com');
  const [phone, setPhone] = useState('77 123 45 67');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [termsError, setTermsError] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // État Étape 3 (Vérification OTP)
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [countdown, setCountdown] = useState<number>(59);
  const [isResending, setIsResending] = useState<boolean>(false);
  const [otpError, setOtpError] = useState<string | null>(null);
  const otpInputsRef = useRef<(HTMLInputElement | null)[]>([]);

  // État Étape 4 (Préférences)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([
    'concert',
    'humour',
    'soiree',
  ]);
  const [selectedCity, setSelectedCity] = useState<string>('Dakar');

  // Compte à rebours renvoi de code OTP
  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (currentStep === 3 && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [currentStep, countdown]);

  // Gestion des 6 chiffres OTP
  const handleOtpChange = (index: number, value: string) => {
    if (otpError) setOtpError(null);
    const cleaned = value.replace(/\D/g, '');
    const newOtp = [...otp];

    if (cleaned.length > 1) {
      const pasted = cleaned.slice(0, 6).split('');
      pasted.forEach((char, i) => {
        if (i < 6) newOtp[i] = char;
      });
      setOtp(newOtp);
      const nextFocus = Math.min(pasted.length, 5);
      otpInputsRef.current[nextFocus]?.focus();
      return;
    }

    newOtp[index] = cleaned;
    setOtp(newOtp);

    if (cleaned && index < 5) {
      otpInputsRef.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputsRef.current[index - 1]?.focus();
    }
  };

  const handleResendCode = () => {
    if (countdown > 0) return;
    setIsResending(true);
    setTimeout(() => {
      setIsResending(false);
      setCountdown(59);
      setOtp(['', '', '', '', '', '']);
      otpInputsRef.current[0]?.focus();
    }, 500);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const fullCode = otp.join('');
    if (fullCode.length < 6) {
      setOtpError('Veuillez saisir le code à 6 chiffres.');
      return;
    }
    setCurrentStep(4);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleCategory = (categoryId: string) => {
    if (selectedCategories.includes(categoryId)) {
      setSelectedCategories(selectedCategories.filter((id) => id !== categoryId));
    } else {
      setSelectedCategories([...selectedCategories, categoryId]);
    }
  };

  const hasMinLength = password.length >= 8;
  const hasNumber = /\d/.test(password);
  const hasUppercase = /[A-Z]/.test(password);

  const strengthScore =
    (hasMinLength ? 1 : 0) +
    (hasNumber ? 1 : 0) +
    (hasUppercase ? 1 : 0) +
    (password.length >= 10 && hasNumber && hasUppercase ? 1 : 0);

  const getStrengthLabel = () => {
    if (!password) return 'Trop court';
    if (strengthScore <= 1) return 'Trop court';
    if (strengthScore === 2) return 'Faible';
    if (strengthScore === 3) return 'Moyen';
    return 'Fort';
  };

  const handleStep1Continue = () => {
    setCurrentStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStep2Continue = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!acceptTerms) {
      setTermsError(true);
      return;
    }
    setTermsError(false);

    if (password && confirmPassword && password !== confirmPassword) {
      setFormError('Les mots de passe ne correspondent pas.');
      return;
    }

    setCurrentStep(3);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStep4Continue = () => {
    setCurrentStep(5);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFinishOnboarding = () => {
    onComplete?.(selectedRole);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FB] flex flex-col justify-between font-sans selection:bg-brand-300 selection:text-gray-900">
      {/* ========================================================= */}
      {/* 1. EN-TÊTE / NAVBAR */}
      {/* ========================================================= */}
      <div className="bg-white border-b border-gray-100">
        <Navbar
          searchQuery={searchQuery}
          onSearch={onSearch}
          onNavigateHome={onNavigateHome}
          onOpenAuth={() => onOpenLogin()}
          isAuthenticated={currentStep === 5}
          cartCount={cartCount}
          onOpenCart={onOpenCart}
        />
      </div>

      {/* ========================================================= */}
      {/* 2. CONTENEUR PRINCIPAL ONBOARDING */}
      {/* ========================================================= */}
      {currentStep <= 4 ? (
        <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex flex-col items-center justify-center">
          {/* STEPPER GLOBAL (4 ÉTAPES) */}
          <div className="flex items-center justify-center max-w-xl mx-auto mb-8 sm:mb-10 select-none">
            {/* Étape 1 : Profil */}
            <div
              onClick={() => setCurrentStep(1)}
              className="flex flex-col items-center cursor-pointer group"
            >
              {currentStep > 1 ? (
                <div className="w-8 h-8 rounded-full bg-[#10B981] text-white flex items-center justify-center shadow-xs transition-all">
                  <Check className="w-4 h-4 stroke-[3]" />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-full border-2 border-[#FF5722] text-[#FF5722] font-bold text-xs flex items-center justify-center bg-white shadow-2xs">
                  1
                </div>
              )}
              <span
                className={`text-[11px] mt-1.5 transition-colors ${
                  currentStep === 1
                    ? 'font-bold text-[#111827]'
                    : currentStep > 1
                    ? 'font-medium text-gray-500'
                    : 'text-gray-400'
                }`}
              >
                Profil
              </span>
            </div>

            {/* Ligne 1-2 */}
            <div
              className={`h-[1.5px] w-12 sm:w-16 md:w-20 mx-2 -mt-5 transition-colors ${
                currentStep > 1 ? 'bg-[#10B981]' : 'bg-gray-200'
              }`}
            />

            {/* Étape 2 : Informations */}
            <div
              onClick={() => currentStep >= 2 && setCurrentStep(2)}
              className="flex flex-col items-center cursor-pointer"
            >
              {currentStep > 2 ? (
                <div className="w-8 h-8 rounded-full bg-[#10B981] text-white flex items-center justify-center shadow-xs transition-all">
                  <Check className="w-4 h-4 stroke-[3]" />
                </div>
              ) : (
                <div
                  className={`w-8 h-8 rounded-full font-bold text-xs flex items-center justify-center bg-white transition-all ${
                    currentStep === 2
                      ? 'border-2 border-[#FF5722] text-[#FF5722] shadow-2xs'
                      : 'border border-gray-300 text-gray-400'
                  }`}
                >
                  2
                </div>
              )}
              <span
                className={`text-[11px] mt-1.5 ${
                  currentStep === 2
                    ? 'font-bold text-[#111827]'
                    : currentStep > 2
                    ? 'font-medium text-gray-500'
                    : 'text-gray-400 font-medium'
                }`}
              >
                Informations
              </span>
            </div>

            {/* Ligne 2-3 */}
            <div
              className={`h-[1.5px] w-12 sm:w-16 md:w-20 mx-2 -mt-5 transition-colors ${
                currentStep > 2 ? 'bg-[#10B981]' : 'bg-gray-200'
              }`}
            />

            {/* Étape 3 : Vérification */}
            <div
              onClick={() => currentStep >= 3 && setCurrentStep(3)}
              className="flex flex-col items-center cursor-pointer"
            >
              {currentStep > 3 ? (
                <div className="w-8 h-8 rounded-full bg-[#10B981] text-white flex items-center justify-center shadow-xs transition-all">
                  <Check className="w-4 h-4 stroke-[3]" />
                </div>
              ) : (
                <div
                  className={`w-8 h-8 rounded-full font-bold text-xs flex items-center justify-center bg-white transition-all ${
                    currentStep === 3
                      ? 'border-2 border-[#FF5722] text-[#FF5722] shadow-2xs'
                      : 'border border-gray-300 text-gray-400'
                  }`}
                >
                  3
                </div>
              )}
              <span
                className={`text-[11px] mt-1.5 ${
                  currentStep === 3
                    ? 'font-bold text-[#111827]'
                    : 'text-gray-400 font-medium'
                }`}
              >
                Vérification
              </span>
            </div>

            {/* Ligne 3-4 */}
            <div
              className={`h-[1.5px] w-12 sm:w-16 md:w-20 mx-2 -mt-5 transition-colors ${
                currentStep > 3 ? 'bg-[#10B981]' : 'bg-gray-200'
              }`}
            />

            {/* Étape 4 : Préférences */}
            <div
              onClick={() => currentStep >= 4 && setCurrentStep(4)}
              className="flex flex-col items-center cursor-pointer"
            >
              <div
                className={`w-8 h-8 rounded-full font-bold text-xs flex items-center justify-center bg-white transition-all ${
                  currentStep === 4
                    ? 'border-2 border-[#FF5722] text-[#FF5722] shadow-2xs'
                    : 'border border-gray-300 text-gray-400'
                }`}
              >
                4
              </div>
              <span
                className={`text-[11px] mt-1.5 ${
                  currentStep === 4
                    ? 'font-bold text-[#111827]'
                    : 'text-gray-400 font-medium'
                }`}
              >
                Préférences
              </span>
            </div>
          </div>

          {/* ÉTAPE 1 : CHOIX DU PROFIL */}
          {currentStep === 1 && (
            <div className="bg-white rounded-[28px] sm:rounded-[36px] p-6 sm:p-12 lg:p-14 w-full shadow-[0_4px_30px_rgba(0,0,0,0.03)] border border-gray-100 animate-in fade-in duration-300">
              <div className="mb-8 sm:mb-10 text-center">
                <h1 className="text-2xl sm:text-3xl lg:text-[32px] font-black text-[#111827] tracking-tight">
                  Bienvenue sur Sunu Events
                </h1>
                <p className="text-xs sm:text-sm text-gray-500 mt-2 max-w-lg mx-auto leading-relaxed">
                  Dis-nous ce qui t'amène pour qu'on personnalise ton expérience dès le départ.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 max-w-3xl mx-auto">
                <div
                  onClick={() => setSelectedRole('attendee')}
                  className={`relative rounded-2xl sm:rounded-3xl p-6 sm:p-7 text-left transition-all cursor-pointer select-none ${
                    selectedRole === 'attendee'
                      ? 'border-2 border-[#FF5722] bg-white shadow-[0_8px_30px_rgba(255,87,34,0.06)]'
                      : 'border border-gray-200 bg-white hover:border-gray-300 hover:shadow-xs'
                  }`}
                >
                  <div className="absolute top-6 right-6">
                    {selectedRole === 'attendee' ? (
                      <div className="w-5 h-5 rounded-full bg-[#FF5722] text-white flex items-center justify-center shadow-2xs">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
                    )}
                  </div>

                  <div className="w-11 h-11 rounded-2xl bg-[#EEF2F6] flex items-center justify-center mb-4">
                    <Users className="w-5 h-5 text-gray-700" />
                  </div>

                  <h3 className="font-bold text-base sm:text-lg text-[#111827]">
                    Je découvre des évènements
                  </h3>
                  <p className="text-xs text-gray-500 mt-1.5 leading-relaxed min-h-[36px]">
                    Trouve des concerts, matchs, festivals et bien plus, et achète tes billets en 2 minutes.
                  </p>

                  <div className="mt-5 pt-4 border-t border-gray-100 space-y-2.5">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
                      <span className="text-xs text-gray-600 font-medium">
                        Recommandations personnalisées
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
                      <span className="text-xs text-gray-600 font-medium">
                        Billets QR toujours accessibles
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
                      <span className="text-xs text-gray-600 font-medium">
                        Alertes sur tes artistes favoris
                      </span>
                    </div>
                  </div>
                </div>

                <div
                  onClick={() => setSelectedRole('organizer')}
                  className={`relative rounded-2xl sm:rounded-3xl p-6 sm:p-7 text-left transition-all cursor-pointer select-none ${
                    selectedRole === 'organizer'
                      ? 'border-2 border-[#FF5722] bg-white shadow-[0_8px_30px_rgba(255,87,34,0.06)]'
                      : 'border border-gray-200 bg-white hover:border-gray-300 hover:shadow-xs'
                  }`}
                >
                  <div className="absolute top-6 right-6">
                    {selectedRole === 'organizer' ? (
                      <div className="w-5 h-5 rounded-full bg-[#FF5722] text-white flex items-center justify-center shadow-2xs">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
                    )}
                  </div>

                  <div className="w-11 h-11 rounded-2xl bg-[#FFB703] text-white flex items-center justify-center mb-4 shadow-xs">
                    <Ticket className="w-5 h-5" />
                  </div>

                  <h3 className="font-bold text-base sm:text-lg text-[#111827]">
                    J'organise des évènements
                  </h3>
                  <p className="text-xs text-gray-500 mt-1.5 leading-relaxed min-h-[36px]">
                    Crée ta billetterie, encaisse via Wave & Orange Money et suis tes ventes en direct.
                  </p>

                  <div className="mt-5 pt-4 border-t border-gray-100 space-y-2.5">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
                      <span className="text-xs text-gray-600 font-medium">
                        Publication en 10 minutes
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
                      <span className="text-xs text-gray-600 font-medium">
                        Tableau de bord des ventes
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
                      <span className="text-xs text-gray-600 font-medium">
                        Scan des billets le jour J
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 sm:mt-10 flex justify-end max-w-3xl mx-auto">
                <button
                  type="button"
                  onClick={handleStep1Continue}
                  className="px-7 py-3 rounded-full bg-[#121526] hover:bg-[#090B14] text-white font-bold text-xs sm:text-sm flex items-center gap-2 transition-all active:scale-95 shadow-xs cursor-pointer"
                >
                  <span>Continuer</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ÉTAPE 2 : INFORMATIONS */}
          {currentStep === 2 && (
            <div className="bg-white rounded-[28px] sm:rounded-[36px] p-6 sm:p-10 lg:p-12 w-full max-w-xl mx-auto shadow-[0_4px_30px_rgba(0,0,0,0.03)] border border-gray-100 text-left animate-in fade-in duration-300">
              <div className="mb-6">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight">
                  Créons ton compte
                </h2>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                  Quelques infos et c'est parti.
                </p>
              </div>

              {formError && (
                <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
                  {formError}
                </div>
              )}

              <form onSubmit={handleStep2Continue} className="space-y-4">
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#374151] mb-1.5">
                      Prénom
                    </label>
                    <input
                      type="text"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Aminata"
                      className="w-full px-3.5 py-2.5 bg-white border border-[#E5E7EB] rounded-xl text-xs sm:text-sm text-[#111827] focus:ring-1 focus:ring-[#111827] focus:outline-none transition-all placeholder:text-[#9CA3AF]"
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
                      placeholder="Diop"
                      className="w-full px-3.5 py-2.5 bg-white border border-[#E5E7EB] rounded-xl text-xs sm:text-sm text-[#111827] focus:ring-1 focus:ring-[#111827] focus:outline-none transition-all placeholder:text-[#9CA3AF]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#374151] mb-1.5">
                    Adresse email
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="aminata.diop@email.com"
                    className="w-full px-3.5 py-2.5 bg-white border border-[#E5E7EB] rounded-xl text-xs sm:text-sm text-[#111827] focus:ring-1 focus:ring-[#111827] focus:outline-none transition-all placeholder:text-[#9CA3AF]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#374151] mb-1.5">
                    Téléphone
                  </label>
                  <div className="flex rounded-xl overflow-hidden border border-[#E5E7EB] focus-within:ring-1 focus-within:ring-[#111827] transition-all">
                    <span className="inline-flex items-center px-3.5 bg-[#F9FAFB] text-[#4B5563] text-xs sm:text-sm font-semibold border-r border-[#E5E7EB] select-none">
                      {CHECKOUT_CONSTANTS.PHONE_PREFIX}
                    </span>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="77 123 45 67"
                      className="w-full px-3.5 py-2.5 bg-white text-xs sm:text-sm text-[#111827] focus:outline-none placeholder:text-[#9CA3AF]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#374151] mb-1.5">
                    Mot de passe
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="8 caractères minimum"
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

                  <div className="grid grid-cols-4 gap-1.5 mt-2">
                    <div
                      className={`h-1 rounded-full transition-all ${
                        strengthScore >= 1
                          ? strengthScore === 1
                            ? 'bg-red-400'
                            : 'bg-emerald-500'
                          : 'bg-gray-200'
                      }`}
                    />
                    <div
                      className={`h-1 rounded-full transition-all ${
                        strengthScore >= 2
                          ? strengthScore === 2
                            ? 'bg-amber-400'
                            : 'bg-emerald-500'
                          : 'bg-gray-200'
                      }`}
                    />
                    <div
                      className={`h-1 rounded-full transition-all ${
                        strengthScore >= 3 ? 'bg-emerald-500' : 'bg-gray-200'
                      }`}
                    />
                    <div
                      className={`h-1 rounded-full transition-all ${
                        strengthScore >= 4 ? 'bg-emerald-500' : 'bg-gray-200'
                      }`}
                    />
                  </div>

                  <p className="text-[11px] text-gray-500 mt-1">
                    {getStrengthLabel()}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 mt-1 text-[11px] text-gray-500">
                    <span
                      className={`flex items-center gap-1 transition-colors ${
                        hasMinLength ? 'text-emerald-600 font-medium' : 'text-gray-400'
                      }`}
                    >
                      <Check className="w-3 h-3 stroke-[2.5]" /> 8 caractères
                    </span>
                    <span
                      className={`flex items-center gap-1 transition-colors ${
                        hasNumber ? 'text-emerald-600 font-medium' : 'text-gray-400'
                      }`}
                    >
                      <Check className="w-3 h-3 stroke-[2.5]" /> Un chiffre
                    </span>
                    <span
                      className={`flex items-center gap-1 transition-colors ${
                        hasUppercase ? 'text-emerald-600 font-medium' : 'text-gray-400'
                      }`}
                    >
                      <Check className="w-3 h-3 stroke-[2.5]" /> Une majuscule
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#374151] mb-1.5">
                    Confirme ton mot de passe
                  </label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Retape ton mot de passe"
                    className="w-full px-3.5 py-2.5 bg-white border border-[#E5E7EB] rounded-xl text-xs sm:text-sm text-[#111827] focus:ring-1 focus:ring-[#111827] focus:outline-none transition-all placeholder:text-[#9CA3AF]"
                  />
                </div>

                <div className="pt-1">
                  <label className="flex items-start gap-2.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={acceptTerms}
                      onChange={(e) => {
                        setAcceptTerms(e.target.checked);
                        if (e.target.checked) setTermsError(false);
                      }}
                      className="w-4 h-4 mt-0.5 rounded border-gray-300 text-gray-900 focus:ring-gray-900 cursor-pointer"
                    />
                    <span className="text-xs text-gray-600 leading-snug">
                      J'accepte les{' '}
                      <span className="font-bold text-[#111827]">
                        conditions d'utilisation
                      </span>{' '}
                      et la{' '}
                      <span className="font-bold text-[#111827]">
                        politique de confidentialité
                      </span>{' '}
                      de Sunu Events.
                    </span>
                  </label>

                  {termsError && (
                    <p className="text-xs font-semibold text-red-500 mt-1.5">
                      Tu dois accepter les conditions pour continuer
                    </p>
                  )}
                </div>

                <div className="pt-4 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="px-5 py-2.5 rounded-full border border-gray-200 hover:bg-gray-50 text-xs font-semibold text-gray-700 flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Retour</span>
                  </button>

                  <button
                    type="submit"
                    className="px-7 py-3 rounded-full bg-[#121526] hover:bg-[#090B14] text-white font-bold text-xs sm:text-sm flex items-center gap-2 transition-all active:scale-95 shadow-xs cursor-pointer"
                  >
                    <span>Continuer</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ÉTAPE 3 : VÉRIFICATION DU NUMÉRO */}
          {currentStep === 3 && (
            <div className="bg-white rounded-[28px] sm:rounded-[36px] p-6 sm:p-10 lg:p-12 w-full max-w-md mx-auto shadow-[0_4px_30px_rgba(0,0,0,0.03)] border border-gray-100 text-center animate-in fade-in duration-300">
              <div className="w-12 h-12 rounded-2xl bg-[#EEF2F6] flex items-center justify-center mx-auto mb-4">
                <Phone className="w-5 h-5 text-gray-800" />
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-[#111827] tracking-tight">
                Vérifie ton numéro
              </h2>

              <p className="text-xs sm:text-sm text-gray-500 mt-1.5 leading-relaxed">
                On a envoyé un code à 6 chiffres au{' '}
                <span className="font-extrabold text-[#111827]">
                  +221 {phone || '77 123 45 67'}
                </span>
              </p>

              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="text-xs font-semibold text-[#FF5722] hover:underline mt-1.5 inline-block cursor-pointer"
              >
                Modifier le numéro
              </button>

              <form onSubmit={handleVerifyOtp} className="mt-6">
                <div className="flex items-center justify-center gap-2 sm:gap-2.5">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => {
                        otpInputsRef.current[index] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      className={`w-10 h-12 sm:w-11 sm:h-13 rounded-xl border text-center font-bold text-lg text-[#111827] transition-all focus:outline-none ${
                        digit
                          ? 'border-[#FF5722] bg-white'
                          : index === otp.findIndex((d) => !d) || (index === 0 && !otp[0])
                          ? 'border-[#FF5722] ring-2 ring-[#FF5722]/15 bg-white'
                          : 'border-gray-200 bg-white'
                      }`}
                    />
                  ))}
                </div>

                {otpError && (
                  <p className="text-xs font-semibold text-red-500 mt-2.5">
                    {otpError}
                  </p>
                )}

                <div className="mt-4 text-xs text-gray-500">
                  <span>Aucun code reçu ? </span>
                  {countdown > 0 ? (
                    <span className="font-semibold text-gray-600">
                      Renvoyer dans {countdown}s
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResendCode}
                      disabled={isResending}
                      className="font-bold text-[#FF5722] hover:underline cursor-pointer"
                    >
                      {isResending ? 'Envoi en cours...' : 'Renvoyer le code'}
                    </button>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 px-6 rounded-full bg-[#121526] hover:bg-[#090B14] text-white font-bold text-xs sm:text-sm transition-all active:scale-98 cursor-pointer mt-5 shadow-xs"
                >
                  Vérifier & continuer
                </button>
              </form>

              <div className="mt-5 p-3.5 bg-[#F9FAFB] border border-gray-100 rounded-xl flex items-start gap-2.5 text-left">
                <ShieldCheck className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                <p className="text-[11px] text-gray-500 leading-relaxed">
                  Cette vérification protège ton compte et garantit que tes billets te sont bien destinés.
                </p>
              </div>

              <div className="mt-4">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="text-xs font-semibold text-gray-500 hover:text-gray-900 inline-flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Retour</span>
                </button>
              </div>
            </div>
          )}

          {/* ÉTAPE 4 : PRÉFÉRENCES */}
          {currentStep === 4 && (
            <div className="bg-white rounded-[28px] sm:rounded-[36px] p-6 sm:p-10 lg:p-12 w-full max-w-xl mx-auto shadow-[0_4px_30px_rgba(0,0,0,0.03)] border border-gray-100 text-left animate-in fade-in duration-300">
              <div className="mb-4">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight">
                  Qu'est-ce qui te fait vibrer ?
                </h2>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                  Sélectionne au moins 3 catégories pour des recommandations sur mesure.
                </p>
              </div>

              <div className="mb-5 inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#F3F4F6] rounded-full text-xs text-gray-700 font-medium select-none">
                <span
                  className={`font-bold px-1.5 py-0.5 rounded-md text-[11px] ${
                    selectedCategories.length >= 3
                      ? 'bg-[#10B981] text-white'
                      : 'bg-[#FF5722]/10 text-[#FF5722]'
                  }`}
                >
                  {selectedCategories.length}
                </span>
                <span>/ 3 minimum sélectionnées</span>
              </div>

              <div className="flex flex-wrap gap-2.5 sm:gap-3 select-none">
                {CATEGORIES_LIST.map((category) => {
                  const isSelected = selectedCategories.includes(category.id);
                  const IconComponent = category.icon;

                  return (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() => toggleCategory(category.id)}
                      className={`px-4 py-2 sm:py-2.5 rounded-full text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer active:scale-95 ${
                        isSelected
                          ? 'bg-[#121526] text-white shadow-xs'
                          : 'bg-white border border-[#E5E7EB] text-[#374151] hover:border-gray-400 hover:bg-gray-50'
                      }`}
                    >
                      <IconComponent
                        className={`w-3.5 h-3.5 ${
                          isSelected ? 'text-white' : 'text-gray-600'
                        }`}
                      />
                      <span>{category.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-6">
                <label className="block text-xs font-semibold text-[#374151] mb-1.5">
                  Ta ville
                </label>
                <div className="relative">
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border border-[#E5E7EB] rounded-xl text-xs sm:text-sm text-[#111827] focus:ring-1 focus:ring-[#111827] focus:outline-none transition-all appearance-none cursor-pointer pr-10"
                  >
                    {SENEGAL_CITIES.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <div className="pt-6 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="px-5 py-2.5 rounded-full border border-gray-200 hover:bg-gray-50 text-xs font-semibold text-gray-700 flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Retour</span>
                </button>

                <button
                  type="button"
                  onClick={handleStep4Continue}
                  disabled={selectedCategories.length < 3}
                  className={`px-7 py-3 rounded-full font-bold text-xs sm:text-sm flex items-center gap-2 transition-all active:scale-95 shadow-xs cursor-pointer ${
                    selectedCategories.length >= 3
                      ? 'bg-[#121526] hover:bg-[#090B14] text-white'
                      : 'bg-gray-400 text-white cursor-not-allowed opacity-80'
                  }`}
                >
                  <span>Terminer</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="mt-3.5 text-right">
                <button
                  type="button"
                  onClick={handleStep4Continue}
                  className="text-xs text-gray-400 hover:text-gray-700 hover:underline cursor-pointer font-medium"
                >
                  Passer cette étape
                </button>
              </div>
            </div>
          )}
        </main>
      ) : (
        /* ========================================================= */
        /* ÉTAPE 5 : ÉCRAN DE BIENVENUE & CONFIRMATION ("Bienvenue, Aminata !") */
        /* ========================================================= */
        <div className="flex-1 flex flex-col">
          {/* BANDEAU SUPÉRIEUR SOMBRE */}
          <div className="bg-[#12142B] text-white py-12 sm:py-16 px-4 text-center relative overflow-hidden">
            {/* Halo lumineux décoratif */}
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] pointer-events-none -z-0"
              style={{
                borderRadius: '170px',
                background: '#FF5722',
                opacity: 0.15,
                filter: 'blur(90px)',
              }}
            />

            <div className="relative z-10 max-w-xl mx-auto">
              {/* Badge orange avec coche */}
              <div className="w-14 h-14 rounded-full bg-[#FF5722] text-white flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Check className="w-7 h-7 stroke-[3]" />
              </div>

              {/* Titre */}
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Bienvenue, {firstName || 'Aminata'} !
              </h1>

              {/* Sous-titre */}
              <p className="text-xs sm:text-sm text-[#9CA3AF] mt-2 leading-relaxed">
                Ton compte est prêt. Direction les meilleurs évènements du Sénégal.
              </p>
            </div>
          </div>

          {/* CONTENU PRINCIPAL SUR FOND CLAIR */}
          <main className="flex-1 max-w-xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-10 space-y-4">
            {/* CARTE PROFIL UTILISATEUR */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-100 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-3.5">
                {/* Avatar utilisateur */}
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-amber-300 bg-amber-100 flex items-center justify-center shrink-0">
                  <img
                    src="/images/wally.png"
                    alt={firstName}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  <Users className="w-5 h-5 text-amber-800" />
                </div>

                <div>
                  <h3 className="font-bold text-base text-[#111827]">
                    {firstName} {lastName}
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {email || 'aminata.diop@email.com'}
                  </p>
                </div>
              </div>

              {/* Badge rôle & ville */}
              <div className="bg-[#FFF1EE] text-[#FF5722] font-bold text-[10px] sm:text-xs px-3 py-1 rounded-full uppercase tracking-wider">
                {selectedRole === 'organizer' ? 'ORGANISATEUR' : 'ACHETEUR'} • {selectedCity.toUpperCase()}
              </div>
            </div>

            {/* 3 CARTES D'AVANTAGES / ACTIONS CLÉS */}
            <div className="space-y-3">
              {/* Carte 1 : Découverte */}
              <div className="bg-[#F8F9FA] rounded-2xl p-4 sm:p-5 flex items-center gap-3.5 sm:gap-4 text-left border border-gray-100/60 hover:bg-gray-100/70 transition-colors">
                <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-2xs text-[#0D9488] shrink-0">
                  <Compass className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-[#111827]">
                    Découvre des évènements près de toi
                  </h4>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    Sélection personnalisée selon tes goûts et {selectedCity}
                  </p>
                </div>
              </div>

              {/* Carte 2 : Alertes */}
              <div className="bg-[#F8F9FA] rounded-2xl p-4 sm:p-5 flex items-center gap-3.5 sm:gap-4 text-left border border-gray-100/60 hover:bg-gray-100/70 transition-colors">
                <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-2xs text-[#0D9488] shrink-0">
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-[#111827]">
                    Active les alertes
                  </h4>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    Sois prévenu(e) dès qu'un artiste ou une équipe que tu suis programme une date
                  </p>
                </div>
              </div>

              {/* Carte 3 : Amis */}
              <div className="bg-[#F8F9FA] rounded-2xl p-4 sm:p-5 flex items-center gap-3.5 sm:gap-4 text-left border border-gray-100/60 hover:bg-gray-100/70 transition-colors">
                <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-2xs text-[#0D9488] shrink-0">
                  <UserPlus className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-[#111827]">
                    Invite tes amis
                  </h4>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    Partage tes évènements favoris et sortez ensemble
                  </p>
                </div>
              </div>
            </div>

            {/* BOUTONS D'ACTION */}
            <div className="pt-6 flex items-center justify-center gap-3 sm:gap-4">
              <button
                type="button"
                onClick={onNavigateHome}
                className="px-6 py-3 rounded-full border border-gray-200 hover:bg-gray-50 text-xs sm:text-sm font-semibold text-gray-800 transition-all cursor-pointer"
              >
                Retour à l'accueil
              </button>

              <button
                type="button"
                onClick={handleFinishOnboarding}
                className="px-7 py-3.5 rounded-full bg-[#121526] hover:bg-[#090B14] text-white font-bold text-xs sm:text-sm flex items-center gap-2 transition-all active:scale-95 shadow-xs cursor-pointer"
              >
                <span>Accéder à mon espace</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </main>
        </div>
      )}

      {/* ========================================================= */}
      {/* 3. PIED DE PAGE GLOBAL */}
      {/* ========================================================= */}
      <Footer onNavigateHome={onNavigateHome} />
    </div>
  );
};
