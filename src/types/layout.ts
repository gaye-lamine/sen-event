import { AuthMode } from './auth';

export interface NavbarProps {
  searchQuery?: string;
  onSearch?: (query: string) => void;
  onNavigateHome?: () => void;
  onOpenAuth?: (mode: AuthMode) => void;
  cartCount?: number;
  onOpenCart?: () => void;
}

export interface FooterProps {
  onNavigateHome?: () => void;
}
