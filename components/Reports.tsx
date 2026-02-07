
import React from 'react';
import { Book, Sale, Purchase } from '../types';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { TrendingUp, Target, Zap } from 'lucide-react';

interface ReportsProps {
  books: Book[];
  sales: Sale[];
  purchases: Purchase[];
}

const Reports: React.FC<ReportsProps> = ({ books, sales, purchases }) => {
  const totalRevenue = sales.reduce((acc, s) => acc + s.totalAmount, 0);
  const totalInvestment = purchases.reduce((acc, p) => acc + p.totalAmount, 0);
  const totalProfit = totalRevenue - totalInvestment;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ReportSummaryCard 
          title="Gross Revenue" 
          value={`₹${totalRevenue.toLocaleString()}`} 
          percentage="+14.2%" 
          isPositive={true} 
          icon={<TrendingUp size={24} />}
        />
        <ReportSummaryCard 
          title="Total Investment" 
          value={`₹${totalInvestment.toLocaleString()}`} 
          percentage="+2.4%" 
          isPositive={false} 
          icon={<Zap size={24} />}
        />
        <ReportSummaryCard 
          title="Net Profit/Loss" 
          value={`₹${totalProfit.toLocaleString()}`} 
          percentage={totalProfit >= 0 ? "+8.5%" : "-3.2%"} 
          isPositive={totalProfit >= 0} 
          icon={<Target size={24} />}
        />
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h3 className="font-bold text-lg text-slate-800 mb-8 outfit">Profit Analysis (Monthly)</h3>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={[
              { month: 'Jan', revenue: 4000, profit: 2400 },
              { month: 'Feb', revenue: 3000, profit: 1398 },
              { month: 'Mar', revenue: 2000, profit: 9800 },
              { month: 'Apr', revenue: 2780, profit: 3908 },
            ]}>
              <XAxis dataKey="month" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
              />
              <Legend verticalAlign="top" align="right" />
              <Bar dataKey="revenue" fill="#e2e8f0" radius={[4, 4, 0, 0]} barSize={40} />
              <Bar dataKey="profit" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

const ReportSummaryCard: React.FC<{ title: string, value: string, percentage: string, isPositive: boolean, icon: React.ReactNode }> = ({ title, value, percentage, isPositive, icon }) => (
  <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group">
    <div className={`absolute -right-4 -bottom-4 w-32 h-32 opacity-5 rounded-full ${isPositive ? 'bg-emerald-500' : 'bg-red-500'} group-hover:scale-110 transition-transform duration-500`}></div>
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-xl ${isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
        {icon}
      </div>
      <span className={`text-xs font-bold px-2 py-1 rounded-full ${isPositive ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
        {percentage}
      </span>
    </div>
    <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
    <p className="text-3xl font-bold text-slate-900 outfit">{value}</p>
    <p className="text-[10px] text-slate-400 mt-4 uppercase tracking-wider font-semibold">Updated 5m ago</p>
  </div>
);

export default Reports;
