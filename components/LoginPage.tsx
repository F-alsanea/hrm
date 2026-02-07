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
    <div className="min-h-screen flex items-center justify-center p-6 bg-transparent relative">
      <div className="absolute top-8 right-8 z-50">
        <button onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')} className="bg-white/5 backdrop-blur-3xl px-6 py-3 rounded-2xl text-white border border-white/10 font-bold text-xs uppercase tracking-widest hover:bg-white/10 transition-all">
          {lang === 'ar' ? 'English' : 'العربية'}
        </button>
      </div>

      <div className="w-full max-w-sm p-4 animate-slideUp">
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-white text-blue-950 rounded-3xl mx-auto mb-8 flex items-center justify-center font-black text-4xl shadow-2xl">K</div>
          <h1 className="text-3xl font-black text-white tracking-tight leading-tight mb-3">{t.title}</h1>
          <p className="text-white/40 font-bold uppercase text-[10px] tracking-[0.4em]">{t.subtitle}</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-[10px] font-black text-white/30 uppercase tracking-[0.2em] px-2">{t.username}</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-6 py-4 rounded-2xl bg-white/5 text-white font-bold outline-none border border-white/10 focus:border-white/30 focus:bg-white/10 transition-all text-sm"
              placeholder="admin"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="block text-[10px] font-black text-white/30 uppercase tracking-[0.2em] px-2">{t.password}</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-6 py-4 rounded-2xl bg-white/5 text-white font-bold outline-none border border-white/10 focus:border-white/30 focus:bg-white/10 transition-all text-sm"
              placeholder="••••••"
              required
            />
          </div>
          {error && <p className="text-red-400 text-[10px] text-center font-bold uppercase tracking-wider animate-pulse">{error}</p>}
          <button type="submit" className="w-full bg-white text-blue-950 py-5 rounded-2xl font-black text-base shadow-2xl hover:bg-opacity-90 active:scale-[0.98] transition-all duration-300 uppercase tracking-widest">{t.login}</button>
        </form>
      </div>
    </div>
  );
};



