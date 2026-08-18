import React, { useState } from 'react';
import { ArrowLeft, ShieldCheck, QrCode, CheckCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { EventItem } from '../../types/event';

interface PaymentStepProps {
  event: EventItem;
  totalAmount: number;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  onBack: () => void;
  onPaymentComplete: () => void;
}

export const PaymentStep: React.FC<PaymentStepProps> = ({
  event,
  totalAmount,
  customerName,
  customerPhone,
  customerEmail,
  onBack,
  onPaymentComplete,
}) => {
  const [method, setMethod] = useState<'wave' | 'orange_money' | 'card'>('wave');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const formattedAmount = new Intl.NumberFormat('fr-FR').format(totalAmount);

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
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
      onPaymentComplete();
    }, 1500);
  };

  if (isSuccess) {
    return (
      <div className="bg-white rounded-3xl sm:rounded-[32px] p-6 sm:p-8 lg:p-10 border border-gray-100 shadow-sm text-center">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8" />
        </div>

        <h2 className="text-2xl font-extrabold text-gray-900">
          Paiement réussi !
        </h2>
        <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-md mx-auto">
          Vos billets ont été validés et envoyés par SMS au{' '}
          <strong className="text-gray-800">{customerPhone || '77 000 00 00'}</strong> et par e-mail à{' '}
          <strong className="text-gray-800">{customerEmail || 'client@sunuevents.sn'}</strong>.
        </p>

        {/* Digital Ticket Card */}
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
              <span className="font-semibold text-white">{customerName || 'Client'}</span>
            </div>
            <div>
              <span className="text-gray-400">Payé : </span>
              <span className="font-bold text-amber-400">{formattedAmount} {event.currency || 'F'}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl sm:rounded-[32px] p-6 sm:p-8 lg:p-10 border border-gray-100/90 shadow-sm text-left">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
          Mode de paiement
        </h1>
        <p className="text-xs sm:text-sm text-gray-400 mt-1">
          Sélectionnez votre moyen de paiement sécurisé pour finaliser la commande.
        </p>
      </div>

      <form onSubmit={handlePay} className="space-y-4">
        {/* Payment Methods */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* Wave */}
          <button
            type="button"
            onClick={() => setMethod('wave')}
            className={`p-4 rounded-2xl border flex items-center gap-3 transition-all cursor-pointer ${
              method === 'wave'
                ? 'border-[#1DC6F6] bg-[#1DC6F6]/10 text-gray-900 ring-2 ring-[#1DC6F6]/30'
                : 'border-gray-200 hover:border-gray-300 text-gray-700 bg-white'
            }`}
          >
            <span className="w-3.5 h-3.5 rounded-full bg-[#1DC6F6] flex-shrink-0" />
            <div className="text-left">
              <div className="font-bold text-xs sm:text-sm">Wave Sénégal</div>
              <div className="text-[11px] text-gray-500">Paiement sans frais</div>
            </div>
          </button>

          {/* Orange Money */}
          <button
            type="button"
            onClick={() => setMethod('orange_money')}
            className={`p-4 rounded-2xl border flex items-center gap-3 transition-all cursor-pointer ${
              method === 'orange_money'
                ? 'border-[#FF7900] bg-[#FF7900]/10 text-gray-900 ring-2 ring-[#FF7900]/30'
                : 'border-gray-200 hover:border-gray-300 text-gray-700 bg-white'
            }`}
          >
            <span className="w-3.5 h-3.5 rounded-full bg-[#FF7900] flex-shrink-0" />
            <div className="text-left">
              <div className="font-bold text-xs sm:text-sm">Orange Money</div>
              <div className="text-[11px] text-gray-500">Code secret OM</div>
            </div>
          </button>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-100 mt-6">
          <button
            onClick={onBack}
            type="button"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 text-xs font-semibold text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour</span>
          </button>

          <button
            type="submit"
            disabled={isProcessing}
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#0F141C] text-white text-xs sm:text-sm font-bold rounded-full hover:bg-black active:scale-98 transition-all shadow-md cursor-pointer disabled:opacity-50"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>
              {isProcessing
                ? 'Paiement en cours...'
                : `Payer ${formattedAmount} ${event.currency || 'F'}`}
            </span>
          </button>
        </div>
      </form>
    </div>
  );
};
