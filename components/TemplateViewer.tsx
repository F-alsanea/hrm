
import React from 'react';
import { TEMPLATES } from '../constants';
import { Language } from '../types';

interface TemplateViewerProps {
  lang: Language;
  t: any;
}

export const TemplateViewer: React.FC<TemplateViewerProps> = ({ lang, t }) => {
  return (
    <div className="space-y-12 animate-slideUp">
      <div className="glass-card p-10 md:p-16 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.1)]">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h3 className="text-3xl font-black text-heading tracking-tight uppercase leading-none">{t.templates}</h3>
            <p className="text-[10px] text-muted font-black uppercase tracking-[0.4em] mt-3 opacity-60">Verified Message Assets</p>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
          {Object.values(TEMPLATES).map((template) => (
            <div key={template.type} className="glass-card bg-white/5 border border-white/10 rounded-[2.5rem] p-10 hover:scale-[1.02] transition-all duration-500 group">
              <div className="flex justify-between items-center mb-8">
                <span className="bg-blue-600 text-white px-6 py-2 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-blue-600/20">
                  {template.type}
                </span>
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/20 group-hover:text-blue-400 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                </div>
              </div>

              <div className="bg-white/5 p-8 rounded-3xl border border-white/5 text-sm text-heading whitespace-pre-wrap min-h-[220px] leading-relaxed shadow-inner font-semibold opacity-80 group-hover:opacity-100 transition-opacity">
                {template.content[lang]}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
