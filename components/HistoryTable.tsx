
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
    <div className="glass-card rounded-[3rem] shadow-2xl overflow-hidden border-2 border-white/60 bg-white/80">
      <div className="p-10 border-b border-gray-200/50 flex flex-col sm:flex-row justify-between items-center gap-6">
        <div>
          <h3 className="text-2xl font-black text-heading tracking-tight uppercase">{t.history}</h3>
          <p className="text-xs text-muted font-bold uppercase tracking-widest mt-1">Recruitment Transaction Logs</p>
        </div>
        <button
          onClick={onClear}
          className="text-red-600 hover:text-white hover:bg-red-600 text-[11px] font-black uppercase tracking-widest border-2 border-red-600/20 px-8 py-3 rounded-2xl transition-all shadow-sm"
        >
          {t.clearHistory}
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className={`w-full ${lang === 'ar' ? 'text-right' : 'text-left'} border-collapse`}>
          <thead>
            <tr className="bg-gray-500/5 text-heading border-b border-gray-200/50">
              <th className="px-8 py-6 font-black text-[11px] uppercase tracking-[0.2em]">{t.timestamp}</th>
              <th className="px-8 py-6 font-black text-[11px] uppercase tracking-[0.2em]">{t.actionType}</th>
              <th className="px-8 py-6 font-black text-[11px] uppercase tracking-[0.2em]">{t.candidateName}</th>
              <th className="px-8 py-6 font-black text-[11px] uppercase tracking-[0.2em]">{t.sender}</th>
              <th className="px-8 py-6 font-black text-[11px] uppercase tracking-[0.2em]">{t.status}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100/50">
            {history.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-8 py-24 text-center text-muted font-black uppercase tracking-[0.3em] text-xs">
                  {t.noHistory}
                </td>
              </tr>
            ) : (
              history.map((log) => (
                <tr key={log.id} className="hover:bg-white transition-colors group">
                  <td className="px-8 py-5 text-[11px] font-mono font-bold text-gray-500">{log.timestamp}</td>
                  <td className="px-8 py-5">
                    <span className="px-4 py-1.5 rounded-xl text-[10px] font-black tracking-wider bg-[#1f4e78] text-white shadow-sm uppercase">
                      {log.type}
                    </span>
                  </td>
                  <td className="px-8 py-5 font-black text-heading text-sm">{log.candidateName}</td>
                  <td className="px-8 py-5 text-[11px] font-black text-muted uppercase tracking-wider">{log.sender}</td>
                  <td className="px-8 py-5">
                    <span className="text-green-700 font-black text-[11px] uppercase tracking-widest">
                      {log.status}
                    </span>
                  </td>
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
