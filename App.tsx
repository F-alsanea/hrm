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

  return (
    <>
      <style>{`
        * { box-sizing: border-box; }
        :root { --font-arabic: 'IBM Plex Sans Arabic', 'Inter', sans-serif; }
        body { margin: 0; font-family: var(--font-arabic); line-height: 1.6; -webkit-font-smoothing: antialiased; }
        [dir="rtl"] body, [dir="rtl"] * { line-height: 1.8; letter-spacing: 0; }
        .theme-light { --bg-page: #f8fafc; --bg-glass: rgba(255, 255, 255, 0.9); --text-heading: #1e293b; --text-muted: #64748b; --bg-sidebar: #1e293b; --bg-input: #ffffff; --text-input: #1e293b; --border-input: #e2e8f0; --accent: #2563eb; }
        .theme-dark { --bg-page: #0f172a; --bg-glass: rgba(30, 41, 59, 0.8); --text-heading: #f8fafc; --text-muted: #94a3b8; --bg-sidebar: #000000; --bg-input: #1e293b; --text-input: #f8fafc; --border-input: #334155; --accent: #60a5fa; }
        .bg-page { background-color: var(--bg-page); }
        .glass-card { background: var(--bg-glass); backdrop-filter: blur(20px); border: 1px solid var(--border-input); box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1); }
        .text-heading { color: var(--text-heading); font-weight: 800; }
        .text-muted { color: var(--text-muted); font-weight: 500; }
        input, select, textarea { background-color: var(--bg-input); color: var(--text-input); border: 1px solid var(--border-input); transition: all 0.2s; border-radius: 0.75rem; padding: 0.75rem 1rem; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.4s ease-out; }
        .animate-slideUp { animation: slideUp 0.5s ease-out; }
      `}</style>

      {!user ? (
        <div className={`min-h-screen theme-${theme}`}>
          <LoginPage onLogin={(u) => { setUser(u); localStorage.setItem('alkaki_user', JSON.stringify(u)); }} lang={lang} setLang={setLang} />
        </div>
      ) : (
        <div className={`flex flex-col md:flex-row h-screen font-sans theme-${theme} bg-page transition-colors duration-500 overflow-hidden`}>
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} user={user} onLogout={handleLogout} theme={theme} setTheme={setTheme} lang={lang} setLang={setLang} t={t} access={{ canCompose: user.role === 'admin' || user.role === 'staff', canViewHistory: user.role === 'admin' || user.role === 'manager', canViewTemplates: user.role === 'admin' || user.role === 'manager' }} />
          <main className="flex-1 p-4 md:p-8 overflow-y-auto flex flex-col relative">
            <header className="mb-6 md:mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-fadeIn">
              <div>
                <h1 className="text-2xl md:text-3xl font-black text-heading tracking-tight">{t.title}</h1>
                <p className="text-muted text-[10px] md:text-sm font-semibold mt-1 uppercase tracking-widest">{t.subtitle}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-heading text-[10px] md:text-xs font-black border border-white/20 shadow-sm uppercase">
                {new Date().toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
            </header>
            <div className="max-w-6xl mx-auto w-full flex-1 animate-slideUp">
              {activeTab === 'composer' && (user.role === 'admin' || user.role === 'staff') && <MessageComposer onSend={saveToHistory} lang={lang} user={user} t={t} />}
              {activeTab === 'history' && (user.role === 'admin' || user.role === 'manager') && <HistoryTable history={history} onClear={clearHistory} lang={lang} t={t} />}
              {activeTab === 'templates' && (user.role === 'admin' || user.role === 'manager') && <TemplateViewer lang={lang} t={t} />}
            </div>
            <footer className="mt-8 py-6 text-center border-t border-gray-500/10 text-muted text-[11px] font-black tracking-[0.3em] uppercase opacity-70">
              {t.madeBy} <a href="https://www.linkedin.com/in/falsanea/" target="_blank" rel="noopener noreferrer" className="text-heading hover:underline transition-all">{t.author}</a>
            </footer>
          </main>
        </div>
      )}
    </>
  );
};
export default App;
