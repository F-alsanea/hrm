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
          pointer-events-auto px-6 py-3.5 rounded-full border backdrop-blur-2xl
          transition-all duration-500 hover:scale-105 hover:-translate-y-1 flex items-center gap-4 text-sm font-bold
          ${theme === 'light' ? 'bg-white/90 border-slate-200 text-slate-900 shadow-[0_10px_40px_rgba(0,0,0,0.08)]' :
            theme === 'dark' ? 'bg-slate-950/80 border-white/10 text-white shadow-[0_10px_50px_rgba(0,0,0,0.4)]' :
              'bg-indigo-950/90 border-indigo-400/30 text-indigo-50 shadow-[0_10px_50px_rgba(49,46,129,0.5)]'}
        `}
      >
        <span className="opacity-40 uppercase tracking-widest text-[9px]">{lang === 'ar' ? 'تصميم وتطوير' : 'Designed & Developed by'}</span>
        <div className={`w-px h-4 ${theme === 'light' ? 'bg-slate-200' : 'bg-white/10'}`} />
        <span className="font-black tracking-tight">{lang === 'ar' ? 'فيصل السني' : 'Faisal Alsanea'}</span>
      </a>
    </div>
  );
};

const ThemeSwitcher: React.FC<{ theme: ThemeMode; setTheme: (t: ThemeMode) => void }> = ({ theme, setTheme }) => {
  return (
    <div className="flex bg-black/10 backdrop-blur-xl p-1.5 rounded-2xl border border-white/10 no-print shadow-xl">
      <button
        onClick={() => setTheme('light')}
        className={`p-2.5 rounded-xl transition-all duration-300 ${theme === 'light' ? 'bg-white text-indigo-600 shadow-lg scale-110' : 'text-white/40 hover:text-white hover:bg-white/10'}`}
        title="Light Mode"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" /></svg>
      </button>
      <button
        onClick={() => setTheme('dusk')}
        className={`p-2.5 rounded-xl transition-all duration-300 ${theme === 'dusk' ? 'bg-indigo-600 text-white shadow-lg scale-110' : 'text-white/40 hover:text-white hover:bg-white/10'}`}
        title="Dusk Mode"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v2" /><path d="m4.93 4.93 1.41 1.41" /><path d="M20 12h2" /><path d="m19.07 4.93-1.41 1.41" /><path d="M15.947 12.65a4 4 0 0 0-5.925-4.128" /><path d="M13 22H7a5 5 0 1 1 4.9-6H13a5 5 0 0 1 0 10Z" /></svg>
      </button>
      <button
        onClick={() => setTheme('dark')}
        className={`p-2.5 rounded-xl transition-all duration-300 ${theme === 'dark' ? 'bg-slate-800 text-indigo-400 shadow-lg scale-110' : 'text-white/40 hover:text-white hover:bg-white/10'}`}
        title="Dark Mode"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" /></svg>
      </button>
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
      <div className={`min-h-screen theme-${theme} flex items-center justify-center p-6 relative overflow-hidden transition-all duration-700`}>
        <div className="z-10 w-full flex flex-col items-center gap-8">
          <LoginPage
            onLogin={(u) => { setUser(u); localStorage.setItem('alkaki_user', JSON.stringify(u)); }}
            lang={lang}
            setLang={setLang}
            theme={theme}
            setTheme={setTheme}
          />
        </div>
        <Signature lang={lang} theme={theme} />
        <style>{`
          * { font-family: 'Tajawal', sans-serif; }
          body { 
            margin: 0; 
            background: ${theme === 'light' ? '#F1F5F9' : theme === 'dark' ? '#020617' : '#1E1B4B'} !important;
            transition: background 0.5s ease;
          }
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
      <main className="flex-1 p-4 md:p-6 overflow-y-auto flex flex-col relative">
        <header className="mb-4 md:mb-6 flex flex-row justify-between items-center gap-6 animate-fadeIn">
          <div className="flex items-center gap-5">
            <ThemeSwitcher theme={theme} setTheme={setTheme} />
            <div>
              <h1 className="text-xl md:text-2xl font-black text-heading drop-shadow-sm tracking-tight leading-tight">{t.title}</h1>
              {t.subtitle && <p className="text-muted text-[9px] md:text-[10px] font-bold mt-0.5 uppercase tracking-[0.2em] opacity-80">{t.subtitle}</p>}
            </div>
          </div>
          <div className="bg-white/5 backdrop-blur-xl px-3 py-1.5 rounded-lg text-heading text-[9px] font-black border border-white/10 shadow-lg uppercase tracking-wider transition-transform hover:scale-105 duration-300 hidden lg:block">
            {new Date().toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </header>


        <div className="max-w-7xl mx-auto w-full flex-1 animate-slideUp">
          {activeTab === 'composer' && canCompose && <MessageComposer onSend={saveToHistory} lang={lang} theme={theme} user={user} t={t} />}
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
          color-scheme: light;
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
          color-scheme: dark;
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
        .theme-dusk { 
          color-scheme: dark;
          --bg-page: #1e1b4b; 
          --bg-glass: rgba(30, 27, 75, 0.4); 
          --bg-glass-solid: rgba(30, 27, 75, 0.8);
          --text-heading: #e0e7ff; 
          --text-muted: #a5b4fc; 
          --border-glass: rgba(255, 255, 255, 0.15); 
          --bg-input: #312e81; 
          --text-input: #e0e7ff;
          --bg-sidebar: #1e1b4b;
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
          width: 100%;
          line-height: 1.5;
          overflow-wrap: break-word;
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
