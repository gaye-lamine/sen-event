import React, { useState } from 'react';
import { OnboardingPageProps } from '../types/auth';
import { OnboardingFormData } from '../types/onboarding';
import { INITIAL_ONBOARDING_STATE } from '../data/onboardingData';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { OnboardingStepper } from '../components/onboarding/OnboardingStepper';
import { StepRoleSelection } from '../components/onboarding/steps/StepRoleSelection';
import { StepAccountInfo } from '../components/onboarding/steps/StepAccountInfo';
import { StepPhoneVerification } from '../components/onboarding/steps/StepPhoneVerification';
import { StepPreferences } from '../components/onboarding/steps/StepPreferences';
import { StepWelcomeSuccess } from '../components/onboarding/steps/StepWelcomeSuccess';

/**
 * @page OnboardingPage
 * @description Page d'inscription et onboarding en 5 étapes modulaires :
 * 1. StepRoleSelection : Découverte vs Organisation
 * 2. StepAccountInfo : Nom, Email, Téléphone, Mot de passe
 * 3. StepPhoneVerification : Code OTP SMS à 6 chiffres
 * 4. StepPreferences : Centres d'intérêts et Ville
 * 5. StepWelcomeSuccess : Écran de confirmation et découverte
 */
export const OnboardingPage: React.FC<OnboardingPageProps> = ({
  onNavigateHome,
  onNavigateLogin,
  onOpenLogin,
  onOpenDashboard,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [formData, setFormData] = useState<OnboardingFormData>(
    INITIAL_ONBOARDING_STATE
  );

  const loginAction = onNavigateLogin || onOpenLogin;

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 5));
  };

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  return (
    <div className="min-h-screen bg-[#F8F9FB] flex flex-col justify-between font-sans selection:bg-brand-300 selection:text-gray-900">
      {/* 1. EN-TÊTE / NAVBAR */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16 sm:h-20 gap-4">
          <Navbar
            onNavigateHome={onNavigateHome}
            onOpenAuth={loginAction}
          />
        </div>
      </div>

      {/* 2. CORPS DU TUNNEL D'ONBOARDING */}
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-12 flex flex-col justify-center">
        {/* Stepper horizontal */}
        {currentStep <= 4 && (
          <OnboardingStepper currentStep={currentStep} />
        )}

        {/* Carte formulaire principale */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-200/80 shadow-sm">
          {currentStep === 1 && (
            <StepRoleSelection
              formData={formData}
              setFormData={setFormData}
              onNext={handleNext}
              onNavigateLogin={loginAction}
            />
          )}

          {currentStep === 2 && (
            <StepAccountInfo
              formData={formData}
              setFormData={setFormData}
              onNext={handleNext}
              onPrev={handlePrev}
            />
          )}

          {currentStep === 3 && (
            <StepPhoneVerification
              formData={formData}
              setFormData={setFormData}
              onNext={handleNext}
              onPrev={handlePrev}
            />
          )}

          {currentStep === 4 && (
            <StepPreferences
              formData={formData}
              setFormData={setFormData}
              onNext={handleNext}
              onPrev={handlePrev}
            />
          )}

          {currentStep === 5 && (
            <StepWelcomeSuccess
              formData={formData}
              onNavigateHome={onNavigateHome}
              onOpenDashboard={onOpenDashboard}
            />
          )}
        </div>
      </main>

      {/* 3. PIED DE PAGE GLOBAL */}
      <Footer onNavigateHome={onNavigateHome} />
    </div>
  );
};
