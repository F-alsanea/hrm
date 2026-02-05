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
    const credentials: Record<string, any> = {
      'faisal': { pass: '391010', role: 'admin', name: lang === 'ar' ? 'فيصل' : 'Faisal' },
      'turki': { pass: '123456', role: 'manager', name: lang === 'ar' ? 'تركي' : 'Turki' },
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
      <div className="glass-card w-full max-w-[95%] md:max-w-md p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] shadow-2xl relative z-10">
        <div className="text-center mb-8 md:mb-10">
          <div className="w-20 h-20 bg-[#1f4e78] rounded-[1.5rem] mx-auto mb-4 flex items-center justify-center text-white font-black text-4xl shadow-xl rotate-3">K</div>
          <h1 className="text-2xl md:text-3xl font-black text-[#1f4e78] tracking-tight">{t.title}</h1>
          <p className="text-gray-500 font-bold mt-1 uppercase text-[9px] md:text-[10px] tracking-[0.2em]">{t.subtitle}</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-6">
          <input type="text" placeholder={t.username} className="w-full px-6 py-4 rounded-2xl bg-gray-50" value={username} onChange={(e) => setUsername(e.target.value)} required />
          <input type="password" placeholder={t.password} className="w-full px-6 py-4 rounded-2xl bg-gray-50" value={password} onChange={(e) => setPassword(e.target.value)} required />
          {error && <p className="text-red-500 text-xs text-center font-black">{error}</p>}
          <button type="submit" className="w-full bg-[#1f4e78] text-white py-5 rounded-[2rem] font-black text-lg shadow-xl">{t.login}</button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
