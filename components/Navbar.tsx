import React, { useState } from 'react';
import { Menu, X, User } from 'lucide-react';

interface NavbarProps {
  onNavigate: (page: string) => void;
  currentPage: string;
  isAdmin: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate, currentPage, isAdmin }) => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Início' },
    { id: 'news', label: 'Notícias' },
    { id: 'calendar', label: 'Calendário' },
    { id: 'teams', label: 'Equipas' },
    { id: 'shop', label: 'Loja' },
    { id: 'partners', label: 'Parceiros' },
    { id: 'about', label: 'Quem Somos' },
    { id: 'photos', label: 'Fotos' },
    { id: 'contacts', label: 'Contactos' },
  ];

  const handleNav = (page: string) => {
    onNavigate(page);
    setIsOpen(false);
  };

  return (
    <nav className="bg-secondary text-white sticky top-0 z-50 border-b-4 border-primary shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center cursor-pointer" onClick={() => handleNav('home')}>
            {/* Logo placeholder - using text for simplicity but styled specifically */}
            <div className="flex flex-col items-center justify-center font-black italic tracking-tighter leading-none">
              <span className="text-3xl text-white">ALMA</span>
              <span className="text-sm text-primary">VISEU</span>
            </div>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    currentPage === item.id
                      ? 'bg-primary text-white'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-primary'
                  }`}
                >
                  {item.label}
                </button>
              ))}
              {isAdmin ? (
                <button
                   onClick={() => handleNav('admin')}
                   className="px-3 py-2 rounded-md text-sm font-bold bg-white text-secondary hover:bg-gray-200 flex items-center gap-2"
                >
                  <User size={16} /> Admin
                </button>
              ) : (
                <button
                   onClick={() => handleNav('login')}
                   className="text-gray-500 hover:text-white"
                   title="Área de Admin"
                >
                  <User size={16} />
                </button>
              )}
            </div>
          </div>
          
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-secondary pb-4">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium ${
                  currentPage === item.id
                    ? 'bg-primary text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            ))}
            <button
                onClick={() => handleNav(isAdmin ? 'admin' : 'login')}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-primary hover:text-white"
            >
              {isAdmin ? 'Painel de Controlo' : 'Login Admin'}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};
