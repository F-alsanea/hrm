import React, { useState, useEffect } from 'react';
import { MessageType, MessageLog, User, Language, ThemeMode } from './types';
import { Sidebar } from './components/Sidebar';
import { MessageComposer } from './components/MessageComposer';
import { HistoryTable } from './components/HistoryTable';
import { TemplateViewer } from './components/TemplateViewer';
import { LoginPage } from './components/LoginPage';
import { translations } from './translations';

const Signature: React.FC<{ lang: 'ar' | 'en'; theme: ThemeMode }> = ({ lang, theme }) => {
  return (
    <div className="fixed bottom-8 w-full flex justify-center z-[100] pointer-events-none no-print px-4">
      <a
        href="https://www.linkedin.com/in/falsanea/"
        target="_blank"
        rel="noopener noreferrer"
        className={`
          pointer-events-auto px-5 py-2.5 rounded-2xl border backdrop-blur-2xl
          transition-all duration-500 hover:scale-105 hover:-translate-y-1 group
          flex items-center gap-4 text-sm
          ${theme === 'light'
            ? 'bg-white/70 border-white/50 text-slate-900 shadow-[0_8px_32px_rgba(0,0,0,0.06)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)]'
            : 'bg-slate-900/60 border-white/10 text-white shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.5)]'}
        `}
      >
        <div className="flex flex-col items-start leading-tight">
          <span className="text-[10px] uppercase tracking-widest opacity-40 font-bold mb-0.5">
            {lang === 'ar' ? 'تصميم وتطوير' : 'Designed & Developed by'}
          </span>
          <span className="font-black text-base tracking-tight">
            {lang === 'ar' ? 'فيصل السني' : 'Faisal Alsanea'}
          </span>
        </div>

        <div className={`
          w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-500
          ${theme === 'light' ? 'bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white' : 'bg-indigo-500/10 text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white'}
        `}>
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
          </svg>
        </div>
      </a>
    </div>
  );
};

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [lang, setLang] = useState<Language>('ar');
  const [theme, setTheme] = useState<ThemeMode>('light');
  const [activeTab, setActiveTab] = useState<'composer' | 'history' | 'templates'>('composer');
  const [history, setHistory] = useState<MessageLog[]>([]);

  const t = translations[lang];

  useEffect(() => {
    const savedUser = localStorage.getItem('alkaki_user');
    if (savedUser) setUser(JSON.parse(savedUser));
    const savedHistory = localStorage.getItem('alkaki_history');
    if (savedHistory) setHistory(JSON.parse(savedHistory));
    const savedLang = localStorage.getItem('alkaki_lang') as Language;
    if (savedLang) setLang(savedLang);
    const savedTheme = localStorage.getItem('alkaki_theme') as ThemeMode;
    if (savedTheme) setTheme(savedTheme);
  }, []);

  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    localStorage.setItem('alkaki_lang', lang);
  }, [lang]);

  useEffect(() => { localStorage.setItem('alkaki_theme', theme); }, [theme]);

  const saveToHistory = (log: MessageLog) => {
    const updated = [log, ...history];
    setHistory(updated);
    localStorage.setItem('alkaki_history', JSON.stringify(updated));
  };

  const handleLogout = () => { setUser(null); localStorage.removeItem('alkaki_user'); };

  const clearHistory = () => {
    if (window.confirm(t.confirmClear)) { setHistory([]); localStorage.removeItem('alkaki_history'); }
  };

  if (!user) {
    return (
      <div className={`min-h-screen theme-${theme}`}>
        <LoginPage onLogin={(u) => { setUser(u); localStorage.setItem('alkaki_user', JSON.stringify(u)); }} lang={lang} setLang={setLang} />
        <Signature lang={lang} theme={theme} />
        <style>{`
          * { font-family: 'Tajawal', sans-serif; }
          body { margin: 0; line-height: 1.6; }
          [dir="rtl"] { line-height: 1.8; }
        `}</style>
      </div>
    );
  }

  const canViewTemplates = user.role === 'admin' || user.role === 'manager';
  const canViewHistory = user.role === 'admin' || user.role === 'manager';
  const canCompose = user.role === 'admin' || user.role === 'staff';

  return (
    <div className={`flex flex-col md:flex-row h-screen font-sans theme-${theme} bg-page transition-all duration-700 ease-in-out overflow-hidden`}>
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} user={user} onLogout={handleLogout} theme={theme} setTheme={setTheme} lang={lang} setLang={setLang} t={t} access={{ canCompose, canViewHistory, canViewTemplates }} />
      <main className="flex-1 p-4 md:p-8 lg:p-10 overflow-y-auto flex flex-col relative">
        <header className="mb-6 md:mb-8 flex flex-row justify-between items-center gap-6 animate-fadeIn">
          <div>
            <h1 className="text-2xl md:text-4xl font-black text-heading drop-shadow-sm tracking-tight leading-tight">{t.title}</h1>
            <p className="text-muted text-[10px] md:text-xs font-bold mt-1 uppercase tracking-[0.2em] opacity-80">{t.subtitle}</p>
          </div>
          <div className="bg-white/5 backdrop-blur-xl px-4 py-2 rounded-xl text-heading text-[10px] font-black border border-white/10 shadow-lg uppercase tracking-wider transition-transform hover:scale-105 duration-300 hidden sm:block">
            {new Date().toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </header>


        <div className="max-w-7xl mx-auto w-full flex-1 animate-slideUp">
          {activeTab === 'composer' && canCompose && <MessageComposer onSend={saveToHistory} lang={lang} user={user} t={t} />}
          {activeTab === 'history' && canViewHistory && <HistoryTable history={history} onClear={clearHistory} lang={lang} t={t} />}
          {activeTab === 'templates' && canViewTemplates && <TemplateViewer lang={lang} t={t} />}
        </div>

        <Signature lang={lang} theme={theme} />
      </main>

      <style>{`
        :root { --font-main: 'Tajawal', sans-serif; }
        * { font-family: var(--font-main); box-sizing: border-box; scroll-behavior: smooth; }
        
        /* Arabic Typography Fix */
        html[lang="ar"], [dir="rtl"] { 
          line-height: 1.8; 
          letter-spacing: 0 !important; 
        }
        html[lang="ar"] *, [dir="rtl"] * {
          letter-spacing: 0 !important;
          word-spacing: normal !important;
        }

        body { margin: 0; line-height: 1.6; background: #0f172a; color: #f8fafc; overflow-x: hidden; }
        
        .theme-light { 
          --bg-page: #f1f5f9; 
          --bg-glass: rgba(255, 255, 255, 0.45); 
          --bg-glass-solid: rgba(255, 255, 255, 0.85);
          --text-heading: #0f172a; 
          --text-muted: #475569; 
          --border-glass: rgba(255, 255, 255, 0.5); 
          --bg-input: #ffffff; 
          --text-input: #0f172a;
          --bg-sidebar: #1e293b;
        }
        .theme-dark { 
          --bg-page: #0f172a; 
          --bg-glass: rgba(15, 23, 42, 0.4); 
          --bg-glass-solid: rgba(15, 23, 42, 0.8);
          --text-heading: #f8fafc; 
          --text-muted: #94a3b8; 
          --border-glass: rgba(255, 255, 255, 0.1); 
          --bg-input: #1e293b; 
          --text-input: #f8fafc;
          --bg-sidebar: #020617;
        }
        
        .bg-page { background-color: var(--bg-page); }
        .glass-card { 
          background: var(--bg-glass); 
          backdrop-filter: blur(20px) saturate(180%); 
          -webkit-backdrop-filter: blur(20px) saturate(180%);
          border: 1px solid var(--border-glass); 
          box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.08);
          border-radius: 2rem;
        }
        .glass-card-solid {
           background: var(--bg-glass-solid);
           backdrop-filter: blur(20px) saturate(180%);
           border: 1px solid var(--border-glass); 
           border-radius: 1.5rem;
        }
        
        .text-heading { color: var(--text-heading); }
        .text-muted { color: var(--text-muted); }
        
        input, select, textarea { 
          background-color: var(--bg-input); 
          color: var(--text-input); 
          border: 1px solid rgba(0,0,0,0.1); 
          transition: all 0.2s ease; 
          border-radius: 1rem; 
          padding: 0.8rem 1.2rem; 
          font-weight: 600;
          outline: none;
          font-size: 14px;
        }
        select option {
          background-color: var(--bg-input);
          color: var(--text-input);
        }
        .theme-dark input, .theme-dark select, .theme-dark textarea {
          border-color: rgba(255,255,255,0.1);
        }
        input:focus, select:focus, textarea:focus { 
          border-color: #3b82f6; 
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
        }


        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.6s ease-out forwards; }
        .animate-slideUp { animation: slideUp 0.8s cubic-bezier(0.23, 1, 0.32, 1) forwards; }

        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(0, 0, 0, 0.1); border-radius: 10px; }
        .theme-dark::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); }
      `}</style>

    </div>
  );
};

export default App;
