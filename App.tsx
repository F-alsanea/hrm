
import React, { useState, useRef, useEffect } from 'react';
import { Candidate, ViewMode, User, ThemeMode, UserRole } from './types';
import { INITIAL_CANDIDATES } from './constants';
import CandidateCard from './components/CandidateCard';
import Signature from './components/Signature';
import * as XLSX from 'xlsx';

const MOCK_USERS: Record<string, { pass: string; role: UserRole; name: string }> = {
  'faisal': { pass: '391010', role: 'ADMIN', name: 'فيصل السني' },
  'turki': { pass: '123456', role: 'MANAGER', name: 'تركي آل تركي' },
  'abdulaziz': { pass: '123456', role: 'STAFF', name: 'عبدالعزيز' },
  'deena': { pass: '123456', role: 'STAFF', name: 'دينا' }
};

const App: React.FC = () => {
  const [candidates, setCandidates] = useState<Candidate[]>(() => {
    const saved = localStorage.getItem('smart_candidates');
    return saved ? JSON.parse(saved) : INITIAL_CANDIDATES;
  });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.LIST);
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('smart_theme');
    return (saved as ThemeMode) || 'DARK';
  });
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    document.body.className = '';
    if (theme === 'DARK') document.body.classList.add('theme-dark');
    if (theme === 'DUSK') document.body.classList.add('theme-dusk');
    localStorage.setItem('smart_theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('smart_candidates', JSON.stringify(candidates));
  }, [candidates]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const found = MOCK_USERS[loginData.username.toLowerCase()];
    if (found && found.pass === loginData.password) {
      setUser({
        username: loginData.username,
        role: found.role,
        displayName: found.name
      });
      setError('');
    } else {
      setError('اسم المستخدم أو كلمة المرور غير صحيحة');
    }
  };

  const handleLogout = () => {
    setUser(null);
    setLoginData({ username: '', password: '' });
  };

  const currentCandidate = candidates[selectedIndex];

  const handlePrint = () => {
    window.print();
  };

  const updateCandidateNotes = (notes: string) => {
    const updated = [...candidates];
    updated[selectedIndex].interviewerNotes = notes;
    setCandidates(updated);
  };

  const deleteCandidate = (id: number) => {
    if (window.confirm('هل أنت متأكد من حذف هذا المرشح؟')) {
      const updated = candidates.filter(c => c.id !== id);
      setCandidates(updated);
      if (selectedIndex >= updated.length) {
        setSelectedIndex(Math.max(0, updated.length - 1));
      }
    }
  };

  const clearAllCandidates = () => {
    if (window.confirm('⚠️ تحذير: هل أنت متأكد من حذف قائمة البيانات بالكامل؟ لا يمكن التراجع عن هذا الإجراء.')) {
      setCandidates([]);
      setSelectedIndex(0);
      alert('تم مسح جميع البيانات بنجاح.');
    }
  };

  // Helper to normalize strings for comparison
  const normalizeValues = (val: string) => val.trim().toLowerCase().replace(/[\u064B-\u065F\u06D6-\u06DC\u06DF-\u06E8\u06EA-\u06ED]/g, ""); // Remove Tashkeel

  const findVal = (row: any, keywords: string[]) => {
    const keys = Object.keys(row);

    // 1. Exact match (normalized)
    const exactKey = keys.find(k => keywords.some(kw => normalizeValues(k) === normalizeValues(kw)));
    if (exactKey) return String(row[exactKey]);

    // 2. Partial match (normalized)
    const partialKey = keys.find(k => keywords.some(kw => {
      const cleanK = normalizeValues(k);
      const cleanKW = normalizeValues(kw);
      return cleanK.includes(cleanKW) || cleanKW.includes(cleanK);
    }));

    if (partialKey) {
      console.log(`Matched partial key: '${partialKey}' for keywords: [${keywords.join(', ')}]`);
      return String(row[partialKey]);
    }

    console.warn(`No match found for keywords: [${keywords.join(', ')}]. Available keys:`, keys);
    return "-";
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    const fileExt = file.name.split('.').pop()?.toLowerCase();

    reader.onload = (e) => {
      let newCandidates: Candidate[] = [];
      try {
        let jsonData: any[] = [];

        if (fileExt === 'xlsx' || fileExt === 'xls') {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          jsonData = XLSX.utils.sheet_to_json(worksheet);
        } else {
          // CSV or Text handling
          const text = e.target?.result as string;
          const workbook = XLSX.read(text, { type: 'string' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          jsonData = XLSX.utils.sheet_to_json(worksheet);
        }

        if (jsonData.length === 0) {
          alert("الملف فارغ أو لا يحتوي على بيانات صحيحة");
          return;
        }

        console.log("First row keys:", Object.keys(jsonData[0])); // Debug log

        newCandidates = jsonData.map((row, index) => ({
          id: Date.now() + index + Math.random(), // Ensure uniqueness
          fullName: findVal(row, ["الاسم الكامل", "الاسم", "Name", "Full Name", "اسم المرشح", "Candidate Name"]),
          phone: findVal(row, ["رقم الجوال", "الجوال", "الهاتف", "Mobile", "Phone", "Cell", "Mobile Number"]),
          age: findVal(row, ["العمر", "Age", "السن"]),
          nationality: findVal(row, ["الجنسية", "Nationality", "Country"]),
          residencyStatus: findVal(row, ["حالة الإقامة", "الإقامة", "Residency", "Iqama Status", "نوع الإقامة"]),
          jobAppliedFor: findVal(row, ["الوظيفة", "المسمى الوظيفي", "Job", "Position", "Applied Position", "الوظيفة المتقدم عليها"]),
          currentlyEmployed: findVal(row, ["على رأس العمل", "Employed", "Current Employment"]),
          fullTimeAvailability: findVal(row, ["تفرغ", "Availability", "Available", "هل أنت متفرغ"]),
          militaryStatus: findVal(row, ["الحالة المهنية", "Status", "Military Status", "المهنة"]),
          socialStatus: findVal(row, ["الحالة الاجتماعية", "Social", "Marital Status"]),
          yearsOfExperience: findVal(row, ["سنوات الخبرة", "الخبرة", "Experience", "Years of Experience", "Total Experience"]),
          workedHajj: findVal(row, ["حج", "Hajj", "خبرة حج", "موسم الحج"]),
          hasHealthCard: findVal(row, ["كرت صحي", "Health Card", "بطاقة صحية"]),
          lastSalary: findVal(row, ["آخر راتب", "الراتب", "Salary", "Last Salary", "Current Salary"]),
          hasTransportation: findVal(row, ["مواصلات", "Transportation", "سيارة", "Car"]),
          englishLevel: findVal(row, ["مستوى اللغة", "اللغة الإنجليزية", "English", "English Level"]),
          willingToWorkReqs: findVal(row, ["متطلبات العمل", "Requirements", "موافق على الشروط"]),
          housingInfo: findVal(row, ["معلومات السكن", "السكن", "Housing", "Location", "Residence"]),
          willingToInterviewInJeddah: findVal(row, ["جدة", "Jeddah", "مقابلة جدة"]),
          education: findVal(row, ["التعليم", "المؤهل", "Education", "Degree", "Qualification", "المؤهل العلمي"]),
        }));

        setCandidates(prev => [...prev, ...newCandidates]); // Append new data
        setSelectedIndex(candidates.length);
        setViewMode(ViewMode.LIST);
        alert(`تم بنجاح معالجة البيانات واستيراد ${newCandidates.length} مرشح!`);
      } catch (err) {
        console.error("Excel processing error:", err);
        alert("حدث خطأ أثناء قراءة الملف، يرجى التأكد من الصيغة.");
      }
    };


    if (fileExt === 'xlsx' || fileExt === 'xls') {
      reader.readAsArrayBuffer(file);
    } else {
      reader.readAsText(file);
    }
  };

  const ThemeSwitcher = () => (
    <div className="flex bg-black/10 backdrop-blur-md p-1.5 rounded-2xl border border-white/10 shadow-inner">
      <button
        onClick={() => setTheme('LIGHT')}
        className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-300 ${theme === 'LIGHT' ? 'bg-white shadow-md scale-110 text-blue-600' : 'opacity-40 hover:opacity-100'}`}
        title="Light Mode"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" /></svg>
      </button>
      <button
        onClick={() => setTheme('DARK')}
        className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-300 ${theme === 'DARK' ? 'bg-slate-900 shadow-md text-white scale-110' : 'opacity-40 hover:opacity-100'}`}
        title="Dark Mode"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" /></svg>
      </button>
      <button
        onClick={() => setTheme('DUSK')}
        className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-300 ${theme === 'DUSK' ? 'bg-indigo-900 shadow-md text-white scale-110' : 'opacity-40 hover:opacity-100'}`}
        title="Dusk Mode"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v2" /><path d="m4.93 4.93 1.41 1.41" /><path d="M20 12h2" /><path d="m19.07 4.93-1.41 1.41" /><path d="M15.947 12.65a4 4 0 0 0-5.925-4.128" /><path d="M13 22H7a5 5 0 1 1 4.9-6H13a5 5 0 0 1 0 10Z" /></svg>
      </button>
    </div>
  );

  if (!user) {
    return (
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden transition-colors duration-500">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>

        <div className="absolute top-8 right-8 z-50 animate-in fade-in slide-in-from-top-4 duration-700">
          <ThemeSwitcher />
        </div>

        <div className="glass-card w-full max-w-md p-10 rounded-3xl shadow-2xl relative z-10 mx-4 border border-white/20 animate-in zoom-in-95 duration-500">
          <div className="flex flex-col items-center mb-10">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-xl flex items-center justify-center mb-6 transform hover:rotate-12 transition-transform duration-500">
              <span className="text-4xl text-white">💼</span>
            </div>
            <h1 className="text-3xl font-black text-center mb-2 tracking-tight">تسجيل الدخول</h1>
            <p className="opacity-60 text-sm font-bold">بوابة إدارة استقطاب الكفاءات</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <input
                type="text"
                placeholder="اسم المستخدم"
                required
                className="w-full bg-white/50 dark:bg-black/20 p-5 rounded-2xl border border-white/10 outline-none focus:ring-4 focus:ring-blue-500/20 transition-all text-center font-black"
                value={loginData.username}
                onChange={e => setLoginData({ ...loginData, username: e.target.value })}
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="كلمة المرور"
                required
                className="w-full bg-white/50 dark:bg-black/20 p-5 rounded-2xl border border-white/10 outline-none focus:ring-4 focus:ring-blue-500/20 transition-all text-center font-black"
                value={loginData.password}
                onChange={e => setLoginData({ ...loginData, password: e.target.value })}
              />
            </div>
            {error && <p className="text-red-500 text-xs text-center font-black animate-bounce">{error}</p>}
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4.5 rounded-2xl shadow-2xl shadow-blue-600/40 transition-all active:scale-95 text-lg uppercase tracking-widest"
            >
              دخول النظام
            </button>
          </form>
          <div className="mt-8 text-center text-[10px] opacity-40 font-black uppercase tracking-widest">
            Talent Acquisition Platform v2.5
          </div>
        </div>
        <Signature />
      </div>
    );
  }

  const filteredCandidates = candidates.filter(c =>
    c.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.phone.includes(searchQuery) ||
    c.jobAppliedFor.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col">
      <header className="no-print glass-card border-b border-white/10 sticky top-0 z-50 px-8 py-5 flex justify-between items-center transition-all duration-500">
        <div className="flex items-center gap-5">
          <div className="bg-blue-600 text-white p-3 rounded-2xl shadow-lg">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 00-2-2V5a2 2 0 002-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 00-2 2z" /></svg>
          </div>
          <div>
            <h1 className="text-2xl font-black leading-none uppercase tracking-tight">استقطاب الكفاءات</h1>
            <p className="text-[10px] text-blue-500 font-black uppercase tracking-[0.3em] mt-2">Talent Acquisition</p>
          </div>
        </div>

        <div className="flex gap-6 items-center">
          <ThemeSwitcher />

          <div className="h-8 w-px bg-white/10 mx-2"></div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-black">{user.displayName}</p>
              <p className="text-[10px] opacity-40 font-black uppercase tracking-widest leading-none mt-1">{user.role}</p>
            </div>
            <button onClick={handleLogout} className="bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white w-10 h-10 flex items-center justify-center rounded-xl transition-all shadow-lg border border-red-500/20 group">
              <span className="group-hover:scale-125 transition-transform">🚪</span>
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <aside className="no-print w-72 glass-card border-l border-white/10 p-6 flex flex-col gap-4">
          <h3 className="text-[9px] font-black uppercase tracking-widest opacity-40 px-4 mb-2">القائمة الرئيسية</h3>
          <button
            onClick={() => setViewMode(ViewMode.LIST)}
            className={`w-full flex items-center gap-4 p-4 rounded-2xl font-black transition-all ${viewMode === ViewMode.LIST ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/30 -translate-y-1' : 'hover:bg-white/5 opacity-60 hover:opacity-100'}`}
          >
            <span className="text-xl">📋</span> قائمة البيانات
          </button>
          <button
            onClick={() => setViewMode(ViewMode.CARD)}
            className={`w-full flex items-center gap-4 p-4 rounded-2xl font-black transition-all ${viewMode === ViewMode.CARD ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/30 -translate-y-1' : 'hover:bg-white/5 opacity-60 hover:opacity-100'}`}
          >
            <span className="text-xl">🖨️</span> نموذج الطباعة
          </button>

          <div className="mt-auto space-y-4">
            <div className="glass-card p-5 rounded-[2rem] border border-white/10 bg-white/5">
              <h4 className="text-[9px] font-black uppercase text-blue-500 mb-4 tracking-widest text-center">أدوات البيانات</h4>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex flex-col items-center justify-center gap-3 bg-blue-600 text-white py-6 rounded-[1.5rem] font-black hover:bg-blue-500 transition-all text-xs shadow-lg shadow-blue-600/20"
              >
                <span className="text-2xl">📁</span>
                رفع ملف Excel
              </button>
              <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept=".xlsx,.xls,.csv,.txt" className="hidden" />
            </div>
          </div>
        </aside>

        <main className="flex-1 overflow-auto p-10">
          {viewMode === ViewMode.LIST ? (
            <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-5 duration-700">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div className="flex items-center gap-6">
                  <div>
                    <h2 className="text-5xl font-black mb-3 tracking-tight">قاعدة البيانات</h2>
                    <p className="opacity-40 text-xs font-black uppercase tracking-[0.2em]">Management of all candidates ({candidates.length})</p>
                  </div>
                  {candidates.length > 0 && (
                    <button
                      onClick={clearAllCandidates}
                      className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white px-6 py-3 rounded-2xl font-black text-xs transition-all shadow-lg border border-red-500/20 flex items-center gap-2 group mt-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="group-hover:rotate-12 transition-transform"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" /></svg>
                      مسح الكل
                    </button>
                  )}
                </div>
                <div className="relative w-full md:w-96 group">
                  <input
                    type="text"
                    placeholder="بحث في البيانات..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full glass-card p-5 pr-14 rounded-[1.5rem] border border-white/5 focus:border-blue-500/50 outline-none focus:ring-8 focus:ring-blue-500/10 font-black transition-all shadow-xl"
                  />
                  <span className="absolute right-6 top-5 text-xl opacity-30 group-focus-within:opacity-100 group-focus-within:text-blue-500 transition-all">🔍</span>
                </div>
              </div>

              <div className="glass-card rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/10">
                <table className="w-full text-right">
                  <thead>
                    <tr className="bg-blue-600 text-white">
                      <th className="p-6 font-black uppercase tracking-widest text-[11px]">المرشح</th>
                      <th className="p-6 font-black uppercase tracking-widest text-[11px]">المؤهلات</th>
                      <th className="p-6 font-black uppercase tracking_widest text-[11px]">التواصل</th>
                      <th className="p-6 font-black uppercase tracking-widest text-[11px] text-center">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredCandidates.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="p-20 text-center opacity-20 font-black text-2xl uppercase tracking-[0.3em]">لا يوجد بيانات</td>
                      </tr>
                    ) : (
                      filteredCandidates.map((c, i) => (
                        <tr key={c.id} className="hover:bg-blue-600/[0.04] transition-all group">
                          <td className="p-6">
                            <div className="font-black text-lg group-hover:text-blue-500 transition-colors">{c.fullName}</div>
                            <div className="text-[10px] opacity-40 font-black uppercase tracking-widest mt-1">{c.nationality} • {c.age} سنة</div>
                          </td>
                          <td className="p-6">
                            <div className="font-black text-sm opacity-80">{c.jobAppliedFor}</div>
                            <div className="text-[10px] opacity-40 font-black uppercase mt-1">الخبرة: {c.yearsOfExperience}</div>
                          </td>
                          <td className="p-6">
                            <div className="font-black font-mono text-blue-500" dir="ltr">{c.phone}</div>
                            <div className="text-[10px] opacity-40 font-black mt-1 uppercase">{c.residencyStatus}</div>
                          </td>
                          <td className="p-6 text-center">
                            <div className="flex items-center justify-center gap-3">
                              <button
                                onClick={() => {
                                  const idx = candidates.findIndex(cand => cand.id === c.id);
                                  setSelectedIndex(idx);
                                  setViewMode(ViewMode.CARD);
                                }}
                                className="bg-blue-600/10 text-blue-500 px-6 py-2.5 rounded-xl text-[10px] font-black hover:bg-blue-600 hover:text-white transition-all shadow-md group-hover:scale-105"
                              >
                                عرض
                              </button>
                              <button
                                onClick={() => deleteCandidate(c.id)}
                                className="bg-red-500/10 text-red-500 p-2.5 rounded-xl hover:bg-red-500 hover:text-white transition-all opacity-0 group-hover:opacity-100 shadow-lg"
                                title="حذف"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" /></svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto flex flex-col items-center gap-10 animate-in zoom-in-95 duration-700">
              <div className="w-full flex justify-between items-center no-print glass-card p-5 rounded-[2rem] border border-white/5 shadow-2xl">
                <div className="flex gap-3">
                  <button
                    onClick={() => setSelectedIndex(Math.max(0, selectedIndex - 1))}
                    disabled={selectedIndex === 0}
                    className="glass-card w-12 h-12 flex items-center justify-center rounded-xl hover:bg-blue-600 hover:text-white disabled:opacity-10 transition-all shadow-lg active:scale-90"
                  >
                    <svg className="w-5 h-5 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7-7 7" /></svg>
                  </button>
                  <div className="glass-card px-8 flex items-center font-black text-sm bg-blue-600 text-white shadow-xl shadow-blue-600/30 rounded-xl tracking-widest uppercase">
                    مرشح {selectedIndex + 1} / {candidates.length}
                  </div>
                  <button
                    onClick={() => setSelectedIndex(Math.min(candidates.length - 1, selectedIndex + 1))}
                    disabled={selectedIndex === candidates.length - 1}
                    className="glass-card w-12 h-12 flex items-center justify-center rounded-xl hover:bg-blue-600 hover:text-white disabled:opacity-10 transition-all shadow-lg active:scale-90"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7-7 7" /></svg>
                  </button>
                </div>

                <button
                  onClick={handlePrint}
                  className="bg-green-600 text-white px-10 py-4.5 rounded-[1.5rem] font-black shadow-2xl shadow-green-600/30 hover:bg-green-500 transition-all flex items-center gap-4 hover:-translate-y-1 active:scale-95"
                >
                  <span className="text-2xl">🖨️</span>
                  <span className="uppercase tracking-widest">طباعة النموذج</span>
                </button>
              </div>

              <CandidateCard
                candidate={currentCandidate}
                onUpdateNotes={updateCandidateNotes}
              />
            </div>
          )}
        </main>
      </div>
      <Signature />
    </div>
  );
};

export default App;
