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
    <div className="glass-card shadow-2xl overflow-hidden mb-16 animate-slideUp">
      <div className="p-6 md:p-8 border-b border-white/5 flex flex-col sm:flex-row justify-between items-center gap-6 bg-white/[0.02]">
        <div className="text-center sm:text-right">
          <h3 className="text-xl md:text-2xl font-black text-heading uppercase leading-none">{t.history}</h3>
          <p className="text-[9px] text-muted font-bold uppercase tracking-wider mt-2 opacity-50">System Logs</p>
        </div>
        <button onClick={onClear} className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white px-6 py-3 rounded-xl font-black uppercase text-[9px] border border-red-500/20 transition-all shadow-lg">{t.clearHistory}</button>
      </div>
      <div className="overflow-x-auto">
        <table className={`w-full ${lang === 'ar' ? 'text-right' : 'text-left'} border-collapse`}>
          <thead>
            <tr className="bg-black/10 text-heading border-b border-white/5">
              <th className="px-6 py-4 font-black text-[10px] uppercase opacity-40">{t.timestamp}</th>
              <th className="px-6 py-4 font-black text-[10px] uppercase opacity-40">{t.actionType}</th>
              <th className="px-6 py-4 font-black text-[10px] uppercase opacity-40">{t.candidateName}</th>
              <th className="px-6 py-4 font-black text-[10px] uppercase opacity-40">{t.sender}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {history.length === 0 ? (
              <tr><td colSpan={4} className="px-6 py-20 text-center text-muted font-bold uppercase text-[10px] opacity-20">{t.noHistory}</td></tr>
            ) : (
              history.map((log) => (
                <tr key={log.id} className="hover:bg-blue-500/[0.03] transition-colors group">
                  <td className="px-6 py-4 text-[10px] font-mono text-muted opacity-50">{log.timestamp}</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 rounded-lg text-[8px] font-black bg-blue-500/10 text-blue-500 border border-blue-500/10 uppercase">
                      {log.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-bold text-sm text-heading">{log.candidateName}</td>
                  <td className="px-6 py-4 text-[9px] font-black text-muted uppercase opacity-60">{log.sender}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};


