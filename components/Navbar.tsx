import React, { useState } from 'react';
import { Menu, X, User } from 'lucide-react';

interface NavbarProps {
  onNavigate: (page: string) => void;
  currentPage: string;
  isAdmin: boolean;
}

const AlmaLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 500 500" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      {/* Path for the curved text at the bottom */}
      <path id="ringCurve" d="M 88, 250 A 162, 162 0 0, 0 412, 250" fill="none" />
    </defs>
  
    {/* Circle Ring */}
    <circle cx="250" cy="250" r="185" stroke="#ea580c" strokeWidth="55" fill="none" />
    
    {/* Big V shape */}
    <path d="M 15 25 L 250 260 L 485 25 L 400 25 L 250 175 L 100 25 Z" fill="#ea580c" />
    
    {/* Cheek Triangles */}
    <path d="M 150 180 L 205 235 L 150 235 Z" fill="#ea580c" />
    <path d="M 350 180 L 295 235 L 350 235 Z" fill="#ea580c" />
    
    {/* Nose Triangle */}
    <path d="M 233 245 L 267 245 L 250 265 Z" fill="#ea580c" />
    
    {/* VISEU Text */}
    <text x="250" y="380" textAnchor="middle" fill="#ea580c" fontSize="75" fontWeight="900" style={{fontFamily: 'Arial Black, sans-serif'}} letterSpacing="2">VISEU</text>
    
    {/* Curved Text */}
    <text fill="white" fontSize="30" fontWeight="bold" letterSpacing="1" style={{fontFamily: 'Arial, sans-serif'}}>
      <textPath href="#ringCurve" startOffset="50%" textAnchor="middle" alignmentBaseline="central">
        FUNDADO EM 2022
      </textPath>
    </text>
  </svg>
);

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
        <div className="flex items-center justify-between h-24">
          {/* Logo and Brand Name */}
          <div className="flex items-center cursor-pointer group gap-3" onClick={() => handleNav('home')}>
            <AlmaLogo className="h-16 w-16 md:h-20 md:w-20 transition-transform group-hover:scale-105" />
            <span className="text-3xl md:text-4xl font-black italic tracking-tighter text-white">ALMA</span>
          </div>
          
          {/* Desktop Navigation */}
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
          
          {/* Mobile menu button */}
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
        <div className="md:hidden bg-secondary pb-4 shadow-xl border-t border-gray-800">
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
            <div className="border-t border-gray-700 mt-2 pt-2">
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