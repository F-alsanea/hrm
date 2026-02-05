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
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-[#1f4e78]">
      <div className="absolute top-4 right-4 z-50">
        <button onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')} className="bg-white/10 backdrop-blur-md px-6 py-2 rounded-full text-white border border-white/20 font-bold">
          {lang === 'ar' ? 'English' : 'العربية'}
        </button>
      </div>

      <div className="glass-card w-full max-w-md p-6 md:p-10 rounded-[3rem] shadow-2xl relative z-10">
        <div className="text-center mb-10">
          <div className="w-24 h-24 bg-[#1f4e78] rounded-[2rem] mx-auto mb-6 flex items-center justify-center text-white font-black text-5xl shadow-2xl rotate-3">K</div>
          <h1 className="text-2xl md:text-3xl font-black text-white drop-shadow-md tracking-tight">{t.title}</h1>
          <p className="text-blue-100/60 font-bold mt-2 uppercase text-[10px] tracking-[0.2em]">{t.subtitle}</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-xs font-black text-white/80 uppercase mb-2 tracking-widest">{t.username}</label>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full px-6 py-4 rounded-2xl bg-white text-[#1f4e78] font-bold outline-none" placeholder="Username" required />
          </div>
          <div>
            <label className="block text-xs font-black text-white/80 uppercase mb-2 tracking-widest">{t.password}</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-6 py-4 rounded-2xl bg-white text-[#1f4e78] font-bold outline-none" placeholder="••••••" required />
          </div>
          {error && <p className="text-red-400 text-xs text-center font-black uppercase">{error}</p>}
          <button type="submit" className="w-full bg-white text-[#1f4e78] py-5 rounded-[2rem] font-black text-lg shadow-2xl hover:bg-blue-50 transition-all">{t.login}</button>
        </form>

        <div className="mt-8 text-center text-[10px] font-black text-white/40 uppercase tracking-widest">
          {t.madeBy} <a href="https://www.linkedin.com/in/falsanea/" target="_blank" rel="noopener noreferrer" className="text-white hover:underline transition-all">{t.author}</a>
        </div>
      </div>
    </div>
  );
};
export default LoginPage;
