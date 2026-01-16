
import React, { useState } from 'react';
import { TransactionType } from '../types';

interface Props {
  categories: Record<TransactionType, string[]>;
  onUpdate: (categories: Record<TransactionType, string[]>) => void;
  onClose: () => void;
}

const CategoryManager: React.FC<Props> = ({ categories, onUpdate, onClose }) => {
  const [activeType, setActiveType] = useState<TransactionType>('expense');
  const [newCategory, setNewCategory] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');

  const handleAdd = () => {
    if (!newCategory.trim()) return;
    const updated = { ...categories };
    updated[activeType] = [...updated[activeType], newCategory.trim()];
    onUpdate(updated);
    setNewCategory('');
  };

  const handleDelete = (index: number) => {
    const updated = { ...categories };
    updated[activeType] = updated[activeType].filter((_, i) => i !== index);
    onUpdate(updated);
  };

  const handleStartEdit = (index: number) => {
    setEditingIndex(index);
    setEditValue(categories[activeType][index]);
  };

  const handleSaveEdit = () => {
    if (editingIndex === null || !editValue.trim()) return;
    const updated = { ...categories };
    updated[activeType][editingIndex] = editValue.trim();
    onUpdate(updated);
    setEditingIndex(null);
  };

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4 z-[100]">
      <div className="glass-dark rounded-[2.5rem] p-8 sm:p-10 w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-200">
        <header className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-black text-black tracking-tighter">Manage Categories</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-all">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </header>

        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
          {(['income', 'expense', 'bill', 'saving', 'debt'] as TransactionType[]).map((t) => (
            <button
              key={t}
              onClick={() => { setActiveType(t); setEditingIndex(null); }}
              className={`px-4 py-2 text-[10px] font-bold uppercase tracking-widest rounded-xl border transition-all whitespace-nowrap ${
                activeType === t ? 'bg-black text-white border-black' : 'bg-white text-slate-400 border-slate-100'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2 scrollbar-hide">
          {categories[activeType].map((cat, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100 group">
              {editingIndex === idx ? (
                <input
                  autoFocus
                  className="bg-transparent font-bold text-sm text-black flex-grow outline-none"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onBlur={handleSaveEdit}
                  onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit()}
                />
              ) : (
                <span className="text-sm font-bold text-black">{cat}</span>
              )}
              
              <div className="flex gap-2">
                <button onClick={() => handleStartEdit(idx)} className="text-slate-300 hover:text-black transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                </button>
                <button onClick={() => handleDelete(idx)} className="text-slate-300 hover:text-red-500 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            className="flex-grow rounded-xl border border-slate-100 bg-slate-50 py-3 px-4 text-sm font-bold text-black outline-none focus:border-black transition-all"
            placeholder={`New ${activeType} category...`}
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          />
          <button
            onClick={handleAdd}
            className="bg-black text-white px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-zinc-800 transition-all shadow-lg active:scale-95"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryManager;
