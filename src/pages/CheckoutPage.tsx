import React, { useState } from 'react';
import { EventItem, TicketTier } from '../types/event';
import { CheckoutStepper, CheckoutStep } from '../components/checkout/CheckoutStepper';
import { TicketSelectionStep } from '../components/checkout/TicketSelectionStep';
import { OrderSummaryCard } from '../components/checkout/OrderSummaryCard';
import { CustomerInfoStep } from '../components/checkout/CustomerInfoStep';
import { PaymentStep } from '../components/checkout/PaymentStep';

interface CheckoutPageProps {
  event: EventItem;
  initialTiers?: { tier: TicketTier; quantity: number }[];
  onNavigateHome: () => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({
  event,
  initialTiers,
  onNavigateHome,
}) => {
  const [currentStep, setCurrentStep] = useState<CheckoutStep>(1);

  // Available ticket tiers
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

  // Initialize quantities (default to Standard x2, VIP x1 as in the mockup, or from initialTiers)
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

  // Customer info state
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

  return (
    <div className="w-full bg-[#F4F5F7]/70 py-8 sm:py-12 px-4 sm:px-6 lg:px-8 min-h-screen">
      <div className="max-w-6xl mx-auto">
        
        {/* Rounded Main Box Container as in Mockup */}
        <div className="bg-[#FAFBFD] rounded-[32px] sm:rounded-[44px] p-6 sm:p-10 lg:p-14 border border-gray-100/90 shadow-sm">
          
          {/* Stepper Progress Indicator */}
          <CheckoutStepper
            currentStep={currentStep}
            onStepClick={(step) => setCurrentStep(step)}
          />

          {/* Two-Column Checkout Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start mt-2 sm:mt-4">
            
            {/* Left Column: Active Step Form (7 of 12) */}
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
                  onPaymentComplete={() => {}}
                />
              )}
            </div>

            {/* Right Column: Order Summary Card (5 of 12) */}
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
