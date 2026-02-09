import React, { useState } from 'react';
import { Menu, X, User } from 'lucide-react';

interface NavbarProps {
  onNavigate: (page: string) => void;
  currentPage: string;
  isAdmin: boolean;
  logoUrl?: string;
}

const AlmaLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 500 500" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      {/* Path for the curved text at the bottom */}
      <path id="ringCurve" d="M 75, 250 A 175, 175 0 0, 0 425, 250" fill="none" />
    </defs>
  
    {/* Circle Ring */}
    <circle cx="250" cy="250" r="200" stroke="#ea580c" strokeWidth="60" fill="none" />
    
    {/* Top V Shape */}
    <path d="M 30 40 L 130 40 L 250 190 L 370 40 L 470 40 L 250 310 Z" fill="#ea580c" />
    
    {/* Inner Nose Triangle */}
    <path d="M 215 250 L 285 250 L 250 290 Z" fill="#ea580c" />
    
    {/* VISEU Text */}
    <text x="250" y="390" textAnchor="middle" fill="#ea580c" fontSize="70" fontWeight="900" style={{fontFamily: 'Arial Black, sans-serif'}} letterSpacing="2">VISEU</text>
    
    {/* Curved Text */}
    <text fill="white" fontSize="34" fontWeight="bold" letterSpacing="1" style={{fontFamily: 'Arial, sans-serif'}}>
      <textPath href="#ringCurve" startOffset="50%" textAnchor="middle" alignmentBaseline="central">
        FUNDADO EM 2022
      </textPath>
    </text>
  </svg>
);

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
    { id: 'about', label: 'Sobre' },
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
    <nav className="bg-black/95 backdrop-blur-md text-white sticky top-0 z-50 border-b-2 border-primary shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-24">
          {/* Logo and Brand Name */}
          <div className="flex items-center cursor-pointer group gap-3" onClick={() => handleNav('home')}>
            {logoUrl ? (
              <img 
                src={logoUrl} 
                alt="ALMA Logo" 
                className="h-16 w-16 md:h-20 md:w-20 object-contain transition-transform group-hover:scale-105" 
              />
            ) : (
              <AlmaLogo className="h-16 w-16 md:h-20 md:w-20 transition-transform group-hover:scale-105" />
            )}
            <span className="text-3xl md:text-4xl font-black italic tracking-tighter text-white">ALMA</span>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:block">
            <div className="ml-10 flex items-baseline space-x-2">
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
          
          {/* Mobile menu button */}
          <div className="-mr-2 flex lg:hidden">
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