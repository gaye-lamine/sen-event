import React from 'react';
import { Check } from 'lucide-react';
import { CheckoutStep, CheckoutStepperProps } from '../../types';

/**
 * @component CheckoutStepper
 * @description Indicateur d'avancement horizontal à 3 étapes (Billets, Informations, Paiement)
 * avec pastilles d'état (validé en vert, actif en corail, en attente en gris).
 * @param {CheckoutStepperProps} props - Contrat de propriétés du composant
 */
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
    <div className="flex items-center justify-center max-w-xl mx-auto py-6 sm:py-10">
      {steps.map((step, idx) => {
        const isActive = currentStep === step.number;
        const isPassed = currentStep > step.number;
        const isLast = idx === steps.length - 1;

        return (
          <React.Fragment key={step.number}>
            <div className="flex flex-col items-center">
              <button
                onClick={() => onStepClick?.(step.number)}
                disabled={!isPassed && !isActive}
                type="button"
                className={`
                  w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold transition-all
                  ${
                    isPassed
                      ? 'bg-[#10B981] text-white shadow-xs cursor-pointer'
                      : isActive
                      ? 'bg-transparent border-2 border-[#FF4747] text-[#FF4747] shadow-xs'
                      : 'bg-white border border-gray-200 text-gray-400'
                  }
                `}
              >
                {isPassed ? (
                  <Check className="w-4 h-4 text-white stroke-[2.5]" />
                ) : (
                  step.number
                )}
              </button>
              <span
                className={`text-[11px] sm:text-xs font-semibold mt-1.5 transition-colors ${
                  isActive
                    ? 'text-gray-900 font-extrabold'
                    : isPassed
                    ? 'text-gray-600 font-medium'
                    : 'text-gray-400'
                }`}
              >
                {step.label}
              </span>
            </div>

            {!isLast && (
              <div className="flex-1 flex items-center justify-center px-3 sm:px-6 -mt-5">
                <div className="w-full relative flex items-center justify-center">
                  <div
                    className={`h-[1px] w-full transition-colors ${
                      isPassed ? 'bg-[#10B981]' : 'bg-gray-200'
                    }`}
                  />
                  <div
                    className={`absolute w-1.5 h-1.5 rounded-full ${
                      isPassed ? 'bg-[#10B981]' : 'bg-gray-300'
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
