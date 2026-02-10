import React, { useEffect, useState } from 'react';
import { Calendar, ChevronRight, MapPin, Trophy, X } from 'lucide-react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { supabase } from './lib/supabase';
import {
  GalleryItem,
  Match,
  NewsItem,
  Product,
  SiteContent,
  Team,
  TeamMember,
} from './types';

interface ModalItem {
  id: string;
  image: string;
  title: string;
  subtitle?: string;
  description?: string;
  members?: TeamMember[];
}

const stripHtml = (html: string) => {
  const tmp = document.createElement('DIV');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
};

const DynamicSection: React.FC<{
  id: string;
  content?: SiteContent;
  defaultClass?: string;
  defaultTitle?: string;
  defaultSubtitle?: string;
  children: React.ReactNode;
}> = ({ id, content, defaultClass, defaultTitle, defaultSubtitle, children }) => {
  const title = content?.title || defaultTitle;
  const subtitle = content?.subtitle || defaultSubtitle;
  const bgClass = defaultClass || 'bg-white text-black';

  return (
    <section id={id} className={`py-16 md:py-24 relative overflow-hidden ${bgClass}`}>
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {(title || subtitle) && (
          <div className="mb-12 text-left border-l-4 border-primary pl-6">
            {title && (
              <h2 className="text-4xl md:text-5xl font-black italic tracking-tighter uppercase mb-2">
                {title}
              </h2>
            )}
            {subtitle && (
              <div
                className="text-lg md:text-xl font-light opacity-80 max-w-2xl"
                dangerouslySetInnerHTML={{ __html: subtitle }}
              ></div>
            )}
          </div>
        )}
        {children}
      </div>
    </section>
  );
};

