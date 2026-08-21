export type AuthMode = 'login' | 'signup';
export type AuthMethodType = 'email' | 'phone';
export type OnboardingRole = 'attendee' | 'organizer';

export interface AuthState {
  isOpen: boolean;
  mode: AuthMode;
}

export interface AuthModalProps {
  isOpen: boolean;
  initialMode?: AuthMode;
  onClose: () => void;
}

export interface LoginPageProps {
  initialMode?: AuthMode;
  onNavigateHome: () => void;
  onLoginSuccess?: (userData?: unknown) => void;
  onOpenOnboarding?: () => void;
}

export interface OnboardingPageProps {
  onNavigateHome: () => void;
  onOpenLogin?: () => void;
  onNavigateLogin?: () => void;
  onOpenDashboard?: () => void;
  onComplete?: (role: OnboardingRole) => void;
  searchQuery?: string;
  onSearch?: (q: string) => void;
  cartCount?: number;
  onOpenCart?: () => void;
}
