import React, { useState } from 'react';
import { Menu, X, User } from 'lucide-react';

interface NavbarProps {
  onNavigate: (page: string) => void;
  currentPage: string;
  isAdmin: boolean;
  logoUrl?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate, currentPage, isAdmin, logoUrl }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const navItems = [
    { id: 'home', label: 'Início' },
    { id: 'news', label: 'Notícias' },
    { id: 'calendar', label: 'Calendário' },
    { id: 'teams', label: 'Equipas' },
    { id: 'photos', label: 'Fotos' },
    { id: 'partners', label: 'Parceiros' },
    { id: 'shop', label: 'Loja' },
    { id: 'about', label: 'Quem Somos' },
    { id: 'contacts', label: 'Contactos' },
  ];

  const handleNav = (id: string) => {
    // If it's a special page (admin/login/about/contacts), navigate directly
    if (id === 'admin' || id === 'login' || id === 'about' || id === 'contacts') {
      onNavigate(id);
      window.scrollTo(0, 0);
      setIsOpen(false);
      return;
    }

    // If we are not on the landing page (e.g. we are in admin or about page), go to home first
    if (currentPage !== 'home') {
      onNavigate('home');
      // Wait for render then scroll
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        } else {
          window.scrollTo(0,0);
        }
      }, 100);
    } else {
      // We are already on home, just scroll
      if (id === 'home') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
    setIsOpen(false);
  };

  return (
    <nav className="bg-black/95 backdrop-blur-md text-white sticky top-0 z-50 border-b-2 border-primary shadow-2xl transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center h-24 relative">
          
          {/* Desktop Navigation - Centered */}
          <div className="hidden lg:block">
            <div className="flex items-baseline space-x-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className={`px-3 py-2 rounded-md text-sm font-bold uppercase tracking-wider transition-all duration-200 hover:text-primary hover:bg-white/5 ${currentPage === item.id ? 'text-primary' : 'text-gray-300'}`}
                >
                  {item.label}
                </button>
              ))}
              {isAdmin ? (
                <button
                   onClick={() => handleNav('admin')}
                   className="ml-4 px-4 py-2 rounded-full text-sm font-bold bg-primary text-white hover:bg-orange-700 flex items-center gap-2 transition-transform hover:scale-105"
                >
                  <User size={16} /> Admin
                </button>
              ) : (
                <button
                   onClick={() => handleNav('login')}
                   className="ml-2 text-gray-500 hover:text-white transition"
                   title="Área de Admin"
                >
                  <User size={16} />
                </button>
              )}
            </div>
          </div>
          
          {/* Mobile menu button - Positioned absolutely to the right */}
          <div className="absolute right-0 flex lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-primary hover:text-white hover:bg-gray-800 focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="lg:hidden bg-black border-t border-gray-800">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className="block w-full text-left px-3 py-3 rounded-md text-base font-bold text-gray-300 hover:bg-gray-900 hover:text-primary border-b border-gray-900"
              >
                {item.label}
              </button>
            ))}
            <div className="pt-4">
              <button
                  onClick={() => handleNav(isAdmin ? 'admin' : 'login')}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-primary hover:text-white flex items-center gap-2"
              >
                <User size={16} /> {isAdmin ? 'Painel de Controlo' : 'Login Admin'}
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};