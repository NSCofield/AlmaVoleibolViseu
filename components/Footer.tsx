import React from 'react';
import { Facebook, Instagram, Youtube, Mail, MapPin, Phone, Lock } from 'lucide-react';
import { SiteContent } from '../types';

interface FooterProps {
  content?: SiteContent;
  onNavigate: (page: string) => void;
  siteContent?: Record<string, SiteContent>;
}

export const Footer: React.FC<FooterProps> = ({ content, onNavigate, siteContent }) => {
  const title = content?.title || "";
  const description = content?.subtitle || "Promovendo o voleibol em Viseu com paixão, dedicação e espírito de equipa. Junta-te a nós e faz parte desta grande família.";
  const image = content?.image_url;

  const socialLinks = {
    facebook: siteContent?.['social_facebook']?.title || "https://www.facebook.com/VivAlmaVoleibolViseu",
    instagram: siteContent?.['social_instagram']?.title || "https://www.instagram.com/vivalma.voleibol.viseu/",
    youtube: siteContent?.['social_youtube']?.title || ""
  };

  const contactEmail = siteContent?.['contact_email']?.title || 'almavoleibolviseu@gmail.com';

  return (
    <footer className="bg-secondary text-white pt-10 pb-6 border-t-4 border-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* About */}
        <div>
          {image && (
             <img src={image} alt={title} className="h-24 w-auto mb-4 object-contain" />
          )}
          <h3 className="text-2xl font-bold text-primary mb-4 italic">{title}</h3>
          <div className="text-gray-400 text-sm leading-relaxed" dangerouslySetInnerHTML={{__html: description}} />
        </div>

        {/* Contacts */}
        <div>
          <h4 className="text-lg font-bold mb-4 border-b border-gray-700 pb-2">Contactos</h4>
          <ul className="space-y-3 text-sm text-gray-300">
            <li className="flex items-start gap-3">
              <MapPin className="text-primary mt-1" size={18} />
              <span>Escola Secundária Alves Martins<br />Avenida Infante Dom Henrique, 3514-507, Viseu</span>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="text-primary" size={18} />
              <a href={`mailto:${contactEmail}`} className="hover:text-primary transition">{contactEmail}</a>
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
          <div className="flex flex-wrap gap-4">
            {socialLinks.facebook && (
              <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="bg-gray-800 p-3 rounded-full hover:bg-primary transition-all duration-300 transform hover:scale-110 shadow-lg shadow-black/20" title="Facebook">
                <Facebook size={20} />
              </a>
            )}
            {socialLinks.instagram && (
              <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="bg-gray-800 p-3 rounded-full hover:bg-primary transition-all duration-300 transform hover:scale-110 shadow-lg shadow-black/20" title="Instagram">
                <Instagram size={20} />
              </a>
            )}
            {socialLinks.youtube && (
              <a href={socialLinks.youtube} target="_blank" rel="noopener noreferrer" className="bg-gray-800 p-3 rounded-full hover:bg-primary transition-all duration-300 transform hover:scale-110 shadow-lg shadow-black/20" title="YouTube">
                <Youtube size={20} />
              </a>
            )}
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 pt-6 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-4">
        <div className="text-xs text-gray-500">
           &copy; {new Date().getFullYear()} ALMA. Todos os direitos reservados.
        </div>
        <button 
          onClick={() => onNavigate('login')} 
          className="text-gray-800 hover:text-primary transition p-2"
          title="Área Privada"
        >
           <Lock size={12} />
        </button>
      </div>
    </footer>
  );
};