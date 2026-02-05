import React, { useState } from 'react';
import { User, Language } from '../types';
import { translations } from '../translations';

interface LoginPageProps {
  onLogin: (user: User) => void;
  lang: Language;
  setLang: (l: Language) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, lang, setLang }) => {
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
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#1f4e78] relative overflow-hidden">
      <div className="absolute top-4 right-4 z-50">
        <button onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')} className="bg-white/10 backdrop-blur-md px-6 py-2 rounded-full text-white border border-white/20 font-bold hover:bg-white/20 transition-all">
          {lang === 'ar' ? 'English' : 'العربية'}
        </button>
      </div>

      <div className="glass-card w-full max-w-md p-8 md:p-12 rounded-[2.5rem] md:rounded-[3.5rem] shadow-2xl relative z-10">
        <div className="text-center mb-10 md:mb-12">
          <div className="w-20 h-20 md:w-28 md:h-28 bg-[#1f4e78] rounded-[2rem] mx-auto mb-6 flex items-center justify-center text-white font-black text-5xl shadow-xl rotate-3">K</div>
          <h1 className="text-2xl md:text-4xl font-black text-white drop-shadow-lg tracking-tight">{t.title}</h1>
          <p className="text-blue-100/60 font-bold mt-2 uppercase text-[10px] md:text-xs tracking-[0.2em]">{t.subtitle}</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6 md:space-y-8">
          <div>
            <label className="block text-xs font-black text-white/90 uppercase mb-3 tracking-widest">{t.username}</label>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full px-6 py-5 rounded-2xl bg-white text-[#1f4e78] font-bold outline-none border-2 border-transparent focus:border-blue-300 transition-all" placeholder="Username" required />
          </div>
          <div>
            <label className="block text-xs font-black text-white/90 uppercase mb-3 tracking-widest">{t.password}</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-6 py-5 rounded-2xl bg-white text-[#1f4e78] font-bold outline-none border-2 border-transparent focus:border-blue-300 transition-all" placeholder="••••••" required />
          </div>
          {error && <p className="text-red-300 text-xs text-center font-black uppercase tracking-widest">{error}</p>}
          <button type="submit" className="w-full bg-white text-[#1f4e78] py-5 rounded-[2.5rem] font-black text-xl shadow-2xl hover:bg-blue-50 transition-all transform hover:-translate-y-1 active:scale-95">{t.login}</button>
        </form>

        <div className="mt-10 md:mt-12 text-center text-[10px] font-black text-white/40 uppercase tracking-widest">
          {t.madeBy} <a href="https://www.linkedin.com/in/falsanea/" target="_blank" rel="noopener noreferrer" className="text-white hover:underline transition-all">{t.author}</a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
