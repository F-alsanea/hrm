import React, { useState } from 'react';
import { User, Language } from '../types';
import { translations } from '../translations';

const LoginPage: React.FC<{ onLogin: (u: User) => void; lang: Language; setLang: (l: Language) => void; }> = ({ onLogin, lang, setLang }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const t = translations[lang];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const credentials: Record<string, any> = {
      'faisal': { pass: '391010', role: 'admin', name: lang === 'ar' ? 'فيصل' : 'Faisal' },
      'turki': { pass: '123456', role: 'manager', name: lang === 'ar' ? 'تركي' : 'Turki' },
      'abdulaziz': { pass: '123456', role: 'staff', name: lang === 'ar' ? 'عبدالعزيز' : 'Abdulaziz' },
      'deena': { pass: '123456', role: 'staff', name: lang === 'ar' ? 'دينا' : 'Deena' }
    };
    const userEntry = credentials[username.toLowerCase()];
    if (userEntry && userEntry.pass === password) { onLogin({ username, role: userEntry.role, displayName: userEntry.name }); } 
    else { setError(t.loginError); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#1f4e78] relative overflow-hidden">
      <div className="absolute top-4 right-4 z-50">
        <button onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')} className="bg-white/10 backdrop-blur-md px-6 py-2 rounded-full text-white border border-white/20 font-bold">{lang === 'ar' ? 'English' : 'العربية'}</button>
      </div>
      <div className="glass-card w-full max-w-md p-8 md:p-12 rounded-[3rem] shadow-2xl relative z-10">
        <div className="text-center mb-10">
          <div className="w-24 h-24 bg-[#1f4e78] rounded-[2rem] mx-auto mb-6 flex items-center justify-center text-white font-black text-5xl rotate-3 shadow-xl">K</div>
          <h1 className="text-2xl md:text-3xl font-black text-white drop-shadow-md">{t.title}</h1>
          <p className="text-blue-100/60 font-bold mt-2 uppercase text-[10px] tracking-widest">{t.subtitle}</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-xs font-black text-white/90 uppercase mb-2 tracking-widest">{t.username}</label>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full bg-white text-[#1f4e78] font-bold outline-none" required />
          </div>
          <div>
            <label className="block text-xs font-black text-white/90 uppercase mb-2 tracking-widest">{t.password}</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-white text-[#1f4e78] font-bold outline-none" required />
          </div>
          {error && <p className="text-red-300 text-xs text-center font-black uppercase tracking-widest">{error}</p>}
          <button type="submit" className="w-full bg-white text-[#1f4e78] py-5 rounded-[2rem] font-black text-lg hover:bg-blue-50 transition-all shadow-xl">{t.login}</button>
        </form>
        <div className="mt-8 text-center text-[10px] font-black text-white/40 uppercase tracking-widest">
          {t.madeBy} <a href="https://www.linkedin.com/in/falsanea/" target="_blank" rel="noopener noreferrer" className="text-white hover:underline">{t.author}</a>
        </div>
      </div>
    </div>
  );
};
export default LoginPage;
