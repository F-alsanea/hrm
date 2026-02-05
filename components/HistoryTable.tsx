import React from 'react';
import { MessageLog, Language } from '../types';

interface HistoryTableProps {
  history: MessageLog[];
  onClear: () => void;
  lang: Language;
  t: any;
}

const HistoryTable: React.FC<HistoryTableProps> = ({ history, onClear, lang, t }) => {
  return (
    <div className="glass-card rounded-[2rem] md:rounded-[3rem] shadow-2xl overflow-hidden border-2 border-white/60 bg-white/80 mb-20">
      <div className="p-6 md:p-10 border-b border-gray-200/50 flex flex-col sm:flex-row justify-between items-center gap-6">
        <div className="text-center sm:text-right">
          <h3 className="text-xl md:text-2xl font-black text-heading tracking-tight uppercase">{t.history}</h3>
          <p className="text-[10px] md:text-xs text-muted font-bold uppercase tracking-widest mt-1">Recruitment Logs</p>
        </div>
        <button onClick={onClear} className="text-red-600 border-2 border-red-600/20 px-6 py-2 rounded-[1rem] font-black uppercase text-[10px]">{t.clearHistory}</button>
      </div>
      <div className="overflow-x-auto">
        <table className={`w-full ${lang === 'ar' ? 'text-right' : 'text-left'} border-collapse`}>
          <thead>
            <tr className="bg-gray-500/5 text-heading border-b">
              <th className="px-8 py-6 font-black text-[11px] uppercase">{t.timestamp}</th>
              <th className="px-8 py-6 font-black text-[11px] uppercase">{t.actionType}</th>
              <th className="px-8 py-6 font-black text-[11px] uppercase">{t.candidateName}</th>
              <th className="px-8 py-6 font-black text-[11px] uppercase">{t.sender}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {history.length === 0 ? (
              <tr><td colSpan={4} className="px-8 py-24 text-center text-muted font-black uppercase text-xs">{t.noHistory}</td></tr>
            ) : (
              history.map((log) => (
                <tr key={log.id} className="hover:bg-white transition-colors">
                  <td className="px-8 py-5 text-[11px] font-mono text-gray-500">{log.timestamp}</td>
                  <td className="px-8 py-5"><span className="px-3 py-1 rounded-lg text-[9px] font-black bg-[#1f4e78] text-white">{log.type}</span></td>
                  <td className="px-8 py-5 font-black text-sm">{log.candidateName}</td>
                  <td className="px-8 py-5 text-[10px] font-black text-muted uppercase">{log.sender}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HistoryTable;
