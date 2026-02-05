import React from 'react';
import { Facebook, Instagram, Mail, MapPin, Phone } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-secondary text-white pt-10 pb-6 border-t-4 border-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* About */}
        <div>
          <h3 className="text-2xl font-bold text-primary mb-4 italic">ALMA VISEU</h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            Promovendo o voleibol em Viseu com paixão, dedicação e espírito de equipa.
            Junta-te a nós e faz parte desta grande família.
          </p>
        </div>

        {/* Contacts */}
        <div>
          <h4 className="text-lg font-bold mb-4 border-b border-gray-700 pb-2">Contactos</h4>
          <ul className="space-y-3 text-sm text-gray-300">
            <li className="flex items-start gap-3">
              <MapPin className="text-primary mt-1" size={18} />
              <span>Escola Secundária Alves Marins<br />Avenida Infante Dom Henrique, 3514-507, Viseu</span>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="text-primary" size={18} />
              <a href="mailto:almavoleibolviseu@gmail.com" className="hover:text-primary transition">almavoleibolviseu@gmail.com</a>
            </li>
            <li className="flex items-start gap-3">
              <Phone className="text-primary mt-1" size={18} />
              <div className="flex flex-col">
                <span>+351 919 264 188</span>
                <span>+351 925 332 607</span>
              </div>
            </li>
          </ul>
        </div>

        {/* Social */}
        <div>
          <h4 className="text-lg font-bold mb-4 border-b border-gray-700 pb-2">Segue-nos</h4>
          <div className="flex space-x-4">
            <a href="https://www.facebook.com/VivAlmaVoleibolViseu" target="_blank" rel="noopener noreferrer" className="bg-gray-800 p-3 rounded-full hover:bg-primary transition-colors duration-300">
              <Facebook size={20} />
            </a>
            <a href="https://www.instagram.com/vivalma.voleibol.viseu/" target="_blank" rel="noopener noreferrer" className="bg-gray-800 p-3 rounded-full hover:bg-primary transition-colors duration-300">
              <Instagram size={20} />
            </a>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 pt-6 border-t border-gray-800 text-center text-xs text-gray-500">
        &copy; {new Date().getFullYear()} ALMA Viseu. Todos os direitos reservados.
      </div>
    </footer>
  );
};