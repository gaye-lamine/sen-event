import React from 'react';
import { Check } from 'lucide-react';

export interface OnboardingStepperProps {
  currentStep: number;
}

const STEP_LABELS = [
  'Profil',
  'Informations',
  'Vérification',
  'Préférences',
  'Bienvenue',
];

export const OnboardingStepper: React.FC<OnboardingStepperProps> = ({
  currentStep,
}) => {
  return (
    <div className="w-full max-w-xl mx-auto mb-8 px-4">
      <div className="flex items-center justify-between relative">
        <div className="absolute top-1/2 left-0 w-full -translate-y-1/2 h-0.5 bg-gray-200 z-0" />
        <div
          className="absolute top-1/2 left-0 -translate-y-1/2 h-0.5 bg-[#121526] z-0 transition-all duration-500 ease-out"
          style={{
            width: `${((Math.min(currentStep, 5) - 1) / 4) * 100}%`,
          }}
        />

        {STEP_LABELS.map((label, index) => {
          const stepNum = index + 1;
          const isDone = currentStep > stepNum;
          const isActive = currentStep === stepNum;

          return (
            <div key={label} className="relative z-10 flex flex-col items-center">
              <div
                className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 ${
                  isDone
                    ? 'bg-[#121526] text-white shadow-xs'
                    : isActive
                    ? 'bg-[#121526] text-white ring-4 ring-gray-100 shadow-xs'
                    : 'bg-white border border-gray-300 text-gray-400'
                }`}
              >
                {isDone ? <Check className="w-4 h-4 stroke-[3]" /> : stepNum}
              </div>
              <span
                className={`text-[10px] sm:text-xs mt-1.5 font-medium whitespace-nowrap transition-colors ${
                  isActive
                    ? 'text-gray-900 font-bold'
                    : isDone
                    ? 'text-gray-700 font-semibold'
                    : 'text-gray-400'
                }`}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
