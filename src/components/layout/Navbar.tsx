import React, { useState } from 'react';
import { Search, ShoppingCart, Menu, X, Ticket } from 'lucide-react';

/**
 * ============================================================================
 * BARRE DE NAVIGATION (NAVBAR) AVEC ACCÈS RAPIDE LOGIN & CRÉER UN COMPTE
 * ============================================================================
 */

interface NavbarProps {
  onSearch?: (query: string) => void;
  /** Déclencheur pour ouvrir la modale d'authentification (mode 'login' ou 'signup') */
  onOpenAuth?: (mode: 'login' | 'signup') => void;
  cartCount?: number;
  onOpenCart?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onSearch,
  onOpenAuth,
  cartCount = 0,
  onOpenCart,
}) => {
  const [searchValue, setSearchValue] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchValue);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-gray-100/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          
          {/* Logo officiel Sunu Events */}
          <a
            href="#"
            className="flex items-center gap-2 font-extrabold text-xl sm:text-2xl tracking-tight text-gray-900 group"
          >
            <span className="text-gray-900 group-hover:text-brand-600 transition-colors">
              Sunu Events
            </span>
          </a>

          {/* Barre de recherche rapide (Desktop) */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex flex-1 max-w-md mx-4 items-center bg-[#F3F4F6] rounded-full px-4 py-2 focus-within:ring-2 focus-within:ring-gray-900/20 focus-within:bg-white border border-transparent focus-within:border-gray-200 transition-all"
          >
            <Search className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Un artiste, une salle, un match..."
              className="w-full bg-transparent text-xs sm:text-sm text-gray-800 placeholder-gray-400 focus:outline-none"
            />
          </form>

          {/* Boutons d'actions à droite */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            
            {/* Bouton Panier */}
            <button
              onClick={onOpenCart}
              type="button"
              className="relative p-2.5 text-gray-700 hover:text-gray-900 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Mon panier"
            >
              <ShoppingCart className="w-5 h-5 stroke-[1.8]" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-brand-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>

            {/* ============================================================= */}
            {/* BOUTON 1 : SE CONNECTER (LOGIN)                                */}
            {/* Ouvre la modale d'authentification en mode 'login'            */}
            {/* ============================================================= */}
            <button
              onClick={() => onOpenAuth?.('login')}
              type="button"
              className="hidden sm:inline-flex items-center justify-center px-4 py-2 text-xs font-semibold text-gray-800 bg-white border border-gray-200 rounded-full hover:bg-gray-50 hover:border-gray-300 transition-all"
            >
              Se connecter
            </button>

            {/* ============================================================= */}
            {/* BOUTON 2 : CRÉER UN COMPTE (SIGNUP)                            */}
            {/* Ouvre la modale d'authentification en mode 'signup'           */}
            {/* ============================================================= */}
            <button
              onClick={() => onOpenAuth?.('signup')}
              type="button"
              className="inline-flex items-center justify-center px-5 py-2 text-xs font-semibold text-white bg-[#0F141C] rounded-full hover:bg-black shadow-sm hover:shadow transition-all"
            >
              Créer un compte
            </button>

            {/* Menu Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              type="button"
              className="md:hidden p-2 text-gray-700 hover:text-gray-900 rounded-full hover:bg-gray-100"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Barre de recherche sur Mobile */}
        <div className="md:hidden pb-3">
          <form
            onSubmit={handleSearchSubmit}
            className="flex items-center bg-[#F3F4F6] rounded-full px-4 py-2 border border-gray-200"
          >
            <Search className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Un artiste, une salle, un match..."
              className="w-full bg-transparent text-xs text-gray-800 placeholder-gray-400 focus:outline-none"
            />
          </form>
        </div>

        {/* Tiroir de navigation mobile avec boutons Se connecter / Créer un compte */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100 space-y-2">
            <button
              onClick={() => {
                onOpenAuth?.('login');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg"
            >
              Se connecter
            </button>
            <button
              onClick={() => {
                onOpenAuth?.('signup');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-4 py-2.5 text-sm font-medium text-white bg-[#0F141C] rounded-lg"
            >
              Créer un compte
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
