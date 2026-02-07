
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  BadgeDollarSign, 
  BarChart3, 
  BrainCircuit,
  Plus,
  Search,
  BookOpen,
  Menu,
  X,
  Bell,
  ChevronRight,
  TrendingUp,
  AlertTriangle,
  Monitor
} from 'lucide-react';
import { ViewType, Book, Purchase, Sale } from './types';
import Dashboard from './components/Dashboard';
import Inventory from './components/Inventory';
import Purchases from './components/Purchases';
import Sales from './components/Sales';
import Reports from './components/Reports';
import AIAssistant from './components/AIAssistant';

const INITIAL_BOOKS: Book[] = [
  { id: '1', name: 'The Great Gatsby', writer: 'F. Scott Fitzgerald', quantity: 15, purchasePrice: 200, sellingPrice: 350, category: 'Fiction', shelfNumber: 'A-101' },
  { id: '2', name: 'Atomic Habits', writer: 'James Clear', quantity: 5, purchasePrice: 300, sellingPrice: 450, category: 'Self-Help', shelfNumber: 'B-205' },
  { id: '3', name: 'Clean Code', writer: 'Robert C. Martin', quantity: 2, purchasePrice: 1200, sellingPrice: 1800, category: 'Technology', shelfNumber: 'C-302' },
];

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<ViewType>('dashboard');
  const [books, setBooks] = useState<Book[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    const savedBooks = localStorage.getItem('salman_books');
    const savedPurchases = localStorage.getItem('salman_purchases');
    const savedSales = localStorage.getItem('salman_sales');

    if (savedBooks) setBooks(JSON.parse(savedBooks));
    else setBooks(INITIAL_BOOKS);

    if (savedPurchases) setPurchases(JSON.parse(savedPurchases));
    if (savedSales) setSales(JSON.parse(savedSales));
  }, []);

  useEffect(() => {
    localStorage.setItem('salman_books', JSON.stringify(books));
    localStorage.setItem('salman_purchases', JSON.stringify(purchases));
    localStorage.setItem('salman_sales', JSON.stringify(sales));
  }, [books, purchases, sales]);

  const handleAddPurchase = (newPurchase: Purchase) => {
    setPurchases(prev => [newPurchase, ...prev]);
    setBooks(prev => {
      const existing = prev.find(b => b.name.toLowerCase() === newPurchase.bookName.toLowerCase());
      if (existing) {
        return prev.map(b => b.id === existing.id ? {
          ...b,
          quantity: b.quantity + newPurchase.quantity,
          purchasePrice: newPurchase.purchasePricePerUnit,
          sellingPrice: newPurchase.sellingPricePerUnit,
          shelfNumber: newPurchase.shelfNumber || b.shelfNumber
        } : b);
      } else {
        return [...prev, {
          id: Date.now().toString(),
          name: newPurchase.bookName,
          writer: newPurchase.writer,
          quantity: newPurchase.quantity,
          purchasePrice: newPurchase.purchasePricePerUnit,
          sellingPrice: newPurchase.sellingPricePerUnit,
          category: 'General',
          shelfNumber: newPurchase.shelfNumber
        }];
      }
    });
  };

  const handleRecordSale = (newSale: Sale) => {
    setSales(prev => [newSale, ...prev]);
    setBooks(prev => prev.map(b => 
      b.name === newSale.bookName ? { ...b, quantity: b.quantity - newSale.quantity } : b
    ));
  };

  const handleDeleteBook = (id: string) => {
    if (window.confirm('Are you sure you want to delete this book from inventory?')) {
      setBooks(prev => prev.filter(b => b.id !== id));
    }
  };

  const handleUpdateBook = (updatedBook: Book) => {
    setBooks(prev => prev.map(b => b.id === updatedBook.id ? updatedBook : b));
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'purchases', label: 'Purchases', icon: ShoppingCart },
    { id: 'inventory', label: 'Inventory', icon: Package },
    { id: 'sales', label: 'Sales', icon: BadgeDollarSign },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'ai-assistant', label: 'AI Insights', icon: BrainCircuit, color: 'text-indigo-600' },
  ];

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard': return <Dashboard books={books} sales={sales} purchases={purchases} />;
      case 'inventory': return <Inventory books={books} onDelete={handleDeleteBook} onUpdate={handleUpdateBook} />;
      case 'purchases': return <Purchases purchases={purchases} onAdd={handleAddPurchase} />;
      case 'sales': return <Sales sales={sales} books={books} onAdd={handleRecordSale} />;
      case 'reports': return <Reports books={books} sales={sales} purchases={purchases} />;
      case 'ai-assistant': return <AIAssistant data={{ books, sales, purchases }} />;
      default: return <Dashboard books={books} sales={sales} purchases={purchases} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-100 p-0 md:p-4">
      <div className="flex flex-1 bg-white rounded-none md:rounded-[2.5rem] shadow-2xl border border-slate-200 overflow-hidden ring-8 ring-slate-100/50">
        {/* Sidebar */}
        <aside className={`bg-slate-50 border-r border-slate-200 transition-all duration-300 flex flex-col ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
          <div className="p-8 flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-100 ring-4 ring-indigo-50">
              <BookOpen size={20} />
            </div>
            {isSidebarOpen && <span className="font-black text-lg tracking-tight text-slate-800 outfit">Salman Books</span>}
          </div>

          <nav className="flex-1 px-4 space-y-2 mt-4">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id as ViewType)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 ${
                  activeView === item.id 
                  ? 'bg-white text-indigo-700 font-bold shadow-sm border border-slate-200 ring-2 ring-slate-100' 
                  : 'text-slate-500 hover:bg-white/50 hover:text-slate-700'
                }`}
              >
                <div className={`${activeView === item.id ? 'scale-110' : ''} transition-transform`}>
                  <item.icon size={20} className={item.color || ''} />
                </div>
                {isSidebarOpen && <span className="text-sm">{item.label}</span>}
              </button>
            ))}
          </nav>

          <div className="p-6 border-t border-slate-200/50">
            <div className={`flex items-center gap-3 bg-white p-3 rounded-2xl border border-slate-100 shadow-sm transition-all ${!isSidebarOpen && 'justify-center'}`}>
              <div className="w-8 h-8 rounded-full bg-slate-200 shrink-0 overflow-hidden">
                <img src="https://picsum.photos/40/40?random=1" alt="User" className="w-full h-full object-cover" />
              </div>
              {isSidebarOpen && (
                <div className="truncate">
                  <p className="text-[10px] font-black uppercase text-slate-400 leading-none mb-1">Store Admin</p>
                  <p className="text-xs font-bold text-slate-700 truncate">Salman Admin</p>
                </div>
              )}
            </div>
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="mt-4 w-full flex items-center justify-center p-3 rounded-xl text-slate-400 hover:bg-white hover:text-slate-600 transition-colors"
            >
              {isSidebarOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col bg-slate-50/30">
          <header className="h-20 px-8 flex items-center justify-between sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-100">
            <div className="flex items-center gap-4">
              <div className="p-2.5 bg-slate-100 rounded-xl text-slate-400">
                <Monitor size={18} />
              </div>
              <div>
                <h1 className="text-lg font-black text-slate-800 capitalize outfit leading-none tracking-tight">
                  {activeView.replace('-', ' ')}
                </h1>
                <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mt-1">Salman Book Center v1.4</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
               <div className="hidden lg:flex items-center gap-2 bg-slate-100/50 px-4 py-2 rounded-2xl border border-slate-100">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                  <span className="text-[10px] font-black text-slate-500 uppercase">Live Database</span>
               </div>
               <button className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-indigo-600 shadow-sm transition-all hover:scale-105 active:scale-95">
                 <Bell size={20} />
               </button>
            </div>
          </header>

          <div className="p-10 overflow-y-auto flex-1 scrollbar-hide">
            <div className="max-w-[1400px] mx-auto">
               {renderContent()}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
