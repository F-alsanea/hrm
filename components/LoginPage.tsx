import React, { useState } from 'react';
import { User, Language } from '../types';
import { translations } from '../translations';

interface LoginPageProps {
  onLogin: (user: User) => void;
  lang: Language;
  setLang: (l: Language) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin, lang, setLang }) => {
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

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-transparent relative overflow-hidden">
      <div className="absolute top-6 right-6 z-50">
        <button onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')} className="bg-white/5 backdrop-blur-2xl px-6 py-3 rounded-2xl text-white border border-white/10 font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all shadow-2xl">
          {lang === 'ar' ? 'English' : 'العربية'}
        </button>
      </div>

      <div className="glass-card w-full max-w-lg p-10 md:p-16 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)] relative z-10 animate-slideUp">
        <div className="text-center mb-12 md:mb-16">
          <div className="w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2.5rem] mx-auto mb-8 flex items-center justify-center text-white font-black text-6xl shadow-[0_20px_40px_rgba(37,99,235,0.3)] rotate-6 hover:rotate-0 transition-all duration-500">K</div>
          <h1 className="text-3xl md:text-5xl font-black text-white drop-shadow-2xl tracking-tight leading-tight">{t.title}</h1>
          <p className="text-blue-200/40 font-black mt-4 uppercase text-[10px] md:text-xs tracking-[0.4em]">{t.subtitle}</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-8 md:space-y-10">
          <div className="group">
            <label className="block text-[10px] font-black text-white/40 uppercase mb-4 tracking-[0.2em]">{t.username}</label>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full px-8 py-6 rounded-3xl bg-white/5 text-white font-bold outline-none border-2 border-white/10 focus:border-blue-500/50 focus:bg-white/10 transition-all shadow-inner" placeholder="admin" required />
          </div>
          <div className="group">
            <label className="block text-[10px] font-black text-white/40 uppercase mb-4 tracking-[0.2em]">{t.password}</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-8 py-6 rounded-3xl bg-white/5 text-white font-bold outline-none border-2 border-white/10 focus:border-blue-500/50 focus:bg-white/10 transition-all shadow-inner" placeholder="••••••" required />
          </div>
          {error && <p className="text-red-400 text-[10px] text-center font-black uppercase tracking-[0.2em] animate-pulse">{error}</p>}
          <button type="submit" className="w-full bg-white text-blue-900 py-6 rounded-3xl font-black text-xl shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 uppercase tracking-widest">{t.login}</button>
        </form>

        <div className="mt-12 md:mt-16 text-center text-[9px] font-black text-white/20 uppercase tracking-[0.5em] opacity-50 hover:opacity-100 transition-opacity">
          {t.madeBy} <a href="https://www.linkedin.com/in/falsanea/" target="_blank" rel="noopener noreferrer" className="text-white hover:underline transition-all">{t.author}</a>
        </div>
      </div>
    </div>
  );
};


