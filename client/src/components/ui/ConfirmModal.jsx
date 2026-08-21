import React from 'react';
import { AlertCircle } from 'lucide-react';

export default function ConfirmModal({ isOpen, title, message, onConfirm, onCancel }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-obsidian/60 backdrop-blur-sm px-4">
      <div className="bg-linen w-full max-w-md p-6 rounded-xl shadow-2xl border border-obsidian/10 animate-in zoom-in-95 duration-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-terracotta/20 text-terracotta p-2 rounded-full">
            <AlertCircle size={24} />
          </div>
          <h3 className="text-lg font-bold uppercase tracking-widest text-obsidian">{title}</h3>
        </div>
        
        <p className="text-obsidian/70 text-sm mb-8 font-medium">
          {message}
        </p>

        <div className="flex justify-end gap-3">
          <button 
            onClick={onCancel}
            className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-obsidian/60 hover:text-obsidian bg-black/5 hover:bg-black/10 rounded transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={onConfirm}
            className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-linen bg-terracotta hover:bg-terracotta/90 shadow-md rounded transition-colors"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
