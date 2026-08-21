import React from 'react';
import { Check } from 'lucide-react';

export interface OnboardingStepperProps {
  currentStep: number;
}

const STEPS = [
  { id: 1, label: 'Profil' },
  { id: 2, label: 'Informations' },
  { id: 3, label: 'Vérification' },
  { id: 4, label: 'Préférences' },
];

export const OnboardingStepper: React.FC<OnboardingStepperProps> = ({
  currentStep,
}) => {
  return (
    <div className="w-full max-w-xl mx-auto mb-10 px-4">
      <div className="flex items-center justify-between">
        {STEPS.map((step, index) => {
          const isDone = currentStep > step.id;
          const isCurrent = currentStep === step.id;

          return (
            <React.Fragment key={step.id}>
              {/* Étape */}
              <div className="flex flex-col items-center select-none">
                {isDone ? (
                  <div className="w-7 h-7 rounded-full bg-[#16A34A] text-white flex items-center justify-center shadow-2xs">
                    <Check className="w-4 h-4 stroke-[3]" />
                  </div>
                ) : isCurrent ? (
                  <div className="w-7 h-7 rounded-full border-2 border-[#FF5722] bg-white text-[#FF5722] flex items-center justify-center text-xs font-bold shadow-2xs">
                    {step.id}
                  </div>
                ) : (
                  <div className="w-7 h-7 rounded-full border border-gray-200 bg-white text-gray-300 flex items-center justify-center text-xs font-medium">
                    {step.id}
                  </div>
                )}

                <span
                  className={`text-[11px] mt-2 transition-colors ${
                    isCurrent
                      ? 'text-gray-900 font-bold'
                      : isDone
                      ? 'text-gray-400 font-medium'
                      : 'text-gray-300 font-medium'
                  }`}
                >
                  {step.label}
                </span>
              </div>

              {/* Ligne de connexion avec point central */}
              {index < STEPS.length - 1 && (
                <div className="flex-1 mx-3 sm:mx-6 flex items-center justify-center relative -mt-4">
                  <div className="w-full h-px bg-gray-200" />
                  <div className="absolute w-2 h-2 rounded-full border border-gray-300 bg-white" />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
