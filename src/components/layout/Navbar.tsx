import React, { useState } from 'react';
import { Search, ShoppingCart, Menu, X, LogOut, User, Bell } from 'lucide-react';
import { NavbarProps } from '../../types';

/**
 * @component Navbar
 * @description Barre de navigation supérieure responsive avec recherche instantanée,
 * gestion du panier d'achat et déclencheurs d'authentification.
 * @param {NavbarProps} props - Contrat de propriétés du composant
 */
export const Navbar: React.FC<NavbarProps> = ({
  searchQuery = '',
  onSearch,
  onNavigateHome,
  onOpenAuth,
  onOpenDashboard,
  onLogout,
  isAuthenticated = false,
  cartCount = 0,
  onOpenCart,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const target = document.getElementById('all-events-section');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="w-full border-b border-gray-100/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          <button
            onClick={() => onNavigateHome?.()}
            type="button"
            className="flex items-center gap-2 font-extrabold text-xl sm:text-2xl tracking-tight text-gray-900 group cursor-pointer text-left"
          >
            <span className="text-gray-900 group-hover:text-brand-600 transition-colors">
              Sunu Events
            </span>
          </button>

          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex flex-1 max-w-md mx-4 items-center bg-[#F3F4F6] rounded-full px-4 py-2 focus-within:ring-2 focus-within:ring-gray-900/20 focus-within:bg-white border border-transparent focus-within:border-gray-200 transition-all"
          >
            <Search className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearch?.(e.target.value)}
              placeholder="Un artiste, une salle, un match..."
              className="w-full bg-transparent text-xs sm:text-sm text-gray-800 placeholder-gray-400 focus:outline-none"
            />
          </form>

          <div className="flex items-center gap-2.5 sm:gap-3">
            <button
              onClick={onOpenCart}
              type="button"
              className="relative p-2.5 text-gray-700 hover:text-gray-900 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
              aria-label="Mon panier"
            >
              <ShoppingCart className="w-5 h-5 stroke-[1.8]" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-brand-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>

            {isAuthenticated ? (
              <div className="flex items-center gap-2 sm:gap-3">
                {/* Bouton Notifications */}
                <button
                  type="button"
                  title="Notifications"
                  className="w-9 h-9 rounded-full border border-gray-200/80 bg-white hover:bg-gray-50 flex items-center justify-center text-gray-700 transition-all cursor-pointer relative"
                >
                  <Bell className="w-4 h-4" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#FF5722] rounded-full ring-2 ring-white" />
                </button>

                {/* Pill Profil Utilisateur */}
                <button
                  type="button"
                  onClick={onOpenDashboard}
                  className="flex items-center gap-2.5 px-3 py-1.5 bg-[#F3F4F6] hover:bg-gray-200/70 border border-gray-200/60 rounded-full text-xs font-bold text-gray-900 transition-all cursor-pointer shadow-2xs"
                >
                  <div className="w-6 h-6 rounded-full overflow-hidden border border-amber-300 bg-amber-100 flex items-center justify-center shrink-0">
                    <img
                      src="/images/wally.png"
                      alt="Aminata"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                    <User className="w-3.5 h-3.5 text-amber-800" />
                  </div>
                  <span>Aminata</span>
                </button>

                {/* Déconnexion */}
                <button
                  onClick={onLogout}
                  type="button"
                  title="Déconnexion"
                  className="p-2 text-gray-400 hover:text-red-600 rounded-full hover:bg-red-50 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={() => onOpenAuth?.('login')}
                  type="button"
                  className="hidden sm:inline-flex items-center justify-center px-4 py-2 text-xs font-semibold text-gray-800 bg-white border border-gray-200 rounded-full hover:bg-gray-50 hover:border-gray-300 transition-all cursor-pointer"
                >
                  Se connecter
                </button>

                <button
                  onClick={() => onOpenAuth?.('signup')}
                  type="button"
                  className="inline-flex items-center justify-center px-5 py-2 text-xs font-semibold text-white bg-[#0F141C] rounded-full hover:bg-black shadow-sm hover:shadow transition-all cursor-pointer"
                >
                  Créer un compte
                </button>
              </>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              type="button"
              className="md:hidden p-2 text-gray-700 hover:text-gray-900 rounded-full hover:bg-gray-100"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <div className="md:hidden pb-3">
          <form
            onSubmit={handleSearchSubmit}
            className="flex items-center bg-[#F3F4F6] rounded-full px-4 py-2 border border-gray-200"
          >
            <Search className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearch?.(e.target.value)}
              placeholder="Un artiste, une salle, un match..."
              className="w-full bg-transparent text-xs sm:text-sm text-gray-800 placeholder-gray-400 focus:outline-none"
            />
          </form>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-3 animate-fadeIn">
          <div className="flex flex-col gap-2">
            {isAuthenticated ? (
              <button
                onClick={() => {
                  onLogout?.();
                  setMobileMenuOpen(false);
                }}
                type="button"
                className="w-full py-2.5 px-4 text-xs font-bold text-red-600 bg-red-50 rounded-xl flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Se déconnecter (Verrouiller)</span>
              </button>
            ) : (
              <>
                <button
                  onClick={() => {
                    onOpenAuth?.('login');
                    setMobileMenuOpen(false);
                  }}
                  type="button"
                  className="w-full py-2.5 px-4 text-xs font-semibold text-gray-800 bg-gray-50 rounded-xl"
                >
                  Se connecter
                </button>
                <button
                  onClick={() => {
                    onOpenAuth?.('signup');
                    setMobileMenuOpen(false);
                  }}
                  type="button"
                  className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-gray-900 rounded-xl"
                >
                  Créer un compte
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
