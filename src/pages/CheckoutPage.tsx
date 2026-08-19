import React, { useState } from 'react';
import { TicketTier, CheckoutStep, CheckoutPageProps } from '../types';
import { CheckoutStepper } from '../components/checkout/CheckoutStepper';
import { TicketSelectionStep } from '../components/checkout/TicketSelectionStep';
import { OrderSummaryCard } from '../components/checkout/OrderSummaryCard';
import { CustomerInfoStep } from '../components/checkout/CustomerInfoStep';
import { PaymentStep } from '../components/checkout/PaymentStep';
import { OrderConfirmationView } from '../components/checkout/OrderConfirmationView';

/**
 * @page CheckoutPage
 * @description Page principale du tunnel d'achat orchestrant les étapes 1 (Billets),
 * 2 (Informations) et 3 (Paiement) ainsi que l'écran final de confirmation.
 * @param {CheckoutPageProps} props - Contrat de propriétés du composant
 */
export const CheckoutPage: React.FC<CheckoutPageProps> = ({
  event,
  initialTiers,
  onNavigateHome,
}) => {
  const [currentStep, setCurrentStep] = useState<CheckoutStep>(1);
  const [isPaymentConfirmed, setIsPaymentConfirmed] = useState(false);

  const tiers: TicketTier[] = event.ticketTiers || [
    {
      id: 'standard',
      name: 'Standard',
      description: 'Accès général, places debout',
      price: 10000,
      available: true,
    },
    {
      id: 'vip',
      name: 'VIP',
      description: 'Zone VIP, boisson offerte + accès rapide',
      price: 25000,
      available: true,
      remainingCount: 42,
    },
    {
      id: 'place-reservee',
      name: 'Place Réservée',
      description: 'Premières loges + rencontre backstage',
      price: 50000,
      available: false,
      isSoldOut: true,
    },
  ];

  const [quantities, setQuantities] = useState<Record<string, number>>(() => {
    if (initialTiers && initialTiers.length > 0) {
      const init: Record<string, number> = {};
      initialTiers.forEach((item) => {
        init[item.tier.id] = item.quantity;
      });
      return init;
    }
    return {
      standard: 2,
      vip: 1,
    };
  });

  const [customerFirstName, setCustomerFirstName] = useState('Aminata');
  const [customerLastName, setCustomerLastName] = useState('Diop');
  const [customerPhone, setCustomerPhone] = useState('77 123 45 67');
  const [customerEmail, setCustomerEmail] = useState('aminata.diop@email.com');

  const handleUpdateQuantity = (tierId: string, delta: number) => {
    setQuantities((prev) => {
      const current = prev[tierId] || 0;
      const next = Math.max(0, current + delta);
      return { ...prev, [tierId]: next };
    });
  };

  const calculateTotal = () => {
    const subtotal = tiers.reduce((acc, t) => acc + t.price * (quantities[t.id] || 0), 0);
    const serviceFees = subtotal > 0 ? 1500 : 0;
    return subtotal + serviceFees;
  };

  const customerFullName = `${customerFirstName} ${customerLastName}`.trim();

  if (isPaymentConfirmed) {
    return (
      <div className="w-full bg-white">
        <OrderConfirmationView
          orderNumber="SN-284916"
          customerEmail={customerEmail}
          onNavigateHome={onNavigateHome}
        />
      </div>
    );
  }

  return (
    <div className="w-full bg-[#F4F5F7]/70 py-8 sm:py-12 px-4 sm:px-6 lg:px-8 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="bg-[#FAFBFD] rounded-[32px] sm:rounded-[44px] p-6 sm:p-10 lg:p-14 border border-gray-100/90 shadow-sm">
          <CheckoutStepper
            currentStep={currentStep}
            onStepClick={(step) => setCurrentStep(step)}
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start mt-2 sm:mt-4">
            <div className="lg:col-span-7 xl:col-span-8">
              {currentStep === 1 && (
                <TicketSelectionStep
                  event={event}
                  tiers={tiers}
                  quantities={quantities}
                  onUpdateQuantity={handleUpdateQuantity}
                  onContinue={() => setCurrentStep(2)}
                />
              )}

              {currentStep === 2 && (
                <CustomerInfoStep
                  tiers={tiers}
                  quantities={quantities}
                  customerFirstName={customerFirstName}
                  customerLastName={customerLastName}
                  customerPhone={customerPhone}
                  customerEmail={customerEmail}
                  onChangeFirstName={setCustomerFirstName}
                  onChangeLastName={setCustomerLastName}
                  onChangePhone={setCustomerPhone}
                  onChangeEmail={setCustomerEmail}
                  onBack={() => setCurrentStep(1)}
                  onContinue={() => setCurrentStep(3)}
                />
              )}

              {currentStep === 3 && (
                <PaymentStep
                  event={event}
                  totalAmount={calculateTotal()}
                  customerName={customerFullName}
                  customerPhone={customerPhone}
                  customerEmail={customerEmail}
                  onBack={() => setCurrentStep(2)}
                  onPaymentComplete={() => setIsPaymentConfirmed(true)}
                />
              )}
            </div>

            <div className="lg:col-span-5 xl:col-span-4">
              <OrderSummaryCard
                event={event}
                tiers={tiers}
                quantities={quantities}
                onModifyTickets={() => setCurrentStep(1)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
