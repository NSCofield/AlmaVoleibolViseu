import React, { useState, useEffect, useRef } from 'react';
import { supabase } from './lib/supabase';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { NewsItem, Match, Product, Partner, Team, TeamMember, GalleryItem, OrganizationMember, SiteContent } from './types';
import { 
  Loader2, Calendar, MapPin, ShoppingBag, Users, 
  Info, Camera, Mail, Trophy, ArrowRight, ChevronRight, Edit, Trash, Plus, Save, Copy, Check,
  LogIn, UserPlus, Upload, Image as ImageIcon, Settings, Phone, Home, Layout, FileText,
  Bold, Italic, Underline, Type, Palette, AlignLeft, AlignCenter, AlignRight, List, ListOrdered, Highlighter,
  X, ChevronLeft, Database, ShieldCheck, AlertTriangle, Lock
} from 'lucide-react';

// --- HELPER: Strip HTML for previews ---
const stripHtml = (html: string) => {
   if (!html) return "";
   const tmp = document.createElement("DIV");
   tmp.innerHTML = html;
   return tmp.textContent || tmp.innerText || "";
};

// --- RICH TEXT EDITOR COMPONENT ---
const RichTextEditor = ({ value, onChange, className, placeholder }: { value: string, onChange: (val: string) => void, className?: string, placeholder?: string }) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [customSize, setCustomSize] = useState('16');

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
       if (editorRef.current.innerHTML !== value) {
          editorRef.current.innerHTML = value || '';
       }
    }
  }, [value]);

  const handleInput = () => {
    if (editorRef.current) {
        onChange(editorRef.current.innerHTML);
    }
  };

  const execCmd = (command: string, arg: string | undefined = undefined) => {
    document.execCommand(command, false, arg);
    handleInput();
  };

  const applyCustomFontSize = () => {
    document.execCommand('fontSize', false, '7');
    const fontElements = document.getElementsByTagName("font");
    for (let i = 0; i < fontElements.length; i++) {
        if (fontElements[i].getAttribute("size") === "7") {
            fontElements[i].removeAttribute("size");
            fontElements[i].style.fontSize = `${customSize}px`;
        }
    }
    handleInput();
  };

  const fontList = [
    "Inter", "Montserrat", "Arial", "Arial Black", "Helvetica", "Verdana", "Tahoma", "Trebuchet MS", 
    "Times New Roman", "Georgia", "Garamond", "Courier New", "Brush Script MT", "Comic Sans MS", "Impact"
  ];

  return (
    <div className={`border rounded bg-white text-black overflow-hidden shadow-sm ${className}`}>
      <div className="flex flex-wrap items-center gap-1 bg-neutral-100 p-2 border-b select-none">
        <div className="flex gap-0.5 border-r pr-2 mr-1">
          <button type="button" onClick={() => execCmd('bold')} className="p-1.5 hover:bg-neutral-300 rounded" title="Negrito"><Bold size={16}/></button>
          <button type="button" onClick={() => execCmd('italic')} className="p-1.5 hover:bg-neutral-300 rounded" title="Itálico"><Italic size={16}/></button>
          <button type="button" onClick={() => execCmd('underline')} className="p-1.5 hover:bg-neutral-300 rounded" title="Sublinhado"><Underline size={16}/></button>
        </div>
        <div className="flex gap-0.5 border-r pr-2 mr-1">
          <button type="button" onClick={() => execCmd('justifyLeft')} className="p-1.5 hover:bg-neutral-300 rounded" title="Esquerda"><AlignLeft size={16}/></button>
          <button type="button" onClick={() => execCmd('justifyCenter')} className="p-1.5 hover:bg-neutral-300 rounded" title="Centro"><AlignCenter size={16}/></button>
          <button type="button" onClick={() => execCmd('justifyRight')} className="p-1.5 hover:bg-neutral-300 rounded" title="Direita"><AlignRight size={16}/></button>
        </div>
        <div className="flex gap-2 border-r pr-2 mr-1 items-center">
            <select onChange={(e) => execCmd('fontName', e.target.value)} className="text-xs p-1.5 border rounded bg-white h-8 w-28 cursor-pointer focus:border-primary outline-none">
              <option value="Inter">Fonte</option>
              {fontList.map(font => (
                <option key={font} value={font} style={{fontFamily: font}}>{font}</option>
              ))}
            </select>
            <div className="flex items-center gap-1 bg-white border rounded px-1 h-8">
              <Type size={14} className="text-neutral-500"/>
              <input 
                type="number" 
                value={customSize} 
                onChange={(e) => setCustomSize(e.target.value)}
                className="w-10 text-xs border-none outline-none text-center"
                title="Tamanho da fonte em px"
              />
              <span className="text-[10px] text-neutral-400">px</span>
              <button 
                type="button" 
                onClick={applyCustomFontSize} 
                className="text-[10px] font-bold bg-neutral-200 hover:bg-primary hover:text-white px-1.5 rounded transition"
              >
                OK
              </button>
            </div>
        </div>
        <div className="flex gap-0.5 border-r pr-2 mr-1">
          <button type="button" onClick={() => execCmd('insertUnorderedList')} className="p-1.5 hover:bg-neutral-300 rounded" title="Lista"><List size={16}/></button>
          <button type="button" onClick={() => execCmd('insertOrderedList')} className="p-1.5 hover:bg-neutral-300 rounded" title="Lista Numerada"><ListOrdered size={16}/></button>
        </div>
        <div className="flex items-center gap-2 pl-1">
           <div className="flex items-center gap-1 border rounded bg-white px-1 h-8 hover:border-primary transition" title="Cor do Texto">
              <Palette size={14} className="text-neutral-500"/>
              <input type="color" onChange={(e) => execCmd('foreColor', e.target.value)} className="w-6 h-6 border-none bg-transparent cursor-pointer" />
           </div>
           <div className="flex items-center gap-1 border rounded bg-white px-1 h-8 hover:border-primary transition" title="Cor de Fundo (Realce)">
              <Highlighter size={14} className="text-neutral-500"/>
              <input type="color" defaultValue="#ffffff" onChange={(e) => execCmd('hiliteColor', e.target.value)} className="w-6 h-6 border-none bg-transparent cursor-pointer" />
           </div>
        </div>
      </div>
      <div 
        ref={editorRef}
        className="p-4 min-h-[150px] outline-none max-h-[500px] overflow-y-auto leading-normal"
        contentEditable
        onInput={handleInput}
        onBlur={handleInput}
        data-placeholder={placeholder}
      ></div>
      <div className="bg-neutral-50 p-1 text-[10px] text-neutral-400 text-right border-t">
        Editor HTML
      </div>
    </div>
  );
};

// --- CAROUSEL COMPONENT ---
const SectionCarousel = ({ children, className }: { children?: React.ReactNode, className?: string }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount = current.clientWidth * 0.8;
      current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className={`relative group/carousel ${className}`}>
      <button 
        onClick={() => scroll('left')} 
        className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-primary text-white p-3 rounded-full opacity-0 group-hover/carousel:opacity-100 transition-opacity backdrop-blur-sm -ml-4 md:ml-0"
      >
        <ChevronLeft size={24} />
      </button>
      
      <div 
        ref={scrollRef} 
        className="flex overflow-x-auto gap-6 pb-8 snap-x snap-mandatory scrollbar-hide px-2"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {children}
      </div>

      <button 
        onClick={() => scroll('right')} 
        className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-primary text-white p-3 rounded-full opacity-0 group-hover/carousel:opacity-100 transition-opacity backdrop-blur-sm -mr-4 md:mr-0"
      >
        <ChevronRight size={24} />
      </button>
    </div>
  );
};

// --- IMAGE MODAL / CAROUSEL COMPONENT ---
interface ModalItem {
  id: string;
  image: string;
  title: string;
  subtitle?: string;
  description?: string;
  price?: number; 
  members?: TeamMember[]; // Added for roster
  coaches?: string; // Coaches field
}

