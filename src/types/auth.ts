export type AuthMode = 'login' | 'signup';

export interface AuthState {
  isOpen: boolean;
  mode: AuthMode;
}

export interface AuthModalProps {
  isOpen: boolean;
  initialMode?: AuthMode;
  onClose: () => void;
}