const SectionCarousel: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex overflow-x-auto gap-6 pb-8 snap-x snap-mandatory scrollbar-hide">
      {children}
    </div>
  );
};

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [news, setNews] = useState<NewsItem[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [siteContent, setSiteContent] = useState<Record<string, SiteContent>>({});

  const [modalOpen, setModalOpen] = useState(false);
  const [modalItems, setModalItems] = useState<ModalItem[]>([]);
  const [modalStartIndex, setModalStartIndex] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const { data: newsData } = await supabase
        .from('news')
        .select('*')
        .order('created_at', { ascending: false });
      if (newsData) setNews(newsData);

      const { data: matchesData } = await supabase
        .from('matches')
        .select('*')
        .order('date', { ascending: true });
      if (matchesData) setMatches(matchesData);

      const { data: teamsData } = await supabase.from('teams').select('*');
      if (teamsData) setTeams(teamsData);

      const { data: membersData } = await supabase.from('team_members').select('*');
      if (membersData) setTeamMembers(membersData);

      const { data: contentData } = await supabase.from('site_content').select('*');
      if (contentData) {
        const contentMap: Record<string, SiteContent> = {};
        contentData.forEach((c: SiteContent) => {
          contentMap[c.section] = c;
        });
        setSiteContent(contentMap);
      }
    };
    fetchData();
  }, []);

  const heroContent = siteContent['hero'];
  const now = new Date();
  const upcoming = matches.filter((m) => new Date(m.date) >= now).slice(0, 10);
  const past = matches
    .filter((m) => new Date(m.date) < now)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10);
  const nextMatch = upcoming[0];

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    if (page === 'login') {
      // Logic for login navigation
    }
  };

  const openModal = (
    items: any[],
    index: number,
    type: 'news' | 'product' | 'team' | 'gallery'
  ) => {
    let formattedItems: ModalItem[] = [];

    if (type === 'news') {
      formattedItems = items.map((i: NewsItem) => ({
        id: i.id,
        image: i.image_url || `https://picsum.photos/seed/${i.id}/800/600`,
        title: i.title,
        subtitle: new Date(i.created_at).toLocaleDateString('pt-PT'),
        description: i.content,
      }));
    } else if (type === 'product') {
      formattedItems = items.map((i: Product) => ({
        id: i.id,
        image: i.image_url || `https://picsum.photos/seed/${i.id}/800/600`,
        title: i.name,
        subtitle: `${i.price.toFixed(2)} €`,
        description: i.description,
      }));
    } else if (type === 'team') {
      formattedItems = items.map((i: Team) => {
        const roster = teamMembers.filter((m) => m.team_id === i.id);
        return {
          id: i.id,
          image: i.image_url || `https://picsum.photos/seed/${i.id}/800/600`,
          title: i.name,
          description: i.description,
          members: roster,
        };
      });
    } else if (type === 'gallery') {
      formattedItems = items.map((i: GalleryItem) => ({
        id: i.id,
        image: i.image_url || `https://picsum.photos/seed/${i.id}/800/600`,
        title: i.title || 'Sem título',
      }));
    }

    setModalItems(formattedItems);
    setModalStartIndex(index);
    setModalOpen(true);
  };

  const defaultHero = {
    title: 'ALMA VISEU',
    subtitle: 'Paixão. Competição. Voleibol.',
    image_url: 'https://picsum.photos/1920/1080?grayscale&blur=2',
  };

  const currentHero = heroContent || defaultHero;

  const isHeroHtml = /<[a-z][\s\S]*>/i.test(currentHero.title || '');
  const renderHeroTitle = () => {
    if (isHeroHtml)
      return (
        <div
          dangerouslySetInnerHTML={{ __html: currentHero.title }}
          className="inline-block"
        ></div>
      );
    const words = currentHero.title.split(' ');
    if (words.length === 1) return <span className="text-white">{words[0]}</span>;
    const lastWord = words.pop();
    return (
      <>
        <span className="text-white">{words.join(' ')}</span>{' '}
        <span className="text-primary">{lastWord}</span>
      </>
    );
  };

  return (
    <div className="bg-black min-h-screen font-sans text-neutral-200 selection:bg-primary selection:text-black">
      <Navbar
        onNavigate={handleNavigate}
        currentPage={currentPage}
        isAdmin={false}
        logoUrl={siteContent['navbar']?.image_url}
      />

      <div className="bg-black text-white">
        {/* HERO SECTION */}
        <section
          id="home"
          className="relative h-screen min-h-[600px] flex items-center justify-center text-center overflow-hidden"
        >
          <div className="absolute inset-0 bg-black/60 z-10"></div>
          <img
            src={currentHero.image_url}
            alt="Voleibol"
            className="absolute inset-0 w-full h-full object-cover opacity-50"
          />
          <div className="relative z-20 max-w-5xl px-4 animate-fade-in-up">
            <h1 className="text-6xl md:text-9xl font-black italic tracking-tighter mb-2 leading-none uppercase">
              {renderHeroTitle()}
            </h1>
            <div className="text-xl md:text-3xl text-neutral-300 font-light mb-8 tracking-widest uppercase">
              <div dangerouslySetInnerHTML={{ __html: currentHero.subtitle }}></div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() =>
                  document.getElementById('calendar')?.scrollIntoView({ behavior: 'smooth' })
                }
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
                <div className="text-primary font-bold uppercase tracking-widest text-xs">
                  Próximo Jogo
                </div>
                <div className="text-2xl font-bold">{nextMatch.category}</div>
              </div>
              <div className="flex items-center gap-6 text-3xl md:text-5xl font-black italic">
                <span className="text-white">{nextMatch.home_team}</span>
                <span className="text-primary text-2xl">VS</span>
                <span className="text-white">{nextMatch.guest_team}</span>
              </div>
              <div className="text-right flex flex-col items-end">
                <div className="flex items-center gap-2 mb-1 text-neutral-300">
                  <Calendar size={16} className="text-primary" />
                  <span>
                    {new Date(nextMatch.date).toLocaleDateString('pt-PT')}{' '}
                    <span className="text-neutral-600">|</span>{' '}
                    {new Date(nextMatch.date).toLocaleTimeString('pt-PT', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
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
        <DynamicSection
          id="news"
          content={siteContent['news']}
          defaultClass="bg-neutral-900 text-white"
          defaultTitle="Últimas Notícias"
        >
          <SectionCarousel>
            {news.map((item, index) => (
              <div
                key={item.id}
                className="bg-neutral-800 rounded-xl overflow-hidden group hover:ring-2 hover:ring-primary transition-all duration-300 cursor-pointer snap-center min-w-[300px] md:min-w-[400px]"
                onClick={() => openModal(news, index, 'news')}
              >
                <div className="h-56 overflow-hidden">
                  <img
                    src={item.image_url || `https://picsum.photos/seed/${item.id}/400/250`}
                    alt={item.title}
                    className="w-full h-full object-cover transition duration-500 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                  />
                </div>
                <div className="p-6 relative">
                  <div className="absolute -top-4 right-6 bg-primary text-white text-xs font-bold px-3 py-1 rounded shadow-lg">
                    {new Date(item.created_at).toLocaleDateString('pt-PT')}
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-white leading-tight group-hover:text-primary transition line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-neutral-400 text-sm line-clamp-3">
                    {stripHtml(item.content)}
                  </p>
                </div>
              </div>
            ))}
            {news.length === 0 && (
              <p className="text-neutral-500 text-center w-full">A aguardar novidades...</p>
            )}
          </SectionCarousel>
        </DynamicSection>

        {/* CALENDAR SECTION */}
        <DynamicSection
          id="calendar"
          content={siteContent['calendar']}
          defaultClass="bg-black text-white"
          defaultTitle="Calendário & Resultados"
          defaultSubtitle="Acompanha a nossa jornada jornada a jornada."
        >
          {!siteContent['calendar']?.image_url && (
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 pointer-events-none"></div>
          )}

          <div className="relative z-10 space-y-16">
            {/* UPCOMING MATCHES CAROUSEL */}
            <div>
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3 text-white pl-2">
                <span className="w-8 h-8 bg-primary rounded flex items-center justify-center text-black">
                  <Calendar size={18} />
                </span>
                Próximos Jogos
              </h3>
              <SectionCarousel>
                {upcoming.map((m) => (
                  <div
                    key={m.id}
                    className="snap-center min-w-[320px] bg-neutral-900 border-l-4 border-primary p-6 rounded-r-xl hover:bg-neutral-800 transition shadow-lg group border-y border-r border-neutral-800 hover:border-neutral-700"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-xs font-bold text-primary uppercase tracking-widest bg-primary/10 px-2 py-1 rounded">
                        {m.category}
                      </span>
                      <div className="text-right">
                        <span className="text-white font-bold block">
                          {new Date(m.date).toLocaleDateString('pt-PT')}
                        </span>
                        <span className="text-neutral-500 text-xs">
                          {new Date(m.date).toLocaleTimeString('pt-PT', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    </div>
                    <div className="text-xl font-black italic text-white mb-4 flex flex-col gap-1">
                      <span>{m.home_team}</span>
                      <span className="text-neutral-600 text-sm not-italic font-normal">
                        VS
                      </span>
                      <span>{m.guest_team}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-neutral-400 border-t border-neutral-800 pt-4">
                      <MapPin size={16} className="text-primary" />
                      <span className="truncate">{m.location}</span>
                    </div>
                  </div>
                ))}
                {upcoming.length === 0 && (
                  <p className="text-neutral-600 italic px-4 w-full text-center">
                    Sem jogos agendados.
                  </p>
                )}
              </SectionCarousel>
            </div>

            {/* RESULTS CAROUSEL */}
            <div>
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3 text-white pl-2">
                <span className="w-8 h-8 bg-white rounded flex items-center justify-center text-black">
                  <Trophy size={18} />
                </span>
                Resultados
              </h3>
              <SectionCarousel>
                {past.map((m) => (
                  <div
                    key={m.id}
                    className="snap-center min-w-[320px] bg-neutral-900 p-6 rounded-xl border border-neutral-800 hover:border-neutral-600 transition shadow-lg"
                  >
                    <div className="flex items-center justify-between mb-4 border-b border-neutral-800 pb-4">
                      <span className="text-xs font-bold text-neutral-500 uppercase tracking-widest">
                        {m.category}
                      </span>
                      <div className="text-xs text-neutral-400 flex flex-col items-end">
                        <span className="font-bold text-white">
                          {new Date(m.date).getDate()}{' '}
                          {new Date(m.date).toLocaleString('default', { month: 'short' })}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span
                          className={`font-bold text-lg ${
                            m.score_home! > m.score_guest!
                              ? 'text-primary'
                              : 'text-neutral-300'
                          }`}
                        >
                          {m.home_team}
                        </span>
                        <span className="font-mono text-xl font-bold bg-black px-3 py-1 rounded text-white">
                          {m.score_home}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span
                          className={`font-bold text-lg ${
                            m.score_guest! > m.score_home!
                              ? 'text-primary'
                              : 'text-neutral-300'
                          }`}
                        >
                          {m.guest_team}
                        </span>
                        <span className="font-mono text-xl font-bold bg-black px-3 py-1 rounded text-white">
                          {m.score_guest}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
                {past.length === 0 && (
                  <p className="text-neutral-600 italic px-4 w-full text-center">
                    Sem resultados.
                  </p>
                )}
              </SectionCarousel>
            </div>
          </div>
        </DynamicSection>

        {/* TEAMS SECTION */}
        <DynamicSection
          id="teams"
          content={siteContent['teams']}
          defaultClass="bg-neutral-900 text-white"
          defaultTitle="As Nossas Equipas"
        >
          <SectionCarousel>
            {teams.map((t, idx) => (
              <div
                key={t.id}
                className="flex-shrink-0 snap-center rounded-2xl overflow-hidden bg-neutral-800 shadow-2xl cursor-pointer hover:ring-2 hover:ring-primary transition-all duration-300 w-[90vw] md:w-[600px] flex flex-col"
                onClick={() => openModal(teams, idx, 'team')}
              >
                <div className="relative h-[300px]">
                  <img
                    src={t.image_url || `https://picsum.photos/seed/${t.id}/800/600`}
                    className="absolute inset-0 w-full h-full object-cover"
                    alt={t.name}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-800 opacity-80"></div>
                </div>
                <div className="p-8 flex flex-col justify-center flex-grow">
                  <h3 className="text-3xl font-black italic text-white mb-4">{t.name}</h3>
                  <div
                    className="text-neutral-400 leading-relaxed text-sm line-clamp-3"
                    dangerouslySetInnerHTML={{ __html: t.description }}
                  ></div>
                  <div className="mt-4 text-primary text-sm font-bold flex items-center gap-2">
                    Ver mais <ChevronRight size={16} />
                  </div>
                </div>
              </div>
            ))}
            {teams.length === 0 && (
              <p className="text-neutral-500 text-center w-full">Equipas a carregar...</p>
            )}
          </SectionCarousel>
        </DynamicSection>
      </div>

      {/* Modal */}
      {modalOpen && modalItems.length > 0 && (
        <div className="fixed inset-0 z-[60] bg-black/90 flex items-center justify-center p-4">
          <button
            onClick={() => setModalOpen(false)}
            className="absolute top-4 right-4 text-white p-2 bg-neutral-800 rounded-full hover:bg-primary hover:text-black transition z-50"
          >
            <X size={24} />
          </button>
          <div className="bg-neutral-900 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-xl flex flex-col md:flex-row shadow-2xl border border-neutral-800">
            <div className="w-full md:w-1/2 h-64 md:h-auto relative">
              <img
                src={modalItems[modalStartIndex].image}
                className="w-full h-full object-cover"
                alt={modalItems[modalStartIndex].title}
              />
            </div>
            <div className="p-8 md:w-1/2 flex flex-col">
              <h3 className="text-3xl font-black italic text-white mb-2">
                {modalItems[modalStartIndex].title}
              </h3>
              {modalItems[modalStartIndex].subtitle && (
                <p className="text-primary font-bold mb-4">
                  {modalItems[modalStartIndex].subtitle}
                </p>
              )}
              <div
                className="text-neutral-300 text-sm leading-relaxed mb-6 whitespace-pre-line flex-grow"
                dangerouslySetInnerHTML={{
                  __html: modalItems[modalStartIndex].description || '',
                }}
              ></div>
              {modalItems[modalStartIndex].members && (
                <div className="mt-4">
                  <h4 className="font-bold text-white mb-2 border-b border-neutral-700 pb-2">
                    Plantel
                  </h4>
                  <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                    {modalItems[modalStartIndex].members!.map((m) => (
                      <div
                        key={m.id}
                        className="text-xs text-neutral-400 flex items-center gap-2"
                      >
                        <span className="font-mono text-primary font-bold w-6">
                          {m.number}
                        </span>
                        <span>{m.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <Footer content={siteContent['footer']} onNavigate={handleNavigate} />
    </div>
  );
};

export default App;