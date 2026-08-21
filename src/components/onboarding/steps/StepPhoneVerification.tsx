import React, { useState, useEffect, useRef } from 'react';
import { Loader2, Phone, Shield } from 'lucide-react';
import { OnboardingFormData } from '../../../types/onboarding';
import { authService } from '../../../services/api/authService';

export interface StepPhoneVerificationProps {
  formData: OnboardingFormData;
  setFormData: React.Dispatch<React.SetStateAction<OnboardingFormData>>;
  onNext: () => void;
  onPrev: () => void;
}

export const StepPhoneVerification: React.FC<StepPhoneVerificationProps> = ({
  formData,
  setFormData,
  onNext,
  onPrev,
}) => {
  const [countdown, setCountdown] = useState(59);
  const [canResend, setCanResend] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const handleOtpChange = (index: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    setErrorMsg('');
    const newOtp = [...formData.otpCode];
    newOtp[index] = val.slice(-1);
    setFormData((p) => ({ ...p, otpCode: newOtp }));

    if (val && index < 5) {
      inputRefs.current[index + 1]?.focus();
      setFocusedIndex(index + 1);
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === 'Backspace' && !formData.otpCode[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
      setFocusedIndex(index - 1);
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted) {
      const newOtp = [...formData.otpCode];
      for (let i = 0; i < 6; i++) {
        newOtp[i] = pasted[i] || '';
      }
      setFormData((p) => ({ ...p, otpCode: newOtp }));
      const lastIndex = Math.min(pasted.length, 5);
      inputRefs.current[lastIndex]?.focus();
      setFocusedIndex(lastIndex);
    }
  };

  const getFormattedPhone = () => {
    const rawPhone = formData.phone.replace(/\s+/g, '');
    return rawPhone.startsWith('+221')
      ? rawPhone
      : rawPhone.startsWith('221')
      ? `+${rawPhone}`
      : `+221${rawPhone}`;
  };

  const handleResend = async () => {
    setIsResending(true);
    setErrorMsg('');
    try {
      await authService.resendOtp(getFormattedPhone());
      setCountdown(59);
      setCanResend(false);
      setFormData((p) => ({ ...p, otpCode: ['', '', '', '', '', ''] }));
      inputRefs.current[0]?.focus();
      setFocusedIndex(0);
    } catch (err: unknown) {
      const message = (err as Error)?.message || "Impossible d'envoyer un nouveau code.";
      setErrorMsg(message);
    } finally {
      setIsResending(false);
    }
  };

  const handleVerify = async () => {
    const code = formData.otpCode.join('');
    if (code.length !== 6) {
      setErrorMsg('Veuillez saisir les 6 chiffres du code reçu par SMS.');
      return;
    }
    setErrorMsg('');
    setIsVerifying(true);

    try {
      await authService.verifyOtp({
        phone: getFormattedPhone(),
        otp_code: code,
      });
      onNext();
    } catch (err: unknown) {
      const message =
        (err as Error)?.message || 'Code de vérification invalide ou expiré.';
      setErrorMsg(message);
    } finally {
      setIsVerifying(false);
    }
  };

  const isComplete = formData.otpCode.every((digit) => digit.length === 1);

  return (
    <div className="space-y-5 text-center animate-in fade-in duration-300">
      {/* 1. Icône Téléphone dans un carré arrondi gris */}
      <div className="w-14 h-14 rounded-2xl bg-[#F3F4F6] text-[#111827] flex items-center justify-center mx-auto shadow-2xs">
        <Phone className="w-6 h-6 fill-[#111827]" />
      </div>

      {/* 2. Titre & Numéro */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-[#111827] tracking-tight">
          Vérifie ton numéro
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1.5 leading-relaxed">
          On a envoyé un code à 6 chiffres au{' '}
          <span className="font-bold text-[#111827]">
            {formData.phone ? getFormattedPhone() : '+221 77 123 45 67'}
          </span>
        </p>
        <button
          type="button"
          onClick={onPrev}
          className="text-xs text-[#FF5722] font-semibold hover:underline cursor-pointer mt-1.5 inline-block"
        >
          Modifier le numéro
        </button>
      </div>

      {errorMsg && (
        <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-semibold max-w-xs mx-auto">
          {errorMsg}
        </div>
      )}

      {/* 3. 6 Boîtes OTP avec bordure corail active */}
      <div
        className="flex items-center justify-center gap-2 sm:gap-2.5 py-1"
        onPaste={handlePaste}
      >
        {formData.otpCode.map((digit, idx) => {
          const isFocused = focusedIndex === idx;
          const hasValue = digit.length > 0;

          return (
            <input
              key={idx}
              ref={(el) => {
                inputRefs.current[idx] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onFocus={() => setFocusedIndex(idx)}
              onChange={(e) => handleOtpChange(idx, e.target.value)}
              onKeyDown={(e) => handleKeyDown(idx, e)}
              className={`w-11 h-14 sm:w-12 sm:h-15 text-center text-xl sm:text-2xl font-black rounded-2xl outline-none transition-all bg-white shadow-2xs ${
                isFocused || (idx === 0 && !hasValue)
                  ? 'border-2 border-[#FF5722]'
                  : hasValue
                  ? 'border-2 border-gray-900'
                  : 'border border-gray-200 hover:border-gray-300'
              }`}
            />
          );
        })}
      </div>

      {/* 4. Renvoi du code */}
      <div className="text-xs text-gray-500">
        {canResend ? (
          <p>
            Aucun code reçu ?{' '}
            <button
              type="button"
              disabled={isResending}
              onClick={handleResend}
              className="font-bold text-[#FF5722] hover:underline cursor-pointer disabled:opacity-50"
            >
              {isResending ? 'Envoi en cours...' : 'Renvoyer le code'}
            </button>
          </p>
        ) : (
          <p>
            Aucun code reçu ?{' '}
            <span className="text-gray-700 font-medium">
              Renvoyer dans {countdown}s
            </span>
          </p>
        )}
      </div>

      {/* 5. Bouton Principal : Vérifier & continuer */}
      <div className="pt-2">
        <button
          type="button"
          disabled={isVerifying}
          onClick={handleVerify}
          className="w-full py-3.5 px-6 rounded-full bg-[#12142B] hover:bg-[#0A0C1B] text-white font-bold text-xs sm:text-sm shadow-xs transition-all active:scale-98 cursor-pointer disabled:opacity-75 flex items-center justify-center gap-2"
        >
          {isVerifying && <Loader2 className="w-4 h-4 animate-spin" />}
          <span>{isVerifying ? 'Vérification en cours...' : 'Vérifier & continuer'}</span>
        </button>
      </div>

      {/* 6. Encart de Sécurité Beige / Warm */}
      <div className="p-3.5 sm:p-4 rounded-2xl bg-[#FBF7EE] border border-[#F3E8D2] flex items-start gap-2.5 text-left text-[11px] text-gray-600 leading-relaxed shadow-2xs">
        <Shield className="w-4 h-4 text-gray-500 shrink-0 mt-0.5" />
        <span>
          Cette vérification protège ton compte et garantit que tes billets te sont bien destinés.
        </span>
      </div>

      {/* 7. Bouton Retour textuel discret centré */}
      <div className="pt-1">
        <button
          type="button"
          onClick={onPrev}
          className="text-xs font-semibold text-gray-500 hover:text-gray-900 transition-colors cursor-pointer"
        >
          ← Retour
        </button>
      </div>
    </div>
  );
};
