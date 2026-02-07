
import React from 'react';
import { 
  Users, 
  BookCopy, 
  TrendingUp, 
  Clock, 
  ChevronRight,
  ShoppingCart,
  DollarSign,
  AlertTriangle
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Book, Sale, Purchase } from '../types';

interface DashboardProps {
  books: Book[];
  sales: Sale[];
  purchases: Purchase[];
}

const Dashboard: React.FC<DashboardProps> = ({ books, sales, purchases }) => {
  const totalStock = books.reduce((acc, b) => acc + b.quantity, 0);
  const totalRevenue = sales.reduce((acc, s) => acc + s.totalAmount, 0);
  const recentSales = sales.slice(0, 5);
  const lowStockBooks = books.filter(b => b.quantity < 5);

  // Mock chart data
  const data = [
    { name: 'Mon', sales: 4000 },
    { name: 'Tue', sales: 3000 },
    { name: 'Wed', sales: 2000 },
    { name: 'Thu', sales: 2780 },
    { name: 'Fri', sales: 1890 },
    { name: 'Sat', sales: 2390 },
    { name: 'Sun', sales: 3490 },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Stock at Salman" 
          value={totalStock.toLocaleString()} 
          icon={<BookCopy className="text-blue-600" size={24} />}
          trend="+12% from last month"
          color="blue"
        />
        <StatCard 
          title="Sales Recorded" 
          value={sales.length.toLocaleString()} 
          icon={<ShoppingCart className="text-emerald-600" size={24} />}
          trend="+5.4% growth"
          color="emerald"
        />
        <StatCard 
          title="Total Revenue" 
          value={`₹${totalRevenue.toLocaleString()}`} 
          icon={<DollarSign className="text-amber-600" size={24} />}
          trend="Real-time tracking"
          color="amber"
        />
        <StatCard 
          title="Store Traffic" 
          value="452" 
          icon={<Users className="text-indigo-600" size={24} />}
          trend="+18% attendance"
          color="indigo"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="font-bold text-lg text-slate-800 outfit">Revenue Performance</h3>
              <p className="text-sm text-slate-500">Weekly tracking for Salman Book Center</p>
            </div>
            <select className="bg-slate-50 border-none rounded-lg text-xs font-semibold px-3 py-1.5">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="sales" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-lg text-slate-800 outfit">Critical Stock</h3>
            <span className="text-xs bg-red-50 text-red-600 px-2 py-1 rounded-full font-bold">{lowStockBooks.length} Alerts</span>
          </div>
          <div className="space-y-4">
            {lowStockBooks.length > 0 ? lowStockBooks.map((book) => (
              <div key={book.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-red-500 border border-red-100">
                    <AlertTriangle size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900 truncate max-w-[120px]">{book.name}</p>
                    <p className="text-[10px] text-slate-500 uppercase tracking-tighter">{book.writer}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-red-600">{book.quantity} left</p>
                </div>
              </div>
            )) : (
              <div className="text-center py-12">
                <p className="text-sm text-slate-400">All stock healthy ✨</p>
              </div>
            )}
            <button className="w-full mt-2 py-3 text-xs font-bold text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors">
              Go to Inventory
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Recent Activity - Now full width as category distribution is removed */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-lg text-slate-800 mb-6 outfit">Recent Sales at Salman</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-xs text-slate-400 uppercase tracking-wider">
                  <th className="pb-4 font-semibold">Book</th>
                  <th className="pb-4 font-semibold">Customer</th>
                  <th className="pb-4 font-semibold">Amount</th>
                  <th className="pb-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentSales.map((sale) => (
                  <tr key={sale.id} className="group hover:bg-slate-50 transition-colors">
                    <td className="py-4">
                      <p className="text-sm font-semibold text-slate-900">{sale.bookName}</p>
                      <p className="text-[10px] text-slate-500">{sale.date.split('T')[0]}</p>
                    </td>
                    <td className="py-4 text-sm text-slate-600">{sale.customerName}</td>
                    <td className="py-4 text-sm font-bold text-indigo-600">₹{sale.totalAmount}</td>
                    <td className="py-4">
                      <span className="px-2 py-1 bg-emerald-50 text-emerald-600 rounded-md text-[10px] font-bold">PAID</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ title: string, value: string, icon: React.ReactNode, trend: string, color: string }> = ({ title, value, icon, trend, color }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group">
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 rounded-xl bg-${color}-50 group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <div className="text-[10px] font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded-full uppercase">
        Live
      </div>
    </div>
    <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
    <p className="text-2xl font-bold text-slate-900 outfit">{value}</p>
    <div className="mt-4 pt-4 border-t border-slate-50 flex items-center gap-2">
      <TrendingUp size={14} className="text-emerald-500" />
      <span className="text-[10px] text-slate-400 font-medium">{trend}</span>
    </div>
  </div>
);

export default Dashboard;
