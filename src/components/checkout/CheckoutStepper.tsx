import React from 'react';

export type CheckoutStep = 1 | 2 | 3;

interface CheckoutStepperProps {
  currentStep: CheckoutStep;
  onStepClick?: (step: CheckoutStep) => void;
}

export const CheckoutStepper: React.FC<CheckoutStepperProps> = ({
  currentStep,
  onStepClick,
}) => {
  const steps: { number: CheckoutStep; label: string }[] = [
    { number: 1, label: 'Billets' },
    { number: 2, label: 'Informations' },
    { number: 3, label: 'Paiement' },
  ];

  return (
    <div className="flex items-center justify-center max-w-xl mx-auto py-8 sm:py-12">
      {steps.map((step, idx) => {
        const isActive = currentStep === step.number;
        const isPassed = currentStep > step.number;
        const isLast = idx === steps.length - 1;

        return (
          <React.Fragment key={step.number}>
            {/* Step Item */}
            <div className="flex flex-col items-center">
              <button
                onClick={() => isPassed && onStepClick?.(step.number)}
                disabled={!isPassed}
                type="button"
                className={`
                  w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold transition-all
                  ${
                    isActive
                      ? 'bg-transparent border-2 border-[#FF4747] text-[#FF4747] shadow-sm'
                      : isPassed
                      ? 'bg-[#FF4747] text-white border-2 border-[#FF4747] cursor-pointer'
                      : 'bg-white border border-gray-200 text-gray-400'
                  }
                `}
              >
                {step.number}
              </button>
              <span
                className={`text-[11px] sm:text-xs font-semibold mt-1.5 transition-colors ${
                  isActive || isPassed ? 'text-gray-900' : 'text-gray-400'
                }`}
              >
                {step.label}
              </span>
            </div>

            {/* Connecting Line with mid-dot */}
            {!isLast && (
              <div className="flex-1 flex items-center justify-center px-3 sm:px-6 -mt-5">
                <div className="w-full relative flex items-center justify-center">
                  <div
                    className={`h-[1px] w-full transition-colors ${
                      isPassed ? 'bg-[#FF4747]' : 'bg-gray-200'
                    }`}
                  />
                  {/* Subtle midpoint dot */}
                  <div
                    className={`absolute w-1.5 h-1.5 rounded-full ${
                      isPassed ? 'bg-[#FF4747]' : 'bg-gray-300'
                    }`}
                  />
                </div>
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};
