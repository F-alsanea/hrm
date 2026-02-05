
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

const Sidebar: React.FC<SidebarProps> = ({ 
  activeTab, setActiveTab, user, onLogout, theme, setTheme, lang, setLang, t, access 
}) => {
  const navItems = [
    { id: 'composer', label: t.composer, icon: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z', show: access.canCompose },
    { id: 'history', label: t.history, icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', show: access.canViewHistory },
    { id: 'templates', label: t.templates, icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', show: access.canViewTemplates },
  ].filter(i => i.show);

  return (
    <aside className="w-full md:w-80 glass m-4 rounded-[3rem] overflow-hidden flex flex-col h-[calc(100vh-2rem)] shadow-2xl transition-all duration-300 z-30 border-2 border-white/30" style={{ backgroundColor: 'var(--bg-sidebar)' }}>
      <div className="p-10 text-center border-b border-white/10 bg-white/5">
        <div className="w-24 h-24 bg-white rounded-[2rem] mx-auto mb-6 flex items-center justify-center text-[#1f4e78] font-black text-4xl shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500">
          K
        </div>
        <h2 className="font-black text-2xl text-white tracking-tight">مجموعة الكعكي</h2>
        <div className="mt-3 inline-block px-4 py-1.5 bg-white/10 rounded-full text-[11px] text-white/90 uppercase font-black tracking-widest border border-white/20">
          {user.displayName} / {t[user.role]}
        </div>
      </div>
      
      <nav className="p-8 space-y-4 flex-1 overflow-y-auto">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-5 px-6 py-5 rounded-[1.8rem] transition-all duration-300 group ${
              activeTab === item.id 
                ? 'bg-white text-[#1f4e78] font-black shadow-[0_15px_30px_rgba(0,0,0,0.1)] scale-105' 
                : 'hover:bg-white/10 text-white/70 hover:text-white'
            }`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d={item.icon} />
            </svg>
            <span className="text-[13px] font-black uppercase tracking-wider">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-8 space-y-6">
        <div className="bg-white/5 p-6 rounded-[2rem] border border-white/10 space-y-5 shadow-inner">
          <div className="flex flex-col gap-3">
            <span className="text-[10px] text-white/50 font-black uppercase tracking-[0.2em]">{t.theme}</span>
            <div className="flex bg-black/30 p-1.5 rounded-2xl border border-white/5">
              {(['light', 'dark', 'sepia'] as ThemeMode[]).map(m => (
                <button 
                  key={m}
                  onClick={() => setTheme(m)}
                  className={`flex-1 py-2 rounded-xl text-[10px] font-black tracking-tighter transition-all duration-300 ${theme === m ? 'bg-white text-[#1f4e78] shadow-md' : 'text-white/40 hover:text-white/70'}`}
                >
                  {t[m]}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex flex-col gap-3">
            <span className="text-[10px] text-white/50 font-black uppercase tracking-[0.2em]">{t.lang}</span>
            <button 
              onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
              className="bg-white/10 hover:bg-white/20 px-4 py-3 rounded-2xl text-[11px] text-white font-black tracking-widest border border-white/10 transition-all uppercase"
            >
              {lang === 'ar' ? 'Switch to English' : 'التبديل للعربية'}
            </button>
          </div>
        </div>

        <button 
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-3 py-4 rounded-[1.8rem] bg-red-600/10 text-red-100 hover:bg-red-600 hover:text-white transition-all text-xs font-black uppercase tracking-widest border border-red-600/20 shadow-lg"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          {t.logout}
        </button>

        <div className="text-center pt-2">
          <p className="text-[10px] text-white/30 uppercase font-black tracking-[0.4em] leading-loose">{t.footer}</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
