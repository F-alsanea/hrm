import { MessageType, Template } from './types';

export const LOCATIONS = [
  { id: 'office', name: { ar: 'الإدارة الرئيسية', en: 'Head Office' }, link: 'https://maps.app.goo.gl/EoiSqTWpTsgZz38w8' },
  { id: 'zikaki', name: { ar: 'مطعم زيكاكي', en: 'Zikaki Restaurant' }, link: 'https://maps.app.goo.gl/t4gCLttTddFEVJz4A' },
  { id: 'shorafa', name: { ar: 'قاعة الشرافة', en: 'Al Shorafa Hall' }, link: 'https://maps.app.goo.gl/TxzTcDpuHGqfsTiK6' },
  { id: 'sezione', name: { ar: 'مطعم سيزيوني', en: 'Sezione Restaurant' }, link: 'https://maps.app.goo.gl/t2yjnGVrbGWiUeE26' },
  { id: 'albay_m', name: { ar: 'مخبز الباي المحمدية', en: 'Al Bay Bakery - Muhammadiyah' }, link: 'https://maps.app.goo.gl/H1S2hSiQaVwqoJ8P8' },
  { id: 'albay_z', name: { ar: 'مخبز الباي الزهراء', en: 'Al Bay Bakery - Al Zahra' }, link: 'https://maps.app.goo.gl/w4yKtuHm8BftGGww7' },
  { id: 'gabbiano', name: { ar: 'مطعم الجبيانو', en: 'Il Gabbiano Restaurant' }, link: 'https://maps.app.goo.gl/DWC3G4MH4XDVR1Ww9' },
];

export const DAYS = [
  { ar: 'الأحد', en: 'Sunday' },
  { ar: 'الاثنين', en: 'Monday' },
  { ar: 'الثلاثاء', en: 'Tuesday' },
  { ar: 'الأربعاء', en: 'Wednesday' },
  { ar: 'الخميس', en: 'Thursday' },
  { ar: 'الجمعة', en: 'Friday' },
  { ar: 'السبت', en: 'Saturday' },
];

export const DEFAULT_FORM_LINK = "https://docs.google.com/forms/e/1FAIpQLSdfdTSx2PLk5592bJAGLYcys5Vh2rcUv2iGaJmJDzdRFI4DRQ/viewform?usp=header";

export const TEMPLATES: Record<MessageType, Template> = {
  [MessageType.INTERVIEW]: {
    type: MessageType.INTERVIEW,
    variables: ['name', 'place', 'date', 'day', 'time', 'location_link'],
    content: {
      ar: `عزيزي المرشح/ عزيزتي المرشحة *{name}*،\n\nتحية طيبة،،\n\nيسرنا إبلاغكم بأنه تم اختياركم من بين عدد من المرشحين لإجراء مقابلة شخصية، وذلك ضمن إجراءات التوظيف في مجموعة الكعكي.\n\nتفاصيل المقابلة:\nالمكان: *{place}*\nالتاريخ: *{date}*\nاليوم: *{day}*\nالوقت: *{time}*\n\nرابط الموقع:\n{location_link}\n\nنأمل الالتزام بالحضور في الوقت المحدد.\n\nقسم التوظيف - مجموعة الكعكي`,
      en: `Dear Candidate *{name}*,\n\nGreetings,,\n\nWe are pleased to inform you that you have been selected for an interview at Al-Kaki Group.\n\nInterview Details:\nLocation: *{place}*\nDate: *{date}*\nDay: *{day}*\nTime: *{time}*\n\nLocation Link:\n{location_link}\n\nWe look forward to your attendance at the scheduled time.\n\nRecruitment Department - Al-Kaki Group`
    }
  },
  [MessageType.REMINDER]: {
    type: MessageType.REMINDER,
    variables: ['name', 'place', 'location_link'],
    content: {
      ar: `عزيزي/عزيزتي المرشح(ة) *{name}*،\n\nتحية طيبة،،\n\nنأمل تأكيد حضوركم لموعد المقابلة المقررة اليوم في: *{place}* – مجموعة الكعكي\n\nالتفاصيل الكاملة للموقع في الرابط التالي:\n{location_link}\n\nشاكرين لكم تعاونكم، ونتمنى لكم كل التوفيق.\n\nقسم التوظيف - مجموعة الكعكي`,
      en: `Dear Candidate *{name}*,\n\nGreetings,,\n\nWe hope to confirm your attendance for the interview scheduled today at: *{place}* – Al-Kaki Group\n\nFull location details in the following link:\n{location_link}\n\nThank you for your cooperation, we wish you the best of luck.\n\nRecruitment Department - Al-Kaki Group`
    }
  },
  [MessageType.INFO_COLLECTION]: {
    type: MessageType.INFO_COLLECTION,
    variables: ['name', 'position', 'form_link'],
    content: {
      ar: `عزيزي/عزيزتي المرشح *{name}*،\n\nنشكركم على اهتمامكم بالانضمام إلى مجموعة الكعكي.\n\nحرصًا منا على استكمال خطوات الترشيح المبدئي، نرجو منكم التكرم بالإجابة على النموذج المرفق حيث تم ترشيحكم للمسمى الوظيفي (*{position}*).\n\nرابط النموذج:\n{form_link}\n\nملاحظة: في حال لم يكن المسمى الوظيفي المقترح مناسبًا لكم، نأمل منكم الرد بعبارة "غير مهتم".\n\nمع خالص التحية، قسم التوظيف – مجموعة الكعكي`,
      en: `Dear Candidate *{name}*,\n\nThank you for your interest in joining Al-Kaki Group.\n\nTo complete the initial screening process, please fill out the attached form as you have been nominated for the position: (*{position}*).\n\nForm Link:\n{form_link}\n\nNote: If the proposed position is not suitable for you, please reply with "Not Interested".\n\nBest regards, Recruitment Department – Al-Kaki Group`
    }
  },
  [MessageType.REJECTION]: {
    type: MessageType.REJECTION,
    variables: ['name'],
    content: {
      ar: `عزيزي/عزيزتي المرشح *{name}*،\n\nنشكر لك اهتمامك بشركتنا وتخصيص وقتك لحضور المقابلة الشخصية.\n\nبعد دراسة جميع الطلبات بعناية ومراجعة متطلبات الوظيفة، نأسف لإبلاغك بعدم اختيارك لهذه الفرصة في الوقت الحالي. نود التأكيد على أن هذا القرار يتعلق بمتطلبات الوظيفة ولا يعكس أي تقصير في مؤهلاتك أو قدراتك.\n\nكما يسعدنا الاحتفاظ ببياناتك في قاعدة بياناتنا للتواصل معك في حال توفر فرص تناسب خبراتك مستقبلاً.\n\nنتمنى لك كل التوفيق والنجاح في مسيرتك المهنية.\n\nتقبل منا خالص التحيات، مجموعة الكعكي`,
      en: `Dear Candidate *{name}*,\n\nThank you for your interest and for taking the time to attend the interview.\n\nAfter careful review of all applications and job requirements, we regret to inform you that you have not been selected for this opportunity at this time. We would like to emphasize that this decision relates to job requirements and does not reflect any deficiency in your qualifications.\n\nWe are happy to keep your data in our database to contact you if future opportunities fit your experience.\n\nWe wish you all the best and success in your career.\n\nBest regards, Al-Kaki Group`
    }
  }
};
