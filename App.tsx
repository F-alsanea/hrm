import React, { useState, useEffect } from 'react';
import { MessageType, MessageLog, User, Language, ThemeMode } from './types';
import { Sidebar } from './components/Sidebar';
import { MessageComposer } from './components/MessageComposer';
import { HistoryTable } from './components/HistoryTable';
import { TemplateViewer } from './components/TemplateViewer';
import { LoginPage } from './components/LoginPage';
import { translations } from './translations';

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
        <style>{`
          * { font-family: 'IBM Plex Sans Arabic', 'Inter', sans-serif; }
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
      <main className="flex-1 p-4 md:p-10 lg:p-12 overflow-y-auto flex flex-col relative">
        <header className="mb-8 md:mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 animate-fadeIn">
          <div>
            <h1 className="text-3xl md:text-5xl font-black text-heading drop-shadow-sm tracking-tight leading-tight">{t.title}</h1>
            <p className="text-muted text-xs md:text-sm font-bold mt-2 uppercase tracking-[0.3em] opacity-80">{t.subtitle}</p>
          </div>
          <div className="bg-white/5 backdrop-blur-xl px-6 py-2.5 rounded-2xl text-heading text-[11px] font-black border border-white/10 shadow-2xl uppercase tracking-widest transition-transform hover:scale-105 duration-300">
            {new Date().toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </header>

        <div className="max-w-7xl mx-auto w-full flex-1 animate-slideUp">
          {activeTab === 'composer' && canCompose && <MessageComposer onSend={saveToHistory} lang={lang} user={user} t={t} />}
          {activeTab === 'history' && canViewHistory && <HistoryTable history={history} onClear={clearHistory} lang={lang} t={t} />}
          {activeTab === 'templates' && canViewTemplates && <TemplateViewer lang={lang} t={t} />}
        </div>

        <footer className="mt-12 py-8 text-center border-t border-white/5 text-muted text-[10px] font-black tracking-[0.4em] uppercase opacity-50">
          {t.madeBy} <a href="https://www.linkedin.com/in/falsanea/" target="_blank" rel="noopener noreferrer" className="text-heading hover:opacity-100 transition-all border-b border-transparent hover:border-current">{t.author}</a>
        </footer>
      </main>

      <style>{`
        :root { --font-main: 'Inter', 'IBM Plex Sans Arabic', sans-serif; }
        * { font-family: var(--font-main); box-sizing: border-box; scroll-behavior: smooth; }
        [dir="rtl"] { line-height: 1.8; letter-spacing: 0; }
        body { margin: 0; line-height: 1.6; background: #0f172a; color: #f8fafc; }
        
        .theme-light { 
          --bg-page: #f1f5f9; 
          --bg-glass: rgba(255, 255, 255, 0.7); 
          --text-heading: #0f172a; 
          --text-muted: #475569; 
          --border-input: rgba(15, 23, 42, 0.1); 
          --bg-input: #ffffff; 
          --text-input: #0f172a;
          --bg-sidebar: #1e293b;
        }
        .theme-dark { 
          --bg-page: #020617; 
          --bg-glass: rgba(15, 23, 42, 0.6); 
          --text-heading: #f8fafc; 
          --text-muted: #94a3b8; 
          --border-input: rgba(248, 250, 252, 0.1); 
          --bg-input: #1e293b; 
          --text-input: #f8fafc;
          --bg-sidebar: #0f172a;
        }
        
        .bg-page { background-color: var(--bg-page); }
        .glass-card { 
          background: var(--bg-glass); 
          backdrop-filter: blur(24px) saturate(180%); 
          -webkit-backdrop-filter: blur(24px) saturate(180%);
          border: 1px solid var(--border-input); 
          box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
          border-radius: 2.5rem;
        }
        
        .text-heading { color: var(--text-heading); }
        .text-muted { color: var(--text-muted); }
        
        input, select, textarea { 
          background-color: var(--bg-input); 
          color: var(--text-input); 
          border: 2px solid var(--border-input); 
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); 
          border-radius: 1.25rem; 
          padding: 1rem 1.25rem; 
          font-weight: 600;
          outline: none;
        }
        input:focus, select:focus, textarea:focus { 
          border-color: #3b82f6; 
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
          transform: translateY(-2px);
        }

        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.8s ease-out forwards; }
        .animate-slideUp { animation: slideUp 1s cubic-bezier(0.23, 1, 0.32, 1) forwards; }

        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(0, 0, 0, 0.1); border-radius: 10px; }
        .theme-dark::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); }
      `}</style>
    </div>
  );
};

export default App;
