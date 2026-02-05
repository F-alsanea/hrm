import React, { useState, useEffect } from 'react';
import { MessageType, MessageLog, User, Language, ThemeMode } from './types';
import Sidebar from './components/Sidebar';
import MessageComposer from './components/MessageComposer';
import HistoryTable from './components/HistoryTable';
import TemplateViewer from './components/TemplateViewer';
import LoginPage from './components/LoginPage';
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

  useEffect(() => {
    localStorage.setItem('alkaki_theme', theme);
  }, [theme]);

  const saveToHistory = (log: MessageLog) => {
    const updated = [log, ...history];
    setHistory(updated);
    localStorage.setItem('alkaki_history', JSON.stringify(updated));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('alkaki_user');
  };

  const clearHistory = () => {
    if (window.confirm(t.confirmClear)) {
      setHistory([]);
      localStorage.removeItem('alkaki_history');
    }
  };

  if (!user) {
    return (
      <div className={`min-h-screen theme-${theme}`}>
        <LoginPage onLogin={(u) => {
          setUser(u);
          localStorage.setItem('alkaki_user', JSON.stringify(u));
        }} lang={lang} setLang={setLang} />
      </div>
    );
  }

  const canViewTemplates = user.role === 'admin' || user.role === 'manager';
  const canViewHistory = user.role === 'admin' || user.role === 'manager';
  const canCompose = user.role === 'admin' || user.role === 'staff';

  return (
    <div className={`flex flex-col md:flex-row h-screen font-sans theme-${theme} bg-page transition-colors duration-500 overflow-hidden`}>
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        user={user} 
        onLogout={handleLogout}
        theme={theme}
        setTheme={setTheme}
        lang={lang}
        setLang={setLang}
        t={t}
        access={{ canCompose, canViewHistory, canViewTemplates }}
      />
      
      <main className="flex-1 p-4 md:p-8 overflow-y-auto flex flex-col relative">
        <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-fadeIn">
          <div>
            <h1 className="text-3xl font-black text-heading drop-shadow-md tracking-tight">{t.title}</h1>
            <p className="text-muted text-sm font-semibold mt-1 uppercase tracking-widest">{t.subtitle}</p>
          </div>
          <div className="glass px-6 py-2 rounded-full text-heading text-xs font-black border border-white/40 shadow-xl uppercase tracking-wider">
            {new Date().toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </header>

        <div className="max-w-6xl mx-auto w-full flex-1 animate-slideUp">
          {activeTab === 'composer' && canCompose && (
            <MessageComposer onSend={saveToHistory} lang={lang} user={user} t={t} />
          )}
          
          {activeTab === 'history' && canViewHistory && (
            <HistoryTable history={history} onClear={clearHistory} lang={lang} t={t} />
          )}

          {activeTab === 'templates' && canViewTemplates && (
            <TemplateViewer lang={lang} t={t} />
          )}
        </div>

        <footer className="mt-8 py-6 text-center border-t border-gray-500/10 text-muted text-[11px] font-black tracking-[0.3em] uppercase opacity-70">
          {t.footer}
        </footer>
      </main>
      
      <style>{`
        :root {
          --transition-speed: 0.4s;
        }

        * {
          font-family: 'IBM Plex Sans Arabic', 'Inter', sans-serif;
        }
        
        body {
          line-height: 1.6;
        }
        
        .theme-light { 
          --bg-page: #f8fafc; 
          --bg-glass: rgba(255, 255, 255, 0.85); 
          --text-heading: #0f172a; 
          --text-muted: #64748b; 
          --bg-sidebar: #1e293b; 
          --bg-input: #ffffff;
          --text-input: #0f172a;
          --border-input: #cbd5e1;
          --accent: #2563eb;
        }
        
        .theme-dark { 
          --bg-page: #020617; 
          --bg-glass: rgba(15, 23, 42, 0.85); 
          --text-heading: #f8fafc; 
          --text-muted: #94a3b8; 
          --bg-sidebar: #000000; 
          --bg-input: #1e293b;
          --text-input: #f8fafc;
          --border-input: #334155;
          --accent: #3b82f6;
        }
        
        .theme-sepia { 
          --bg-page: #fdf6e3; 
          --bg-glass: rgba(253, 246, 227, 0.95); 
          --text-heading: #433422; 
          --text-muted: #736757; 
          --bg-sidebar: #433422; 
          --bg-input: #fffcf0;
          --text-input: #433422;
          --border-input: #e6dfc8;
          --accent: #af5f00;
        }
        
        .bg-page { background-color: var(--bg-page); }
        .glass-card { 
          background: var(--bg-glass); 
          backdrop-filter: blur(16px); 
          border: 1px solid var(--border-input); 
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
        }
        .text-heading { color: var(--text-heading); letter-spacing: -0.01em; }
        .text-muted { color: var(--text-muted); }

        input, select, textarea {
          background-color: var(--bg-input) !important;
          color: var(--text-input) !important;
          border: 1px solid var(--border-input) !important;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          border-radius: 0.75rem !important;
          padding: 0.75rem 1rem !important;
        }

        input:focus, select:focus {
          border-color: var(--accent) !important;
          box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
          outline: none;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.5s ease-out; }
        .animate-slideUp { animation: slideUp 0.6s cubic-bezier(0.23, 1, 0.32, 1); }
      `}</style>
    </div>
  );
};

export default App;
