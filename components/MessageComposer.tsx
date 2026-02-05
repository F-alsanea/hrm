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
    for (let hour = 9; hour <= 23; hour++) {
      for (let min = 0; min < 60; min += 10) {
        if (hour === 23 && min > 0) break;
        const amPmAr = hour >= 12 ? 'مساءً' : 'صباحاً';
        const amPmEn = hour >= 12 ? 'PM' : 'AM';
        let displayHour = hour > 12 ? hour - 12 : (hour === 0 ? 12 : hour);
        const formattedMin = min === 0 ? '00' : min;
        times.push({ ar: `${displayHour}:${formattedMin} ${amPmAr}`, en: `${displayHour}:${formattedMin} ${amPmEn}` });
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

  useEffect(() => {
    const template = TEMPLATES[formData.type];
    let content = template.content[lang];
    const selectedLocation = LOCATIONS.find(l => l.id === formData.locationId);
    
    content = content.replace(/{name}/g, formData.name || '______');
    content = content.replace(/{place}/g, selectedLocation?.name[lang] || '______');
    content = content.replace(/{location_link}/g, selectedLocation?.link || '______');
    content = content.replace(/{form_link}/g, formData.formLink || '______');
    content = content.replace(/{date}/g, formData.date || '______');
    content = content.replace(/{day}/g, formData.day || '______');
    content = content.replace(/{time}/g, formData.time || '______');
    content = content.replace(/{position}/g, formData.position || '______');
    setPreview(content);
  }, [formData, lang]);

  const handleSend = () => {
    if (!formData.name || !formData.phone) {
      alert(lang === 'ar' ? "يرجى إدخال اسم المرشح ورقم الجوال" : "Candidate data missing");
      return;
    }
    let cleanPhone = formData.phone.replace(/[^0-9]/g, '');
    if (cleanPhone.startsWith('05')) cleanPhone = '966' + cleanPhone.substring(1);
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(preview)}`;
    onSend({
      id: Date.now().toString(),
      timestamp: new Date().toLocaleString(),
      type: formData.type,
      candidateName: formData.name,
      phoneNumber: cleanPhone,
      details: formData.type === MessageType.INFO_COLLECTION ? formData.position : LOCATIONS.find(l=>l.id===formData.locationId)?.name[lang],
      status: lang === 'ar' ? 'تم الإرسال' : 'Sent',
      sender: user.displayName,
      notes: ''
    });
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-8 items-start pb-20 lg:pb-0">
      <div className="lg:col-span-7 glass-card p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] shadow-2xl">
        <h3 className="text-xl md:text-2xl font-black text-heading mb-6 md:mb-10 flex items-center gap-4">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-[#1f4e78] rounded-[1rem] flex items-center justify-center text-white shadow-lg">K</div>
          <span className="tracking-tight">{t.details}</span>
        </h3>
        <div className="space-y-6 md:space-y-8">
          <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value as MessageType })} className="w-full px-4 md:px-6 py-4 md:py-5 rounded-[1.2rem] md:rounded-[1.5rem] font-black text-heading">
            {Object.values(MessageType).map(type => <option key={type} value={type}>{type}</option>)}
          </select>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            <input type="text" placeholder={t.candidateName} value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-6 py-5" />
            <input type="text" placeholder={t.phone} value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full px-6 py-5" />
          </div>
          <div className="bg-white/40 p-6 md:p-10 rounded-[2rem] md:rounded-[2.5rem] border border-white/60 space-y-6 shadow-inner">
            {(formData.type === MessageType.INTERVIEW || formData.type === MessageType.REMINDER) && (
              <select value={formData.locationId} onChange={(e) => setFormData({ ...formData, locationId: e.target.value })} className="w-full px-6 py-5">
                {LOCATIONS.map(loc => <option key={loc.id} value={loc.id}>{loc.name[lang]}</option>)}
              </select>
            )}
            {formData.type === MessageType.INTERVIEW && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} className="w-full" />
                <select value={formData.day} onChange={(e) => setFormData({ ...formData, day: e.target.value })} className="w-full">
                  {DAYS.map(day => <option key={day.en} value={day[lang]}>{day[lang]}</option>)}
                </select>
                <select value={formData.time} onChange={(e) => setFormData({ ...formData, time: e.target.value })} className="w-full">
                  {timeOptions.map(to => <option key={to.en} value={to[lang]}>{to[lang]}</option>)}
                </select>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="lg:col-span-5 flex flex-col gap-6 md:gap-8 h-full">
        <div className="glass-card p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] shadow-2xl flex-1 flex flex-col border-2 border-white/80">
          <h3 className="text-lg md:text-xl font-black text-heading mb-6">{t.preview}</h3>
          <div className="bg-white/95 p-5 md:p-8 rounded-[1.5rem] text-[13px] md:text-sm text-gray-900 shadow-inner flex-1 font-bold overflow-y-auto max-h-[350px] md:max-h-[550px] whitespace-pre-wrap">{preview}</div>
          <div className="mt-6 md:mt-10 space-y-4">
            <button onClick={handleSend} className="w-full bg-[#1f4e78] text-white font-black py-4 md:py-6 px-6 md:px-10 rounded-[1.8rem] shadow-xl text-lg md:text-xl uppercase tracking-widest">{t.sendWhatsapp}</button>
            <button onClick={() => { navigator.clipboard.writeText(preview); alert(t.copySuccess); }} className="w-full py-4 text-[#1f4e78] font-black text-[10px] uppercase bg-white/60 rounded-[1.5rem] border-2 border-white">{t.copySuccess}</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageComposer;
