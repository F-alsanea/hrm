import React, { useState, useEffect, useMemo } from 'react';
import { MessageType, MessageLog, FormData, User, Language } from '../types';
import { TEMPLATES, LOCATIONS, DAYS, DEFAULT_FORM_LINK } from '../constants';

interface MessageComposerProps {
  onSend: (log: MessageLog) => void;
  lang: Language;
  user: User;
  t: any;
}

export const MessageComposer: React.FC<MessageComposerProps> = ({ onSend, lang, user, t }) => {
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

  const updatePreview = () => {
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
  };

  useEffect(() => { updatePreview(); }, [formData, lang]);

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
      timestamp: new Date().toLocaleString(lang === 'ar' ? 'ar-SA' : 'en-US'),
      type: formData.type,
      candidateName: formData.name,
      phoneNumber: cleanPhone,
      details: formData.type === MessageType.INFO_COLLECTION ? formData.position || '' : `${LOCATIONS.find(l => l.id === formData.locationId)?.name[lang] || ''}`,
      status: lang === 'ar' ? 'تم الإرسال' : 'Sent',
      sender: user.displayName,
      notes: ''
    });
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start pb-20 lg:pb-0">
      <div className="lg:col-span-12 glass-card p-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-hidden rounded-[2rem]">
          {/* Main Form Section */}
          <div className="lg:col-span-7 p-6 md:p-10 bg-white/5">
            <h3 className="text-xl md:text-2xl font-black text-heading mb-8 flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center text-white shadow-xl shadow-blue-500/20 rotate-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5" /></svg>
              </div>
              <span className="tracking-tight uppercase">{t.details}</span>
            </h3>

            <div className="space-y-8">
              <div className="space-y-3">
                <label className="block text-[9px] font-black text-muted uppercase tracking-wider ml-1">{lang === 'ar' ? 'نوع الرسالة' : 'MESSAGE TYPE'}</label>
                <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value as MessageType })} className="w-full px-6 py-4 rounded-2xl font-bold cursor-pointer transition-all shadow-lg border-none">
                  {Object.values(MessageType).map(type => <option key={type} value={type}>{type}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="block text-[9px] font-black text-muted uppercase tracking-wider ml-1">{t.candidateName}</label>
                  <input type="text" placeholder="e.g. Faisal Alsanea" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-6 py-4 rounded-xl shadow-md border-none" />
                </div>
                <div className="space-y-3">
                  <label className="block text-[9px] font-black text-muted uppercase tracking-wider ml-1">{t.phone}</label>
                  <input type="text" placeholder="05XXXXXXXX" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full px-6 py-4 rounded-xl shadow-md border-none" />
                </div>
              </div>

              {formData.type === MessageType.INFO_COLLECTION && (
                <div className="bg-blue-600/5 p-6 md:p-8 rounded-[1.8rem] border-2 border-blue-500/5 space-y-8 animate-fadeIn">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-md">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h4 className="font-black text-blue-600 uppercase text-[10px] tracking-wider">{lang === 'ar' ? 'إعدادات جمع المعلومات' : 'Info Collection Settings'}</h4>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <label className="block text-[8px] font-black text-muted/60 uppercase tracking-wider ml-1">{t.position}</label>
                      <input
                        type="text"
                        value={formData.position}
                        onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                        className="w-full shadow-sm border-none py-3"
                        placeholder={lang === 'ar' ? "مثلاً: مدير تسويق" : "e.g. Marketing Manager"}
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="block text-[8px] font-black text-muted/60 uppercase tracking-wider ml-1">{t.formLink}</label>
                      <input
                        type="text"
                        value={formData.formLink}
                        onChange={(e) => setFormData({ ...formData, formLink: e.target.value })}
                        className="w-full shadow-sm border-none py-3 font-mono text-[10px]"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-black/5 p-6 md:p-10 rounded-[2rem] space-y-8">
                {(formData.type === MessageType.INTERVIEW || formData.type === MessageType.REMINDER) && (
                  <div className="space-y-3">
                    <label className="block text-[9px] font-black text-muted uppercase tracking-wider ml-1">{lang === 'ar' ? 'اسم الموقع' : 'LOCATION NAME'}</label>
                    <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value as MessageType })} className={`w-full ${lang === 'ar' ? 'pr-4 pl-10' : 'pl-4 pr-10'} py-4 rounded-2xl font-bold cursor-pointer transition-all shadow-lg border-none`}>
                      {LOCATIONS.map(loc => <option key={loc.id} value={loc.id}>{loc.name[lang]}</option>)}
                    </select>
                  </div>
                )}
                {formData.type === MessageType.INTERVIEW && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5 animate-fadeIn">
                    <div className="space-y-3">
                      <label className="block text-[9px] font-black text-muted uppercase tracking-wider ml-1">{lang === 'ar' ? 'التاريخ' : 'DATE'}</label>
                      <input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} className="w-full px-5 py-4 rounded-xl shadow-sm border-none text-sm" />
                    </div>
                    <div className="space-y-3">
                      <label className="block text-[9px] font-black text-muted uppercase tracking-wider ml-1">{lang === 'ar' ? 'اليوم' : 'DAY'}</label>
                      <select value={formData.day} onChange={(e) => setFormData({ ...formData, day: e.target.value })} className="w-full px-5 py-4 rounded-xl shadow-sm border-none font-bold text-sm">
                        {DAYS.map(day => <option key={day.en} value={day[lang]}>{day[lang]}</option>)}
                      </select>
                    </div>
                    <div className="space-y-3">
                      <label className="block text-[9px] font-black text-muted uppercase tracking-wider ml-1">{lang === 'ar' ? 'الوقت' : 'TIME'}</label>
                      <select value={formData.time} onChange={(e) => setFormData({ ...formData, time: e.target.value })} className="w-full px-5 py-4 rounded-xl shadow-sm border-none font-bold text-sm">
                        {timeOptions.map(to => <option key={to.en} value={to[lang]}>{to[lang]}</option>)}
                      </select>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Preview Section */}
          <div className="lg:col-span-5 p-6 md:p-10 flex flex-col bg-white/[0.03] border-l border-white/5">
            <h3 className="text-lg md:text-xl font-black text-heading mb-8 uppercase tracking-wider">{t.preview}</h3>
            <div className={`bg-white/95 backdrop-blur-sm p-8 rounded-2xl text-[13px] md:text-sm text-gray-900 shadow-xl flex-1 font-bold overflow-y-auto max-h-[400px] lg:max-h-none min-h-[300px] whitespace-pre-wrap leading-relaxed relative ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
              <div className="absolute top-0 left-0 w-full h-1.5 bg-blue-600 rounded-t-2xl"></div>
              {preview}
            </div>

            <div className="mt-8 space-y-4">
              <button
                onClick={handleSend}
                className="w-full bg-blue-600 text-white font-black py-4.5 px-8 rounded-2xl shadow-xl shadow-blue-500/20 text-base uppercase tracking-wider hover:bg-blue-700 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-4 group"
              >
                <span>{t.sendWhatsapp}</span>
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 24 24"><path d="M12.012 2c-5.508 0-9.987 4.479-9.987 9.988 0 1.757.455 3.409 1.25 4.847l-1.275 4.659 4.774-1.253c1.398.761 2.996 1.196 4.695 1.196 5.508 0 9.987-4.479 9.987-9.988 0-5.508-4.479-9.988-9.987-9.988zm0 18.272c-1.54 0-3.047-.413-4.362-1.194l-.312-.187-2.821.74.752-2.734-.206-.328c-.859-1.365-1.312-2.951-1.312-4.581 0-4.729 3.847-8.576 8.576-8.576 4.729 0 8.576 3.847 8.576 8.576 0 4.729-3.847 8.576-8.576 8.576zm4.693-6.41c-.257-.129-1.523-.752-1.759-.838-.236-.086-.407-.129-.578.129-.171.258-.66.838-.809 1.011-.149.172-.299.193-.557.064-.257-.13-1.087-.401-2.071-1.278-.765-.683-1.282-1.526-1.432-1.784-.149-.258-.016-.397.113-.526.116-.116.257-.299.386-.448.129-.149.171-.257.257-.428.086-.171.043-.321-.021-.45-.064-.129-.578-1.396-.793-1.912-.209-.502-.423-.434-.578-.442-.149-.007-.321-.009-.493-.009-.171 0-.45.064-.686.321-.236.257-.901.881-.901 2.15 0 1.269.923 2.495 1.051 2.666.129.171 1.816 2.774 4.397 3.887.614.265 1.094.423 1.468.542.617.196 1.178.169 1.62.103.493-.073 1.523-.622 1.737-1.226.215-.605.215-1.125.15-1.226-.065-.101-.237-.161-.494-.29z" /></svg>
              </button>
              <button onClick={() => { navigator.clipboard.writeText(preview); alert(t.copySuccess); }} className="w-full py-4 text-muted font-black text-[9px] uppercase hover:text-heading transition-all tracking-wider bg-white/5 rounded-xl border border-white/5">{t.copySuccess}</button>
            </div>
          </div>
        </div>
      </div>
    </div>

  );
};


