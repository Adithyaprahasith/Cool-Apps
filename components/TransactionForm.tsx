
import React, { useState } from 'react';
import { Transaction, TransactionType } from '../types';

interface Props {
  categories: Record<TransactionType, string[]>;
  onAdd: (transaction: Transaction) => void;
  onClose: () => void;
}

interface FormErrors {
  amount?: string;
  description?: string;
  date?: string;
  category?: string;
}

const TransactionForm: React.FC<Props> = ({ categories, onAdd, onClose }) => {
  const [type, setType] = useState<TransactionType>('expense');
  const [category, setCategory] = useState(categories.expense[0] || '');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [errors, setErrors] = useState<FormErrors>({});

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    // Amount validation
    const numAmount = parseFloat(amount);
    if (!amount || isNaN(numAmount)) {
      newErrors.amount = 'Please enter a valid amount';
    } else if (numAmount <= 0) {
      newErrors.amount = 'Amount must be greater than zero';
    }

    // Description validation
    if (!description.trim()) {
      newErrors.description = 'Description is required';
    } else if (description.trim().length < 2) {
      newErrors.description = 'Description is too short';
    }

    // Date validation
    if (!date) {
      newErrors.date = 'Date is required';
    } else {
      const selectedDate = new Date(date);
      if (isNaN(selectedDate.getTime())) {
        newErrors.date = 'Invalid date format';
      }
    }

    // Category validation
    if (!category) {
      newErrors.category = 'Please select a category';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onAdd({ 
        id: Math.random().toString(36).substr(2, 9), 
        date, 
        amount: parseFloat(amount), 
        type, 
        category, 
        description: description.trim() 
      });
      onClose();
    }
  };

  const handleTypeChange = (newType: TransactionType) => {
    setType(newType);
    setCategory(categories[newType][0] || '');
    // Clear errors when type changes as category might reset
    setErrors(prev => ({ ...prev, category: undefined }));
  };

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4 z-[100]">
      <div className="glass-dark rounded-[2.5rem] p-8 sm:p-10 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
        <header className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-black text-black tracking-tighter">New Registry</h2>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-slate-100 rounded-full transition-all text-slate-400 hover:text-black"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-wrap gap-2">
            {(['income', 'expense', 'bill', 'saving', 'debt'] as TransactionType[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => handleTypeChange(t)}
                className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-widest rounded-xl border transition-all ${
                  type === t ? 'bg-black text-white border-black shadow-md' : 'bg-white text-slate-400 border-slate-100'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Category</label>
              <select 
                value={category} 
                onChange={(e) => {
                  setCategory(e.target.value);
                  setErrors(prev => ({ ...prev, category: undefined }));
                }} 
                className={`w-full rounded-xl border bg-slate-50 py-3 px-3 text-sm font-bold text-black appearance-none transition-colors ${
                  errors.category ? 'border-red-400 bg-red-50' : 'border-slate-100'
                }`}
              >
                {categories[type].length > 0 ? (
                  categories[type].map((cat) => <option key={cat} value={cat}>{cat}</option>)
                ) : (
                  <option value="">No categories</option>
                )}
              </select>
              {errors.category && <p className="text-[9px] font-bold text-red-500 uppercase ml-1">{errors.category}</p>}
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Date</label>
              <input 
                type="date" 
                value={date} 
                onChange={(e) => {
                  setDate(e.target.value);
                  setErrors(prev => ({ ...prev, date: undefined }));
                }} 
                className={`w-full rounded-xl border bg-slate-50 py-3 px-3 text-sm font-bold text-black transition-colors ${
                  errors.date ? 'border-red-400 bg-red-50' : 'border-slate-100'
                }`} 
              />
              {errors.date && <p className="text-[9px] font-bold text-red-500 uppercase ml-1">{errors.date}</p>}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Amount</label>
            <div className="relative">
              <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-black text-slate-300">$</span>
              <input 
                type="number" 
                step="0.01" 
                value={amount} 
                onChange={(e) => {
                  setAmount(e.target.value);
                  setErrors(prev => ({ ...prev, amount: undefined }));
                }} 
                className={`w-full rounded-2xl border bg-slate-50 py-4 pl-12 pr-6 font-extrabold text-2xl text-black transition-colors ${
                  errors.amount ? 'border-red-400 bg-red-50' : 'border-slate-100'
                }`} 
                placeholder="0.00" 
              />
            </div>
            {errors.amount && <p className="text-[9px] font-bold text-red-500 uppercase ml-1 mt-1">{errors.amount}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Description</label>
            <input 
              type="text" 
              value={description} 
              onChange={(e) => {
                setDescription(e.target.value);
                setErrors(prev => ({ ...prev, description: undefined }));
              }} 
              className={`w-full rounded-xl border bg-slate-50 py-3 px-4 text-sm font-bold text-black transition-colors ${
                errors.description ? 'border-red-400 bg-red-50' : 'border-slate-100'
              }`} 
              placeholder="e.g. Weekly Groceries" 
            />
            {errors.description && <p className="text-[9px] font-bold text-red-500 uppercase ml-1">{errors.description}</p>}
          </div>

          <button 
            type="submit" 
            className="w-full bg-black text-white font-bold py-4 rounded-2xl hover:bg-zinc-800 transition-all shadow-lg active:scale-95 text-xs uppercase tracking-[0.2em] mt-2 group"
          >
            Save Record
            <span className="inline-block ml-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">→</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default TransactionForm;