const ImageModal = ({ items, initialIndex, isOpen, onClose }: { items: ModalItem[], initialIndex: number, isOpen: boolean, onClose: () => void }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex]); 

  if (!isOpen || items.length === 0) return null;

  const currentItem = items[currentIndex];

  const next = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % items.length);
  };

  const prev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  return (
    <div className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <button onClick={onClose} className="absolute top-4 right-4 text-white hover:text-primary z-50">
        <X size={32} />
      </button>

      {items.length > 1 && (
        <>
          <button onClick={prev} className="absolute left-2 md:left-8 top-1/2 -translate-y-1/2 text-white/50 hover:text-white hover:bg-black/50 p-2 rounded-full transition z-50">
             <ChevronLeft size={48} />
          </button>
          <button onClick={next} className="absolute right-2 md:right-8 top-1/2 -translate-y-1/2 text-white/50 hover:text-white hover:bg-black/50 p-2 rounded-full transition z-50">
             <ChevronRight size={48} />
          </button>
        </>
      )}

      <div 
        className="w-full h-full max-w-7xl flex flex-col md:flex-row bg-black overflow-hidden rounded-xl shadow-2xl border border-neutral-800" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex-1 bg-black flex items-center justify-center relative h-[40vh] md:h-full">
           <img 
              src={currentItem.image} 
              alt={currentItem.title} 
              className="max-w-full max-h-full object-contain"
           />
        </div>

        <div className="w-full md:w-[450px] bg-neutral-900 border-l border-neutral-800 flex flex-col h-[60vh] md:h-full">
           <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar flex-grow">
              {currentItem.subtitle && (
                <div className="text-primary font-bold uppercase tracking-widest text-xs mb-2">
                   {currentItem.subtitle}
                </div>
              )}
              <h2 className="text-2xl md:text-3xl font-black italic text-white mb-6 leading-tight">
                 {currentItem.title}
              </h2>
              
              {currentItem.description && (
                <div 
                  className="text-white leading-relaxed text-sm md:text-base space-y-4 mb-8"
                  dangerouslySetInnerHTML={{__html: currentItem.description}}
                ></div>
              )}
              
              {/* Coaches Section */}
              {currentItem.coaches && (
                <div className="mb-8 border-l-4 border-primary pl-4">
                   <h3 className="text-primary font-bold uppercase tracking-widest text-xs mb-1">Equipa Técnica</h3>
                   <div 
                     className="text-white text-base font-bold whitespace-pre-wrap"
                     dangerouslySetInnerHTML={{__html: currentItem.coaches}}
                   ></div>
                </div>
              )}

              {/* Roster / Plantel Rendering - UPDATED TO SHOW EMPTY STATE */}
              {currentItem.members && (
                <div className="border-t border-neutral-800 pt-6">
                   <h3 className="text-primary font-bold uppercase tracking-widest text-sm mb-4 flex items-center gap-2">
                      <Users size={16} /> Plantel
                   </h3>
                   {currentItem.members.length > 0 ? (
                      <div className="grid grid-cols-3 gap-3">
                          {currentItem.members.map(member => (
                            <div key={member.id} className="flex flex-col items-center bg-black p-2 rounded-lg border border-neutral-800 hover:border-primary transition group">
                                <div className="w-12 h-12 rounded-full overflow-hidden mb-2 bg-neutral-800 border-2 border-neutral-700 group-hover:border-primary transition">
                                    <img src={member.image_url || `https://ui-avatars.com/api/?name=${member.name}&background=random`} alt={member.name} className="w-full h-full object-cover" />
                                </div>
                                <div className="font-bold text-white text-[10px] text-center leading-tight w-full truncate" title={member.name}>{member.name}</div>
                                <div className="text-[9px] text-primary font-bold uppercase">{member.number ? `#${member.number}` : ''} {member.position}</div>
                            </div>
                          ))}
                       </div>
                   ) : (
                       <p className="text-neutral-500 text-sm italic">Plantel a anunciar brevemente.</p>
                   )}
                </div>
              )}
           </div>
           
           <div className="mt-auto p-4 border-t border-neutral-800 text-xs text-neutral-500 flex justify-between shrink-0">
              <span>ALMA Viseu</span>
              <span>{currentIndex + 1} / {items.length}</span>
           </div>
        </div>
      </div>
    </div>
  );
};

// --- LANDING PAGE SECTIONS ---

const SectionTitle = ({ title, subtitle, className }: { title: string, subtitle?: string, className?: string }) => {
  const isHtmlTitle = /<[a-z][\s\S]*>/i.test(title || '');

  const renderTitle = () => {
    if (!title) return null;
    if (isHtmlTitle) {
      return <div dangerouslySetInnerHTML={{ __html: title }} className="inline-block" />;
    }
    const words = title.split(' ');
    if (words.length === 1) return <span className="text-inherit">{words[0]}</span>;
    const lastWord = words.pop();
    return (
      <>
        <span className="text-inherit">{words.join(' ')}</span> <span className="text-primary">{lastWord}</span>
      </>
    );
  };

  return (
    <div className={`mb-12 text-center ${className}`}>
      <h2 className="text-4xl md:text-5xl font-montserrat font-extrabold italic text-inherit mb-2 uppercase tracking-tighter leading-tight">
        {renderTitle()}
      </h2>
      {subtitle && (
        <div className="text-inherit opacity-70 max-w-2xl mx-auto" dangerouslySetInnerHTML={{ __html: subtitle }}></div>
      )}
      <div className="w-24 h-1 bg-primary mx-auto mt-4"></div>
    </div>
  );
};

const DynamicSection = ({ 
  id, 
  content, 
  defaultClass, 
  children,
  defaultTitle,
  defaultSubtitle,
  padding = "py-24"
}: { 
  id: string, 
  content: SiteContent | undefined, 
  defaultClass: string, 
  children?: React.ReactNode,
  defaultTitle?: string,
  defaultSubtitle?: string,
  padding?: string
}) => {
  const bgImage = content?.image_url;
  const title = content?.title || defaultTitle;
  const subtitle = content?.subtitle || defaultSubtitle;

  return (
    <section id={id} className={`relative ${padding} px-4 ${!bgImage ? defaultClass : 'bg-black text-white'} overflow-hidden`}>
      {bgImage && (
        <div className="absolute inset-0 z-0">
          <img src={bgImage} className="w-full h-full object-cover opacity-30" alt="Background" />
          <div className="absolute inset-0 bg-black/60"></div>
        </div>
      )}
      <div className="relative z-10 max-w-7xl mx-auto">
        {(title) && (
           <SectionTitle title={title} subtitle={subtitle} className={!bgImage && defaultClass.includes('text-black') ? 'text-black' : 'text-white'} />
        )}
        {children}
      </div>
    </section>
  );
};

// --- ABOUT PAGE COMPONENT ---
const AboutPage = ({ teams, organization }: { teams: Team[], organization: OrganizationMember[] }) => {
  return (
    <div className="bg-neutral-900 min-h-screen text-white py-12 px-4 animate-fade-in">
        <div className="max-w-4xl mx-auto text-center">
          <SectionTitle title="Quem Somos" subtitle="A nossa história e a nossa gente." />
          
          <div className="mb-16">
             <h2 className="text-4xl font-black italic text-primary mb-8">ALMA VISEU</h2>
             <p className="text-xl text-neutral-300 leading-relaxed mb-8">
                O <strong>ALMA</strong> é mais do que um clube de voleibol, é uma comunidade dedicada ao desenvolvimento desportivo e pessoal dos jovens de Viseu. 
                Fundado com a missão de revitalizar o voleibol na região centro, o clube tem crescido sustentadamente, promovendo valores como o respeito, a disciplina e o espírito de sacrifício.
              </p>
              <div className="grid grid-cols-3 gap-4 text-center">
                 <div className="p-4 bg-black rounded-lg border border-neutral-800">
                    <div className="text-3xl font-bold text-primary mb-1">2022</div>
                    <div className="text-xs text-neutral-500 uppercase">Fundação</div>
                 </div>
                 <div className="p-4 bg-black rounded-lg border border-neutral-800">
                    <div className="text-3xl font-bold text-primary mb-1">{teams.length}</div>
                    <div className="text-xs text-neutral-500 uppercase">Equipas</div>
                 </div>
                 <div className="p-4 bg-black rounded-lg border border-neutral-800">
                    <div className="text-3xl font-bold text-primary mb-1">100+</div>
                    <div className="text-xs text-neutral-500 uppercase">Atletas</div>
                 </div>
              </div>
          </div>

          {organization.length > 0 && (
            <div className="border-t border-neutral-800 pt-16">
              <h3 className="text-2xl font-bold text-white mb-12 uppercase tracking-widest">Estrutura Diretiva</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-12">
                 {organization.map(member => (
                    <div key={member.id} className="flex flex-col items-center group">
                       <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-neutral-800 group-hover:border-primary transition duration-300 mb-6 shadow-xl relative">
                          <img 
                            src={member.image_url || `https://ui-avatars.com/api/?name=${member.name}&background=random`} 
                            alt={member.name}
                            className="w-full h-full object-cover"
                          />
                       </div>
                       <h4 className="text-xl font-bold text-white mb-1">{member.name}</h4>
                       <p className="text-primary text-sm uppercase font-bold tracking-wider">{member.role}</p>
                    </div>
                 ))}
              </div>
            </div>
          )}
        </div>
    </div>
  );
};

