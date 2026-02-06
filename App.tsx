import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { supabase } from './lib/supabase';
import { Product, SiteContent, NewsItem, Match, Partner, Team, GalleryItem } from './types';
import { ShoppingBag, X, Calendar, MapPin, ChevronRight } from 'lucide-react';

// DynamicSection Component
const DynamicSection = ({ id, content, defaultClass, defaultTitle, children }: { id: string, content?: SiteContent, defaultClass?: string, defaultTitle: string, children?: React.ReactNode }) => {
  const bgImage = content?.image_url ? `url(${content.image_url})` : undefined;
  
  return (
    <section id={id} className={`py-20 px-4 relative ${defaultClass || ''}`} style={{ backgroundImage: bgImage, backgroundSize: 'cover', backgroundPosition: 'center' }}>
      {bgImage && <div className="absolute inset-0 bg-black/70"></div>}
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="text-center mb-16">
           <h2 className="text-4xl md:text-5xl font-black italic tracking-tighter mb-4 text-primary uppercase">{content?.title || defaultTitle}</h2>
           {content?.subtitle && <p className="text-xl text-gray-300 max-w-2xl mx-auto">{content.subtitle}</p>}
        </div>
        {children}
      </div>
    </section>
  );
};

// Modal Component
const Modal = ({ isOpen, onClose, item, type }: { isOpen: boolean, onClose: () => void, item: any, type: string }) => {
  if (!isOpen || !item) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-neutral-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative border border-neutral-800" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-white hover:text-primary z-10 p-2 bg-black/50 rounded-full"><X size={24} /></button>
        <div className="grid md:grid-cols-2 gap-0">
          <div className="h-64 md:h-full min-h-[300px] relative">
            <img src={item.image_url || `https://picsum.photos/seed/${item.id}/800/800`} alt={item.title || item.name} className="absolute inset-0 w-full h-full object-cover" />
          </div>
          <div className="p-8">
            <h3 className="text-3xl font-bold text-white mb-2">{item.title || item.name}</h3>
            {item.price && <div className="text-2xl font-bold text-primary mb-6">{item.price.toFixed(2)} €</div>}
            <div className="prose prose-invert max-w-none text-gray-300">
               {item.description ? <div dangerouslySetInnerHTML={{__html: item.description}} /> : <p>{item.content}</p>}
            </div>
            {type === 'product' && (
              <button className="mt-8 w-full bg-primary text-white py-4 rounded-xl font-bold text-lg hover:bg-orange-700 transition flex items-center justify-center gap-3">
                <ShoppingBag /> Encomendar agora
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [isAdmin, setIsAdmin] = useState(false);
  
  // Data States
  const [products, setProducts] = useState<Product[]>([]);
  const [siteContent, setSiteContent] = useState<Record<string, SiteContent>>({});
  
  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [modalType, setModalType] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      // Fetch Products
      const { data: prodData } = await supabase.from('products').select('*');
      if (prodData) setProducts(prodData);

      // Fetch Site Content
      const { data: contentData } = await supabase.from('site_content').select('*');
      if (contentData) {
        const contentMap = contentData.reduce((acc: any, item: any) => {
          acc[item.section] = item;
          return acc;
        }, {});
        setSiteContent(contentMap);
      }
    };

    fetchData();
  }, []);

  const openModal = (items: any[], index: number, type: string) => {
    setSelectedItem(items[index]);
    setModalType(type);
    setModalOpen(true);
  };

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-primary selection:text-white">
      <Navbar onNavigate={handleNavigate} currentPage={currentPage} isAdmin={isAdmin} />
      
      <main>
        {currentPage === 'home' && (
          <>
             {/* Hero Section */}
             <div id="home" className="h-screen relative flex items-center justify-center bg-neutral-900">
                <div className="absolute inset-0 overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?q=80&w=2000&auto=format&fit=crop" className="w-full h-full object-cover opacity-40" alt="Volleyball" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                </div>
                <div className="relative z-10 text-center px-4">
                  <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter text-white mb-6 drop-shadow-2xl">ALMA <span className="text-primary">VISEU</span></h1>
                  <p className="text-xl md:text-2xl text-gray-300 font-light max-w-2xl mx-auto drop-shadow-lg">Mais do que um clube, uma família. Unidos pela paixão do voleibol.</p>
                </div>
             </div>

             {/* News Section */}
             <DynamicSection id="news" content={siteContent['news']} defaultClass="bg-neutral-900" defaultTitle="Últimas Notícias">
                <div className="text-center text-gray-500 py-10">
                   <p>Notícias em breve...</p>
                </div>
             </DynamicSection>

             {/* Calendar Section */}
             <DynamicSection id="calendar" content={siteContent['calendar']} defaultClass="bg-black" defaultTitle="Próximos Jogos">
                <div className="text-center text-gray-500 py-10">
                   <p>Calendário em breve...</p>
                </div>
             </DynamicSection>

             {/* Teams Section */}
             <DynamicSection id="teams" content={siteContent['teams']} defaultClass="bg-neutral-900" defaultTitle="As Nossas Equipas">
                <div className="text-center text-gray-500 py-10">
                   <p>Equipas em breve...</p>
                </div>
             </DynamicSection>

             {/* SHOP SECTION */}
             <DynamicSection id="shop" content={siteContent['shop']} defaultClass="bg-black text-white" defaultTitle="Loja Oficial">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {products.map((p, index) => (
                    <div 
                      key={p.id} 
                      className="bg-neutral-900 rounded-xl overflow-hidden group border border-neutral-800 hover:border-primary transition duration-300 cursor-pointer"
                      onClick={() => openModal(products, index, 'product')}
                    >
                      <div className="h-48 overflow-hidden relative p-3 bg-neutral-800">
                        <img src={p.image_url || `https://picsum.photos/seed/${p.id}/400/400`} alt={p.name} className="w-full h-full object-cover rounded-lg transition transform group-hover:scale-105" />
                        <div className="absolute top-3 right-3 bg-primary text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">{p.price.toFixed(2)} €</div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold text-base text-white mb-1">{p.name}</h3>
                        <div className="text-neutral-500 text-xs mb-3 line-clamp-2" dangerouslySetInnerHTML={{__html: p.description}}></div>
                        <button className="w-full bg-white text-black py-2 rounded font-bold text-sm hover:bg-primary hover:text-white transition flex items-center justify-center gap-2">
                          <ShoppingBag size={14} /> Encomendar
                        </button>
                      </div>
                    </div>
                  ))}
                  {products.length === 0 && <p className="col-span-4 text-center text-neutral-500">A carregar loja...</p>}
                </div>
             </DynamicSection>

             {/* Partners Section */}
             <DynamicSection id="partners" content={siteContent['partners']} defaultClass="bg-neutral-900" defaultTitle="Parceiros">
                 <div className="text-center text-gray-500 py-10">
                   <p>Parceiros em breve...</p>
                </div>
             </DynamicSection>
             
             {/* Photos Section */}
             <DynamicSection id="photos" content={siteContent['photos']} defaultClass="bg-black" defaultTitle="Galeria">
                 <div className="text-center text-gray-500 py-10">
                   <p>Fotos em breve...</p>
                </div>
             </DynamicSection>

             {/* Contacts Section */}
             <section id="contacts" className="py-20 bg-neutral-900">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h2 className="text-4xl font-black italic text-primary mb-8 uppercase">Contacta-nos</h2>
                    <p className="text-gray-300">Entra em contacto connosco para mais informações.</p>
                </div>
             </section>
          </>
        )}

        {currentPage === 'about' && (
          <div className="pt-32 pb-20 px-4 max-w-4xl mx-auto min-h-screen">
             <h1 className="text-5xl font-black italic text-primary mb-8 uppercase">Quem Somos</h1>
             <div className="prose prose-invert prose-lg">
                <p>O <strong>ALMA VISEU</strong> é um projeto nascido da paixão pelo voleibol e do desejo de criar uma referência na formação desportiva em Viseu.</p>
                <p>Fundado em 2022, o nosso clube tem crescido sustentadamente, apostando na formação de atletas não só a nível técnico e tático, mas também humano e social.</p>
             </div>
          </div>
        )}

        {currentPage === 'login' && (
           <div className="pt-24 min-h-screen flex items-center justify-center p-4">
             <div className="bg-neutral-900 p-8 rounded-xl border border-neutral-800 w-full max-w-md shadow-2xl">
               <h2 className="text-2xl font-bold mb-6 text-center text-white">Login Admin</h2>
               <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
                    <input type="email" className="w-full bg-black border border-gray-800 rounded p-2 text-white focus:border-primary focus:outline-none" placeholder="admin@almaviseu.pt" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Password</label>
                    <input type="password" className="w-full bg-black border border-gray-800 rounded p-2 text-white focus:border-primary focus:outline-none" placeholder="••••••••" />
                  </div>
                  <button onClick={() => { setIsAdmin(true); setCurrentPage('home'); }} className="w-full bg-primary text-white py-2 rounded font-bold hover:bg-orange-700 transition">Entrar</button>
               </div>
             </div>
           </div>
        )}

        {currentPage === 'admin' && isAdmin && (
           <div className="pt-32 p-8 min-h-screen">
              <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-10">
                    <h1 className="text-4xl font-bold text-white">Painel de Administração</h1>
                    <button onClick={() => { setIsAdmin(false); setCurrentPage('home'); }} className="bg-red-600 text-white px-4 py-2 rounded font-bold hover:bg-red-700">Sair</button>
                </div>
                <div className="bg-neutral-900 p-8 rounded-xl border border-neutral-800">
                    <p className="text-gray-400">Funcionalidades de administração em desenvolvimento.</p>
                </div>
              </div>
           </div>
        )}
      </main>
      
      <Footer />
      
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} item={selectedItem} type={modalType} />
    </div>
  );
}

export default App;