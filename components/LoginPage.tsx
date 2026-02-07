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
    <div className="flex bg-black/5 backdrop-blur-xl p-1.5 rounded-2xl border border-current/10 no-print shadow-sm">
      <button onClick={() => setTheme('light')} className={`p-2 rounded-xl transition-all ${theme === 'light' ? 'bg-white text-indigo-600 shadow-md scale-110' : 'opacity-40 hover:opacity-100'}`}>☀️</button>
      <button onClick={() => setTheme('dusk')} className={`p-2 rounded-xl transition-all ${theme === 'dusk' ? 'bg-indigo-600 text-white shadow-md scale-110' : 'opacity-40 hover:opacity-100'}`}>⛅</button>
      <button onClick={() => setTheme('dark')} className={`p-2 rounded-xl transition-all ${theme === 'dark' ? 'bg-slate-800 text-indigo-400 shadow-md scale-110' : 'opacity-40 hover:opacity-100'}`}>🌙</button>
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
    const userEntry = credentials[username.toLowerCase()];
    if (userEntry && userEntry.pass === password) {
      onLogin({ username, role: userEntry.role, displayName: userEntry.name });
    } else {
      setError(t.loginError);
    }
  };

  const cardStyle = theme === 'light'
    ? 'bg-white border-[#0F172A]/15 shadow-xl transition-all duration-300 hover:shadow-2xl text-slate-900'
    : theme === 'dark'
      ? 'bg-[#020617]/80 border-white/10 backdrop-blur-xl transition-all duration-300 hover:border-indigo-500/30 text-white'
      : 'bg-indigo-950/40 border-indigo-400/40 backdrop-blur-xl transition-all duration-300 hover:bg-white/10 text-[#E0E7FF]';

  const inputStyle = `w-full p-5 pr-12 rounded-2xl border font-black outline-none transition-all ${theme === 'light' ? 'bg-slate-50 border-slate-300 focus:border-indigo-500' : 'bg-black/20 border-white/10 focus:border-indigo-500'
    }`;

  return (
    <div className="w-full max-w-md p-6 animate-fadeIn">
      <form onSubmit={handleLogin} className={`p-12 rounded-[3.5rem] border z-10 text-right ${cardStyle}`}>
        <div className="flex justify-between items-center mb-10">
          <ThemeSwitcher theme={theme} setTheme={setTheme} />
          <div className="p-4 bg-indigo-600 rounded-2xl text-white shadow-xl text-3xl font-black">🏢</div>
        </div>

        <h2 className="text-3xl font-black mb-1">{t.title}</h2>
        <p className="text-[10px] font-black opacity-40 mb-10 uppercase tracking-[0.2em]">{t.subtitle}</p>

        <div className="space-y-6">
          <div className="relative">
            <span className="absolute right-4 top-1/2 -translate-y-1/2 opacity-30">👤</span>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              className={inputStyle}
              placeholder={t.username}
              required
            />
          </div>

          <div className="relative">
            <span className="absolute right-4 top-1/2 -translate-y-1/2 opacity-30">🔒</span>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className={inputStyle}
              placeholder={t.password}
              required
            />
          </div>

          <button
            type="button"
            onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
            className={`w-full py-3 rounded-xl border border-current/10 font-bold text-xs uppercase tracking-widest transition-all ${theme === 'light' ? 'hover:bg-slate-100' : 'hover:bg-white/5'}`}
          >
            {lang === 'ar' ? 'English Language' : 'اللغة العربية'}
          </button>

          {error && <div className="text-rose-500 text-xs font-black text-center animate-pulse">{error}</div>}

          <button
            type="submit"
            className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black shadow-xl transform transition-transform active:scale-[0.98] text-lg uppercase tracking-wide"
          >
            {t.login}
          </button>
        </div>
      </form>
    </div>
  );
};
