
import React, { useState, useEffect, useMemo } from 'react';
import { MessageType, MessageLog, FormData, User, Language } from '../types';
import { TEMPLATES, LOCATIONS, DAYS, DEFAULT_FORM_LINK } from '../constants';

interface MessageComposerProps {
  onSend: (log: MessageLog) => void;
  lang: Language;
  user: User;
  t: any;
}

const MessageComposer: React.FC<MessageComposerProps> = ({ onSend, lang, user, t }) => {
  const timeOptions = useMemo(() => {
    const times: { ar: string; en: string }[] = [];
    const startHour = 9;
    const endHour = 23;

    for (let hour = startHour; hour <= endHour; hour++) {
      for (let min = 0; min < 60; min += 10) {
        if (hour === endHour && min > 0) break;

        const amPmAr = hour >= 12 ? 'مساءً' : 'صباحاً';
        const amPmEn = hour >= 12 ? 'PM' : 'AM';
        
        let displayHour = hour;
        if (hour > 12) displayHour = hour - 12;
        if (hour === 0) displayHour = 12;

        const formattedMin = min === 0 ? '00' : min;

        times.push({
          ar: `${displayHour}:${formattedMin} ${amPmAr}`,
          en: `${displayHour}:${formattedMin} ${amPmEn}`
        });
      }
    }
    return times;
  }, []);

  const [formData, setFormData] = useState<FormData & { locationId: string }>({
    type: MessageType.INTERVIEW,
    name: '',
    phone: '',
    formLink: DEFAULT_FORM_LINK,
    locationId: LOCATIONS[0].id,
    date: new Date().toISOString().split('T')[0],
    day: DAYS[0][lang],
    time: timeOptions[0][lang],
    position: lang === 'ar' ? 'مدير عمليات' : 'Operations Manager',
    notes: ''
  });

  const [preview, setPreview] = useState('');

  const updatePreview = () => {
    const template = TEMPLATES[formData.type];
    let content = template.content[lang];
    
    const selectedLocation = LOCATIONS.find(l => l.id === formData.locationId);
    const locationName = selectedLocation ? selectedLocation.name[lang] : '______';
    const locationLink = selectedLocation ? selectedLocation.link : '______';

    const nameVal = formData.name || '______';
    const placeVal = locationName;
    const dateVal = formData.date || '______';
    const dayVal = formData.day || '______';
    const timeVal = formData.time || '______';
    const posVal = formData.position || '______';

    content = content.replace(/{name}/g, nameVal);
    content = content.replace(/{place}/g, placeVal);
    content = content.replace(/{location_link}/g, locationLink);
    content = content.replace(/{form_link}/g, formData.formLink || '______');
    content = content.replace(/{date}/g, dateVal);
    content = content.replace(/{day}/g, dayVal);
    content = content.replace(/{time}/g, timeVal);
    content = content.replace(/{position}/g, posVal);
    
    setPreview(content);
  };

  useEffect(() => {
    updatePreview();
  }, [formData, lang]);

  const handleSend = () => {
    if (!formData.name || !formData.phone) {
      alert(lang === 'ar' ? "يرجى إدخال اسم المرشح ورقم الجوال" : "Please enter candidate name and phone number");
      return;
    }

    let cleanPhone = formData.phone.replace(/[^0-9]/g, '');
    if (cleanPhone.startsWith('05')) {
      cleanPhone = '966' + cleanPhone.substring(1);
    }

    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(preview)}`;
    const selectedLocation = LOCATIONS.find(l => l.id === formData.locationId);
    
    const log: MessageLog = {
      id: Date.now().toString(),
      timestamp: new Date().toLocaleString(lang === 'ar' ? 'ar-SA' : 'en-US'),
      type: formData.type,
      candidateName: formData.name,
      phoneNumber: cleanPhone,
      details: formData.type === MessageType.INFO_COLLECTION ? formData.position || '' : `${selectedLocation?.name[lang] || ''}`,
      status: lang === 'ar' ? 'تم الإرسال' : 'Sent',
      notes: formData.notes || '',
      sender: user.displayName
    };

    onSend(log);
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      <div className="lg:col-span-7 glass-card p-10 rounded-[3rem] shadow-2xl overflow-visible">
        <h3 className="text-2xl font-black text-heading mb-10 flex items-center gap-4">
          <div className="w-12 h-12 bg-[#1f4e78] rounded-[1.2rem] flex items-center justify-center text-white shadow-lg">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5" />
            </svg>
          </div>
          <span className="tracking-tight">{t.details}</span>
        </h3>

        <div className="space-y-8">
          <div className="group">
            <label className="block text-xs font-black text-muted uppercase mb-3 tracking-[0.15em]">{t.actionType}</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as MessageType })}
              className="w-full px-6 py-5 rounded-[1.5rem] outline-none transition-all shadow-sm font-black text-heading cursor-pointer hover:shadow-md"
            >
              {Object.values(MessageType).map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="group">
              <label className="block text-xs font-black text-muted uppercase mb-3 tracking-[0.15em]">{t.candidateName}</label>
              <input
                type="text"
                placeholder={lang === 'ar' ? "الاسم الرباعي للمرشح" : "Full Candidate Name"}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-6 py-5 rounded-[1.5rem] outline-none shadow-sm text-heading font-bold"
              />
            </div>
            <div className="group">
              <label className="block text-xs font-black text-muted uppercase mb-3 tracking-[0.15em]">{t.phone}</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="9665XXXXXXXX"
                className="w-full px-6 py-5 rounded-[1.5rem] outline-none shadow-sm text-heading font-bold"
              />
            </div>
          </div>

          {formData.type === MessageType.INFO_COLLECTION && (
            <div className="group animate-fadeIn">
              <label className="block text-xs font-black text-muted uppercase mb-3 tracking-[0.15em]">{t.formLink}</label>
              <input
                type="text"
                value={formData.formLink}
                onChange={(e) => setFormData({ ...formData, formLink: e.target.value })}
                className="w-full px-6 py-5 rounded-[1.5rem] outline-none shadow-sm text-[#1f4e78] font-mono text-xs font-bold bg-white/50"
              />
            </div>
          )}

          <div className="bg-white/40 p-10 rounded-[2.5rem] border border-white/60 space-y-8 shadow-inner">
            {(formData.type === MessageType.INTERVIEW || formData.type === MessageType.REMINDER) && (
              <div className="animate-fadeIn">
                <label className="block text-xs font-black text-muted uppercase mb-3 tracking-[0.15em]">{t.place}</label>
                <select
                  value={formData.locationId}
                  onChange={(e) => setFormData({ ...formData, locationId: e.target.value })}
                  className="w-full px-6 py-5 rounded-[1.5rem] outline-none text-sm font-black text-heading cursor-pointer shadow-sm"
                >
                  {LOCATIONS.map(loc => (
                    <option key={loc.id} value={loc.id}>{loc.name[lang]}</option>
                  ))}
                </select>
              </div>
            )}
            
            {formData.type === MessageType.INTERVIEW && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fadeIn">
                <div>
                  <label className="block text-xs font-black text-muted uppercase mb-3 tracking-[0.15em]">{t.date}</label>
                  <input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} className="w-full px-6 py-5 rounded-[1.5rem] text-sm text-heading outline-none font-bold shadow-sm" />
                </div>
                <div>
                  <label className="block text-xs font-black text-muted uppercase mb-3 tracking-[0.15em]">{t.day}</label>
                  <select 
                    value={formData.day} 
                    onChange={(e) => setFormData({ ...formData, day: e.target.value })} 
                    className="w-full px-6 py-5 rounded-[1.5rem] text-sm text-heading outline-none font-black cursor-pointer shadow-sm"
                  >
                    {DAYS.map(day => (
                      <option key={day.en} value={day[lang]}>{day[lang]}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-black text-muted uppercase mb-3 tracking-[0.15em]">{t.time}</label>
                  <select 
                    value={formData.time} 
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })} 
                    className="w-full px-6 py-5 rounded-[1.5rem] text-sm text-heading outline-none font-black cursor-pointer shadow-sm"
                  >
                    {timeOptions.map(to => (
                      <option key={to.en} value={to[lang]}>{to[lang]}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}
            
            {formData.type === MessageType.INFO_COLLECTION && (
              <div className="animate-fadeIn">
                <label className="block text-xs font-black text-muted uppercase mb-3 tracking-[0.15em]">{t.position}</label>
                <input 
                  type="text" 
                  value={formData.position} 
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })} 
                  className="w-full px-6 py-5 rounded-[1.5rem] text-sm text-heading outline-none font-black shadow-sm" 
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="lg:col-span-5 flex flex-col gap-8 h-full">
        <div className="glass-card p-10 rounded-[3rem] shadow-2xl flex-1 flex flex-col border-2 border-white/80">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black text-heading uppercase tracking-tighter">{t.preview}</h3>
            <div className="flex gap-3 items-center">
              <span className="w-2.5 h-2.5 bg-blue-600 rounded-full animate-pulse shadow-[0_0_10px_rgba(37,99,235,0.5)]"></span>
              <span className="text-[11px] text-muted font-black uppercase tracking-[0.25em]">Preview</span>
            </div>
          </div>
          
          <div className="bg-white/95 p-8 rounded-[2rem] text-sm text-gray-900 shadow-inner border border-gray-100 whitespace-pre-wrap leading-relaxed flex-1 font-bold overflow-y-auto max-h-[550px]">
            {preview}
          </div>

          <div className="mt-10 space-y-5">
            <button
              onClick={handleSend}
              className="w-full bg-[#1f4e78] hover:bg-[#153a5c] text-white font-black py-6 px-10 rounded-[2.5rem] shadow-[0_20px_40px_rgba(31,78,120,0.3)] flex items-center justify-center gap-5 transition-all transform hover:-translate-y-2 active:scale-95 group"
            >
              <svg className="w-6 h-6 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
              <span className="text-xl uppercase tracking-widest">{t.sendWhatsapp}</span>
            </button>
            <button
              onClick={() => {
                navigator.clipboard.writeText(preview);
                alert(t.copySuccess);
              }}
              className="w-full py-5 text-[#1f4e78] font-black text-[11px] uppercase tracking-[0.2em] bg-white/60 rounded-[2rem] border-2 border-white hover:bg-white transition-all shadow-sm"
            >
              {t.copySuccess}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageComposer;
