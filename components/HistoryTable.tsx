import React from 'react';
import { MessageLog, Language } from '../types';

interface HistoryTableProps {
  history: MessageLog[];
  onClear: () => void;
  lang: Language;
  t: any;
}

export const HistoryTable: React.FC<HistoryTableProps> = ({ history, onClear, lang, t }) => {
  return (
    <div className="glass-card shadow-[0_32px_64px_-12px_rgba(0,0,0,0.1)] overflow-hidden mb-24 animate-slideUp">
      <div className="p-8 md:p-12 border-b border-gray-100/10 flex flex-col sm:flex-row justify-between items-center gap-8 bg-white/[0.02]">
        <div className="text-center sm:text-right">
          <h3 className="text-2xl md:text-3xl font-black text-heading tracking-tight uppercase leading-none">{t.history}</h3>
          <p className="text-[10px] text-muted font-black uppercase tracking-[0.4em] mt-3 opacity-60">System Recruitment Logs</p>
        </div>
        <button onClick={onClear} className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest border border-red-500/20 transition-all shadow-xl">{t.clearHistory}</button>
      </div>
      <div className="overflow-x-auto">
        <table className={`w-full ${lang === 'ar' ? 'text-right' : 'text-left'} border-collapse`}>
          <thead>
            <tr className="bg-black/[0.02] text-heading border-b border-gray-100/5">
              <th className="px-10 py-8 font-black text-[11px] uppercase tracking-widest opacity-50">{t.timestamp}</th>
              <th className="px-10 py-8 font-black text-[11px] uppercase tracking-widest opacity-50">{t.actionType}</th>
              <th className="px-10 py-8 font-black text-[11px] uppercase tracking-widest opacity-50">{t.candidateName}</th>
              <th className="px-10 py-8 font-black text-[11px] uppercase tracking-widest opacity-50">{t.sender}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100/5">
            {history.length === 0 ? (
              <tr><td colSpan={4} className="px-10 py-32 text-center text-muted font-black uppercase text-[11px] tracking-[0.3em] opacity-30">{t.noHistory}</td></tr>
            ) : (
              history.map((log) => (
                <tr key={log.id} className="hover:bg-blue-500/[0.02] transition-colors group">
                  <td className="px-10 py-6 text-[11px] font-mono text-muted opacity-60">{log.timestamp}</td>
                  <td className="px-10 py-6">
                    <span className="px-4 py-1.5 rounded-xl text-[9px] font-black bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 uppercase tracking-widest">
                      {log.type}
                    </span>
                  </td>
                  <td className="px-10 py-6 font-black text-sm text-heading">{log.candidateName}</td>
                  <td className="px-10 py-6 text-[10px] font-black text-muted uppercase tracking-widest opacity-70">{log.sender}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};


