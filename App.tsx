import React, { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { NewsItem, Match, Product, Partner, Team, GalleryItem } from './types';
import { 
  Loader2, Calendar, MapPin, ShoppingBag, Users, 
  Info, Camera, Mail, Trophy, ArrowRight, ChevronRight, Edit, Trash, Plus, Save, Copy, Check,
  LogIn, UserPlus, Upload, Image as ImageIcon, Settings
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
-- (Recriar políticas para garantir consistência)
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
-- Garante que o bucket 'images' existe
insert into storage.buckets (id, name, public) values ('images', 'images', true) ON CONFLICT (id) DO NOTHING;

-- Políticas de Storage (Permite leitura pública e upload para autenticados)
drop policy if exists "Public Access Images" on storage.objects;
create policy "Public Access Images" on storage.objects for select using ( bucket_id = 'images' );

drop policy if exists "Auth Upload Images" on storage.objects;
create policy "Auth Upload Images" on storage.objects for insert with check ( bucket_id = 'images' AND auth.role() = 'authenticated' );

drop policy if exists "Auth Update Images" on storage.objects;
create policy "Auth Update Images" on storage.objects for update using ( bucket_id = 'images' AND auth.role() = 'authenticated' );

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
    <div className="min-h-screen bg-black text-white p-8 flex flex-col items-center justify-center font-sans">
      <div className="max-w-4xl w-full space-y-6">
        <div className="flex items-center gap-4 text-primary">
           <Info size={48} />
           <h1 className="text-4xl font-bold">Configuração da Base de Dados</h1>
        </div>
        <div className="bg-neutral-900 p-6 rounded-lg border-l-4 border-primary">
          <p className="text-xl text-neutral-200 mb-2">
            Configuração necessária.
          </p>
          <p className="text-neutral-400">
            Para corrigir erros de tabelas ou de upload de imagens ("Bucket not found"), copia o código SQL abaixo e executa-o no <a href="https://supabase.com/dashboard/project/_/sql" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-bold">Editor SQL do Supabase</a>.
          </p>
        </div>
        
        <div className="bg-black rounded-lg border border-neutral-700 overflow-hidden shadow-2xl">
          <div className="bg-neutral-800 px-4 py-2 text-xs font-mono text-neutral-400 border-b border-neutral-700 flex justify-between items-center">
            <span>setup_full.sql</span>
            <button 
              onClick={copyToClipboard}
              className={`flex items-center gap-2 px-3 py-1 rounded transition-all ${copied ? 'bg-green-600 text-white' : 'hover:bg-neutral-700 text-neutral-300'}`}
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

// --- LANDING PAGE SECTIONS ---

const SectionTitle = ({ title, subtitle }: { title: string, subtitle?: string }) => (
  <div className="mb-12 text-center">
    <h2 className="text-4xl md:text-5xl font-black italic text-white mb-2 uppercase tracking-tighter">
      {title}<span className="text-primary">.</span>
    </h2>
    {subtitle && <p className="text-neutral-400 max-w-2xl mx-auto">{subtitle}</p>}
    <div className="w-24 h-1 bg-primary mx-auto mt-4"></div>
  </div>
);

const LandingPage = ({ 
  onNavigate, 
  news, 
  matches, 
  products, 
  partners, 
  teams, 
  gallery 
}: { 
  onNavigate: (p: string) => void, 
  news: NewsItem[], 
  matches: Match[], 
  products: Product[],
  partners: Partner[],
  teams: Team[],
  gallery: GalleryItem[]
}) => {
  const nextMatch = matches
    .filter(m => new Date(m.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];

  const upcoming = matches.filter(m => new Date(m.date) >= new Date()).slice(0, 5);
  const past = matches.filter(m => new Date(m.date) < new Date()).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);

  return (
    <div className="bg-black text-white">
      
      {/* HERO SECTION */}
      <section id="home" className="relative h-screen min-h-[600px] flex items-center justify-center text-center overflow-hidden">
        <div className="absolute inset-0 bg-black/60 z-10"></div>
        <img 
          src="https://picsum.photos/1920/1080?grayscale&blur=2" 
          alt="Voleibol" 
          className="absolute inset-0 w-full h-full object-cover opacity-50"
        />
        <div className="relative z-20 max-w-5xl px-4 animate-fade-in-up">
          <h1 className="text-6xl md:text-9xl font-black text-white italic tracking-tighter mb-2 leading-none">
            ALMA <span className="text-primary">VISEU</span>
          </h1>
          <p className="text-xl md:text-3xl text-neutral-300 font-light mb-8 tracking-widest uppercase">
            Paixão. Competição. Voleibol.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => document.getElementById('teams')?.scrollIntoView({behavior: 'smooth'})}
              className="bg-primary text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-orange-700 transition transform hover:scale-105 border-2 border-primary"
            >
              Junta-te à Equipa
            </button>
            <button 
              onClick={() => document.getElementById('calendar')?.scrollIntoView({behavior: 'smooth'})}
              className="bg-transparent text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-black transition transform hover:scale-105 border-2 border-white"
            >
              Ver Jogos
            </button>
          </div>
        </div>
      </section>

      {/* NEXT MATCH BANNER (Floating) */}
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

      {/* NEWS SECTION - Dark Gray */}
      <section id="news" className="py-24 px-4 bg-neutral-900">
        <div className="max-w-7xl mx-auto">
          <SectionTitle title="Últimas Notícias" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {news.slice(0, 3).map(item => (
              <div key={item.id} className="bg-neutral-800 rounded-xl overflow-hidden group hover:ring-2 hover:ring-primary transition-all duration-300">
                <div className="h-56 overflow-hidden">
                  <img src={item.image_url || `https://picsum.photos/seed/${item.id}/400/250`} alt={item.title} className="w-full h-full object-cover transition duration-500 group-hover:scale-110 opacity-80 group-hover:opacity-100" />
                </div>
                <div className="p-6 relative">
                  <div className="absolute -top-4 right-6 bg-primary text-white text-xs font-bold px-3 py-1 rounded shadow-lg">
                    {new Date(item.created_at).toLocaleDateString('pt-PT')}
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-white leading-tight group-hover:text-primary transition">{item.title}</h3>
                  <p className="text-neutral-400 text-sm line-clamp-3">{item.content}</p>
                </div>
              </div>
            ))}
            {news.length === 0 && <p className="text-neutral-500 col-span-3 text-center">A aguardar novidades...</p>}
          </div>
        </div>
      </section>

      {/* CALENDAR SECTION - Black */}
      <section id="calendar" className="py-24 px-4 bg-black relative">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <SectionTitle title="Calendário & Resultados" subtitle="Acompanha a nossa jornada jornada a jornada." />
          
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold mb-8 flex items-center gap-3 text-white">
                <span className="w-8 h-8 bg-primary rounded flex items-center justify-center text-black"><Calendar size={18}/></span> 
                Próximos Jogos
              </h3>
              <div className="space-y-4">
                {upcoming.length === 0 && <p className="text-neutral-600 italic">Sem jogos agendados.</p>}
                {upcoming.map(m => (
                  <div key={m.id} className="bg-neutral-900 border-l-4 border-primary p-5 rounded-r-lg hover:bg-neutral-800 transition">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-bold text-primary uppercase tracking-widest">{m.category}</span>
                      <span className="text-neutral-400 text-sm">{new Date(m.date).toLocaleDateString('pt-PT')}</span>
                    </div>
                    <div className="text-xl font-bold text-white mb-2">{m.home_team} <span className="text-neutral-600 mx-1">vs</span> {m.guest_team}</div>
                    <div className="flex items-center gap-2 text-sm text-neutral-500">
                      <MapPin size={14}/> {m.location}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-2xl font-bold mb-8 flex items-center gap-3 text-white">
                <span className="w-8 h-8 bg-white rounded flex items-center justify-center text-black"><Trophy size={18}/></span> 
                Resultados
              </h3>
              <div className="space-y-4">
                {past.length === 0 && <p className="text-neutral-600 italic">Sem resultados.</p>}
                {past.map(m => (
                  <div key={m.id} className="bg-neutral-900 p-4 rounded-lg flex items-center justify-between border border-neutral-800">
                     <div className="text-xs text-neutral-500 w-16 text-center">
                        <div className="font-bold text-lg">{new Date(m.date).getDate()}</div>
                        <div>{new Date(m.date).toLocaleString('default', { month: 'short' })}</div>
                     </div>
                     <div className="flex-1 px-4 flex justify-between items-center">
                        <span className={`font-bold ${m.score_home! > m.score_guest! ? 'text-primary' : 'text-neutral-400'}`}>{m.home_team}</span>
                        <div className="bg-black px-3 py-1 rounded text-white font-mono border border-neutral-700 mx-2 text-sm whitespace-nowrap">
                          {m.score_home} - {m.score_guest}
                        </div>
                        <span className={`font-bold ${m.score_guest! > m.score_home! ? 'text-primary' : 'text-neutral-400'}`}>{m.guest_team}</span>
                     </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TEAMS SECTION - Dark Gray */}
      <section id="teams" className="py-24 px-4 bg-neutral-900">
        <div className="max-w-7xl mx-auto">
          <SectionTitle title="As Nossas Equipas" />
          <div className="space-y-16">
            {teams.map((t, idx) => (
              <div key={t.id} className={`flex flex-col md:flex-row gap-0 rounded-2xl overflow-hidden bg-neutral-800 shadow-2xl ${idx % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
                 <div className="md:w-1/2 relative min-h-[300px]">
                   <img src={t.image_url || `https://picsum.photos/seed/${t.id}/800/600`} className="absolute inset-0 w-full h-full object-cover" />
                   <div className="absolute inset-0 bg-gradient-to-t from-neutral-800 md:bg-none opacity-80 md:opacity-0"></div>
                 </div>
                 <div className="p-8 md:p-12 md:w-1/2 flex flex-col justify-center">
                    <span className="text-primary font-bold uppercase tracking-widest text-sm mb-2">{t.category}</span>
                    <h3 className="text-3xl md:text-4xl font-black italic text-white mb-6">{t.name}</h3>
                    <p className="text-neutral-400 leading-relaxed text-lg">{t.description}</p>
                 </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SHOP SECTION - Black */}
      <section id="shop" className="py-24 px-4 bg-black">
        <div className="max-w-7xl mx-auto">
          <SectionTitle title="Loja Oficial" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map(p => (
              <div key={p.id} className="bg-neutral-900 rounded-xl overflow-hidden group border border-neutral-800 hover:border-primary transition duration-300">
                <div className="h-64 overflow-hidden relative p-4 bg-neutral-800">
                  <img src={p.image_url || `https://picsum.photos/seed/${p.id}/400/400`} alt={p.name} className="w-full h-full object-cover rounded-lg transition transform group-hover:scale-105" />
                  <div className="absolute top-6 right-6 bg-primary text-white font-bold px-3 py-1 rounded-full shadow-lg">{p.price.toFixed(2)} €</div>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-lg text-white mb-2">{p.name}</h3>
                  <p className="text-neutral-500 text-sm mb-4 line-clamp-2">{p.description}</p>
                  <button className="w-full bg-white text-black py-3 rounded font-bold hover:bg-primary hover:text-white transition flex items-center justify-center gap-2">
                    <ShoppingBag size={18} /> Encomendar
                  </button>
                </div>
              </div>
            ))}
            {products.length === 0 && <p className="col-span-4 text-center text-neutral-500">Loja brevemente...</p>}
          </div>
        </div>
      </section>

      {/* PARTNERS SECTION - Light Gray */}
      <section id="partners" className="py-20 px-4 bg-neutral-100 text-black">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-black italic mb-12 uppercase tracking-tighter text-black">Os Nossos Parceiros</h2>
          <div className="flex flex-wrap justify-center gap-12 items-center grayscale hover:grayscale-0 transition-all duration-500">
            {partners.map(p => (
               <a href={p.website_url} target="_blank" rel="noreferrer" key={p.id} className="block w-40 md:w-56 opacity-60 hover:opacity-100 transition">
                 <img src={p.logo_url || `https://picsum.photos/seed/${p.id}/200/100`} alt={p.name} className="w-full object-contain" />
               </a>
            ))}
            {partners.length === 0 && <p className="text-neutral-400">Seja o nosso primeiro parceiro!</p>}
          </div>
        </div>
      </section>

      {/* ABOUT SECTION - Dark Gray */}
      <section id="about" className="py-24 px-4 bg-neutral-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-black italic text-primary mb-8">ALMA VISEU</h2>
          <p className="text-xl text-neutral-300 leading-relaxed mb-8">
            O <strong>ALMA Viseu</strong> é mais do que um clube de voleibol; é uma comunidade dedicada ao desenvolvimento desportivo e pessoal dos jovens de Viseu. 
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
      </section>

      {/* GALLERY SECTION - Black */}
      <section id="photos" className="py-4 bg-black">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-1">
          {gallery.slice(0, 8).map(g => (
            <div key={g.id} className="relative group overflow-hidden aspect-square">
               <img src={g.image_url || `https://picsum.photos/seed/${g.id}/500/500`} className="w-full h-full object-cover transition duration-700 group-hover:scale-110 opacity-70 group-hover:opacity-100" />
               <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center">
                  <p className="text-white font-bold tracking-widest uppercase text-sm border-2 border-primary px-4 py-2">{g.title}</p>
               </div>
            </div>
          ))}
        </div>
        {gallery.length > 0 && (
           <div className="text-center py-8">
              <button className="text-primary hover:text-white transition font-bold uppercase text-sm tracking-widest flex items-center justify-center gap-2 mx-auto">
                 Ver Galeria Completa <ArrowRight size={16}/>
              </button>
           </div>
        )}
      </section>

      {/* CONTACT SECTION - Dark Gray */}
      <section id="contacts" className="py-24 px-4 bg-neutral-900">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
           <div>
              <SectionTitle title="Contactos" />
              <div className="space-y-8 text-lg">
                 <div className="flex items-start gap-6">
                    <MapPin className="text-primary mt-1" size={32} />
                    <div>
                       <h4 className="font-bold text-white">Localização</h4>
                       <p className="text-neutral-400">Pavilhão Desportivo de Viseu<br/>Rua do Desporto, 3500 Viseu</p>
                    </div>
                 </div>
                 <div className="flex items-start gap-6">
                    <Mail className="text-primary mt-1" size={32} />
                    <div>
                       <h4 className="font-bold text-white">Email</h4>
                       <a href="mailto:geral@almaviseu.pt" className="text-neutral-400 hover:text-white transition">geral@almaviseu.pt</a>
                    </div>
                 </div>
                 <div className="flex items-start gap-6">
                    <Info className="text-primary mt-1" size={32} />
                    <div>
                       <h4 className="font-bold text-white">Horário Secretaria</h4>
                       <p className="text-neutral-400">2ª a 6ª - 18h às 21h</p>
                    </div>
                 </div>
              </div>
           </div>
           
           <div className="bg-neutral-800 p-8 rounded-2xl shadow-xl border border-neutral-700">
              <h3 className="text-2xl font-bold text-white mb-6">Envia-nos uma mensagem</h3>
              <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); alert('Mensagem enviada (Simulação)!'); }}>
                 <div className="grid grid-cols-2 gap-4">
                    <input type="text" placeholder="Nome" className="bg-black border border-neutral-700 text-white rounded p-3 focus:border-primary outline-none" required />
                    <input type="email" placeholder="Email" className="bg-black border border-neutral-700 text-white rounded p-3 focus:border-primary outline-none" required />
                 </div>
                 <input type="text" placeholder="Assunto" className="w-full bg-black border border-neutral-700 text-white rounded p-3 focus:border-primary outline-none" required />
                 <textarea placeholder="A tua mensagem..." className="w-full bg-black border border-neutral-700 text-white rounded p-3 focus:border-primary outline-none h-32" required></textarea>
                 <button className="w-full bg-primary text-white font-bold py-4 rounded hover:bg-orange-700 transition uppercase tracking-widest">Enviar</button>
              </form>
           </div>
        </div>
      </section>

    </div>
  );
};


// --- MAIN APP COMPONENT ---

export default function App() {
  const [currentPage, setCurrentPage] = useState('home'); // 'home' covers all landing page sections
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
  const [isSignUp, setIsSignUp] = useState(false); 

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
      const responses = await Promise.all([
        supabase.from('news').select('*').order('created_at', { ascending: false }),
        supabase.from('matches').select('*').order('date', { ascending: true }),
        supabase.from('products').select('*'),
        supabase.from('partners').select('*'),
        supabase.from('teams').select('*'),
        supabase.from('gallery').select('*')
      ]);

      const [newsRes, matchesRes, prodRes, partRes, teamRes, galRes] = responses;
      const missingTableError = responses.find(r => r.error && r.error.code === '42P01');
      if (missingTableError) {
        setSetupNeeded(true);
        setLoading(false);
        return;
      }

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
    let finalEmail = email;
    if (!email.includes('@')) finalEmail = email + '@almaviseu.pt';

    if (isSignUp) {
        // ... (Registration logic if enabled)
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

  // --- ADMIN RENDERER ---
  // (Moved inside App to access state/methods easily without massive prop drilling)
  const renderAdmin = () => {
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
            await createItem(table, finalData);
            setIsAdding(false);
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
                <button onClick={() => setIsAdding(!isAdding)} className="bg-green-600 text-white px-3 py-1 rounded text-sm flex items-center gap-1">
                  <Plus size={16} /> Adicionar
                </button>
            </div>
            {isAdding && (
              <form onSubmit={handleSubmit} className="mb-6 p-4 bg-neutral-100 border rounded space-y-3">
                {fields.map(f => (
                  <div key={f.key}>
                    <label className="block text-xs font-bold uppercase text-neutral-500 mb-1">{f.label}</label>
                    {f.type === 'textarea' ? (
                      <textarea className="w-full border p-2 rounded" onChange={e => setFormData({...formData, [f.key]: e.target.value})} required={f.required} rows={3}/>
                    ) : f.type === 'image' ? (
                        <input type="file" accept="image/*" className="w-full" onChange={(e) => handleFileChange(f.key, e)} required={f.required} />
                    ) : (
                      <input type={f.type || 'text'} className="w-full border p-2 rounded" onChange={e => setFormData({...formData, [f.key]: e.target.value})} required={f.required} />
                    )}
                  </div>
                ))}
                <button disabled={uploading} className="bg-primary text-white px-4 py-2 rounded font-bold text-sm">
                  {uploading ? 'A enviar...' : 'Guardar'}
                </button>
              </form>
            )}
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-neutral-100">
                  <tr>{fields.slice(0, 3).map(f => <th key={f.key} className="p-2 text-left">{f.label}</th>)}<th className="p-2 w-20">Ações</th></tr>
                </thead>
                <tbody>
                  {data.map(item => (
                    <tr key={item.id} className="border-b hover:bg-neutral-50">
                      {fields.slice(0, 3).map(f => (
                        <td key={f.key} className="p-2 truncate max-w-[200px]">
                            {f.type === 'image' && item[f.key] ? <img src={item[f.key]} className="h-10 w-10 object-cover rounded" /> : item[f.key]?.toString()}
                        </td>
                      ))}
                      <td className="p-2"><button onClick={() => deleteItem(table, item.id)} className="text-red-600"><Trash size={16} /></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
    };

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
              {['noticias', 'jogos', 'loja', 'parceiros', 'equipas', 'galeria', 'definições'].map(tab => (
                <button key={tab} onClick={() => setAdminTab(tab)} className={`w-full text-left p-2 rounded capitalize font-medium ${adminTab === tab ? 'bg-primary text-white' : 'hover:bg-neutral-100 text-neutral-700'}`}>
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
              {adminTab === 'noticias' && <AdminList title="Gerir Notícias" data={news} table="news" fields={[{key: 'title', label: 'Título', required: true}, {key: 'content', label: 'Conteúdo', type: 'textarea'}, {key: 'image_url', label: 'Imagem', type: 'image'}]} />}
              {adminTab === 'jogos' && <AdminList title="Gerir Jogos" data={matches} table="matches" fields={[{key: 'home_team', label: 'Equipa Casa', required: true}, {key: 'guest_team', label: 'Equipa Fora', required: true}, {key: 'date', label: 'Data', type: 'datetime-local', required: true}, {key: 'location', label: 'Local'}, {key: 'category', label: 'Escalão'}, {key: 'score_home', label: 'Pontos Casa', type: 'number'}, {key: 'score_guest', label: 'Pontos Fora', type: 'number'}]} />}
              {adminTab === 'loja' && <AdminList title="Gerir Produtos" data={products} table="products" fields={[{key: 'name', label: 'Nome', required: true}, {key: 'price', label: 'Preço', type: 'number', required: true}, {key: 'description', label: 'Descrição'}, {key: 'image_url', label: 'Imagem', type: 'image'}]} />}
              {adminTab === 'parceiros' && <AdminList title="Gerir Parceiros" data={partners} table="partners" fields={[{key: 'name', label: 'Nome', required: true}, {key: 'website_url', label: 'Website'}, {key: 'logo_url', label: 'Logo', type: 'image'}]} />}
              {adminTab === 'equipas' && <AdminList title="Gerir Equipas" data={teams} table="teams" fields={[{key: 'name', label: 'Nome', required: true}, {key: 'category', label: 'Escalão'}, {key: 'description', label: 'Descrição', type: 'textarea'}, {key: 'image_url', label: 'Foto', type: 'image'}]} />}
              {adminTab === 'galeria' && <AdminList title="Gerir Fotos" data={gallery} table="gallery" fields={[{key: 'title', label: 'Título'}, {key: 'image_url', label: 'Imagem', type: 'image', required: true}]} />}
              {adminTab === 'definições' && <div className="p-4 bg-white rounded shadow text-neutral-500">Funcionalidades de sistema (Adicionar Admin / Reset DB) disponíveis no código original.</div>}
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    if (loading) return <div className="h-screen bg-black flex items-center justify-center"><Loader2 className="animate-spin text-primary" size={48} /></div>;
    if (setupNeeded) return <DatabaseSetupInstructions />;

    if (currentPage === 'admin' && session) return renderAdmin();

    if (currentPage === 'login') {
      return (
        <div className="min-h-screen flex items-center justify-center bg-neutral-900 px-4">
            <div className="bg-black border border-neutral-800 p-8 rounded-lg shadow-2xl w-full max-w-md">
              <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-white mb-1">Login Admin</h2>
                  <p className="text-xs text-neutral-500">Acesso reservado</p>
              </div>
              {loginError && <div className="p-3 rounded mb-4 text-sm bg-red-900/50 text-red-200 border border-red-700">{loginError}</div>}
              <form onSubmit={handleAuth} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-neutral-400 mb-1">Email</label>
                  <input type="text" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-neutral-900 border border-neutral-700 text-white p-3 rounded focus:border-primary outline-none" required />
                </div>
                <div>
                  <label className="block text-sm font-bold text-neutral-400 mb-1">Password</label>
                  <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-neutral-900 border border-neutral-700 text-white p-3 rounded focus:border-primary outline-none" required />
                </div>
                <button type="submit" className="w-full bg-primary text-white py-3 rounded font-bold hover:bg-orange-700 transition">Entrar</button>
              </form>
              <div className="mt-6 text-center border-t border-neutral-800 pt-4">
                <button onClick={() => setCurrentPage('home')} className="text-xs text-neutral-500 hover:text-white">Voltar ao site</button>
              </div>
            </div>
        </div>
      );
    }

    // LANDING PAGE (DEFAULT)
    return <LandingPage onNavigate={setCurrentPage} news={news} matches={matches} products={products} partners={partners} teams={teams} gallery={gallery} />;
  };

  return (
    <div className="flex flex-col min-h-screen font-sans">
      {/* Hide Navbar on Admin/Login pages generally, or keep it. Let's keep distinct nav for Admin */}
      {currentPage !== 'admin' && currentPage !== 'login' && <Navbar onNavigate={setCurrentPage} currentPage={currentPage} isAdmin={!!session} />}
      <main className="flex-grow">
        {renderContent()}
      </main>
      {currentPage !== 'admin' && currentPage !== 'login' && <Footer />}
    </div>
  );
}