// --- CONTACTS PAGE COMPONENT ---
const ContactsPage = ({ content }: { content: SiteContent | undefined }) => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { name, email, subject, message } = formData;
    const body = `Nome: ${name}\nEmail: ${email}\n\nMensagem:\n${message}`;
    window.location.href = `mailto:almavoleibolviseu@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <div className="bg-neutral-900 min-h-screen text-white pt-12 pb-24 px-4 animate-fade-in">
      <DynamicSection id="contacts" content={content} defaultClass="bg-neutral-900 text-white" defaultTitle="Contactos">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 mt-12">
           <div>
              <div className="space-y-8 text-lg">
                 <div className="flex items-start gap-6">
                    <MapPin className="text-primary mt-1" size={32} />
                    <div>
                       <h4 className="font-bold text-inherit">Localização</h4>
                       <p className="opacity-70">Escola Secundária Alves Martins<br/>Avenida Infante Dom Henrique, 3514-507, Viseu</p>
                    </div>
                 </div>
                 <div className="flex items-start gap-6">
                    <Mail className="text-primary mt-1" size={32} />
                    <div>
                       <h4 className="font-bold text-inherit">Email</h4>
                       <a href="mailto:almavoleibolviseu@gmail.com" className="opacity-70 hover:opacity-100 transition">almavoleibolviseu@gmail.com</a>
                    </div>
                 </div>
                 <div className="flex items-start gap-6">
                    <Phone className="text-primary mt-1" size={32} />
                    <div>
                       <h4 className="font-bold text-inherit">Telefone</h4>
                       <div className="opacity-70 flex flex-col">
                         <span>+351 919 264 188</span>
                         <span>+351 925 332 607</span>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
           
           <div className="bg-neutral-800 p-8 rounded-2xl shadow-xl border border-neutral-700">
              <h3 className="text-2xl font-bold text-white mb-6">Envia-nos uma mensagem</h3>
              <form className="space-y-4" onSubmit={handleContactSubmit}>
                 <div className="grid grid-cols-2 gap-4">
                    <input type="text" placeholder="Nome" className="bg-black border border-neutral-700 text-white rounded p-3 focus:border-primary outline-none" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                    <input type="email" placeholder="Email" className="bg-black border border-neutral-700 text-white rounded p-3 focus:border-primary outline-none" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                 </div>
                 <input type="text" placeholder="Assunto" className="w-full bg-black border border-neutral-700 text-white rounded p-3 focus:border-primary outline-none" required value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} />
                 <textarea placeholder="A tua mensagem..." className="w-full bg-black border border-neutral-700 text-white rounded p-3 focus:border-primary outline-none h-32" required value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})}></textarea>
                 <button className="w-full bg-primary text-white font-bold py-4 rounded hover:bg-orange-700 transition uppercase tracking-widest">Enviar</button>
              </form>
           </div>
        </div>
      </DynamicSection>
    </div>
  );
};

// --- AUTOMATIC SCROLL MARQUEE CAROUSEL ---
const PartnersMarquee = ({ partners }: { partners: Partner[] }) => {
  if (partners.length === 0) return <p className="text-neutral-400 text-center w-full">Seja nosso parceiro!</p>;

  // Ensure enough items for smooth scrolling on large screens
  // If we have few partners, duplicate them more times in the base list
  let baseList = partners;
  if (partners.length < 5) {
     baseList = [...partners, ...partners, ...partners, ...partners]; 
  }

  return (
    <div className="w-full overflow-hidden py-4 group cursor-pointer select-none">
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: flex;
          width: max-content;
          animation: marquee 20s linear infinite;
        }
        .group:hover .animate-marquee,
        .group:active .animate-marquee {
          animation-play-state: paused;
        }
      `}</style>
      
      <div className="animate-marquee">
        {/* Set 1 */}
        <div className="flex gap-12 items-center pr-12">
           {baseList.map((p, i) => (
               <a key={`s1-${i}`} href={p.website_url} target="_blank" rel="noreferrer" className="block w-20 md:w-32 grayscale hover:grayscale-0 transition opacity-60 hover:opacity-100 flex-shrink-0">
                 <img src={p.logo_url || `https://picsum.photos/seed/${p.id}/200/100`} alt={p.name} className="w-full object-contain" />
               </a>
           ))}
        </div>
        {/* Set 2 (Duplicate for loop) */}
        <div className="flex gap-12 items-center pr-12">
           {baseList.map((p, i) => (
               <a key={`s2-${i}`} href={p.website_url} target="_blank" rel="noreferrer" className="block w-20 md:w-32 grayscale hover:grayscale-0 transition opacity-60 hover:opacity-100 flex-shrink-0">
                 <img src={p.logo_url || `https://picsum.photos/seed/${p.id}/200/100`} alt={p.name} className="w-full object-contain" />
               </a>
           ))}
        </div>
      </div>
    </div>
  );
};

