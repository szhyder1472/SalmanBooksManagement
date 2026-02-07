
import React, { useState, useRef, useEffect } from 'react';
import { Sale, Book } from '../types';
import { BadgeDollarSign, User, Phone, BookOpen, Hash, Tag, Search, Check, AlertCircle, MapPin } from 'lucide-react';

interface SalesProps {
  sales: Sale[];
  books: Book[];
  onAdd: (s: Sale) => void;
}

const Sales: React.FC<SalesProps> = ({ sales, books, onAdd }) => {
  const [formData, setFormData] = useState({
    bookName: '',
    customerName: '',
    mobile: '',
    quantity: 1
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionRef = useRef<HTMLDivElement>(null);

  const selectedBook = books.find(b => b.name === formData.bookName);

  // Filter books based on search term (including shelf search)
  const filteredBooks = books.filter(b => 
    b.quantity > 0 && 
    (b.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
     b.writer.toLowerCase().includes(searchTerm.toLowerCase()) ||
     (b.shelfNumber && b.shelfNumber.toLowerCase().includes(searchTerm.toLowerCase())))
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionRef.current && !suggestionRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectBook = (book: Book) => {
    setFormData({ ...formData, bookName: book.name });
    setSearchTerm(book.name);
    setShowSuggestions(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBook || selectedBook.quantity < formData.quantity) return;

    onAdd({
      id: Date.now().toString(),
      bookName: formData.bookName,
      customerName: formData.customerName || 'Walk-in Customer',
      mobileNumber: formData.mobile || 'N/A',
      quantity: Number(formData.quantity),
      pricePerUnit: selectedBook.sellingPrice,
      totalAmount: Number(formData.quantity) * selectedBook.sellingPrice,
      date: new Date().toISOString()
    });

    setFormData({ bookName: '', customerName: '', mobile: '', quantity: 1 });
    setSearchTerm('');
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
      <div className="xl:col-span-1 space-y-6">
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm animate-in fade-in slide-in-from-left-4">
          <div className="flex items-center gap-3 text-indigo-600 mb-8">
            <div className="p-3 bg-indigo-50 rounded-xl"><BadgeDollarSign size={24} /></div>
            <h3 className="text-xl font-bold outfit">New Transaction</h3>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1 relative" ref={suggestionRef}>
              <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                <BookOpen size={14} /> Search Book / Shelf
              </label>
              <div className="relative">
                <input 
                  type="text" 
                  autoComplete="off"
                  placeholder="Enter book name or shelf..."
                  value={searchTerm}
                  onFocus={() => setShowSuggestions(true)}
                  onChange={e => {
                    setSearchTerm(e.target.value);
                    setShowSuggestions(true);
                    if (formData.bookName !== e.target.value) {
                      setFormData({ ...formData, bookName: '' });
                    }
                  }}
                  className={`w-full px-4 py-3 bg-slate-50 border-2 rounded-xl focus:ring-4 focus:ring-indigo-500/10 outline-none text-sm transition-all ${
                    selectedBook ? 'border-emerald-100 bg-emerald-50/20' : 'border-transparent'
                  }`}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  {selectedBook ? (
                    <Check size={18} className="text-emerald-500" />
                  ) : (
                    <Search size={18} className="text-slate-300" />
                  )}
                </div>
              </div>

              {showSuggestions && (searchTerm.length > 0 || books.length > 0) && (
                <div className="absolute z-50 left-0 right-0 mt-2 bg-white border border-slate-200 rounded-2xl shadow-2xl max-h-80 overflow-y-auto scrollbar-hide animate-in fade-in slide-in-from-top-2">
                  {filteredBooks.length > 0 ? (
                    filteredBooks.map(book => (
                      <button
                        key={book.id}
                        type="button"
                        onClick={() => handleSelectBook(book)}
                        className="w-full text-left px-4 py-3 hover:bg-indigo-50 flex items-center justify-between border-b border-slate-50 last:border-0 transition-colors"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-bold text-slate-800 leading-tight">{book.name}</p>
                            {book.shelfNumber && (
                              <span className="flex items-center gap-1 px-1.5 py-0.5 bg-indigo-50 text-indigo-600 rounded text-[9px] font-black uppercase">
                                <MapPin size={8} /> Shelf: {book.shelfNumber}
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-tight">{book.writer}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] font-black text-indigo-500">{book.quantity} IN STOCK</p>
                          <p className="text-xs font-bold text-slate-700">₹{book.sellingPrice}</p>
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="p-8 text-center">
                      <p className="text-sm text-slate-400">No books found matching "{searchTerm}"</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                <User size={14} /> Customer Name (Optional)
              </label>
              <input 
                type="text" 
                value={formData.customerName}
                onChange={e => setFormData({...formData, customerName: e.target.value})}
                placeholder="Walk-in Customer"
                className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                <Phone size={14} /> Mobile Number (Optional)
              </label>
              <input 
                type="text" 
                value={formData.mobile}
                onChange={e => setFormData({...formData, mobile: e.target.value})}
                placeholder="9876543210"
                className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                  <Hash size={14} /> Qty
                </label>
                <input 
                  type="number" 
                  min="1"
                  max={selectedBook?.quantity || 1}
                  required
                  value={formData.quantity}
                  onChange={e => setFormData({...formData, quantity: parseInt(e.target.value) || 0})}
                  className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                  <Tag size={14} /> Price
                </label>
                <div className="w-full px-4 py-3 bg-slate-100 border-none rounded-xl text-sm font-bold text-slate-900">
                  ₹{selectedBook?.sellingPrice || 0}
                </div>
              </div>
            </div>

            <div className="pt-4">
              {selectedBook && formData.quantity > selectedBook.quantity && (
                <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-xl text-xs flex items-center gap-2 animate-in fade-in">
                  <AlertCircle size={14} />
                  Insufficient stock! Only {selectedBook.quantity} available.
                </div>
              )}
              
              <div className="flex items-center justify-between mb-4 px-2">
                <span className="text-sm font-medium text-slate-500">Total Payable:</span>
                <span className="text-xl font-bold text-indigo-600 outfit">₹{selectedBook ? selectedBook.sellingPrice * formData.quantity : 0}</span>
              </div>
              <button 
                type="submit" 
                disabled={!selectedBook || formData.quantity < 1 || formData.quantity > selectedBook.quantity}
                className="w-full py-4 bg-emerald-600 text-white rounded-xl font-bold shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition-all disabled:opacity-50 disabled:bg-slate-300 active:scale-95"
              >
                Complete Sale
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="xl:col-span-2">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-right-4">
          <div className="p-6 border-b border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 outfit">Daily Sales History</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 text-[10px] uppercase tracking-widest text-slate-500 font-bold border-b border-slate-100">
                  <th className="px-6 py-4">Invoice #</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Book</th>
                  <th className="px-6 py-4 text-center">Qty</th>
                  <th className="px-6 py-4 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sales.map((s, idx) => (
                  <tr key={s.id} className="hover:bg-slate-50/50">
                    <td className="px-6 py-4 text-xs font-bold text-slate-400">INV-{idx + 1024}</td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-slate-900 leading-none">{s.customerName}</p>
                      <p className="text-[10px] text-slate-400 mt-1">{s.mobileNumber}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{s.bookName}</td>
                    <td className="px-6 py-4 text-center text-sm">{s.quantity}</td>
                    <td className="px-6 py-4 text-right text-sm font-bold text-emerald-600">₹{s.totalAmount}</td>
                  </tr>
                ))}
                {sales.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-20 text-center text-slate-400">No sales recorded yet today</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sales;
