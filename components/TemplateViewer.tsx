
import React from 'react';
import { TEMPLATES } from '../constants';
import { Language } from '../types';

interface TemplateViewerProps {
  lang: Language;
  t: any;
}

const TemplateViewer: React.FC<TemplateViewerProps> = ({ lang, t }) => {
  return (
    <div className="space-y-8">
      <div className="glass-card p-10 rounded-[3rem] shadow-2xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
          <div>
            <h3 className="text-2xl font-black text-heading">{t.templates}</h3>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {Object.values(TEMPLATES).map((template) => (
            <div key={template.type} className="glass-card bg-white/20 border border-white/80 rounded-[2rem] p-8">
              <div className="flex justify-between items-center mb-6">
                <span className="bg-[#1f4e78] text-white px-5 py-2 rounded-2xl text-xs font-black">
                  {template.type}
                </span>
              </div>
              
              <div className="bg-white/90 p-6 rounded-2xl border border-gray-100 text-sm text-gray-700 whitespace-pre-wrap min-h-[180px] leading-relaxed shadow-inner">
                {template.content[lang]}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TemplateViewer;
