
import React, { useState } from 'react';
import { Purchase } from '../types';
import { Plus, History, BookOpen, Package, User, DollarSign, Wallet, MapPin } from 'lucide-react';

interface PurchasesProps {
  purchases: Purchase[];
  onAdd: (p: Purchase) => void;
}

const Purchases: React.FC<PurchasesProps> = ({ purchases, onAdd }) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    bookName: '',
    writer: '',
    quantity: 1,
    purchasePrice: 0,
    sellingPrice: 0,
    shelfNumber: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.bookName || formData.quantity <= 0) return;

    onAdd({
      id: Date.now().toString(),
      bookName: formData.bookName,
      writer: formData.writer,
      quantity: Number(formData.quantity),
      purchasePricePerUnit: Number(formData.purchasePrice),
      sellingPricePerUnit: Number(formData.sellingPrice),
      totalAmount: Number(formData.quantity) * Number(formData.purchasePrice),
      date: new Date().toISOString(),
      shelfNumber: formData.shelfNumber
    });

    setFormData({ bookName: '', writer: '', quantity: 1, purchasePrice: 0, sellingPrice: 0, shelfNumber: '' });
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 outfit">Inventory Procurement</h2>
          <p className="text-sm text-slate-500">Add new items to the library shelves</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all hover:-translate-y-0.5"
        >
          {showForm ? <History size={20} /> : <Plus size={20} />}
          {showForm ? 'View History' : 'New Purchase'}
        </button>
      </div>

      {showForm ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-2xl mx-auto overflow-hidden animate-in zoom-in-95 duration-300">
          <div className="p-8 space-y-8">
            <div className="flex items-center gap-3 text-indigo-600">
              <div className="p-3 bg-indigo-50 rounded-xl"><Plus size={24} /></div>
              <h3 className="text-xl font-bold outfit">Purchase Order Details</h3>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                  <BookOpen size={14} /> Book Title
                </label>
                <input 
                  type="text" 
                  required
                  value={formData.bookName}
                  onChange={e => setFormData({...formData, bookName: e.target.value})}
                  placeholder="Enter full book name..."
                  className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                  <User size={14} /> Author Name
                </label>
                <input 
                  type="text" 
                  value={formData.writer}
                  onChange={e => setFormData({...formData, writer: e.target.value})}
                  placeholder="Writer/Artist"
                  className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                  <MapPin size={14} /> Shelf Number
                </label>
                <input 
                  type="text" 
                  value={formData.shelfNumber}
                  onChange={e => setFormData({...formData, shelfNumber: e.target.value})}
                  placeholder="e.g. A-101"
                  className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                  <Package size={14} /> Quantity
                </label>
                <input 
                  type="number" 
                  min="1"
                  required
                  value={formData.quantity}
                  onChange={e => setFormData({...formData, quantity: parseInt(e.target.value)})}
                  className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                  <Wallet size={14} /> Purchase Price (₹)
                </label>
                <input 
                  type="number" 
                  required
                  value={formData.purchasePrice}
                  onChange={e => setFormData({...formData, purchasePrice: parseFloat(e.target.value)})}
                  className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                  <DollarSign size={14} /> Selling Price (₹)
                </label>
                <input 
                  type="number" 
                  required
                  value={formData.sellingPrice}
                  onChange={e => setFormData({...formData, sellingPrice: parseFloat(e.target.value)})}
                  className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                />
              </div>

              <div className="md:col-span-2 pt-4">
                <button type="submit" className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all">
                  Submit Order - ₹{formData.quantity * formData.purchasePrice}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-[10px] uppercase tracking-widest text-slate-500 font-bold border-b border-slate-100">
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Book</th>
                <th className="px-6 py-4">Shelf</th>
                <th className="px-6 py-4 text-center">Qty</th>
                <th className="px-6 py-4 text-right">Unit Cost</th>
                <th className="px-6 py-4 text-right">Total Cost</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {purchases.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 text-xs font-medium text-slate-500">{new Date(p.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-slate-900 leading-none">{p.bookName}</p>
                    <p className="text-[10px] text-slate-400 uppercase mt-1">{p.writer}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-bold bg-slate-100 px-2 py-1 rounded">{p.shelfNumber || '-'}</span>
                  </td>
                  <td className="px-6 py-4 text-center text-sm font-semibold">{p.quantity}</td>
                  <td className="px-6 py-4 text-right text-sm">₹{p.purchasePricePerUnit}</td>
                  <td className="px-6 py-4 text-right text-sm font-bold text-slate-900">₹{p.totalAmount}</td>
                </tr>
              ))}
              {purchases.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-20 text-center text-slate-400">No purchase history found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Purchases;
