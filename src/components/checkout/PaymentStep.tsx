import React, { useState, useEffect, useRef } from 'react';
import {
  ShieldCheck,
  CreditCard,
  ArrowRight,
  Loader2,
  ExternalLink,
  XCircle,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { PaymentMethodType, PaymentStepProps } from '../../types';
import { formatPrice } from '../../utils';
import { CHECKOUT_CONSTANTS } from '../../constants';
import { orderService } from '../../services/api/orderService';
import { InTouchPaymentMethod } from '../../types/intouch-order';

/**
 * @component PaymentStep
 * @description Troisième étape du tunnel d'achat :
 * - Sur Mobile : Bouton direct vers le DeepLink (Wave / MaxIt).
 * - Sur PC : QR Code ultra-épuré avec redirection automatique dès détection de validation.
 * @param {PaymentStepProps} props - Contrat de propriétés du composant
 */
export const PaymentStep: React.FC<PaymentStepProps> = ({
  event,
  tiers,
  quantities,
  holders,
  totalAmount,
  customerFirstName,
  customerLastName,
  customerPhone,
  customerEmail,
  onBack,
  onPaymentComplete,
}) => {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodType>('orange_money');
  const [phone, setPhone] = useState(
    customerPhone || CHECKOUT_CONSTANTS.DEFAULT_DEMO_BUYER.PHONE
  );
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(true);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAwaitingPayment, setIsAwaitingPayment] = useState(false);
  const [activeOrderNumber, setActiveOrderNumber] = useState<string>('');
  const [deepLink, setDeepLink] = useState<string | null>(null);
  const [qrCodeBase64, setQrCodeBase64] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isMobileDevice, setIsMobileDevice] = useState(false);

  const pollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const checkMobile = () => {
      const ua = navigator.userAgent || navigator.vendor || '';
      return (
        /android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(ua.toLowerCase()) ||
        window.innerWidth < 768
      );
    };
    setIsMobileDevice(checkMobile());
  }, []);

  const stopPolling = () => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      stopPolling();
    };
  }, []);

  const isSuccessStatus = (status?: string | null): boolean => {
    if (!status) return false;
    const s = String(status).toLowerCase().trim();
    return ['success', 'confirmed', 'paid', 'valid', 'completed', 'successful'].includes(s);
  };

  const isFailedStatus = (status?: string | null): boolean => {
    if (!status) return false;
    const s = String(status).toLowerCase().trim();
    return ['failed', 'cancelled', 'rejected', 'expired', 'refused'].includes(s);
  };

  const checkStatusOnce = async (txId: string, orderNum: string) => {
    try {
      if (txId) {
        try {
          const statusRes = await orderService.getPaymentStatus(txId);
          const pStatus = statusRes.data?.status;
          const oStatus = statusRes.data?.order?.status;

          if (isSuccessStatus(pStatus) || isSuccessStatus(oStatus)) {
            stopPolling();
            setIsAwaitingPayment(false);
            confetti({
              particleCount: 120,
              spread: 80,
              origin: { y: 0.6 },
              colors: ['#FFC23C', '#10B981', '#1DC6F6', '#FF7900'],
            });
            onPaymentComplete?.(orderNum);
            return true;
          }

          if (isFailedStatus(pStatus) || isFailedStatus(oStatus)) {
            stopPolling();
            setIsAwaitingPayment(false);
            setErrorMessage('La transaction a été refusée ou a expiré sur votre téléphone.');
            return false;
          }
        } catch {
          // Ignored
        }
      }

      if (orderNum) {
        try {
          const orderRes = await orderService.getOrderDetails(orderNum);
          if (isSuccessStatus(orderRes.data?.status)) {
            stopPolling();
            setIsAwaitingPayment(false);
            confetti({
              particleCount: 120,
              spread: 80,
              origin: { y: 0.6 },
              colors: ['#FFC23C', '#10B981', '#1DC6F6', '#FF7900'],
            });
            onPaymentComplete?.(orderNum);
            return true;
          }
        } catch {
          // Ignored
        }
      }
    } catch {
      // Polling network retry
    }
    return false;
  };

  const handleCancelPayment = () => {
    stopPolling();
    setIsAwaitingPayment(false);
    setDeepLink(null);
    setQrCodeBase64(null);
    setErrorMessage(null);
  };

  const handlePaySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setHasAttemptedSubmit(true);
    setErrorMessage(null);

    if (!acceptedTerms) return;

    setIsSubmitting(true);

    try {
      const formattedPhone = phone.startsWith('+')
        ? phone
        : `+221${phone.replace(/\s+/g, '')}`;

      const itemsPayload = tiers
        .filter((t) => (quantities[t.id] || 0) > 0)
        .map((t) => {
          const qty = quantities[t.id] || 1;
          const tierHolders = holders
            .filter((h) => h.tierName.toLowerCase() === t.name.toLowerCase())
            .map((h) => {
              const parts = h.fullName.trim().split(' ');
              return {
                firstName: parts[0] || customerFirstName || 'Titulaire',
                lastName: parts.slice(1).join(' ') || customerLastName || 'Client',
              };
            });

          const validHolders =
            tierHolders.length === qty
              ? tierHolders
              : Array.from({ length: qty }, () => ({
                  firstName: customerFirstName || 'Titulaire',
                  lastName: customerLastName || 'Client',
                }));

          return {
            ticketTypeId: t.id,
            quantity: qty,
            holders: validHolders,
          };
        });

      const orderRes = await orderService.createOrder({
        event_id: event.id,
        customer: {
          firstName: customerFirstName || 'Client',
          lastName: customerLastName || 'SunuEvents',
          email: customerEmail || 'client@email.sn',
          phone: formattedPhone,
        },
        items: itemsPayload,
      });

      const orderNumber = orderRes.data?.orderNumber || CHECKOUT_CONSTANTS.DEFAULT_ORDER_NUMBER;
      setActiveOrderNumber(orderNumber);

      const inTouchMethod: InTouchPaymentMethod =
        selectedMethod === 'orange_money'
          ? 'orange_money'
          : selectedMethod === 'wave'
          ? 'wave'
          : 'card';

      const paymentRes = await orderService.initiatePayment({
        order_number: orderNumber,
        recipientPhone: formattedPhone,
        paymentMethod: inTouchMethod,
        recipientEmail: customerEmail,
        recipientFirstName: customerFirstName,
        recipientLastName: customerLastName,
      });

      const returnedDeepLink =
        paymentRes.data?.deepLink ||
        paymentRes.data?.MAXIT ||
        paymentRes.data?.OM ||
        null;

      if (returnedDeepLink) {
        setDeepLink(returnedDeepLink);
        if (isMobileDevice) {
          window.location.href = returnedDeepLink;
        }
      }
      if (paymentRes.data?.qrCode) {
        setQrCodeBase64(paymentRes.data.qrCode);
      }

      const transactionId =
        paymentRes.data?.idFromClient ||
        paymentRes.data?.numTransaction ||
        paymentRes.data?.idFromGu ||
        orderNumber;

      setIsSubmitting(false);
      setIsAwaitingPayment(true);

      stopPolling();
      pollIntervalRef.current = setInterval(() => {
        checkStatusOnce(transactionId, orderNumber);
      }, 3000);
    } catch (err: unknown) {
      setIsSubmitting(false);
      const message = err instanceof Error ? err.message : 'Erreur de communication avec le serveur.';
      setErrorMessage(`Erreur InTouch : ${message}`);
    }
  };

  if (isAwaitingPayment) {
    const qrImageSource = qrCodeBase64
      ? qrCodeBase64.startsWith('data:')
        ? qrCodeBase64
        : `data:image/png;base64,${qrCodeBase64}`
      : deepLink
      ? `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(
          deepLink
        )}`
      : `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(
          `SUNUEVENTS-${activeOrderNumber}`
        )}`;

    return (
      <div className="bg-white rounded-3xl sm:rounded-[32px] p-6 sm:p-8 lg:p-10 border border-gray-100 shadow-sm text-center animate-fadeIn">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100 text-left">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
              {selectedMethod === 'orange_money' ? 'Orange Money' : 'Wave'}
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Commande #{activeOrderNumber}
            </p>
          </div>

          <div className="text-left sm:text-right bg-gray-50 p-3 rounded-2xl sm:bg-transparent sm:p-0">
            <span className="text-xs text-gray-400 block font-medium">Total</span>
            <span className="text-xl sm:text-2xl font-black text-gray-900">
              {formatPrice(totalAmount, event.currency)}
            </span>
          </div>
        </div>

        {isMobileDevice && deepLink ? (
          <div className="my-6 p-5 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-2xl text-center space-y-3 shadow-md">
            <a
              href={deepLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white text-gray-900 font-extrabold text-xs sm:text-sm rounded-full shadow-lg active:scale-95 transition-all w-full"
            >
              <span>
                {selectedMethod === 'orange_money'
                  ? "Ouvrir l'application Orange Money (MaxIt)"
                  : "Ouvrir l'application Wave"}
              </span>
              <ExternalLink className="w-4 h-4 text-orange-500" />
            </a>
          </div>
        ) : (
          <div className="my-8 flex flex-col items-center justify-center">
            <div className="p-4 bg-white border-2 border-gray-100 rounded-3xl shadow-lg inline-block">
              <img
                src={qrImageSource}
                alt="QR Code"
                className="w-56 h-56 sm:w-64 sm:h-64 object-contain rounded-2xl"
              />
            </div>

            <p className="text-sm sm:text-base font-extrabold text-gray-900 mt-4 tracking-tight">
              Scannez pour payer
            </p>
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-4">
          <div className="flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-orange-500" />
          </div>

          <button
            type="button"
            onClick={handleCancelPayment}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-500 hover:text-red-600 transition-colors cursor-pointer rounded-lg hover:bg-gray-50"
          >
            <XCircle className="w-4 h-4" />
            <span>Annuler</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl sm:rounded-[32px] p-6 sm:p-8 lg:p-10 border border-gray-100/90 shadow-sm text-left">
      <div className="mb-6 sm:mb-7">
        <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
          Paiement InTouch
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          Choisis ton moyen de paiement local sécurisé (Wave ou Orange Money).
        </p>
      </div>

      {errorMessage && (
        <div className="p-3.5 mb-4 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-700 font-medium">
          {errorMessage}
        </div>
      )}

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
                {CHECKOUT_CONSTANTS.PHONE_PREFIX}
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
              ? 'Scanne le QR Code ou valide la notification Orange Money sur ton téléphone avec ton code secret.'
              : 'Paiement sécurisé chiffré via passerelle bancaire.'}
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
            disabled={isSubmitting}
            type="button"
            className="px-6 py-2.5 rounded-full border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
          >
            Retour
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#0F141C] text-white text-xs sm:text-sm font-bold rounded-full hover:bg-black active:scale-98 transition-all shadow-md cursor-pointer disabled:opacity-75"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-[#FFC23C]" />
                <span>Initiation du paiement InTouch...</span>
              </>
            ) : (
              <>
                <span>Payer maintenant</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
