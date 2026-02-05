
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
    setError('');

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
      {/* Decorative BG elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-300 rounded-full blur-3xl"></div>
      </div>

      <div className="absolute top-4 right-4 z-50">
        <button 
          onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
          className="bg-white/10 backdrop-blur-md px-6 py-2 rounded-full text-white border border-white/20 font-bold hover:bg-white/20 transition-all"
        >
          {lang === 'ar' ? 'English' : 'العربية'}
        </button>
      </div>

      <div className="glass-card w-full max-w-md p-10 rounded-[3rem] shadow-2xl relative z-10">
        <div className="text-center mb-10">
          <div className="w-24 h-24 bg-[#1f4e78] rounded-[2rem] mx-auto mb-6 flex items-center justify-center text-white font-black text-5xl shadow-2xl rotate-3">
            K
          </div>
          <h1 className="text-3xl font-black text-[#1f4e78] tracking-tight">{t.title}</h1>
          <p className="text-gray-500 font-bold mt-2 uppercase text-[10px] tracking-[0.2em]">{t.subtitle}</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-xs font-black text-[#1f4e78] uppercase mb-2 tracking-widest">{t.username}</label>
            <input 
              type="text" 
              placeholder="Username"
              className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-[#1f4e78] outline-none transition-all font-bold text-gray-700"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-xs font-black text-[#1f4e78] uppercase mb-2 tracking-widest">{t.password}</label>
            <input 
              type="password" 
              placeholder="••••••"
              className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-[#1f4e78] outline-none transition-all font-bold text-gray-700"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-red-500 text-xs text-center font-black uppercase tracking-tighter">{error}</p>}
          <button 
            type="submit" 
            className="w-full bg-[#1f4e78] text-white py-5 rounded-[2rem] font-black text-lg shadow-2xl hover:bg-[#153a5c] transition-all transform hover:-translate-y-1 active:scale-95"
          >
            {t.login}
          </button>
        </form>

        <p className="mt-8 text-center text-[10px] font-black text-gray-400 uppercase tracking-widest">
          {t.footer}
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
