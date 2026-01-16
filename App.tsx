
import React, { useState, useEffect, useMemo } from 'react';
import { Transaction, TransactionType } from './types';
import { MOCK_INITIAL_DATA, MONTHS, DEFAULT_CATEGORIES } from './constants';
import Dashboard from './components/Dashboard';
import TransactionForm from './components/TransactionForm';
import CategoryManager from './components/CategoryManager';

const App: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('finvue_simple_data');
    return saved ? JSON.parse(saved) : MOCK_INITIAL_DATA;
  });

  const [categories, setCategories] = useState<Record<TransactionType, string[]>>(() => {
    const saved = localStorage.getItem('finvue_categories');
    return saved ? JSON.parse(saved) : DEFAULT_CATEGORIES;
  });

  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [searchQuery, setSearchQuery] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isCategoryManagerOpen, setIsCategoryManagerOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('finvue_simple_data', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('finvue_categories', JSON.stringify(categories));
  }, [categories]);

  const handleAdd = (t: Transaction) => setTransactions(prev => [t, ...prev]);
  const handleDelete = (id: string) => setTransactions(prev => prev.filter(t => t.id !== id));

  const handleExportCSV = () => {
    if (transactions.length === 0) return;

    const headers = ['Date', 'Description', 'Type', 'Category', 'Amount'];
    const rows = transactions.map(t => [
      t.date,
      `"${t.description.replace(/"/g, '""')}"`,
      t.type,
      t.category,
      t.amount
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `finvue_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filtered = useMemo(() => {
    return transactions.filter(t => {
      const transactionMonth = new Date(t.date).getMonth();
      const matchesMonth = transactionMonth === selectedMonth;
      const query = searchQuery.toLowerCase();
      const matchesSearch = t.description.toLowerCase().includes(query) || 
                            t.category.toLowerCase().includes(query);
      return matchesMonth && matchesSearch;
    });
  }, [transactions, selectedMonth, searchQuery]);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 md:py-12 space-y-8">
      {/* Header & Controls */}
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div className="flex-shrink-0">
          <h1 className="text-3xl font-extrabold tracking-tighter text-black flex items-center gap-2">
            FinVue <span className="text-xs font-bold px-2 py-0.5 bg-black text-white rounded-full uppercase tracking-tighter">Dash</span>
          </h1>
          <p className="text-slate-400 text-sm font-medium">Personal Finance Tracking</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          {/* Search Bar */}
          <div className="relative grow sm:grow-0 sm:min-w-[240px]">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input 
              type="text"
              placeholder="Search activity..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="glass w-full py-2.5 pl-10 pr-4 rounded-2xl text-sm font-medium border-none shadow-sm focus:ring-2 focus:ring-black/5 transition-all"
            />
          </div>

          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
            className="glass py-2.5 px-4 rounded-2xl text-sm font-bold border-none shadow-sm cursor-pointer grow sm:grow-0"
          >
            {MONTHS.map((m, i) => <option key={m} value={i}>{m}</option>)}
          </select>
          
          <div className="flex items-center gap-2 ml-auto sm:ml-0">
            <button
              onClick={handleExportCSV}
              className="p-2.5 rounded-2xl glass hover:bg-slate-100 transition-all text-black"
              title="Export to CSV"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </button>

            <button
              onClick={() => setIsCategoryManagerOpen(true)}
              className="p-2.5 rounded-2xl glass hover:bg-slate-100 transition-all text-black"
              title="Manage Categories"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>

            <button
              onClick={() => setIsFormOpen(true)}
              className="bg-black text-white px-5 py-2.5 rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center gap-2 shadow-lg"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4"></path></svg>
              Entry
            </button>
          </div>
        </div>
      </header>

      {/* Stats and Charts - now using filtered data */}
      <Dashboard transactions={filtered} selectedMonth={selectedMonth} />

      {/* Activity Table */}
      <div className="glass rounded-[2rem] overflow-hidden">
        <div className="px-6 py-5 border-b border-white/40 flex justify-between items-center bg-white/10">
          <h3 className="text-sm font-bold text-black uppercase tracking-widest">
            {searchQuery ? `Search Results (${filtered.length})` : 'Recent Activity'}
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/30 text-slate-400 text-[10px] uppercase font-bold tracking-widest">
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Reference</th>
                <th className="px-6 py-4 text-right">Value</th>
                <th className="px-6 py-4 text-center"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/40">
              {filtered.length > 0 ? filtered.map((t) => (
                <tr key={t.id} className="hover:bg-white/40 group transition-all">
                  <td className="px-6 py-4 text-[11px] font-bold text-slate-400 whitespace-nowrap">{t.date.split('-').slice(1).join('/')}</td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-black">{t.description}</div>
                    <div className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">{t.category} • {t.type}</div>
                  </td>
                  <td className={`px-6 py-4 text-right text-sm font-black ${t.type === 'income' ? 'text-black' : 'text-slate-600'}`}>
                    {t.type === 'income' ? '+' : '-'}${t.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button onClick={() => handleDelete(t.id)} className="text-slate-200 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 p-1 rounded-lg">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={4} className="px-6 py-20 text-center text-xs font-bold text-slate-300 uppercase tracking-[0.2em]">
                    {searchQuery ? 'No matches found' : 'No records found for this period'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isFormOpen && (
        <TransactionForm
          categories={categories}
          onAdd={handleAdd}
          onClose={() => setIsFormOpen(false)}
        />
      )}

      {isCategoryManagerOpen && (
        <CategoryManager
          categories={categories}
          onUpdate={setCategories}
          onClose={() => setIsCategoryManagerOpen(false)}
        />
      )}
    </div>
  );
};

export default App;
