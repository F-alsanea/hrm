
import React from 'react';
import { TEMPLATES } from '../constants';
import { Language } from '../types';

interface TemplateViewerProps {
  lang: Language;
  t: any;
}

export const TemplateViewer: React.FC<TemplateViewerProps> = ({ lang, t }) => {
  return (
    <div className="space-y-8 animate-slideUp">
      <div className="glass-card p-6 md:p-10 shadow-2xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <div>
            <h3 className="text-2xl font-black text-heading uppercase leading-none">{t.templates}</h3>
            <p className="text-[9px] text-muted font-bold uppercase tracking-wider mt-2 opacity-50">Verified Assets</p>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {Object.values(TEMPLATES).map((template) => (
            <div key={template.type} className="glass-card-solid bg-white/5 border border-white/10 rounded-[2rem] p-8 hover:scale-[1.01] transition-all duration-300 group">
              <div className="flex justify-between items-center mb-6">
                <span className="bg-blue-600 text-white px-5 py-1.5 rounded-xl text-[9px] font-black uppercase shadow-lg shadow-blue-600/10">
                  {template.type}
                </span>
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/10 group-hover:text-blue-400 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                </div>
              </div>

              <div className={`bg-white/80 p-6 rounded-2xl border border-white/10 text-sm text-gray-900 whitespace-pre-wrap min-h-[180px] leading-relaxed shadow-inner font-bold ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
                {template.content[lang]}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

  );
};
