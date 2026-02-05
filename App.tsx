import React, { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { NewsItem, Match, Product, Partner, Team, GalleryItem } from './types';
import { 
  Loader2, Calendar, MapPin, ShoppingBag, Users, 
  Info, Camera, Mail, Trophy, ArrowRight, ChevronRight, Edit, Trash, Plus, Save, Copy, Check,
  LogIn, UserPlus, Upload, Image as ImageIcon
} from 'lucide-react';

// --- SQL SCRIPT CONSTANT ---
const SQL_SCRIPT = `-- 1. Criação das Tabelas
create table if not exists news (
  id uuid default gen_random_uuid() primary key, 
  created_at timestamptz default now(), 
  title text, 
  content text, 
  image_url text
);

create table if not exists matches (
  id uuid default gen_random_uuid() primary key, 
  date timestamptz, 
  home_team text, 
  guest_team text, 
  location text, 
  score_home int, 
  score_guest int, 
  category text
);

create table if not exists products (
  id uuid default gen_random_uuid() primary key, 
  name text, 
  price numeric, 
  description text, 
  image_url text
);

create table if not exists partners (
  id uuid default gen_random_uuid() primary key, 
  name text, 
  website_url text, 
  logo_url text
);

create table if not exists teams (
  id uuid default gen_random_uuid() primary key, 
  name text, 
  category text, 
  description text, 
  image_url text
);

create table if not exists gallery (
  id uuid default gen_random_uuid() primary key, 
  title text, 
  image_url text
);

-- 2. Habilitar Row Level Security (Segurança)
alter table news enable row level security;
alter table matches enable row level security;
alter table products enable row level security;
alter table partners enable row level security;
alter table teams enable row level security;
alter table gallery enable row level security;

-- 3. Políticas de Acesso (Leitura Pública, Escrita Apenas Autenticados)
-- (Políticas simplificadas para garantir funcionamento, recriar se existirem)
drop policy if exists "Public read news" on news;
create policy "Public read news" on news for select using (true);
drop policy if exists "Auth all news" on news;
create policy "Auth all news" on news for all using (auth.role() = 'authenticated');

drop policy if exists "Public read matches" on matches;
create policy "Public read matches" on matches for select using (true);
drop policy if exists "Auth all matches" on matches;
create policy "Auth all matches" on matches for all using (auth.role() = 'authenticated');

drop policy if exists "Public read products" on products;
create policy "Public read products" on products for select using (true);
drop policy if exists "Auth all products" on products;
create policy "Auth all products" on products for all using (auth.role() = 'authenticated');

drop policy if exists "Public read partners" on partners;
create policy "Public read partners" on partners for select using (true);
drop policy if exists "Auth all partners" on partners;
create policy "Auth all partners" on partners for all using (auth.role() = 'authenticated');

drop policy if exists "Public read teams" on teams;
create policy "Public read teams" on teams for select using (true);
drop policy if exists "Auth all teams" on teams;
create policy "Auth all teams" on teams for all using (auth.role() = 'authenticated');

drop policy if exists "Public read gallery" on gallery;
create policy "Public read gallery" on gallery for select using (true);
drop policy if exists "Auth all gallery" on gallery;
create policy "Auth all gallery" on gallery for all using (auth.role() = 'authenticated');

-- 4. Storage (Imagens)
-- Tenta criar o bucket 'images' (Requer permissões de admin no projeto, pode falhar se não executado no dashboard)
insert into storage.buckets (id, name, public) values ('images', 'images', true) ON CONFLICT (id) DO NOTHING;

-- Políticas de Storage
drop policy if exists "Public Access Images" on storage.objects;
create policy "Public Access Images" on storage.objects for select using ( bucket_id = 'images' );
drop policy if exists "Auth Upload Images" on storage.objects;
create policy "Auth Upload Images" on storage.objects for insert with check ( bucket_id = 'images' AND auth.role() = 'authenticated' );
drop policy if exists "Auth Delete Images" on storage.objects;
create policy "Auth Delete Images" on storage.objects for delete using ( bucket_id = 'images' AND auth.role() = 'authenticated' );
`;

// --- SETUP COMPONENT ---
const DatabaseSetupInstructions = () => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(SQL_SCRIPT);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 flex flex-col items-center justify-center font-sans">
      <div className="max-w-4xl w-full space-y-6">
        <div className="flex items-center gap-4 text-primary">
           <Info size={48} />
           <h1 className="text-4xl font-bold">Configuração da Base de Dados</h1>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg border-l-4 border-primary">
          <p className="text-xl text-gray-200 mb-2">
            O site não conseguiu encontrar as tabelas necessárias.
          </p>
          <p className="text-gray-400">
            Para resolver, copia o código SQL abaixo e executa-o no <a href="https://supabase.com/dashboard/project/_/sql" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-bold">Editor SQL do Supabase</a>.
            Isto também irá configurar o armazenamento de imagens.
          </p>
        </div>
        
        <div className="bg-black rounded-lg border border-gray-700 overflow-hidden shadow-2xl">
          <div className="bg-gray-800 px-4 py-2 text-xs font-mono text-gray-400 border-b border-gray-700 flex justify-between items-center">
            <span>setup_tables.sql</span>
            <button 
              onClick={copyToClipboard}
              className={`flex items-center gap-2 px-3 py-1 rounded transition-all ${copied ? 'bg-green-600 text-white' : 'hover:bg-gray-700 text-gray-300'}`}
            >
              {copied ? <><Check size={14}/> Copiado!</> : <><Copy size={14}/> Copiar SQL</>}
            </button>
          </div>
          <pre className="p-4 overflow-x-auto text-sm font-mono text-green-400 leading-relaxed h-96">
            {SQL_SCRIPT}
          </pre>
        </div>
        
        <div className="flex justify-center pt-4">
          <button onClick={() => window.location.reload()} className="bg-primary text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-orange-700 transition shadow-lg transform hover:scale-105">
            Já executei o SQL, recarregar página
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Sub-components for pages ---

// 1. Home Page
const HomePage = ({ onNavigate, news, matches }: { onNavigate: (p: string) => void, news: NewsItem[], matches: Match[] }) => {
  const nextMatch = matches
    .filter(m => new Date(m.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];

  return (
    <div className="space-y-12 pb-12">
      {/* Hero */}
      <div className="relative bg-black h-[500px] flex items-center justify-center text-center overflow-hidden">
        <div className="absolute inset-0 bg-secondary opacity-60 z-10"></div>
        <img 
          src="https://picsum.photos/1920/1080?grayscale&blur=2" 
          alt="Voleibol" 
          className="absolute inset-0 w-full h-full object-cover opacity-50"
        />
        <div className="relative z-20 max-w-4xl px-4">
          <h1 className="text-5xl md:text-7xl font-black text-white italic tracking-tighter mb-4">
            A TUA <span className="text-primary">ALMA</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 font-light mb-8">
            Paixão, Competição e Formação no Coração de Viseu.
          </p>
          <button 
            onClick={() => onNavigate('teams')}
            className="bg-primary text-white px-8 py-3 rounded-full font-bold text-lg hover:bg-orange-700 transition transform hover:scale-105"
          >
            Junta-te à Equipa
          </button>
        </div>
      </div>

      {/* Next Match Banner */}
      {nextMatch && (
        <div className="bg-primary text-white py-8 -mt-12 relative z-30 mx-4 md:mx-auto max-w-6xl rounded-lg shadow-xl">
          <div className="flex flex-col md:flex-row items-center justify-around text-center px-4">
            <div className="mb-4 md:mb-0">
              <span className="block text-sm opacity-80 uppercase tracking-widest">Próximo Jogo</span>
              <span className="block text-2xl font-bold">{nextMatch.category}</span>
            </div>
            <div className="flex items-center gap-4 text-3xl md:text-4xl font-black italic">
              <span>{nextMatch.home_team}</span>
              <span className="text-black/30">VS</span>
              <span>{nextMatch.guest_team}</span>
            </div>
            <div className="mt-4 md:mt-0 flex flex-col items-center">
              <div className="flex items-center gap-2 mb-1">
                <Calendar size={18} />
                <span>{new Date(nextMatch.date).toLocaleDateString('pt-PT')}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={18} />
                <span className="text-sm">{nextMatch.location}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Latest News Preview */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-secondary border-l-4 border-primary pl-4">Últimas Notícias</h2>
          <button onClick={() => onNavigate('news')} className="text-primary flex items-center gap-1 hover:underline">
            Ver todas <ChevronRight size={20} />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {news.slice(0, 3).map(item => (
            <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow cursor-pointer" onClick={() => onNavigate('news')}>
              <img src={item.image_url || `https://picsum.photos/seed/${item.id}/400/250`} alt={item.title} className="w-full h-48 object-cover" />
              <div className="p-6">
                <span className="text-xs text-primary font-bold">{new Date(item.created_at).toLocaleDateString('pt-PT')}</span>
                <h3 className="text-xl font-bold mb-2 text-secondary leading-tight">{item.title}</h3>
                <p className="text-gray-600 text-sm line-clamp-3">{item.content}</p>
              </div>
            </div>
          ))}
          {news.length === 0 && <p className="text-gray-500">Sem notícias recentes.</p>}
        </div>
      </div>
    </div>
  );
};

// 2. Generic Page Wrappers
const SectionHeader = ({ title }: { title: string }) => (
  <div className="bg-secondary text-white py-12 mb-8">
    <div className="max-w-7xl mx-auto px-4">
      <h1 className="text-4xl font-black italic border-b-4 border-primary inline-block pb-2">{title}</h1>
    </div>
  </div>
);

// --- MAIN APP COMPONENT ---

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [session, setSession] = useState<any>(null);
  
  // Data State
  const [news, setNews] = useState<NewsItem[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [setupNeeded, setSetupNeeded] = useState(false);

  // Form states for Admin
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isSignUp, setIsSignUp] = useState(false); // Toggle between Login and Signup

  // Admin Tab State
  const [adminTab, setAdminTab] = useState('noticias');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    fetchAllData();

    return () => subscription.unsubscribe();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      // Use Promise.all to fetch everything at once
      const responses = await Promise.all([
        supabase.from('news').select('*').order('created_at', { ascending: false }),
        supabase.from('matches').select('*').order('date', { ascending: true }),
        supabase.from('products').select('*'),
        supabase.from('partners').select('*'),
        supabase.from('teams').select('*'),
        supabase.from('gallery').select('*')
      ]);

      const [newsRes, matchesRes, prodRes, partRes, teamRes, galRes] = responses;

      // Check if any response has the "undefined table" error code (42P01)
      const missingTableError = responses.find(r => r.error && r.error.code === '42P01');
      if (missingTableError) {
        setSetupNeeded(true);
        setLoading(false);
        return;
      }

      // If no missing tables, set data
      if (newsRes.data) setNews(newsRes.data);
      if (matchesRes.data) setMatches(matchesRes.data);
      if (prodRes.data) setProducts(prodRes.data);
      if (partRes.data) setPartners(partRes.data);
      if (teamRes.data) setTeams(teamRes.data);
      if (galRes.data) setGallery(galRes.data);

    } catch (e) {
      console.error("Error fetching data:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    
    // Helper: auto-append domain if username is simple
    let finalEmail = email;
    if (!email.includes('@')) {
       finalEmail = email + '@almaviseu.pt';
    }

    if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({ email: finalEmail, password });
        if (error) {
            setLoginError('Erro ao criar conta: ' + error.message);
        } else {
            // Check if session was created immediately (email confirm disabled)
            if (data.session) {
                setCurrentPage('admin');
            } else {
                setLoginError('Conta criada! Verifique o email (se necessário) e faça login.');
                setIsSignUp(false);
            }
        }
    } else {
        const { error } = await supabase.auth.signInWithPassword({ email: finalEmail, password });
        if (error) setLoginError('Erro no login: ' + error.message);
        else setCurrentPage('admin');
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setCurrentPage('home');
  };

  // --- CRUD Operations Helper (Simplified) ---
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

  // --- Page Render Logic ---

  const renderContent = () => {
    if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-primary" size={48} /></div>;
    
    // If tables are missing, force setup screen
    if (setupNeeded) return <DatabaseSetupInstructions />;

    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={setCurrentPage} news={news} matches={matches} />;
      
      case 'news':
        return (
          <div className="min-h-screen bg-gray-50 pb-12">
            <SectionHeader title="Últimas Notícias" />
            <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {news.map(item => (
                <div key={item.id} className="bg-white rounded-lg shadow hover:shadow-lg transition">
                  <img src={item.image_url || `https://picsum.photos/seed/${item.id}/400/250`} className="w-full h-48 object-cover rounded-t-lg" />
                  <div className="p-6">
                    <span className="text-xs text-primary font-bold uppercase">{new Date(item.created_at).toLocaleDateString()}</span>
                    <h2 className="text-xl font-bold mt-2 mb-4">{item.title}</h2>
                    <p className="text-gray-600 text-sm whitespace-pre-line">{item.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'calendar':
        const upcoming = matches.filter(m => new Date(m.date) >= new Date());
        const past = matches.filter(m => new Date(m.date) < new Date()).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        return (
          <div className="min-h-screen bg-gray-50 pb-12">
            <SectionHeader title="Calendário & Resultados" />
            <div className="max-w-4xl mx-auto px-4 space-y-12">
              
              <section>
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-2 text-secondary"><Calendar className="text-primary"/> Próximos Jogos</h3>
                <div className="space-y-4">
                  {upcoming.length === 0 && <p className="text-gray-500 italic">Sem jogos agendados.</p>}
                  {upcoming.map(m => (
                    <div key={m.id} className="bg-white p-6 rounded-lg shadow border-l-4 border-primary flex flex-col sm:flex-row justify-between items-center gap-4">
                      <div className="text-center sm:text-left">
                        <div className="text-sm font-bold text-gray-400 uppercase tracking-wide">{m.category}</div>
                        <div className="text-lg font-bold">{new Date(m.date).toLocaleDateString('pt-PT')} <span className="text-primary mx-1">|</span> {new Date(m.date).toLocaleTimeString('pt-PT', {hour:'2-digit', minute:'2-digit'})}</div>
                        <div className="text-sm text-gray-500">{m.location}</div>
                      </div>
                      <div className="text-2xl font-black italic flex items-center gap-4">
                        <span className="text-right flex-1">{m.home_team}</span>
                        <span className="bg-gray-100 px-3 py-1 rounded text-sm text-gray-400">VS</span>
                        <span className="text-left flex-1">{m.guest_team}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-2 text-secondary"><Trophy className="text-primary"/> Resultados Anteriores</h3>
                <div className="space-y-4">
                {past.length === 0 && <p className="text-gray-500 italic">Sem resultados disponíveis.</p>}
                  {past.map(m => (
                    <div key={m.id} className="bg-gray-100 p-4 rounded-lg flex justify-between items-center opacity-80 hover:opacity-100 transition">
                      <div className="text-sm text-gray-500 w-24">{new Date(m.date).toLocaleDateString()}</div>
                      <div className="flex-1 flex justify-center items-center gap-4 font-bold">
                        <span className={`text-right ${m.score_home! > m.score_guest! ? 'text-green-600' : ''}`}>{m.home_team}</span>
                        <div className="bg-white px-3 py-1 rounded border shadow-sm font-mono">
                          {m.score_home} - {m.score_guest}
                        </div>
                        <span className={`text-left ${m.score_guest! > m.score_home! ? 'text-green-600' : ''}`}>{m.guest_team}</span>
                      </div>
                      <div className="hidden sm:block text-xs uppercase font-bold text-gray-400 w-24 text-right">{m.category}</div>
                    </div>
                  ))}
                </div>
              </section>

            </div>
          </div>
        );

      case 'shop':
        return (
          <div className="min-h-screen bg-gray-50 pb-12">
            <SectionHeader title="Loja Oficial" />
            <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map(p => (
                <div key={p.id} className="bg-white rounded-lg shadow overflow-hidden group">
                  <div className="h-64 overflow-hidden relative">
                    <img src={p.image_url || `https://picsum.photos/seed/${p.id}/400/400`} alt={p.name} className="w-full h-full object-cover transition transform group-hover:scale-110" />
                    <div className="absolute top-2 right-2 bg-primary text-white font-bold px-3 py-1 rounded-full shadow">{p.price.toFixed(2)} €</div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-lg">{p.name}</h3>
                    <p className="text-gray-500 text-sm mb-4 line-clamp-2">{p.description}</p>
                    <button className="w-full bg-secondary text-white py-2 rounded font-bold hover:bg-gray-800 transition flex items-center justify-center gap-2">
                      <ShoppingBag size={18} /> Encomendar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'teams':
        return (
          <div className="min-h-screen bg-gray-50 pb-12">
            <SectionHeader title="As Nossas Equipas" />
            <div className="max-w-7xl mx-auto px-4 space-y-12">
              {teams.map((t, idx) => (
                <div key={t.id} className={`flex flex-col md:flex-row gap-8 items-center bg-white rounded-xl shadow-lg overflow-hidden ${idx % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
                   <img src={t.image_url || `https://picsum.photos/seed/${t.id}/600/400`} className="w-full md:w-1/2 h-64 md:h-80 object-cover" />
                   <div className="p-8 md:w-1/2">
                      <span className="text-primary font-bold uppercase tracking-widest text-sm mb-2 block">{t.category}</span>
                      <h2 className="text-3xl font-black italic mb-4">{t.name}</h2>
                      <p className="text-gray-600 leading-relaxed">{t.description}</p>
                   </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'partners':
        return (
          <div className="min-h-screen bg-gray-50 pb-12">
            <SectionHeader title="Parceiros" />
            <div className="max-w-6xl mx-auto px-4 text-center mb-12">
               <p className="text-xl text-gray-600">Obrigado a quem nos ajuda a crescer.</p>
            </div>
            <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
              {partners.map(p => (
                <a href={p.website_url} target="_blank" rel="noreferrer" key={p.id} className="bg-white p-8 rounded-lg shadow hover:shadow-xl transition flex items-center justify-center h-40 grayscale hover:grayscale-0">
                  <img src={p.logo_url || `https://picsum.photos/seed/${p.id}/200/100`} alt={p.name} className="max-h-24 max-w-full object-contain" />
                </a>
              ))}
            </div>
          </div>
        );

      case 'about':
        return (
          <div className="min-h-screen bg-gray-50 pb-12">
            <SectionHeader title="Quem Somos" />
            <div className="max-w-4xl mx-auto px-4 bg-white p-8 md:p-12 rounded-lg shadow-lg">
              <h2 className="text-3xl font-bold mb-6 text-primary">ALMA Viseu</h2>
              <div className="prose prose-lg text-gray-700">
                <p className="mb-4">
                  O <strong>ALMA Viseu</strong> é mais do que um clube de voleibol; é uma comunidade dedicada ao desenvolvimento desportivo e pessoal dos jovens de Viseu. 
                  Fundado com a missão de revitalizar o voleibol na região centro, o clube tem crescido sustentadamente.
                </p>
                <p className="mb-4">
                  As nossas cores, <strong>Preto e Laranja</strong>, representam a força e a energia que colocamos em cada treino e jogo.
                </p>
                <h3 className="text-xl font-bold text-secondary mt-8 mb-4">A Nossa Missão</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Formar atletas de excelência.</li>
                  <li>Promover hábitos de vida saudáveis.</li>
                  <li>Inculcar valores de respeito, disciplina e trabalho de equipa.</li>
                </ul>
              </div>
            </div>
          </div>
        );

      case 'photos':
         return (
          <div className="min-h-screen bg-gray-50 pb-12">
            <SectionHeader title="Galeria de Fotos" />
            <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {gallery.map(g => (
                <div key={g.id} className="relative group overflow-hidden rounded-lg aspect-square">
                   <img src={g.image_url || `https://picsum.photos/seed/${g.id}/500/500`} className="w-full h-full object-cover transition duration-500 group-hover:scale-110" />
                   <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition duration-300 flex items-end">
                      <p className="text-white p-4 translate-y-full group-hover:translate-y-0 transition duration-300 font-bold">{g.title}</p>
                   </div>
                </div>
              ))}
            </div>
          </div>
         );

      case 'contacts':
        return (
          <div className="min-h-screen bg-gray-50 pb-12">
            <SectionHeader title="Contactos" />
            <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-12">
              <div className="space-y-8">
                <div className="bg-white p-8 rounded-lg shadow-lg">
                   <h3 className="text-xl font-bold mb-6 border-b pb-2">Informações</h3>
                   <div className="space-y-4">
                      <div className="flex items-start gap-4">
                        <MapPin className="text-primary shrink-0" />
                        <p>Pavilhão Desportivo de Viseu<br/>Rua do Desporto, 3500 Viseu</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <Mail className="text-primary shrink-0" />
                        <p>geral@almaviseu.pt</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <Info className="text-primary shrink-0" />
                        <p>Secretaria: 2ª a 6ª - 18h às 21h</p>
                      </div>
                   </div>
                </div>
                <div className="bg-gray-200 h-64 rounded-lg flex items-center justify-center text-gray-500 font-bold">
                   MAPA (Google Maps Placeholder)
                </div>
              </div>

              <div className="bg-white p-8 rounded-lg shadow-lg">
                <h3 className="text-xl font-bold mb-6">Envia-nos uma mensagem</h3>
                <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); alert('Mensagem enviada (Simulação)!'); }}>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                    <input type="text" className="w-full border border-gray-300 rounded p-2 focus:ring-primary focus:border-primary" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input type="email" className="w-full border border-gray-300 rounded p-2 focus:ring-primary focus:border-primary" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Assunto</label>
                    <input type="text" className="w-full border border-gray-300 rounded p-2 focus:ring-primary focus:border-primary" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mensagem</label>
                    <textarea className="w-full border border-gray-300 rounded p-2 focus:ring-primary focus:border-primary h-32" required></textarea>
                  </div>
                  <button type="submit" className="w-full bg-primary text-white font-bold py-3 rounded hover:bg-orange-700 transition">Enviar Mensagem</button>
                </form>
              </div>
            </div>
          </div>
        );

      case 'login':
        return (
          <div className="min-h-screen flex items-center justify-center bg-gray-100">
             <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
                <div className="text-center mb-6">
                   <h2 className="text-2xl font-bold text-primary mb-1">
                      {isSignUp ? 'Criar Conta Admin' : 'Login Administrativo'}
                   </h2>
                   <p className="text-xs text-gray-400">Acesso reservado à gestão do clube</p>
                </div>
                
                {loginError && (
                  <div className={`p-3 rounded mb-4 text-sm border-l-4 ${loginError.includes('criada') ? 'bg-green-100 text-green-700 border-green-500' : 'bg-red-100 text-red-700 border-red-500'}`}>
                    {loginError}
                  </div>
                )}

                <form onSubmit={handleAuth} className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Email ou Utilizador</label>
                    <input 
                      type="text" 
                      value={email} 
                      onChange={e => setEmail(e.target.value)} 
                      className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition" 
                      required 
                      placeholder="ex: admin"
                    />
                    <div className="text-xs text-gray-400 mt-1">
                      {!email.includes('@') && email.length > 0 ? `Entrar como: ${email}@almaviseu.pt` : ''}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Password</label>
                    <input 
                      type="password" 
                      value={password} 
                      onChange={e => setPassword(e.target.value)} 
                      className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition" 
                      required 
                      placeholder={isSignUp ? "Mínimo 6 caracteres" : ""}
                    />
                  </div>
                  <button type="submit" className="w-full bg-secondary text-white py-3 rounded font-bold hover:bg-gray-800 transition shadow-lg flex justify-center gap-2 items-center">
                    {isSignUp ? <><UserPlus size={18}/> Registar Conta</> : <><LogIn size={18}/> Entrar</>}
                  </button>
                </form>

                <div className="mt-6 text-center border-t pt-4">
                  <button onClick={() => { setIsSignUp(!isSignUp); setLoginError(''); }} className="text-sm text-primary hover:text-orange-700 font-semibold mb-4 block w-full">
                    {isSignUp ? 'Já tem conta? Entrar' : 'Não tem conta? Registar Admin'}
                  </button>
                  <button onClick={() => setCurrentPage('home')} className="text-xs text-gray-400 hover:text-gray-600">
                    Voltar ao site
                  </button>
                </div>
             </div>
          </div>
        );

      case 'admin':
        if (!session) {
           setCurrentPage('login');
           return null;
        }
        
        // Admin Helper to Add Items
        const AdminList = ({ title, data, table, fields }: { title: string, data: any[], table: string, fields: any[] }) => {
           const [isAdding, setIsAdding] = useState(false);
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

           const handleSubmit = async (e: React.FormEvent) => {
             e.preventDefault();
             setUploading(true);
             try {
                const finalData = { ...formData };

                // Handle Image Uploads
                for (const key of Object.keys(files)) {
                   const file = files[key];
                   if (file) {
                      const fileExt = file.name.split('.').pop();
                      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
                      
                      // 1. Upload to Supabase Storage
                      const { error: uploadError } = await supabase.storage.from('images').upload(fileName, file);
                      if (uploadError) throw new Error(`Upload failed: ${uploadError.message}`);

                      // 2. Get Public URL
                      const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(fileName);
                      finalData[key] = publicUrl;
                   }
                }

                await createItem(table, finalData);
                setIsAdding(false);
                setFormData({});
                setFiles({});
                setPreviews({});
             } catch (err: any) {
                alert("Erro: " + err.message);
             } finally {
                setUploading(false);
             }
           };

           return (
             <div className="bg-white p-6 rounded shadow mb-8">
                <div className="flex justify-between items-center mb-4">
                   <h3 className="text-lg font-bold">{title}</h3>
                   <button onClick={() => setIsAdding(!isAdding)} className="bg-green-600 text-white px-3 py-1 rounded text-sm flex items-center gap-1">
                      <Plus size={16} /> Adicionar
                   </button>
                </div>

                {isAdding && (
                  <form onSubmit={handleSubmit} className="mb-6 p-4 bg-gray-50 border rounded space-y-3">
                    {fields.map(f => (
                      <div key={f.key}>
                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1">{f.label}</label>
                        
                        {f.type === 'textarea' ? (
                          <textarea 
                            className="w-full border p-2 rounded focus:ring-2 focus:ring-primary outline-none" 
                            onChange={e => setFormData({...formData, [f.key]: e.target.value})} 
                            required={f.required} 
                            rows={3}
                          />
                        ) : f.type === 'image' ? (
                           <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:bg-gray-50 transition cursor-pointer relative">
                              <input 
                                type="file" 
                                accept="image/*"
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                onChange={(e) => handleFileChange(f.key, e)}
                                required={f.required}
                              />
                              {previews[f.key] ? (
                                 <div className="relative h-40 w-full">
                                    <img src={previews[f.key]} className="h-full w-full object-contain mx-auto" />
                                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 text-white text-xs opacity-0 hover:opacity-100 transition">
                                       Alterar Imagem
                                    </div>
                                 </div>
                              ) : (
                                 <div className="flex flex-col items-center text-gray-400 py-4">
                                    <ImageIcon size={32} className="mb-2" />
                                    <span className="text-sm">Clique ou arraste uma imagem</span>
                                 </div>
                              )}
                           </div>
                        ) : (
                          <input 
                            type={f.type || 'text'} 
                            className="w-full border p-2 rounded focus:ring-2 focus:ring-primary outline-none" 
                            onChange={e => setFormData({...formData, [f.key]: e.target.value})} 
                            required={f.required} 
                            placeholder={f.placeholder}
                          />
                        )}
                      </div>
                    ))}
                    <button 
                      disabled={uploading}
                      className={`bg-primary text-white px-4 py-2 rounded font-bold text-sm flex items-center gap-2 ${uploading ? 'opacity-50' : 'hover:bg-orange-700'}`}
                    >
                      {uploading ? <Loader2 className="animate-spin" size={16}/> : <Save size={16} />} 
                      {uploading ? 'A enviar...' : 'Guardar'}
                    </button>
                  </form>
                )}

                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead className="bg-gray-100">
                      <tr>
                        {fields.slice(0, 3).map(f => <th key={f.key} className="p-2 text-left">{f.label}</th>)}
                        <th className="p-2 w-20">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.map(item => (
                        <tr key={item.id} className="border-b hover:bg-gray-50">
                          {fields.slice(0, 3).map(f => (
                            <td key={f.key} className="p-2 truncate max-w-[200px]">
                               {f.type === 'image' && item[f.key] ? (
                                  <img src={item[f.key]} className="h-10 w-10 object-cover rounded" />
                               ) : (
                                  item[f.key]?.toString()
                               )}
                            </td>
                          ))}
                          <td className="p-2">
                            <button onClick={() => deleteItem(table, item.id)} className="text-red-600 hover:text-red-800 transition"><Trash size={16} /></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
             </div>
           );
        };

        const InviteUser = () => {
           const [newEmail, setNewEmail] = useState('');
           const [newPass, setNewPass] = useState('');

           const createUser = async () => {
              // Note: Only Supabase Service Role can create users without invite confirmation flow usually, 
              // but standard client can signUp. 
              const { error } = await supabase.auth.signUp({ email: newEmail, password: newPass });
              if (error) alert("Erro: " + error.message);
              else alert("Utilizador criado/convidado com sucesso! Verifique o email.");
           };

           return (
             <div className="bg-white p-6 rounded shadow">
               <h3 className="text-lg font-bold mb-4">Adicionar Administrador</h3>
               <div className="flex gap-4">
                 <input type="email" placeholder="Email" className="border p-2 rounded flex-1" onChange={e => setNewEmail(e.target.value)} />
                 <input type="password" placeholder="Password" className="border p-2 rounded flex-1" onChange={e => setNewPass(e.target.value)} />
                 <button onClick={createUser} className="bg-secondary text-white px-4 py-2 rounded">Criar</button>
               </div>
             </div>
           );
        }

        const DatabaseSetup = () => {
          const [copied, setCopied] = useState(false);
          const copyToClipboard = () => {
            navigator.clipboard.writeText(SQL_SCRIPT);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          };

          return (
            <div className="bg-gray-800 text-gray-200 p-6 rounded mt-8 border border-gray-700">
              <h4 className="font-bold text-white mb-2 text-xl">Configuração Inicial da Base de Dados</h4>
              <p className="text-sm mb-4 text-gray-400">Se precisares de recriar as tabelas, usa este código SQL:</p>
              
              <div className="bg-black rounded border border-gray-600">
                <div className="flex justify-between items-center px-4 py-2 bg-gray-900 border-b border-gray-600">
                   <span className="text-xs font-mono">setup_tables.sql</span>
                   <button onClick={copyToClipboard} className="text-xs flex items-center gap-1 hover:text-white">
                      {copied ? <><Check size={12}/> Copiado</> : <><Copy size={12}/> Copiar</>}
                   </button>
                </div>
                <pre className="p-4 overflow-auto text-xs font-mono h-40 text-green-400">
                  {SQL_SCRIPT}
                </pre>
              </div>
            </div>
          );
        };

        return (
          <div className="min-h-screen bg-gray-100">
            <nav className="bg-secondary text-white p-4 flex justify-between items-center">
              <span className="font-bold text-primary">Painel Admin ALMA</span>
              <div className="flex gap-4 items-center">
                 <span className="text-sm text-gray-300">{session.user.email}</span>
                 <button onClick={handleLogout} className="text-sm bg-red-600 px-3 py-1 rounded">Sair</button>
              </div>
            </nav>
            <div className="flex flex-col md:flex-row h-[calc(100vh-64px)]">
              {/* Sidebar */}
              <div className="w-full md:w-64 bg-white border-r p-4 space-y-2">
                 {['noticias', 'jogos', 'loja', 'parceiros', 'equipas', 'galeria', 'utilizadores'].map(tab => (
                   <button 
                     key={tab}
                     onClick={() => setAdminTab(tab)}
                     className={`w-full text-left p-2 rounded capitalize ${adminTab === tab ? 'bg-primary text-white' : 'hover:bg-gray-100'}`}
                   >
                     {tab}
                   </button>
                 ))}
              </div>
              {/* Content */}
              <div className="flex-1 p-8 overflow-y-auto">
                 <h2 className="text-3xl font-bold mb-6 capitalize text-secondary">{adminTab}</h2>
                 
                 {adminTab === 'noticias' && <AdminList title="Gerir Notícias" data={news} table="news" fields={[
                    {key: 'title', label: 'Título', required: true},
                    {key: 'content', label: 'Conteúdo', type: 'textarea'},
                    {key: 'image_url', label: 'Imagem', type: 'image'}
                 ]} />}

                 {adminTab === 'jogos' && <AdminList title="Gerir Jogos" data={matches} table="matches" fields={[
                    {key: 'home_team', label: 'Equipa Casa', required: true},
                    {key: 'guest_team', label: 'Equipa Fora', required: true},
                    {key: 'date', label: 'Data', type: 'datetime-local', required: true},
                    {key: 'location', label: 'Local'},
                    {key: 'category', label: 'Escalão'},
                    {key: 'score_home', label: 'Pontos Casa', type: 'number'},
                    {key: 'score_guest', label: 'Pontos Fora', type: 'number'},
                 ]} />}
                 
                 {adminTab === 'loja' && <AdminList title="Gerir Produtos" data={products} table="products" fields={[
                    {key: 'name', label: 'Nome', required: true},
                    {key: 'price', label: 'Preço', type: 'number', required: true},
                    {key: 'description', label: 'Descrição'},
                    {key: 'image_url', label: 'Imagem', type: 'image'}
                 ]} />}

                 {adminTab === 'parceiros' && <AdminList title="Gerir Parceiros" data={partners} table="partners" fields={[
                    {key: 'name', label: 'Nome', required: true},
                    {key: 'website_url', label: 'Website'},
                    {key: 'logo_url', label: 'Logo', type: 'image'}
                 ]} />}

                 {adminTab === 'equipas' && <AdminList title="Gerir Equipas" data={teams} table="teams" fields={[
                    {key: 'name', label: 'Nome', required: true},
                    {key: 'category', label: 'Escalão'},
                    {key: 'description', label: 'Descrição', type: 'textarea'},
                    {key: 'image_url', label: 'Foto', type: 'image'}
                 ]} />}

                 {adminTab === 'galeria' && <AdminList title="Gerir Fotos" data={gallery} table="gallery" fields={[
                    {key: 'title', label: 'Título'},
                    {key: 'image_url', label: 'Imagem', type: 'image', required: true}
                 ]} />}

                 {adminTab === 'utilizadores' && (
                    <>
                      <InviteUser />
                      <DatabaseSetup />
                    </>
                 )}
              </div>
            </div>
          </div>
        );

      default:
        return <div>Página não encontrada</div>;
    }
  };

  if (currentPage === 'login' || currentPage === 'admin') {
     return renderContent();
  }

  return (
    <div className="flex flex-col min-h-screen font-sans text-secondary">
      <Navbar onNavigate={setCurrentPage} currentPage={currentPage} isAdmin={!!session} />
      <main className="flex-grow">
        {renderContent()}
      </main>
      <Footer />
    </div>
  );
}
