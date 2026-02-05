import React from 'react';
import { User, Language, ThemeMode } from '../types';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: any) => void;
  user: User;
  onLogout: () => void;
  theme: ThemeMode;
  setTheme: (t: ThemeMode) => void;
  lang: Language;
  setLang: (l: Language) => void;
  t: any;
  access: { canCompose: boolean, canViewHistory: boolean, canViewTemplates: boolean };
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab, setActiveTab, user, onLogout, theme, setTheme, lang, setLang, t, access
}) => {
  const navItems = [
    { id: 'composer', label: t.composer, icon: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z', show: access.canCompose },
    { id: 'history', label: t.history, icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', show: access.canViewHistory },
    { id: 'templates', label: t.templates, icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', show: access.canViewTemplates },
  ].filter(i => i.show);

  return (
    <aside className="w-full md:w-80 glass-card m-0 md:m-0 rounded-none overflow-hidden flex flex-col h-auto md:h-screen shadow-2xl transition-all duration-300 z-30 border-r border-white/5" style={{ background: 'var(--bg-sidebar)' }}>
      <div className="p-8 md:p-12 text-center border-b border-white/5 bg-white/[0.02]">
        <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-[2.2rem] mx-auto mb-8 flex items-center justify-center text-white font-black text-5xl shadow-2xl rotate-3 hover:rotate-0 transition-all duration-500">
          K
        </div>
        <h2 className="font-black text-2xl text-white tracking-widest uppercase">الكعكي</h2>
        <div className="mt-4 inline-block px-5 py-2 bg-white/5 rounded-2xl text-[10px] text-white/50 uppercase font-black tracking-[0.2em] border border-white/5">
          {user.displayName} / {t[user.role]}
        </div>
      </div>

      <nav className="p-6 md:p-10 space-y-3 flex-1 overflow-y-auto">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-5 px-6 py-5 rounded-2xl transition-all duration-500 group ${activeTab === item.id
              ? 'bg-white text-blue-900 font-black shadow-[0_15px_30px_rgba(255,255,255,0.1)] scale-[1.03]'
              : 'hover:bg-white/5 text-white/40 hover:text-white'
              }`}
          >
            <div className={`p-2 rounded-xl transition-all ${activeTab === item.id ? 'bg-blue-50' : 'bg-white/5'}`}>
              <svg className="w-5 h-5 md:w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={item.icon} />
              </svg>
            </div>
            <span className="text-[11px] md:text-[12px] font-black uppercase tracking-[0.2em]">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-6 md:p-10 space-y-6">
        <div className="bg-black/20 p-6 rounded-[2rem] border border-white/5 space-y-6 shadow-inner">
          <div className="flex flex-col gap-4">
            <span className="text-[9px] text-white/30 font-black uppercase tracking-[0.3em]">{t.theme}</span>
            <div className="flex bg-black/40 p-1.5 rounded-2xl border border-white/5">
              {(['light', 'dark', 'sepia'] as ThemeMode[]).map(m => (
                <button
                  key={m}
                  onClick={() => setTheme(m)}
                  className={`flex-1 py-3 rounded-xl text-[9px] font-black tracking-tighter transition-all duration-300 ${theme === m ? 'bg-white text-blue-900 shadow-xl' : 'text-white/20 hover:text-white/50'}`}
                >
                  {t[m]}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <span className="text-[9px] text-white/30 font-black uppercase tracking-[0.3em]">{t.lang}</span>
            <button
              onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
              className="bg-white/5 hover:bg-white/10 px-6 py-4 rounded-2xl text-[10px] text-white/80 font-black tracking-widest border border-white/5 transition-all uppercase"
            >
              {lang === 'ar' ? 'English' : 'العربية'}
            </button>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-4 py-5 rounded-2xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all text-[11px] font-black uppercase tracking-[0.3em] border border-red-500/20 shadow-xl"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          {t.logout}
        </button>

        <div className="text-center pt-2">
          <p className="text-[8px] text-white/10 uppercase font-black tracking-[0.5em] leading-loose hover:text-white/30 transition-colors">
            {t.madeBy} <a href="https://www.linkedin.com/in/falsanea/" target="_blank" rel="noopener noreferrer" className="text-white hover:underline">{t.author}</a>
          </p>
        </div>
      </div>
    </aside>
  );
};


