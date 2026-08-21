import {
  Clapperboard,
  GraduationCap,
  Moon,
  Music,
  Presentation,
  Smile,
  Sparkles,
  Trophy,
} from 'lucide-react';
import { OnboardingCategory, OnboardingFormData } from '../types/onboarding';

export const ONBOARDING_CATEGORIES: OnboardingCategory[] = [
  { id: 'concert', label: 'Concert', icon: Music },
  { id: 'humour', label: 'Humour', icon: Smile },
  { id: 'soiree', label: 'Soirée', icon: Moon },
  { id: 'formation', label: 'Formation', icon: GraduationCap },
  { id: 'festival', label: 'Festival', icon: Sparkles },
  { id: 'conference', label: 'Conférence', icon: Presentation },
  { id: 'theatre', label: 'Théâtre', icon: Clapperboard },
  { id: 'sport', label: 'Sport', icon: Trophy },
];

export const SENEGAL_CITIES: string[] = [
  'Dakar',
  'Thiès',
  'Saint-Louis',
  'Mbour / Saly',
  'Ziguinchor',
  'Touba',
  'Kaolack',
  'Autre',
];

export const INITIAL_ONBOARDING_STATE: OnboardingFormData = {
  role: 'attendee',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  acceptTerms: false,
  otpCode: ['', '', '', '', '', ''],
  selectedCategories: [],
  city: 'Dakar',
};
