import React, { useState } from 'react';
import { ShieldCheck, CheckCircle, QrCode, CreditCard, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { PaymentMethodType, PaymentStepProps } from '../../types';

/**
 * @component PaymentStep
 * @description Troisième étape du tunnel d'achat : sélection du mode de paiement local (Wave, OM, CB),
 * saisie du numéro avec préfixe +221, validation des CGV et confirmation avec confettis festifs.
 * @param {PaymentStepProps} props - Contrat de propriétés du composant
 */
export const PaymentStep: React.FC<PaymentStepProps> = ({
  event,
  totalAmount,
  customerName,
  customerPhone,
  customerEmail,
  onBack,
  onPaymentComplete,
}) => {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodType>('wave');
  const [phone, setPhone] = useState(customerPhone || '77 123 45 67');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(true);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const formattedAmount = new Intl.NumberFormat('fr-FR').format(totalAmount);

  const handlePaySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setHasAttemptedSubmit(true);

    if (!acceptedTerms) return;

    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#FFC23C', '#10B981', '#1DC6F6', '#FF7900'],
      });
      onPaymentComplete?.();
    }, 1200);
  };

  if (isSuccess) {
    return (
      <div className="bg-white rounded-3xl sm:rounded-[32px] p-6 sm:p-8 lg:p-10 border border-gray-100 shadow-sm text-center animate-fadeIn">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8" />
        </div>

        <h2 className="text-2xl font-extrabold text-gray-900">
          Paiement réussi !
        </h2>
        <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-md mx-auto">
          Vos billets ont été confirmés. Un SMS vous a été envoyé au{' '}
          <strong className="text-gray-900">{phone || '77 123 45 67'}</strong> et vos e-tickets à{' '}
          <strong className="text-gray-900">{customerEmail || 'aminata.diop@email.com'}</strong>.
        </p>

        <div className="my-6 p-5 sm:p-6 bg-gradient-to-br from-gray-900 to-gray-800 text-white rounded-2xl text-left shadow-lg">
          <div className="flex justify-between items-start gap-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-2.5 py-0.5 rounded-full">
                Billet Certifié
              </span>
              <h3 className="font-extrabold text-base sm:text-lg text-white mt-1.5">
                {event.title}
              </h3>
              <p className="text-xs text-gray-300 mt-0.5">
                {event.date} • {event.location}
              </p>
            </div>

            <div className="bg-white p-2 rounded-xl text-gray-900 shadow-inner flex flex-col items-center flex-shrink-0">
              <QrCode className="w-14 h-14" />
              <span className="text-[9px] font-mono font-bold mt-1 text-gray-700">
                SN-EVT-2026
              </span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-gray-700/60 flex justify-between items-center text-xs text-gray-300">
            <div>
              <span className="text-gray-400">Titulaire : </span>
              <span className="font-semibold text-white">{customerName || 'Aminata Diop'}</span>
            </div>
            <div>
              <span className="text-gray-400">Total payé : </span>
              <span className="font-bold text-amber-400">{formattedAmount} {event.currency || 'F'}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl sm:rounded-[32px] p-6 sm:p-8 lg:p-10 border border-gray-100/90 shadow-sm text-left">
      <div className="mb-6 sm:mb-7">
        <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
          Paiement
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          Choisis ton moyen de paiement préféré.
        </p>
      </div>

      <form onSubmit={handlePaySubmit} className="space-y-5">
        <div className="grid grid-cols-3 gap-3 sm:gap-4">
          <button
            type="button"
            onClick={() => setSelectedMethod('wave')}
            className={`py-4 sm:py-5 px-3 rounded-2xl border flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${
              selectedMethod === 'wave'
                ? 'border-gray-900 bg-white ring-2 ring-gray-900/90 shadow-sm'
                : 'border-gray-200 hover:border-gray-300 bg-white'
            }`}
          >
            <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-2xl flex items-center justify-center bg-cyan-50/60 p-1">
              <img
                src="/images/wave.png"
                alt="Wave"
                className="w-8 h-8 sm:w-10 sm:h-10 object-contain"
              />
            </div>
            <span className="text-xs sm:text-[13px] font-bold text-gray-900">Wave</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedMethod('orange_money')}
            className={`py-4 sm:py-5 px-3 rounded-2xl border flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${
              selectedMethod === 'orange_money'
                ? 'border-gray-900 bg-white ring-2 ring-gray-900/90 shadow-sm'
                : 'border-gray-200 hover:border-gray-300 bg-white'
            }`}
          >
            <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-2xl flex items-center justify-center bg-orange-50/60 p-1">
              <img
                src="/images/orange-money.png"
                alt="Orange Money"
                className="w-8 h-8 sm:w-10 sm:h-10 object-contain"
              />
            </div>
            <span className="text-xs sm:text-[13px] font-bold text-gray-900">Orange Money</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedMethod('card')}
            className={`py-4 sm:py-5 px-3 rounded-2xl border flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${
              selectedMethod === 'card'
                ? 'border-gray-900 bg-white ring-2 ring-gray-900/90 shadow-sm'
                : 'border-gray-200 hover:border-gray-300 bg-white'
            }`}
          >
            <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-2xl bg-[#0F141C] text-white flex items-center justify-center shadow-xs">
              <CreditCard className="w-5 h-5 sm:w-6 sm:h-6 text-white stroke-[2]" />
            </div>
            <span className="text-xs sm:text-[13px] font-bold text-gray-900">Carte bancaire</span>
          </button>
        </div>

        {selectedMethod !== 'card' ? (
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              {selectedMethod === 'wave' ? 'Numéro Wave' : 'Numéro Orange Money'}
            </label>
            <div className="flex rounded-2xl overflow-hidden border border-gray-200 focus-within:ring-2 focus-within:ring-gray-900 transition-all">
              <span className="inline-flex items-center px-4 bg-gray-50 text-gray-600 text-xs sm:text-sm font-semibold border-r border-gray-200 select-none">
                +221
              </span>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="77 123 45 67"
                className="w-full px-4 py-3 bg-white text-xs sm:text-sm text-gray-900 focus:outline-none placeholder:text-gray-400"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Numéro de carte
              </label>
              <input
                type="text"
                required
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                placeholder="4000 1234 5678 9010"
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-2xl text-xs sm:text-sm focus:ring-2 focus:ring-gray-900 focus:outline-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Date d'expiration
                </label>
                <input
                  type="text"
                  required
                  value={cardExpiry}
                  onChange={(e) => setCardExpiry(e.target.value)}
                  placeholder="MM/AA"
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-2xl text-xs sm:text-sm focus:ring-2 focus:ring-gray-900 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  CVC
                </label>
                <input
                  type="text"
                  required
                  value={cardCvc}
                  onChange={(e) => setCardCvc(e.target.value)}
                  placeholder="123"
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-2xl text-xs sm:text-sm focus:ring-2 focus:ring-gray-900 focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        <div className="p-3.5 sm:p-4 rounded-2xl bg-[#EAF7F1] border border-emerald-100 flex items-center gap-2.5 text-xs text-[#178558]">
          <ShieldCheck className="w-4 h-4 text-[#178558] flex-shrink-0" />
          <p className="leading-snug">
            {selectedMethod === 'wave'
              ? 'Tu recevras une notification Wave sur ton téléphone pour confirmer le paiement.'
              : selectedMethod === 'orange_money'
              ? 'Tu recevras un prompt Orange Money sur ton téléphone pour confirmer avec ton code secret.'
              : 'Paiement 3D-Secure chiffré et sécurisé.'}
          </p>
        </div>

        <div className="pt-1">
          <label className="flex items-start gap-2.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
              className="w-4 h-4 mt-0.5 rounded border-gray-300 text-gray-900 focus:ring-gray-900 cursor-pointer"
            />
            <span className="text-xs text-gray-500 leading-tight">
              J'accepte les{' '}
              <a href="#" className="underline text-gray-700 hover:text-black">
                conditions générales de vente
              </a>{' '}
              et la politique de remboursement.
            </span>
          </label>

          {!acceptedTerms && hasAttemptedSubmit && (
            <p className="text-[11px] text-[#FF4747] font-medium mt-1.5">
              Tu dois accepter les conditions pour continuer
            </p>
          )}
        </div>

        <div className="flex items-center justify-between pt-6 border-t border-gray-100 mt-6">
          <button
            onClick={onBack}
            type="button"
            className="px-6 py-2.5 rounded-full border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 active:scale-95 transition-all cursor-pointer"
          >
            Retour
          </button>

          <button
            type="submit"
            disabled={isProcessing}
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#0F141C] text-white text-xs sm:text-sm font-bold rounded-full hover:bg-black active:scale-98 transition-all shadow-md cursor-pointer disabled:opacity-50"
          >
            <span>{isProcessing ? 'Validation en cours...' : 'Payer maintenant'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};
