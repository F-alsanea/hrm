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
    <div className="fixed bottom-6 w-full flex justify-center z-[100] pointer-events-none no-print">
      <a
        href="https://www.linkedin.com/in/falsanea/"
        target="_blank"
        rel="noopener noreferrer"
        className={`
          pointer-events-auto px-6 py-3 rounded-full border backdrop-blur-xl
          transition-all duration-500 hover:scale-110 hover:shadow-2xl flex items-center gap-3 text-sm font-black
          ${theme === 'light' ? 'bg-white/95 border-slate-300 text-[#0F172A] shadow-xl shadow-slate-200/50' :
            theme === 'dark' ? 'bg-[#020617]/90 border-slate-700 text-[#F1F5F9] shadow-2xl' :
              'bg-[#1E1B4B]/95 border-indigo-400/40 text-[#E0E7FF] shadow-[0_0_30px_rgba(79,70,229,0.4)]'}
        `}
      >
        <span className="opacity-60">{lang === 'ar' ? 'تصميم وتطوير' : 'Designed & Developed by'}</span>
        <div className={`w-px h-4 ${theme === 'light' ? 'bg-[#0F172A]/20' : 'bg-white/20'}`} />
        <span className={theme === 'light' ? 'text-indigo-700' : 'text-indigo-300'}>
          {lang === 'ar' ? 'فيصل السني' : 'Faisal Alsanea'}
        </span>
      </a>
    </div>
  );
};

const ThemeSwitcher: React.FC<{ theme: ThemeMode; setTheme: (t: ThemeMode) => void }> = ({ theme, setTheme }) => {
  return (
    <div className="flex bg-black/10 backdrop-blur-xl p-1.5 rounded-2xl border border-current/10 no-print shadow-xl">
      <button onClick={() => setTheme('light')} className={`p-2 rounded-xl transition-all ${theme === 'light' ? 'bg-white text-indigo-600 shadow-md scale-110' : 'opacity-40 hover:opacity-100'}`}>☀️</button>
      <button onClick={() => setTheme('dusk')} className={`p-2 rounded-xl transition-all ${theme === 'dusk' ? 'bg-indigo-600 text-white shadow-md scale-110' : 'opacity-40 hover:opacity-100'}`}>⛅</button>
      <button onClick={() => setTheme('dark')} className={`p-2 rounded-xl transition-all ${theme === 'dark' ? 'bg-slate-800 text-indigo-400 shadow-md scale-110' : 'opacity-40 hover:opacity-100'}`}>🌙</button>
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
      <main className="flex-1 p-4 md:p-8 lg:p-10 overflow-y-auto flex flex-col relative">
        <header className="mb-6 md:mb-8 flex flex-row justify-between items-center gap-6 animate-fadeIn">
          <div className="flex items-center gap-6">
            <ThemeSwitcher theme={theme} setTheme={setTheme} />
            <div>
              <h1 className="text-2xl md:text-4xl font-black text-heading drop-shadow-sm tracking-tight leading-tight">{t.title}</h1>
              <p className="text-muted text-[10px] md:text-xs font-bold mt-1 uppercase tracking-[0.2em] opacity-80">{t.subtitle}</p>
            </div>
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
        .theme-dusk { 
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
