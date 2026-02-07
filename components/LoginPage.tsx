import React, { useState } from 'react';
import { User, Language, ThemeMode } from '../types';
import { translations } from '../translations';

interface LoginPageProps {
  onLogin: (user: User) => void;
  lang: Language;
  setLang: (l: Language) => void;
  theme: ThemeMode;
  setTheme: (t: ThemeMode) => void;
}

const ThemeSwitcher: React.FC<{ theme: ThemeMode; setTheme: (t: ThemeMode) => void }> = ({ theme, setTheme }) => {
  return (
    <div className="flex bg-black/10 backdrop-blur-xl p-1.5 rounded-2xl border border-white/10 no-print shadow-xl">
      <button
        onClick={() => setTheme('light')}
        className={`p-2 rounded-xl transition-all duration-300 ${theme === 'light' ? 'bg-white text-indigo-600 shadow-md scale-110' : 'text-white/40 hover:text-white'}`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" /></svg>
      </button>
      <button
        onClick={() => setTheme('dusk')}
        className={`p-2 rounded-xl transition-all duration-300 ${theme === 'dusk' ? 'bg-indigo-600 text-white shadow-md scale-110' : 'text-white/40 hover:text-white'}`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v2" /><path d="m4.93 4.93 1.41 1.41" /><path d="M20 12h2" /><path d="m19.07 4.93-1.41 1.41" /><path d="M15.947 12.65a4 4 0 0 0-5.925-4.128" /><path d="M13 22H7a5 5 0 1 1 4.9-6H13a5 5 0 0 1 0 10Z" /></svg>
      </button>
      <button
        onClick={() => setTheme('dark')}
        className={`p-2 rounded-xl transition-all duration-300 ${theme === 'dark' ? 'bg-slate-800 text-indigo-400 shadow-md scale-110' : 'text-white/40 hover:text-white'}`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" /></svg>
      </button>
    </div>
  );
};

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin, lang, setLang, theme, setTheme }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const t = translations[lang];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const credentials: Record<string, { pass: string, role: 'admin' | 'manager' | 'staff', name: string }> = {
      'faisal': { pass: '391010', role: 'admin', name: lang === 'ar' ? 'فيصل' : 'Faisal' },
      'turki': { pass: '123456', role: 'manager', name: lang === 'ar' ? 'تركي' : 'Turki' },
      'abdulaziz': { pass: '123456', role: 'staff', name: lang === 'ar' ? 'عبدالعزيز' : 'Abdulaziz' },
      'deena': { pass: '123456', role: 'staff', name: lang === 'ar' ? 'دينا' : 'Deena' }
    };
    const userEntry = credentials[username.toLowerCase().trim()];
    if (userEntry && userEntry.pass === password) {
      onLogin({ username, role: userEntry.role, displayName: userEntry.name });
    } else {
      setError(t.loginError);
    }
  };

  const inputClasses = `w-full p-5 pr-14 rounded-[1.5rem] border-2 font-black outline-none transition-all duration-300 ${theme === 'light'
      ? 'bg-slate-50/50 border-slate-100 focus:border-indigo-500 focus:bg-white text-slate-900'
      : 'bg-black/20 border-white/5 focus:border-indigo-500/50 focus:bg-black/40 text-white'
    }`;

  return (
    <div className="w-full max-w-xl p-4 animate-fadeIn">
      <div className={`p-10 md:p-16 rounded-[4rem] border backdrop-blur-3xl shadow-2xl relative overflow-hidden transition-all duration-700 ${theme === 'light' ? 'bg-white/80 border-white shadow-slate-200/50' :
          theme === 'dark' ? 'bg-slate-950/70 border-white/10 shadow-black/40' :
            'bg-indigo-950/60 border-indigo-400/20 shadow-indigo-950/50'
        }`}>
        {/* Top bar with Theme and Lang */}
        <div className="flex justify-between items-center mb-16">
          <ThemeSwitcher theme={theme} setTheme={setTheme} />
          <button
            onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
            className={`px-6 py-2.5 rounded-2xl border font-bold text-[10px] uppercase tracking-widest transition-all ${theme === 'light' ? 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100' : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
              }`}
          >
            {lang === 'ar' ? 'English' : 'العربية'}
          </button>
        </div>

        {/* Branding */}
        <div className="text-right mb-12">
          <div className="flex items-center justify-end gap-6 mb-8 group">
            <div className="text-right">
              <h2 className={`text-4xl font-black mb-2 tracking-tight ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>{t.title}</h2>
              <p className={`text-[11px] font-black uppercase tracking-[0.3em] ${theme === 'light' ? 'text-slate-400' : 'text-indigo-300/60'}`}>{t.subtitle}</p>
            </div>
            <div className="w-20 h-20 bg-indigo-600 rounded-[2rem] flex items-center justify-center text-white text-4xl shadow-2xl group-hover:scale-110 transition-transform duration-500">🏢</div>
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-8">
          <div className="space-y-3">
            <label className={`block text-[10px] font-black uppercase tracking-[0.2em] px-4 ${theme === 'light' ? 'text-slate-400' : 'text-white/30'}`}>{t.username}</label>
            <div className="relative">
              <span className="absolute right-6 top-1/2 -translate-y-1/2 opacity-30 text-xl pointer-events-none">👤</span>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                className={inputClasses}
                placeholder="faisal"
                required
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className={`block text-[10px] font-black uppercase tracking-[0.2em] px-4 ${theme === 'light' ? 'text-slate-400' : 'text-white/30'}`}>{t.password}</label>
            <div className="relative">
              <span className="absolute right-6 top-1/2 -translate-y-1/2 opacity-30 text-xl pointer-events-none">🔒</span>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className={inputClasses}
                placeholder="••••••"
                required
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-2xl text-[10px] font-black text-center uppercase tracking-widest animate-pulse">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full py-6 bg-indigo-600 hover:bg-indigo-500 text-white rounded-[1.8rem] font-black shadow-[0_20px_40px_rgba(79,70,229,0.3)] transform transition-all active:scale-[0.98] text-xl uppercase tracking-widest flex items-center justify-center gap-3"
          >
            {t.login}
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="opacity-50"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
          </button>
        </form>
      </div>
    </div>
  );
};