const LandingPage = ({ 
  onNavigate, 
  news, 
  matches, 
  products, 
  partners, 
  teams, 
  teamMembers,
  gallery,
  heroContent, 
  siteContent
}: { 
  onNavigate: (p: string) => void, 
  news: NewsItem[], 
  matches: Match[], 
  products: Product[],
  partners: Partner[],
  teams: Team[],
  teamMembers: TeamMember[],
  gallery: GalleryItem[],
  organization?: OrganizationMember[],
  heroContent: SiteContent | null,
  siteContent: Record<string, SiteContent>
}) => {
  const nextMatch = matches
    .filter(m => new Date(m.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];

  const upcoming = matches.filter(m => new Date(m.date) >= new Date()).slice(0, 5);
  const past = matches.filter(m => new Date(m.date) < new Date()).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [modalItems, setModalItems] = useState<ModalItem[]>([]);
  const [modalStartIndex, setModalStartIndex] = useState(0);

  const openModal = (items: any[], index: number, type: 'news' | 'product' | 'team' | 'gallery') => {
    let formattedItems: ModalItem[] = [];

    if (type === 'news') {
      formattedItems = items.map((i: NewsItem) => ({
        id: i.id,
        image: i.image_url || `https://picsum.photos/seed/${i.id}/800/600`,
        title: i.title,
        subtitle: new Date(i.created_at).toLocaleDateString('pt-PT'),
        description: i.content
      }));
    } else if (type === 'product') {
      formattedItems = items.map((i: Product) => ({
        id: i.id,
        image: i.image_url || `https://picsum.photos/seed/${i.id}/800/600`,
        title: i.name,
        subtitle: `${i.price.toFixed(2)} €`,
        description: i.description
      }));
    } else if (type === 'team') {
      formattedItems = items.map((i: Team) => {
        const roster = teamMembers ? teamMembers.filter(m => m.team_id === i.id) : [];
        return {
          id: i.id,
          image: i.image_url || `https://picsum.photos/seed/${i.id}/800/600`,
          title: i.name,
          subtitle: undefined, // Removed category
          description: i.description,
          coaches: i.coaches,
          members: roster
        };
      });
    } else if (type === 'gallery') {
      formattedItems = items.map((i: GalleryItem) => ({
        id: i.id,
        image: i.image_url || `https://picsum.photos/seed/${i.id}/800/600`,
        title: i.title || 'Sem título'
      }));
    }

    setModalItems(formattedItems);
    setModalStartIndex(index);
    setModalOpen(true);
  };

  const defaultHero = {
    title: 'ALMA VISEU',
    subtitle: 'Paixão. Competição. Voleibol.',
    image_url: 'https://picsum.photos/1920/1080?grayscale&blur=2'
  };

  const currentHero = heroContent || defaultHero;

  const isHeroHtml = /<[a-z][\s\S]*>/i.test(currentHero.title || '');
  const renderHeroTitle = () => {
    if (isHeroHtml) return <div dangerouslySetInnerHTML={{__html: currentHero.title}} className="inline-block"></div>;
    const words = currentHero.title.split(' ');
    if (words.length === 1) return <span className="text-white">{words[0]}</span>;
    const lastWord = words.pop();
    return <><span className="text-white">{words.join(' ')}</span> <span className="text-primary">{lastWord}</span></>;
  };

  return (
    <div className="bg-black text-white">
      {/* HERO SECTION */}
      <section id="home" className="relative h-screen min-h-[600px] flex items-center justify-center text-center overflow-hidden">
        <div className="absolute inset-0 bg-black/60 z-10"></div>
        <img src={currentHero.image_url} alt="Voleibol" className="absolute inset-0 w-full h-full object-cover opacity-50" />
        <div className="relative z-20 max-w-5xl px-4 animate-fade-in-up">
          <h1 className="text-6xl md:text-9xl font-black italic tracking-tighter mb-2 leading-none uppercase">
            {renderHeroTitle()}
          </h1>
          <div className="text-xl md:text-3xl text-neutral-300 font-light mb-8 tracking-widest uppercase">
             <div dangerouslySetInnerHTML={{ __html: currentHero.subtitle }}></div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => document.getElementById('calendar')?.scrollIntoView({behavior: 'smooth'})}
              className="bg-transparent text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-black transition transform hover:scale-105 border-2 border-white"
            >
              Ver Jogos
            </button>
          </div>
        </div>
      </section>

      {/* NEXT MATCH BANNER */}
      {nextMatch && (
        <div className="relative z-30 -mt-16 mx-4 md:mx-auto max-w-5xl">
          <div className="bg-gradient-to-r from-neutral-900 to-black border-t-4 border-primary rounded-lg shadow-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between text-center gap-6">
            <div className="text-left">
              <div className="text-primary font-bold uppercase tracking-widest text-xs">Próximo Jogo</div>
              <div className="text-2xl font-bold">{nextMatch.category}</div>
            </div>
            <div className="flex items-center gap-6 text-3xl md:text-5xl font-black italic">
              <span className="text-white">{nextMatch.home_team}</span>
              <span className="text-primary text-2xl">VS</span>
              <span className="text-white">{nextMatch.guest_team}</span>
            </div>
            <div className="text-right flex flex-col items-end">
              <div className="flex items-center gap-2 mb-1 text-neutral-300">
                <Calendar size={16} className="text-primary"/>
                <span>{new Date(nextMatch.date).toLocaleDateString('pt-PT')} <span className="text-neutral-600">|</span> {new Date(nextMatch.date).toLocaleTimeString('pt-PT', {hour:'2-digit', minute:'2-digit'})}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-neutral-500">
                <MapPin size={16} />
                <span>{nextMatch.location}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* NEWS SECTION */}
      <DynamicSection id="news" content={siteContent['news']} defaultClass="bg-neutral-900 text-white" defaultTitle="Últimas Notícias">
          <SectionCarousel>
            {news.map((item, index) => (
              <div 
                key={item.id} 
                className="bg-neutral-800 rounded-xl overflow-hidden group hover:ring-2 hover:ring-primary transition-all duration-300 cursor-pointer snap-center min-w-[300px] md:min-w-[400px]"
                onClick={() => openModal(news, index, 'news')}
              >
                <div className="h-56 overflow-hidden">
                  <img src={item.image_url || `https://picsum.photos/seed/${item.id}/400/250`} alt={item.title} className="w-full h-full object-cover transition duration-500 group-hover:scale-110 opacity-80 group-hover:opacity-100" />
                </div>
                <div className="p-6 relative">
                  <div className="absolute -top-4 right-6 bg-primary text-white text-xs font-bold px-3 py-1 rounded shadow-lg">
                    {new Date(item.created_at).toLocaleDateString('pt-PT')}
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-white leading-tight group-hover:text-primary transition line-clamp-2">{item.title}</h3>
                  <p className="text-neutral-400 text-sm line-clamp-3">
                    {stripHtml(item.content)}
                  </p>
                </div>
              </div>
            ))}
            {news.length === 0 && <p className="text-neutral-500 text-center w-full">A aguardar novidades...</p>}
          </SectionCarousel>
      </DynamicSection>

      {/* CALENDAR SECTION */}
      <DynamicSection id="calendar" content={siteContent['calendar']} defaultClass="bg-black text-white" defaultTitle="Calendário & Resultados" defaultSubtitle="Acompanha a nossa jornada jornada a jornada.">
          {!siteContent['calendar']?.image_url && (
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 pointer-events-none"></div>
          )}
          
          <div className="relative z-10 space-y-16">
            
            {/* UPCOMING MATCHES CAROUSEL */}
            <div>
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3 text-white pl-2">
                <span className="w-8 h-8 bg-primary rounded flex items-center justify-center text-black"><Calendar size={18}/></span> 
                Próximos Jogos
              </h3>
              <SectionCarousel>
                {upcoming.map(m => (
                  <div key={m.id} className="snap-center min-w-[320px] bg-neutral-900 border-l-4 border-primary p-6 rounded-r-xl hover:bg-neutral-800 transition shadow-lg group border-y border-r border-neutral-800 hover:border-neutral-700">
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-xs font-bold text-primary uppercase tracking-widest bg-primary/10 px-2 py-1 rounded">{m.category}</span>
                      <div className="text-right">
                         <span className="text-white font-bold block">{new Date(m.date).toLocaleDateString('pt-PT')}</span>
                         <span className="text-neutral-500 text-xs">{new Date(m.date).toLocaleTimeString('pt-PT', {hour:'2-digit', minute:'2-digit'})}</span>
                      </div>
                    </div>
                    <div className="text-xl font-black italic text-white mb-4 flex flex-col gap-1">
                        <span>{m.home_team}</span>
                        <span className="text-neutral-600 text-sm not-italic font-normal">VS</span>
                        <span>{m.guest_team}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-neutral-400 border-t border-neutral-800 pt-4">
                      <MapPin size={16} className="text-primary"/> 
                      <span className="truncate">{m.location}</span>
                    </div>
                  </div>
                ))}
                {upcoming.length === 0 && <p className="text-neutral-600 italic px-4 w-full text-center">Sem jogos agendados.</p>}
              </SectionCarousel>
            </div>

            {/* RESULTS CAROUSEL */}
            <div>
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3 text-white pl-2">
                <span className="w-8 h-8 bg-white rounded flex items-center justify-center text-black"><Trophy size={18}/></span> 
                Resultados
              </h3>
              <SectionCarousel>
                {past.map(m => (
                  <div key={m.id} className="snap-center min-w-[320px] bg-neutral-900 p-6 rounded-xl border border-neutral-800 hover:border-neutral-600 transition shadow-lg">
                     <div className="flex items-center justify-between mb-4 border-b border-neutral-800 pb-4">
                        <span className="text-xs font-bold text-neutral-500 uppercase tracking-widest">{m.category}</span>
                        <div className="text-xs text-neutral-400 flex flex-col items-end">
                            <span className="font-bold text-white">{new Date(m.date).getDate()} {new Date(m.date).toLocaleString('default', { month: 'short' })}</span>
                        </div>
                     </div>
                     <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <span className={`font-bold text-lg ${m.score_home! > m.score_guest! ? 'text-primary' : 'text-neutral-300'}`}>{m.home_team}</span>
                            <span className="font-mono text-xl font-bold bg-black px-3 py-1 rounded text-white">{m.score_home}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className={`font-bold text-lg ${m.score_guest! > m.score_home! ? 'text-primary' : 'text-neutral-300'}`}>{m.guest_team}</span>
                            <span className="font-mono text-xl font-bold bg-black px-3 py-1 rounded text-white">{m.score_guest}</span>
                        </div>
                     </div>
                  </div>
                ))}
                {past.length === 0 && <p className="text-neutral-600 italic px-4 w-full text-center">Sem resultados.</p>}
              </SectionCarousel>
            </div>

          </div>
      </DynamicSection>

      {/* TEAMS SECTION */}
      <DynamicSection id="teams" content={siteContent['teams']} defaultClass="bg-neutral-900 text-white" defaultTitle="As Nossas Equipas">
          <SectionCarousel>
            {teams.map((t, idx) => (
              <div 
                key={t.id} 
                className="flex-shrink-0 snap-center rounded-2xl overflow-hidden bg-neutral-800 shadow-2xl cursor-pointer hover:ring-2 hover:ring-primary transition-all duration-300 w-[90vw] md:w-[600px] flex flex-col"
                onClick={() => openModal(teams, idx, 'team')}
              >
                 <div className="relative h-[300px]">
                   <img src={t.image_url || `https://picsum.photos/seed/${t.id}/800/600`} className="absolute inset-0 w-full h-full object-cover" />
                   <div className="absolute inset-0 bg-gradient-to-t from-neutral-800 opacity-80"></div>
                 </div>
                 <div className="p-8 flex flex-col justify-center flex-grow">
                    {/* Category Removed here as requested */}
                    <h3 className="text-3xl font-black italic text-white mb-4">{t.name}</h3>
                    <div className="text-neutral-400 leading-relaxed text-sm line-clamp-3" dangerouslySetInnerHTML={{__html: t.description}}></div>
                    <div className="mt-4 text-primary text-sm font-bold flex items-center gap-2">
                       Ver mais <ChevronRight size={16} />
                    </div>
                 </div>
              </div>
            ))}
            {teams.length === 0 && <p className="text-neutral-500 text-center w-full">Equipas a carregar...</p>}
          </SectionCarousel>
      </DynamicSection>
      
      {/* GALLERY SECTION */}
      <section id="photos" className="py-4 bg-black">
        <DynamicSection id="photos-inner" content={siteContent['photos']} defaultClass="bg-black text-white" defaultTitle="Galeria">
            <SectionCarousel>
              {gallery.map((g, index) => (
                <div 
                  key={g.id} 
                  className="relative group overflow-hidden aspect-square cursor-pointer snap-center min-w-[200px] md:min-w-[300px] rounded-lg"
                  onClick={() => openModal(gallery, index, 'gallery')}
                >
                  <img src={g.image_url || `https://picsum.photos/seed/${g.id}/500/500`} className="w-full h-full object-cover transition duration-700 group-hover:scale-110 opacity-70 group-hover:opacity-100" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center">
                      <p className="text-white font-bold tracking-widest uppercase text-sm border-2 border-primary px-4 py-2 text-center">{g.title}</p>
                  </div>
                </div>
              ))}
              {gallery.length === 0 && <p className="text-neutral-500 text-center w-full">Galeria vazia.</p>}
            </SectionCarousel>
        </DynamicSection>
      </section>

      {/* PARTNERS SECTION */}
      <DynamicSection id="partners" content={siteContent['partners']} defaultClass="bg-neutral-100 text-black" defaultTitle="Os Nossos Parceiros" padding="py-6">
          <PartnersMarquee partners={partners} />
      </DynamicSection>

      {/* SHOP SECTION (SMALLER CARDS) */}
      <DynamicSection id="shop" content={siteContent['shop']} defaultClass="bg-black text-white" defaultTitle="Loja Oficial">
          <SectionCarousel>
            {products.map((p, index) => (
              <div 
                key={p.id} 
                className="bg-neutral-900 rounded-xl overflow-hidden group border border-neutral-800 hover:border-primary transition duration-300 cursor-pointer snap-center min-w-[220px] max-w-[220px]"
                onClick={() => openModal(products, index, 'product')}
              >
                <div className="h-40 overflow-hidden relative p-3 bg-neutral-800">
                  <img src={p.image_url || `https://picsum.photos/seed/${p.id}/400/400`} alt={p.name} className="w-full h-full object-cover rounded-lg transition transform group-hover:scale-105" />
                  <div className="absolute top-3 right-3 bg-primary text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">{p.price.toFixed(2)} €</div>
                </div>
                <div className="p-3">
                  <h3 className="font-bold text-sm text-white mb-1 truncate">{p.name}</h3>
                  <div className="text-neutral-500 text-[10px] mb-3 line-clamp-2" dangerouslySetInnerHTML={{__html: p.description}}></div>
                  <button className="w-full bg-white text-black py-2 rounded font-bold text-xs hover:bg-primary hover:text-white transition flex items-center justify-center gap-2">
                    <ShoppingBag size={12} /> Encomendar
                  </button>
                </div>
              </div>
            ))}
            {products.length === 0 && <p className="text-neutral-500 text-center w-full">Loja brevemente...</p>}
          </SectionCarousel>
      </DynamicSection>

      <ImageModal isOpen={modalOpen} onClose={() => setModalOpen(false)} items={modalItems} initialIndex={modalStartIndex} />
    </div>
  );
};

// --- ADMIN COMPONENTS (Moved outside App to prevent remounts) ---

const AdminList = ({ title, data, table, fields, onCreate, onUpdate, onDelete }: { title: string, data: any[], table: string, fields: any[], onCreate: Function, onUpdate: Function, onDelete: Function }) => {
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState<any>({});
    const [files, setFiles] = useState<Record<string, File>>({});
    const [previews, setPreviews] = useState<Record<string, string>>({});
    const [uploading, setUploading] = useState(false);

    const handleFileChange = (key: string, e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          const file = e.target.files[0];
          setFiles(prev => ({ ...prev, [key]: file }));
          setPreviews(prev => ({ ...prev, [key]: URL.createObjectURL(file) }));
      }
    };

    const handleEdit = (item: any) => {
      setFormData(item);
      setEditingId(item.id);
      const newPreviews: any = {};
      fields.forEach(f => {
         if(f.type === 'image' && item[f.key]) newPreviews[f.key] = item[f.key];
      });
      setPreviews(newPreviews);
      setFiles({});
      setIsAdding(true);
    };

    const handleAddNew = () => {
      setEditingId(null);
      setFormData({});
      setFiles({});
      setPreviews({});
      setIsAdding(!isAdding);
    };

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setUploading(true);
      try {
        const finalData = { ...formData };
        delete finalData.id;
        delete finalData.created_at;

        for (const key of Object.keys(files)) {
            const file = files[key];
            if (file) {
              const fileExt = file.name.split('.').pop();
              const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
              const { error: uploadError } = await supabase.storage.from('images').upload(fileName, file);
              if (uploadError) throw new Error(`Upload failed: ${uploadError.message}`);
              const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(fileName);
              finalData[key] = publicUrl;
            }
        }

        if (editingId) await onUpdate(table, editingId, finalData);
        else await onCreate(table, finalData);
        
        setIsAdding(false);
        setEditingId(null);
        setFormData({});
        setFiles({});
        setPreviews({});
      } catch (err: any) {
        alert("Erro: " + (err.message || "Erro desconhecido"));
      } finally {
        setUploading(false);
      }
    };

    return (
      <div className="bg-white p-6 rounded shadow mb-8 text-black">
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold">{title}</h3>
            <button onClick={handleAddNew} className="bg-green-600 text-white px-3 py-1 rounded text-sm flex items-center gap-1">
              {isAdding && !editingId ? <X size={16} /> : <Plus size={16} />} 
              {isAdding && !editingId ? 'Cancelar' : 'Adicionar'}
            </button>
        </div>
        {isAdding && (
          <div className="mb-6 p-4 bg-neutral-100 border rounded space-y-3 relative">
            <div className="text-xs font-bold text-primary mb-2 uppercase tracking-wider">{editingId ? 'Editar Item' : 'Adicionar Novo'}</div>
            {editingId && <button onClick={() => { setIsAdding(false); setEditingId(null); }} className="absolute top-2 right-2 text-neutral-400 hover:text-black"><X size={16}/></button>}
            
            <form onSubmit={handleSubmit} className="space-y-3">
              {fields.map(f => (
                <div key={f.key}>
                  <label className="block text-xs font-bold uppercase text-neutral-500 mb-1">{f.label}</label>
                  {f.type === 'textarea' || f.type === 'richtext' ? (
                    <RichTextEditor value={formData[f.key] || ''} onChange={val => setFormData({...formData, [f.key]: val})} />
                  ) : f.type === 'image' ? (
                      <div className="space-y-2">
                        {previews[f.key] && <img src={previews[f.key]} alt="Preview" className="h-20 w-auto rounded border" />}
                        <input type="file" accept="image/*" className="w-full text-sm" onChange={(e) => handleFileChange(f.key, e)} required={!editingId && f.required} />
                      </div>
                  ) : f.type === 'datetime-local' ? (
                      <input type="datetime-local" className="w-full border p-2 rounded" value={formData[f.key] ? new Date(formData[f.key]).toISOString().slice(0, 16) : ''} onChange={e => setFormData({...formData, [f.key]: e.target.value})} required={f.required} />
                  ) : f.type === 'select' ? (
                      <select className="w-full border p-2 rounded bg-white" value={formData[f.key] || ''} onChange={e => setFormData({...formData, [f.key]: e.target.value})} required={f.required}>
                         <option value="">Selecione...</option>
                         {f.options?.map((opt: any) => (
                           <option key={opt.value} value={opt.value}>{opt.label}</option>
                         ))}
                      </select>
                  ) : (
                    <input type={f.type || 'text'} className="w-full border p-2 rounded" value={formData[f.key] || ''} onChange={e => setFormData({...formData, [f.key]: e.target.value})} required={f.required} />
                  )}
                </div>
              ))}
              <button disabled={uploading} className="bg-primary text-white px-4 py-2 rounded font-bold text-sm w-full md:w-auto">
                {uploading ? 'A guardar...' : 'Guardar'}
              </button>
            </form>
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-neutral-100">
              <tr>{fields.slice(0, 3).map(f => <th key={f.key} className="p-2 text-left">{f.label}</th>)}<th className="p-2 w-24 text-right">Ações</th></tr>
            </thead>
            <tbody>
              {data.map(item => (
                <tr key={item.id} className="border-b hover:bg-neutral-50">
                  {fields.slice(0, 3).map(f => (
                    <td key={f.key} className="p-2 truncate max-w-[200px]">
                        {f.type === 'image' && item[f.key] ? <img src={item[f.key]} className="h-10 w-10 object-cover rounded" /> : 
                         (f.type === 'richtext' || f.type === 'textarea') ? stripHtml(item[f.key]) : 
                         f.type === 'select' ? (f.options?.find((o: any) => String(o.value) === String(item[f.key]))?.label || item[f.key]) :
                         f.type === 'datetime-local' ? new Date(item[f.key]).toLocaleString('pt-PT') : item[f.key]?.toString()
                        }
                    </td>
                  ))}
                  <td className="p-2 text-right space-x-2">
                    <button onClick={() => handleEdit(item)} className="text-blue-600 hover:text-blue-800" title="Editar"><Edit size={16} /></button>
                    <button onClick={() => onDelete(table, item.id)} className="text-red-600 hover:text-red-800" title="Eliminar"><Trash size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
};

const SiteContentEditor = ({ siteContent, onUpdate }: { siteContent: Record<string, SiteContent>, onUpdate: Function }) => {
  const sections = [
    { id: 'hero', label: 'Início (Hero)' },
    { id: 'branding', label: 'Logótipo & Branding' },
    { id: 'footer', label: 'Rodapé (Sobre)' },
    { id: 'news', label: 'Notícias' },
    { id: 'calendar', label: 'Calendário' },
    { id: 'teams', label: 'Equipas' },
    { id: 'shop', label: 'Loja' },
    { id: 'partners', label: 'Parceiros' },
    { id: 'photos', label: 'Galeria' },
    { id: 'contacts', label: 'Contactos' },
  ];
  
  const [selectedSection, setSelectedSection] = useState('hero');
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
     const current = siteContent[selectedSection];
     setTitle(current?.title || '');
     setSubtitle(current?.subtitle || '');
     setPreview(current?.image_url || null);
     setFile(null);
  }, [selectedSection, siteContent]);

  const handleSave = async () => {
    setUploading(true);
    await onUpdate(selectedSection, title, subtitle, file);
    setUploading(false);
  };

  return (
    <div className="bg-white p-6 rounded shadow text-black max-w-2xl">
       <h3 className="text-xl font-bold mb-6 border-b pb-2">Editar Conteúdo do Site</h3>
       
       <div className="mb-6">
         <label className="block text-sm font-bold text-neutral-600 mb-1">Escolher Secção</label>
         <select value={selectedSection} onChange={(e) => setSelectedSection(e.target.value)} className="w-full border p-2 rounded bg-neutral-50 font-bold">
           {sections.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
         </select>
       </div>

       <div className="space-y-4">
          {selectedSection === 'branding' ? (
            <div>
               <p className="text-sm text-neutral-500 mb-4 bg-yellow-50 p-3 rounded border border-yellow-200">
                 Aqui podes alterar o logótipo do site. O título e subtítulo serão ignorados nesta secção.
               </p>
            </div>
          ) : (
            <>
              <div>
                <label className="block text-sm font-bold text-neutral-600 mb-1">Título da Secção</label>
                <RichTextEditor value={title} onChange={setTitle} />
              </div>
              <div>
                <label className="block text-sm font-bold text-neutral-600 mb-1">Subtítulo / Descrição</label>
                <RichTextEditor value={subtitle} onChange={setSubtitle} />
              </div>
            </>
          )}
          
          <div>
            <label className="block text-sm font-bold text-neutral-600 mb-1">
              {selectedSection === 'branding' ? 'Imagem do Logótipo' : 'Imagem de Fundo'}
            </label>
            <input type="file" accept="image/*" onChange={(e) => {
              if (e.target.files?.[0]) {
                setFile(e.target.files[0]);
                setPreview(URL.createObjectURL(e.target.files[0]));
              }
            }} className="w-full mb-2" />
            {preview && (
              <div className={`relative rounded overflow-hidden border ${selectedSection === 'branding' ? 'w-32 h-32 bg-black flex items-center justify-center' : 'h-48 w-full'}`}>
                 <img src={preview} alt="Preview" className={`max-w-full max-h-full ${selectedSection === 'branding' ? 'object-contain' : 'object-cover'}`} />
                 {file && <div className="absolute top-2 right-2 bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded">Nova Imagem</div>}
              </div>
            )}
            <p className="text-xs text-neutral-400 mt-1">Se não escolheres imagem, será usada a padrão.</p>
          </div>
          <button onClick={handleSave} disabled={uploading} className="bg-primary text-white px-6 py-2 rounded font-bold hover:bg-orange-700 transition">
            {uploading ? 'A guardar...' : 'Guardar Alterações'}
          </button>
       </div>
    </div>
  );
};

// --- DATABASE FIX TOOL ---
const DatabaseFixTool = () => {
  const sqlScript = `
-- --- TABELAS ---
create table if not exists news (id uuid default gen_random_uuid() primary key, created_at timestamptz default now(), title text, content text, image_url text);
create table if not exists matches (id uuid default gen_random_uuid() primary key, date timestamptz, home_team text, guest_team text, location text, score_home int, score_guest int, category text);
create table if not exists products (id uuid default gen_random_uuid() primary key, name text, price numeric, description text, image_url text);
create table if not exists partners (id uuid default gen_random_uuid() primary key, name text, website_url text, logo_url text);
create table if not exists teams (id uuid default gen_random_uuid() primary key, name text, category text, description text, image_url text, coaches text);
create table if not exists team_members (id uuid default gen_random_uuid() primary key, team_id uuid references teams(id), name text, number text, position text, image_url text);
create table if not exists gallery (id uuid default gen_random_uuid() primary key, title text, image_url text);
create table if not exists organization (id uuid default gen_random_uuid() primary key, created_at timestamptz default now(), name text, role text, image_url text);
create table if not exists site_content (id uuid default gen_random_uuid() primary key, section text unique not null, title text, subtitle text, image_url text);

-- --- MIGRATIONS ---
alter table teams add column if not exists coaches text;

-- --- RLS (Row Level Security) ---
alter table news enable row level security;
alter table matches enable row level security;
alter table products enable row level security;
alter table partners enable row level security;
alter table teams enable row level security;
alter table team_members enable row level security;
alter table gallery enable row level security;
alter table organization enable row level security;
alter table site_content enable row level security;

-- --- POLÍTICAS DE ACESSO (Drop & Re-create) ---
-- 1. Leitura Pública (Qualquer pessoa vê)
drop policy if exists "Public Read News" on news; create policy "Public Read News" on news for select using (true);
drop policy if exists "Public Read Matches" on matches; create policy "Public Read Matches" on matches for select using (true);
drop policy if exists "Public Read Products" on products; create policy "Public Read Products" on products for select using (true);
drop policy if exists "Public Read Partners" on partners; create policy "Public Read Partners" on partners for select using (true);
drop policy if exists "Public Read Teams" on teams; create policy "Public Read Teams" on teams for select using (true);
drop policy if exists "Public Read TeamMembers" on team_members; create policy "Public Read TeamMembers" on team_members for select using (true);
drop policy if exists "Public Read Gallery" on gallery; create policy "Public Read Gallery" on gallery for select using (true);
drop policy if exists "Public Read Org" on organization; create policy "Public Read Org" on organization for select using (true);
drop policy if exists "Public Read Content" on site_content; create policy "Public Read Content" on site_content for select using (true);

-- 2. Escrita Admin (Só login vê/edita)
drop policy if exists "Admin Write News" on news; create policy "Admin Write News" on news for all using (auth.role() = 'authenticated');
drop policy if exists "Admin Write Matches" on matches; create policy "Admin Write Matches" on matches for all using (auth.role() = 'authenticated');
drop policy if exists "Admin Write Products" on products; create policy "Admin Write Products" on products for all using (auth.role() = 'authenticated');
drop policy if exists "Admin Write Partners" on partners; create policy "Admin Write Partners" on partners for all using (auth.role() = 'authenticated');
drop policy if exists "Admin Write Teams" on teams; create policy "Admin Write Teams" on teams for all using (auth.role() = 'authenticated');
drop policy if exists "Admin Write TeamMembers" on team_members; create policy "Admin Write TeamMembers" on team_members for all using (auth.role() = 'authenticated');
drop policy if exists "Admin Write Gallery" on gallery; create policy "Admin Write Gallery" on gallery for all using (auth.role() = 'authenticated');
drop policy if exists "Admin Write Org" on organization; create policy "Admin Write Org" on organization for all using (auth.role() = 'authenticated');
drop policy if exists "Admin Write Content" on site_content; create policy "Admin Write Content" on site_content for all using (auth.role() = 'authenticated');

-- --- STORAGE (Imagens) ---
insert into storage.buckets (id, name, public) values ('images', 'images', true) on conflict (id) do nothing;
  `;

  return (
    <div className="bg-white p-6 rounded shadow max-w-3xl">
      <div className="flex items-center gap-2 mb-4 text-primary">
        <AlertTriangle size={24} />
        <h3 className="text-xl font-bold">Reparação de Base de Dados</h3>
      </div>
      <p className="mb-4 text-sm text-neutral-600">
        Se os dados (como Atletas) existem no Supabase mas não aparecem aqui ou no site, é provável que faltem as 
        <strong> Políticas de Segurança (RLS)</strong> corretas.
      </p>
      <p className="mb-4 text-sm text-neutral-600">
        Copie o código SQL abaixo e execute-o no <strong>SQL Editor</strong> do seu painel Supabase para corrigir as permissões.
      </p>
      <div className="relative bg-neutral-900 text-green-400 p-4 rounded text-xs font-mono h-64 overflow-y-auto mb-4 border border-neutral-700">
        <pre>{sqlScript}</pre>
        <button 
          onClick={() => navigator.clipboard.writeText(sqlScript).then(() => alert("Copiado!"))}
          className="absolute top-2 right-2 bg-neutral-700 text-white p-1 rounded hover:bg-neutral-600"
          title="Copiar SQL"
        >
          <Copy size={16} />
        </button>
      </div>
      <div className="flex items-center gap-2 text-xs text-neutral-400">
        <Info size={14} />
        <span>Isto ativará o acesso público para leitura e acesso privado para edição em todas as tabelas.</span>
      </div>
    </div>
  );
};

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [session, setSession] = useState<any>(null);
  
  // Data States
  const [news, setNews] = useState<NewsItem[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]); // New state for roster
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [organization, setOrganization] = useState<OrganizationMember[]>([]);
  const [siteContent, setSiteContent] = useState<Record<string, SiteContent>>({});
  
  const [loading, setLoading] = useState(true);

  // Admin Login State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Admin Tab State
  const [adminTab, setAdminTab] = useState('conteudo');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    fetchAllData();
    return () => subscription.unsubscribe();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      // Fetch independent tables first
      const [newsRes, matchesRes, prodRes, partRes, teamRes, galRes, orgRes, contentRes] = await Promise.all([
        supabase.from('news').select('*').order('created_at', { ascending: false }),
        supabase.from('matches').select('*').order('date', { ascending: true }),
        supabase.from('products').select('*'),
        supabase.from('partners').select('*'),
        supabase.from('teams').select('*'),
        supabase.from('gallery').select('*'),
        supabase.from('organization').select('*').order('created_at', { ascending: true }),
        supabase.from('site_content').select('*')
      ]);

      if (newsRes.data) setNews(newsRes.data);
      if (matchesRes.data) setMatches(matchesRes.data);
      if (prodRes.data) setProducts(prodRes.data);
      if (partRes.data) setPartners(partRes.data);
      if (teamRes.data) setTeams(teamRes.data);
      if (galRes.data) setGallery(galRes.data);
      if (orgRes.data) setOrganization(orgRes.data);
      
      if (contentRes.data) {
        const contentMap: Record<string, SiteContent> = {};
        contentRes.data.forEach((item: SiteContent) => {
          contentMap[item.section] = item;
        });
        setSiteContent(contentMap);
      }

      // Fetch team_members specifically and handle error
      const memberRes = await supabase.from('team_members').select('*');
      if (memberRes.error) {
        console.error("Error fetching team_members:", memberRes.error);
        // We continue without crushing the app, simply no members will be shown
      } else if (memberRes.data) {
        const sorted = memberRes.data.sort((a, b) => a.name.localeCompare(b.name, 'pt-PT'));
        setTeamMembers(sorted);
      }

    } catch (e) {
      console.error("Error fetching data:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    let finalEmail = email;
    if (!email.includes('@')) finalEmail = email + '@almaviseu.pt';

    const { error } = await supabase.auth.signInWithPassword({ email: finalEmail, password });
    if (error) setLoginError('Erro no login: ' + error.message);
    else setCurrentPage('admin');
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setCurrentPage('home');
  };

  const deleteItem = async (table: string, id: string) => {
    if(!window.confirm("Tem a certeza que deseja eliminar?")) return;
    const { error } = await supabase.from(table).delete().eq('id', id);
    if (!error) fetchAllData();
    else alert("Erro ao eliminar: " + error.message);
  };

  const createItem = async (table: string, data: any) => {
    const { error } = await supabase.from(table).insert([data]);
    if (error) alert("Erro ao criar: " + error.message);
    else fetchAllData();
  };
  
  const updateItem = async (table: string, id: string, data: any) => {
    const { error } = await supabase.from(table).update(data).eq('id', id);
    if (error) alert("Erro ao atualizar: " + error.message);
    else fetchAllData();
  };

  const updateSectionContent = async (section: string, title: string, subtitle: string, imageFile: File | null) => {
    try {
      let imageUrl = siteContent[section]?.image_url;

      if (imageFile) {
         const fileExt = imageFile.name.split('.').pop();
         const fileName = `${section}_${Date.now()}.${fileExt}`;
         const { error: uploadError } = await supabase.storage.from('images').upload(fileName, imageFile);
         if (uploadError) throw new Error(`Upload failed: ${uploadError.message}`);
         const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(fileName);
         imageUrl = publicUrl;
      }

      const { error } = await supabase.from('site_content').upsert({
        section,
        title,
        subtitle,
        image_url: imageUrl
      }, { onConflict: 'section' });

      if (error) throw error;
      alert("Conteúdo atualizado!");
      fetchAllData();
    } catch (e: any) {
      alert("Erro ao atualizar: " + e.message);
    }
  };

  const renderAdmin = () => {
    return (
      <div className="min-h-screen bg-neutral-100 text-black">
        <nav className="bg-black text-white p-4 flex justify-between items-center border-b-4 border-primary">
          <span className="font-bold text-primary text-xl">Painel Admin ALMA</span>
          <div className="flex gap-4 items-center">
              <span className="text-sm text-neutral-300">{session.user.email}</span>
              <button onClick={handleLogout} className="text-sm bg-red-600 px-3 py-1 rounded hover:bg-red-700">Sair</button>
          </div>
        </nav>
        <div className="flex flex-col md:flex-row h-[calc(100vh-64px)]">
          <div className="w-full md:w-64 bg-white border-r p-4 flex flex-col justify-between">
            <div className="space-y-2">
              <button onClick={() => setAdminTab('conteudo')} className={`w-full text-left p-2 rounded capitalize font-montserrat font-extrabold ${adminTab === 'conteudo' ? 'bg-primary text-white' : 'hover:bg-neutral-100 text-neutral-700'}`}>
                  <span className="flex items-center gap-2"><Layout size={16}/> Conteúdos</span>
              </button>
              {['noticias', 'jogos', 'loja', 'parceiros', 'equipas', 'atletas', 'galeria', 'organograma', 'definições'].map(tab => (
                <button key={tab} onClick={() => setAdminTab(tab)} className={`w-full text-left p-2 rounded capitalize font-montserrat font-extrabold ${adminTab === tab ? 'bg-primary text-white' : 'hover:bg-neutral-100 text-neutral-700'}`}>
                  {tab === 'definições' ? <span className="flex items-center gap-2"><Settings size={16}/> Definições</span> : tab}
                </button>
              ))}
            </div>
            <button onClick={() => setCurrentPage('home')} className="mt-4 w-full text-left p-2 rounded hover:bg-neutral-100 flex items-center gap-2 text-neutral-600 font-bold border-t pt-4">
                <ArrowRight size={16} className="rotate-180" /> Voltar ao Site
            </button>
          </div>
          <div className="flex-1 p-8 overflow-y-auto bg-neutral-50">
              <h2 className="text-3xl font-bold mb-6 capitalize text-secondary">{adminTab}</h2>
              {adminTab === 'conteudo' && <SiteContentEditor siteContent={siteContent} onUpdate={updateSectionContent} />}
              {adminTab === 'noticias' && <AdminList title="Gerir Notícias" data={news} table="news" fields={[{key: 'title', label: 'Título', required: true}, {key: 'content', label: 'Conteúdo', type: 'richtext'}, {key: 'image_url', label: 'Imagem', type: 'image'}]} onCreate={createItem} onUpdate={updateItem} onDelete={deleteItem} />}
              {adminTab === 'jogos' && <AdminList title="Gerir Jogos" data={matches} table="matches" fields={[{key: 'home_team', label: 'Equipa Casa', required: true}, {key: 'guest_team', label: 'Equipa Fora', required: true}, {key: 'date', label: 'Data', type: 'datetime-local', required: true}, {key: 'location', label: 'Local'}, {key: 'category', label: 'Escalão'}, {key: 'score_home', label: 'Pontos Casa', type: 'number'}, {key: 'score_guest', label: 'Pontos Fora', type: 'number'}]} onCreate={createItem} onUpdate={updateItem} onDelete={deleteItem} />}
              {adminTab === 'loja' && <AdminList title="Gerir Produtos" data={products} table="products" fields={[{key: 'name', label: 'Nome', required: true}, {key: 'price', label: 'Preço', type: 'number', required: true}, {key: 'description', label: 'Descrição', type: 'richtext'}, {key: 'image_url', label: 'Imagem', type: 'image'}]} onCreate={createItem} onUpdate={updateItem} onDelete={deleteItem} />}
              {adminTab === 'parceiros' && <AdminList title="Gerir Parceiros" data={partners} table="partners" fields={[{key: 'name', label: 'Nome', required: true}, {key: 'website_url', label: 'Website'}, {key: 'logo_url', label: 'Logo', type: 'image'}]} onCreate={createItem} onUpdate={updateItem} onDelete={deleteItem} />}
              {adminTab === 'equipas' && <AdminList title="Gerir Equipas" data={teams} table="teams" fields={[{key: 'name', label: 'Nome', required: true}, {key: 'category', label: 'Escalão'}, {key: 'coaches', label: 'Treinadores', type: 'richtext'}, {key: 'description', label: 'Descrição', type: 'richtext'}, {key: 'image_url', label: 'Foto', type: 'image'}]} onCreate={createItem} onUpdate={updateItem} onDelete={deleteItem} />}
              {adminTab === 'atletas' && <AdminList title="Gerir Atletas (Plantel)" data={teamMembers} table="team_members" fields={[{key: 'team_id', label: 'Equipa', type: 'select', required: true, options: teams.map(t => ({value: t.id, label: t.name}))}, {key: 'name', label: 'Nome', required: true}, {key: 'number', label: 'Número', type: 'number'}, {key: 'position', label: 'Posição'}, {key: 'image_url', label: 'Foto', type: 'image'}]} onCreate={createItem} onUpdate={updateItem} onDelete={deleteItem} />}
              {adminTab === 'galeria' && <AdminList title="Gerir Fotos" data={gallery} table="gallery" fields={[{key: 'title', label: 'Título'}, {key: 'image_url', label: 'Imagem', type: 'image', required: true}]} onCreate={createItem} onUpdate={updateItem} onDelete={deleteItem} />}
              {adminTab === 'organograma' && <AdminList title="Gerir Direção" data={organization} table="organization" fields={[{key: 'name', label: 'Nome', required: true}, {key: 'role', label: 'Cargo', required: true}, {key: 'image_url', label: 'Foto', type: 'image'}]} onCreate={createItem} onUpdate={updateItem} onDelete={deleteItem} />}
              {adminTab === 'definições' && <DatabaseFixTool />}
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    if (currentPage === 'admin') {
       if (!session) {
         return (
            <div className="flex items-center justify-center min-h-screen bg-black text-white">
               <div className="bg-neutral-900 p-8 rounded-xl shadow-2xl border border-neutral-800 w-full max-w-md">
                  <div className="flex justify-center mb-6">
                    {siteContent['branding']?.image_url ? (
                       <img src={siteContent['branding'].image_url} alt="Logo" className="h-20 object-contain" />
                    ) : (
                       <h2 className="text-3xl font-black italic text-primary">ALMA</h2>
                    )}
                  </div>
                  <h2 className="text-xl font-bold mb-6 text-center text-white">Acesso Reservado</h2>
                  {loginError && <div className="bg-red-500/10 text-red-500 p-3 rounded mb-4 text-sm border border-red-500/20 flex items-center gap-2"><AlertTriangle size={16}/> {loginError}</div>}
                  <form onSubmit={handleAuth} className="space-y-4">
                     <div>
                       <label className="block text-xs font-bold text-neutral-500 uppercase mb-1">Email</label>
                       <input type="text" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-black border border-neutral-800 rounded p-3 focus:border-primary outline-none text-white transition focus:ring-1 focus:ring-primary" placeholder="admin@almaviseu.pt" />
                     </div>
                     <div>
                       <label className="block text-xs font-bold text-neutral-500 uppercase mb-1">Password</label>
                       <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-black border border-neutral-800 rounded p-3 focus:border-primary outline-none text-white transition focus:ring-1 focus:ring-primary" placeholder="••••••••" />
                     </div>
                     <button className="w-full bg-primary text-white font-bold py-3 rounded hover:bg-orange-600 transition uppercase tracking-widest text-sm shadow-lg shadow-primary/20">Entrar</button>
                  </form>
                  <button onClick={() => setCurrentPage('home')} className="mt-6 text-xs text-neutral-500 hover:text-white block text-center w-full uppercase tracking-widest font-bold transition">Voltar ao site</button>
               </div>
            </div>
         );
       }
       return renderAdmin();
    }
    
    if (currentPage === 'login') {
        if (session) {
            setCurrentPage('admin');
            return null;
        }
        return (
            <div className="flex items-center justify-center min-h-screen bg-black text-white">
               <div className="bg-neutral-900 p-8 rounded-xl shadow-2xl border border-neutral-800 w-full max-w-md">
                  <div className="flex justify-center mb-6">
                    {siteContent['branding']?.image_url ? (
                       <img src={siteContent['branding'].image_url} alt="Logo" className="h-20 object-contain" />
                    ) : (
                       <h2 className="text-3xl font-black italic text-primary">ALMA</h2>
                    )}
                  </div>
                  <h2 className="text-xl font-bold mb-6 text-center text-white">Acesso Reservado</h2>
                  {loginError && <div className="bg-red-500/10 text-red-500 p-3 rounded mb-4 text-sm border border-red-500/20 flex items-center gap-2"><AlertTriangle size={16}/> {loginError}</div>}
                  <form onSubmit={handleAuth} className="space-y-4">
                     <div>
                       <label className="block text-xs font-bold text-neutral-500 uppercase mb-1">Email</label>
                       <input type="text" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-black border border-neutral-800 rounded p-3 focus:border-primary outline-none text-white transition focus:ring-1 focus:ring-primary" placeholder="admin@almaviseu.pt" />
                     </div>
                     <div>
                       <label className="block text-xs font-bold text-neutral-500 uppercase mb-1">Password</label>
                       <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-black border border-neutral-800 rounded p-3 focus:border-primary outline-none text-white transition focus:ring-1 focus:ring-primary" placeholder="••••••••" />
                     </div>
                     <button className="w-full bg-primary text-white font-bold py-3 rounded hover:bg-orange-600 transition uppercase tracking-widest text-sm shadow-lg shadow-primary/20">Entrar</button>
                  </form>
                  <button onClick={() => setCurrentPage('home')} className="mt-6 text-xs text-neutral-500 hover:text-white block text-center w-full uppercase tracking-widest font-bold transition">Voltar ao site</button>
               </div>
            </div>
        );
    }

    if (currentPage === 'about') return <AboutPage teams={teams} organization={organization} />;
    if (currentPage === 'contacts') return <ContactsPage content={siteContent['contacts']} />;

    return (
      <LandingPage 
        onNavigate={setCurrentPage} 
        news={news} 
        matches={matches} 
        products={products} 
        partners={partners} 
        teams={teams}
        teamMembers={teamMembers}
        gallery={gallery}
        heroContent={siteContent['hero'] || null}
        siteContent={siteContent}
      />
    );
  };

  if (loading) {
    return (
      <div className="h-screen w-screen bg-black flex flex-col items-center justify-center text-white">
         <Loader2 className="animate-spin mb-4 text-primary" size={48} />
         <p className="font-montserrat font-bold animate-pulse text-xl">A carregar ALMA...</p>
      </div>
    );
  }

  return (
    <>
      {currentPage !== 'admin' && currentPage !== 'login' && (
         <Navbar onNavigate={setCurrentPage} currentPage={currentPage} isAdmin={!!session} logoUrl={siteContent['branding']?.image_url} />
      )}
      {renderContent()}
      {currentPage !== 'admin' && currentPage !== 'login' && (
         <Footer onNavigate={setCurrentPage} content={siteContent['footer']} />
      )}
    </>
  );
}