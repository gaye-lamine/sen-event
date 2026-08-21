import { LucideIcon } from 'lucide-react';
import { OnboardingRole } from './auth';

export interface OnboardingCategory {
  id: string;
  label: string;
  icon: LucideIcon;
}

export interface OnboardingFormData {
  role: OnboardingRole;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
  otpCode: string[];
  selectedCategories: string[];
  city: string;
}

export interface StepProps {
  formData: OnboardingFormData;
  setFormData: React.Dispatch<React.SetStateAction<OnboardingFormData>>;
  onNext: () => void;
  onPrev: () => void;
}
