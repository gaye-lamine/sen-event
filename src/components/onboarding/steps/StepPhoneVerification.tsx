import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, ArrowRight, Phone, ShieldCheck } from 'lucide-react';
import { OnboardingFormData } from '../../../types/onboarding';

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
    const newOtp = [...formData.otpCode];
    newOtp[index] = val.slice(-1);
    setFormData((p) => ({ ...p, otpCode: newOtp }));

    if (val && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === 'Backspace' && !formData.otpCode[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
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
    }
  };

  const handleResend = () => {
    setCountdown(59);
    setCanResend(false);
    setFormData((p) => ({ ...p, otpCode: ['', '', '', '', '', ''] }));
    inputRefs.current[0]?.focus();
  };

  const isComplete = formData.otpCode.every((digit) => digit.length === 1);

  return (
    <div className="space-y-6 text-center animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
          Vérifie ton numéro
        </h1>
        <p className="text-sm text-gray-500 mt-2">
          Nous avons envoyé un code à 6 chiffres par SMS au{' '}
          <span className="font-bold text-gray-800">
            +221 {formData.phone || '77 123 45 67'}
          </span>
          .
        </p>
      </div>

      {/* 6 Boîtes OTP */}
      <div className="flex items-center justify-center gap-2 sm:gap-3 py-4" onPaste={handlePaste}>
        {formData.otpCode.map((digit, idx) => (
          <input
            key={idx}
            ref={(el) => {
              inputRefs.current[idx] = el;
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleOtpChange(idx, e.target.value)}
            onKeyDown={(e) => handleKeyDown(idx, e)}
            className="w-11 h-13 sm:w-13 sm:h-15 text-center text-xl sm:text-2xl font-black rounded-xl border-2 border-gray-200 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 outline-none transition-all bg-white"
          />
        ))}
      </div>

      {/* Décompte et Renvoi */}
      <div className="text-xs text-gray-500">
        {canResend ? (
          <p>
            Tu n'as rien reçu ?{' '}
            <button
              type="button"
              onClick={handleResend}
              className="font-bold text-brand-600 hover:underline cursor-pointer"
            >
              Renvoyer le code
            </button>
          </p>
        ) : (
          <p>
            Renvoyer le code dans{' '}
            <span className="font-bold text-gray-800">
              00:{countdown < 10 ? `0${countdown}` : countdown}
            </span>
          </p>
        )}
      </div>

      {/* Note de Sécurité */}
      <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center gap-2 text-xs text-gray-500">
        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
        <span>Vérification sécurisée pour protéger tes billets</span>
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
          <span>Valider</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
