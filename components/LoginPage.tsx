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
    <div className="min-h-screen flex items-center justify-center p-4 md:p-6 bg-transparent relative overflow-hidden">
      <div className="absolute top-4 right-4 md:top-6 md:right-6 z-50">
        <button onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')} className="bg-white/5 backdrop-blur-2xl px-5 py-2.5 rounded-xl text-white border border-white/10 font-black text-[10px] uppercase tracking-wider hover:bg-white/10 transition-all shadow-xl">
          {lang === 'ar' ? 'English' : 'العربية'}
        </button>
      </div>

      <div className="glass-card w-full max-w-md p-8 md:p-12 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)] relative z-10 animate-slideUp">
        <div className="text-center mb-10 md:mb-12">
          <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2rem] mx-auto mb-6 flex items-center justify-center text-white font-black text-5xl shadow-[0_20px_40px_rgba(37,99,235,0.3)] rotate-6 hover:rotate-0 transition-all duration-500">K</div>
          <h1 className="text-2xl md:text-4xl font-black text-white drop-shadow-2xl leading-tight">{t.title}</h1>
          <p className="text-blue-200/40 font-black mt-3 uppercase text-[9px] md:text-[10px] tracking-[0.2em]">{t.subtitle}</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6 md:space-y-8">
          <div className="group">
            <label className="block text-[9px] font-black text-white/40 uppercase mb-3 tracking-[0.1em]">{t.username}</label>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full px-6 py-4 rounded-2xl bg-white/5 text-white font-bold outline-none border-2 border-white/10 focus:border-blue-500/50 focus:bg-white/10 transition-all shadow-inner text-sm" placeholder="admin" required />
          </div>
          <div className="group">
            <label className="block text-[9px] font-black text-white/40 uppercase mb-3 tracking-[0.1em]">{t.password}</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-6 py-4 rounded-2xl bg-white/5 text-white font-bold outline-none border-2 border-white/10 focus:border-blue-500/50 focus:bg-white/10 transition-all shadow-inner text-sm" placeholder="••••••" required />
          </div>
          {error && <p className="text-red-400 text-[9px] text-center font-black uppercase tracking-[0.1em] animate-pulse">{error}</p>}
          <button type="submit" className="w-full bg-white text-blue-900 py-4.5 rounded-2xl font-black text-lg shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 uppercase tracking-wide">{t.login}</button>
        </form>

        <div className="mt-10 md:mt-12 text-center text-[8px] font-black text-white/20 uppercase tracking-[0.3em] opacity-50 hover:opacity-100 transition-opacity">
          {t.madeBy} <a href="https://www.linkedin.com/in/falsanea/" target="_blank" rel="noopener noreferrer" className="text-white hover:underline transition-all">{t.author}</a>
        </div>
      </div>
    </div>
  );
};



