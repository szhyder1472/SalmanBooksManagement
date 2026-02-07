
import React, { useState } from 'react';
import { Book } from '../types';
import { Search, Filter, Camera, Scan, Edit3, Trash2, ChevronDown, X, Save, MapPin } from 'lucide-react';

interface InventoryProps {
  books: Book[];
  onDelete: (id: string) => void;
  onUpdate: (updatedBook: Book) => void;
}

const Inventory: React.FC<InventoryProps> = ({ books, onDelete, onUpdate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingBook, setEditingBook] = useState<Book | null>(null);

  const filteredBooks = books.filter(b => 
    b.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    b.writer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (b.shelfNumber && b.shelfNumber.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingBook) {
      onUpdate(editingBook);
      setEditingBook(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
        <div className="p-8 border-b border-slate-100 flex flex-col xl:flex-row xl:items-center justify-between gap-6 bg-gradient-to-br from-white to-slate-50/50">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 outfit flex items-center gap-3">
              Inventory Vault
              <span className="text-xs bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full">{books.length} Books</span>
            </h2>
            <p className="text-sm text-slate-500 mt-1">Real-time tracking of your entire literary collection</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Search by title, author, or shelf..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-6 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 w-full md:w-80 shadow-sm transition-all outline-none"
              />
            </div>
            <button className="flex items-center gap-2 px-5 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm">
              <Filter size={18} className="text-slate-400" />
              Sort
              <ChevronDown size={14} className="text-slate-300" />
            </button>
            <button className="flex items-center gap-2 px-5 py-3 bg-indigo-600 text-white rounded-2xl text-sm font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 active:scale-95 transition-all">
              <Camera size={18} />
              Scan ISBN
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 text-[10px] uppercase tracking-[0.2em] text-slate-400 font-black border-b border-slate-100">
                <th className="px-8 py-5">Book Identification</th>
                <th className="px-8 py-5">Shelf Location</th>
                <th className="px-8 py-5 text-center">Availability</th>
                <th className="px-8 py-5 text-right">Market Price</th>
                <th className="px-8 py-5 text-center">Vitality</th>
                <th className="px-8 py-5 text-right">Controls</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBooks.map((book) => (
                <tr key={book.id} className="group hover:bg-indigo-50/30 transition-all">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl flex items-center justify-center text-white font-black text-lg shadow-md group-hover:rotate-6 transition-transform">
                        {book.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors leading-tight">{book.name}</p>
                        <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5 font-medium">
                          by <span className="text-slate-700">{book.writer}</span>
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 text-slate-600">
                      <MapPin size={14} className="text-indigo-400" />
                      <span className="font-bold text-sm bg-slate-100 px-3 py-1 rounded-lg">
                        {book.shelfNumber || 'Not Set'}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <span className="text-lg font-black text-slate-800 tabular-nums">{book.quantity}</span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex flex-col items-end">
                      <span className="text-base font-black text-indigo-600 tabular-nums">₹{book.sellingPrice}</span>
                      <span className="text-[10px] text-slate-400 line-through">₹{book.purchasePrice}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <StatusBadge quantity={book.quantity} />
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => setEditingBook(book)}
                        className="w-10 h-10 flex items-center justify-center bg-white border border-slate-200 text-slate-400 hover:text-indigo-600 hover:border-indigo-200 rounded-xl transition-all shadow-sm"
                      >
                        <Edit3 size={18} />
                      </button>
                      <button 
                        onClick={() => onDelete(book.id)}
                        className="w-10 h-10 flex items-center justify-center bg-white border border-slate-200 text-slate-400 hover:text-red-600 hover:border-red-200 rounded-xl transition-all shadow-sm"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredBooks.length === 0 && (
            <div className="py-32 text-center bg-slate-50/20">
              <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center mx-auto mb-6 text-slate-200 shadow-inner border border-slate-100">
                <Scan size={48} strokeWidth={1} />
              </div>
              <h3 className="text-lg font-bold text-slate-800 outfit">Empty Shelves</h3>
              <p className="text-slate-400 text-sm max-w-xs mx-auto mt-2">We couldn't find any books matching your criteria. Try adjusting your filters.</p>
            </div>
          )}
        </div>
        <div className="px-8 py-6 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest italic">
            Synchronized with Local Database
          </p>
          <div className="flex gap-3">
             <button className="px-5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-50 disabled:opacity-30 shadow-sm transition-all">Previous</button>
             <button className="px-5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-sm transition-all">Next</button>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {editingBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[2.5rem] w-full max-w-lg shadow-2xl border border-white/20 overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-indigo-600 to-violet-700 text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md">
                  <Edit3 size={20} />
                </div>
                <h3 className="text-xl font-bold outfit">Edit Book Details</h3>
              </div>
              <button onClick={() => setEditingBook(null)} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleEditSubmit} className="p-8 space-y-5">
              <div className="space-y-1">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Book Title</label>
                <input 
                  type="text" 
                  value={editingBook.name}
                  onChange={e => setEditingBook({...editingBook, name: e.target.value})}
                  className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-medium"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Author Name</label>
                  <input 
                    type="text" 
                    value={editingBook.writer}
                    onChange={e => setEditingBook({...editingBook, writer: e.target.value})}
                    className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-medium"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Shelf Number</label>
                  <input 
                    type="text" 
                    value={editingBook.shelfNumber || ''}
                    onChange={e => setEditingBook({...editingBook, shelfNumber: e.target.value})}
                    placeholder="e.g. A-101"
                    className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-medium"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Stock Quantity</label>
                  <input 
                    type="number" 
                    value={editingBook.quantity}
                    onChange={e => setEditingBook({...editingBook, quantity: parseInt(e.target.value)})}
                    className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-medium"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Category</label>
                  <input 
                    type="text" 
                    value={editingBook.category}
                    onChange={e => setEditingBook({...editingBook, category: e.target.value})}
                    className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-medium"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Cost Price (₹)</label>
                  <input 
                    type="number" 
                    value={editingBook.purchasePrice}
                    onChange={e => setEditingBook({...editingBook, purchasePrice: parseFloat(e.target.value)})}
                    className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-medium"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Sale Price (₹)</label>
                  <input 
                    type="number" 
                    value={editingBook.sellingPrice}
                    onChange={e => setEditingBook({...editingBook, sellingPrice: parseFloat(e.target.value)})}
                    className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-medium"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button 
                  type="button" 
                  onClick={() => setEditingBook(null)}
                  className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all active:scale-95"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-2 flex items-center justify-center gap-2 py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95 px-8"
                >
                  <Save size={20} />
                  Update Book
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const StatusBadge: React.FC<{ quantity: number }> = ({ quantity }) => {
  if (quantity === 0) return (
    <span className="px-3 py-1.5 bg-red-50 text-red-600 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm border border-red-100">
      CRITICAL
    </span>
  );
  if (quantity < 10) return (
    <span className="px-3 py-1.5 bg-amber-50 text-amber-600 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm border border-amber-100">
      RESTOCK
    </span>
  );
  return (
    <span className="px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm border border-emerald-100">
      HEALTHY
    </span>
  );
};

export default Inventory;
