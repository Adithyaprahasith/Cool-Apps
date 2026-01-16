
import React, { useMemo } from 'react';
import { Transaction } from '../types';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, 
  XAxis, YAxis, Tooltip, Legend,
  AreaChart, Area, CartesianGrid
} from 'recharts';
import { MONTHS, DEFAULT_CATEGORIES } from '../constants';

interface Props {
  transactions: Transaction[];
  selectedMonth: number;
}

const COLORS = ['#000000', '#3f3f46', '#71717a', '#a1a1aa', '#d1d5db'];

const Dashboard: React.FC<Props> = ({ transactions, selectedMonth }) => {
  // Filtered data for the active month
  const currentMonthData = useMemo(() => {
    return transactions.filter(t => new Date(t.date).getMonth() === selectedMonth);
  }, [transactions, selectedMonth]);

  // Stats for the current month cards
  const stats = useMemo(() => {
    const result = { income: 0, expenses: 0, savings: 0, debts: 0, bills: 0 };
    currentMonthData.forEach(t => {
      if (t.type === 'income') result.income += t.amount;
      else if (t.type === 'expense') result.expenses += t.amount;
      else if (t.type === 'saving') result.savings += t.amount;
      else if (t.type === 'debt') result.debts += t.amount;
      else if (t.type === 'bill') result.bills += t.amount;
    });
    return result;
  }, [currentMonthData]);

  // Comprehensive trend data calculation
  const trendData = useMemo(() => {
    const monthsData: Record<number, any> = {};
    const now = new Date();
    
    // Get last 6 months
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const mIdx = d.getMonth();
      // Initialize with 0s for all common categories to avoid chart gaps
      monthsData[mIdx] = { 
        name: MONTHS[mIdx].substring(0, 3), 
        net: 0, 
        income: 0,
        ...DEFAULT_CATEGORIES.expense.reduce((acc, cat) => ({ ...acc, [cat]: 0 }), {}),
        ...DEFAULT_CATEGORIES.bill.reduce((acc, cat) => ({ ...acc, [cat]: 0 }), {})
      };
    }

    transactions.forEach(t => {
      const m = new Date(t.date).getMonth();
      if (monthsData[m]) {
        if (t.type === 'income') {
          monthsData[m].income += t.amount;
          monthsData[m].net += t.amount;
        } else {
          monthsData[m].net -= t.amount;
          // Track specific categories for the evolution chart
          if (monthsData[m].hasOwnProperty(t.category)) {
            monthsData[m][t.category] += t.amount;
          }
        }
      }
    });

    return Object.values(monthsData);
  }, [transactions]);

  // Sparkline data
  const last3Months = trendData.slice(-3);

  const totalIncome = stats.income;
  const totalExpenses = stats.expenses + stats.bills;
  const totalSavings = stats.savings;
  const totalDebts = stats.debts;
  const netBalance = totalIncome - totalExpenses - totalSavings - totalDebts;
  
  // Expense Ratio Metric
  const expenseRatio = totalIncome > 0 ? (totalExpenses / totalIncome) * 100 : 0;

  const pieData = [
    { name: 'Bills', value: stats.bills },
    { name: 'Expenses', value: stats.expenses },
    { name: 'Debts', value: stats.debts },
    { name: 'Savings', value: stats.savings },
  ].filter(d => d.value > 0);

  // Top 5 categories for the evolution chart to keep it clean
  const topCategories = useMemo(() => {
    const totals: Record<string, number> = {};
    transactions.forEach(t => {
      if (t.type !== 'income') {
        totals[t.category] = (totals[t.category] || 0) + t.amount;
      }
    });
    return Object.entries(totals)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([name]) => name);
  }, [transactions]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Summary Cards */}
      <section className="space-y-4">
        <div className="flex justify-between items-end px-1">
          <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Monthly Performance</h3>
          <span className="text-[10px] font-bold text-black bg-white border border-slate-100 px-2 py-1 rounded-lg">LIVE METRICS</span>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <SummaryCard 
            title="Inflow" 
            value={totalIncome} 
            color="text-black" 
            icon="+" 
            trend={last3Months.map(m => ({ val: m.income }))} 
          />
          <SummaryCard 
            title="Outflow" 
            value={totalExpenses} 
            color="text-slate-600" 
            icon="-" 
            trend={last3Months.map(m => ({ val: (m.Groceries || 0) + (m['Rent/Mortgage'] || 0) }))} 
          />
          <SummaryCard 
            title="Allocated Savings" 
            value={totalSavings} 
            color="text-slate-600" 
            icon="↑" 
            trend={last3Months.map(m => ({ val: m.net > 0 ? m.net : 0 }))} 
          />
          <SummaryCard 
            title="Debt Serviced" 
            value={totalDebts} 
            color="text-slate-600" 
            icon="↓" 
            trend={last3Months.map(m => ({ val: 350 }))} // Simplified trend for debt
          />
        </div>
        
        {/* Net Focus Hero */}
        <div className="glass p-8 rounded-[2.5rem] border border-white/60 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-black/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110 duration-500"></div>
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">Net Cash Flow Position</p>
              <h2 className={`text-5xl font-black tracking-tighter ${netBalance >= 0 ? 'text-black' : 'text-red-500'}`}>
                ${netBalance.toLocaleString(undefined, { minimumFractionDigits: 0 })}
              </h2>
            </div>
            <div className="flex gap-8">
              <div className="text-left">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Expense Ratio</p>
                <p className={`text-xl font-black ${expenseRatio > 50 ? 'text-red-500' : 'text-black'}`}>
                  {expenseRatio.toFixed(1)}% <span className="text-[10px] text-slate-300 font-bold uppercase ml-1">of income</span>
                </p>
              </div>
              <div className="text-left">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Efficiency Rate</p>
                <p className="text-xl font-black text-black">
                  {totalIncome > 0 ? Math.round(((totalIncome - totalExpenses) / totalIncome) * 100) : 0}%
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Evolution Chart */}
        <div className="glass p-8 rounded-[2.5rem] min-h-[400px]">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-sm font-black text-black uppercase tracking-widest">Spending Evolution</h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Habit changes across top categories</p>
            </div>
          </div>
          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#94a3b8', fontWeight: '700', fontSize: 10}} 
                  dy={10}
                />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', padding: '12px 16px' }}
                  labelStyle={{ fontWeight: '900', color: '#000', marginBottom: '4px', fontSize: '10px', textTransform: 'uppercase' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '9px', fontWeight: '800', textTransform: 'uppercase', paddingTop: '20px' }} />
                {topCategories.map((cat, index) => (
                  <Area
                    key={cat}
                    type="monotone"
                    dataKey={cat}
                    stackId="1"
                    stroke={COLORS[index % COLORS.length]}
                    fill={COLORS[index % COLORS.length]}
                    fillOpacity={0.6}
                  />
                ))}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Financial Velocity Chart */}
        <div className="glass p-8 rounded-[2.5rem] min-h-[400px]">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-sm font-black text-black uppercase tracking-widest">Financial Velocity</h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Net worth momentum</p>
            </div>
          </div>
          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorNet" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#000000" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#000000" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#94a3b8', fontWeight: '700', fontSize: 10}} 
                  dy={10}
                />
                <YAxis hide />
                <Tooltip 
                  cursor={{ stroke: '#e2e8f0', strokeWidth: 2 }}
                  contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', padding: '12px 16px' }}
                  labelStyle={{ fontWeight: '900', color: '#000', marginBottom: '4px', fontSize: '10px', textTransform: 'uppercase' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="net" 
                  stroke="#000" 
                  strokeWidth={4} 
                  fillOpacity={1} 
                  fill="url(#colorNet)" 
                  animationDuration={1500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* Distribution Chart (Bottom row) */}
      <div className="glass p-8 rounded-[2.5rem] min-h-[400px]">
        <div className="flex flex-col items-center">
          <h3 className="text-sm font-black text-black uppercase tracking-widest mb-2 text-center">Capital Allocation</h3>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter mb-8 text-center">Current Month Flow</p>
          <div className="h-[280px] w-full max-w-2xl">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={pieData} 
                  cx="50%" 
                  cy="50%" 
                  innerRadius={75} 
                  outerRadius={105} 
                  paddingAngle={8} 
                  dataKey="value" 
                  stroke="none"
                >
                  {pieData.map((_, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', fontSize: '12px' }} 
                  itemStyle={{ fontWeight: 'bold' }}
                />
                <Legend 
                  verticalAlign="bottom" 
                  align="center"
                  iconType="circle" 
                  wrapperStyle={{ fontSize: '9px', fontWeight: '800', textTransform: 'uppercase', paddingTop: '30px' }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

const SummaryCard: React.FC<{ 
  title: string; 
  value: number; 
  color: string; 
  icon: string;
  trend: { val: number }[];
}> = ({ title, value, color, icon, trend }) => (
  <div className="glass p-5 rounded-[2rem] border border-white/60 transition-all hover:bg-white/80 group flex flex-col justify-between overflow-hidden">
    <div>
      <div className="flex justify-between items-start mb-1">
        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em]">{title}</p>
        <span className="text-[10px] font-black text-slate-300 group-hover:text-black transition-colors">{icon}</span>
      </div>
      <p className={`text-2xl font-black ${color} tracking-tighter mb-4`}>
        ${value.toLocaleString(undefined, { minimumFractionDigits: 0 })}
      </p>
    </div>
    
    <div className="h-8 w-full -mb-2 -mx-5 px-5">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={trend}>
          <Area 
            type="monotone" 
            dataKey="val" 
            stroke="#cbd5e1" 
            strokeWidth={2} 
            fill="#f8fafc" 
            fillOpacity={0}
            animationDuration={1000}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  </div>
);

export default Dashboard;
