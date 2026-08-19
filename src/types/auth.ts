export type AuthMode = 'login' | 'signup';

export interface AuthState {
  isOpen: boolean;
  mode: AuthMode;
}
