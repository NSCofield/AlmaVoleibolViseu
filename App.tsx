import React, { useEffect, useState } from 'react';
import { Calendar, MapPin, Trophy } from 'lucide-react';
import { supabase } from './lib/supabase';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Match, SiteContent } from './types';

interface DynamicSectionProps {
  id: string;
  content?: SiteContent;
  defaultClass: string;
  defaultTitle: string;
  defaultSubtitle: string;
  children: React.ReactNode;
}

const DynamicSection: React.FC<DynamicSectionProps> = ({ id, content, defaultClass, defaultTitle, defaultSubtitle, children }) => {
  return (
    <section id={id} className={`py-20 relative overflow-hidden ${defaultClass}`}>
      {content?.image_url && (
        <div 
          className="absolute inset-0 bg-cover bg-center z-0 opacity-30"
          style={{ backgroundImage: `url(${content.image_url})` }}
        />
      )}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-black italic tracking-tighter mb-2">{content?.title || defaultTitle}</h2>
          <p className="text-lg opacity-80">{content?.subtitle || defaultSubtitle}</p>
          <div className="h-1 w-24 bg-primary mx-auto mt-6"></div>
        </div>
        {children}
      </div>
    </section>
  );
};

const SectionCarousel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex overflow-x-auto gap-4 pb-8 snap-x snap-mandatory scrollbar-hide px-4">
    {children}
  </div>
);

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [matches, setMatches] = useState<Match[]>([]);
  const [siteContent, setSiteContent] = useState<Record<string, SiteContent>>({});

  useEffect(() => {
    const fetchData = async () => {
      const { data: matchesData } = await supabase.from('matches').select('*').order('date', { ascending: true });
      if (matchesData) setMatches(matchesData);

      const { data: contentData } = await supabase.from('site_content').select('*');
      if (contentData) {
        const contentMap = contentData.reduce((acc: any, item: SiteContent) => {
          acc[item.section] = item;
          return acc;
        }, {});
        setSiteContent(contentMap);
      }
    };
    fetchData();
  }, []);

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    const element = document.getElementById(page);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else {
        window.scrollTo(0,0);
    }
  };

  const upcoming = matches.filter(m => new Date(m.date) >= new Date());
  const past = matches.filter(m => new Date(m.date) < new Date()).reverse();

  return (
    <div className="bg-black min-h-screen text-white font-sans selection:bg-orange-600 selection:text-white">
      <Navbar onNavigate={handleNavigate} currentPage={currentPage} isAdmin={false} />
      
      {/* Hero Section Placeholder */}
      <section id="home" className="h-screen flex items-center justify-center bg-gradient-to-br from-neutral-900 to-black relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-30"></div>
        <div className="text-center relative z-10 p-4">
          <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter text-white mb-4 drop-shadow-xl">ALMA VISEU</h1>
          <p className="text-xl md:text-3xl font-bold text-primary tracking-widest uppercase">Paixão Pelo Voleibol</p>
        </div>
      </section>

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

      <Footer />
    </div>
  );
};

export default App;