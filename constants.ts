
import { MessageType, Template } from './types';

export const LOCATIONS = [
  { id: 'office', name: { ar: 'الإدارة الرئيسية', en: 'Head Office' }, link: 'https://maps.app.goo.gl/VWJaf34hKTnFU8JAA' },
  { id: 'zikaki', name: { ar: 'مطعم زيكاكي', en: 'Zikaki Restaurant' }, link: 'https://maps.app.goo.gl/ZikakiLink' },
  { id: 'shorafa', name: { ar: 'قاعة الشرافة', en: 'Al Shorafa Hall' }, link: 'https://maps.app.goo.gl/ShorafaLink' },
  { id: 'stagioni', name: { ar: 'مطعم سيزيوني', en: 'Stagioni Restaurant' }, link: 'https://maps.app.goo.gl/StagioniLink' },
  { id: 'albay_m', name: { ar: 'مخبز الباي المحمدية', en: 'Al Bay Bakery - Muhammadiyah' }, link: 'https://maps.app.goo.gl/AlBayMuhammadiyah' },
  { id: 'albay_z', name: { ar: 'مخبز الباي الزهراء', en: 'Al Bay Bakery - Al Zahra' }, link: 'https://maps.app.goo.gl/AlBayZahra' },
  { id: 'gabbiano', name: { ar: 'مطعم الجبيانو', en: 'Il Gabbiano Restaurant' }, link: 'https://maps.app.goo.gl/IlGabbiano' },
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
      ar: `عزيزي المرشح/ عزيزتي المرشحة *{name}*،

تحية طيبة،،

يسرنا إبلاغكم بأنه تم اختياركم من بين عدد من المرشحين لإجراء مقابلة شخصية، وذلك ضمن إجراءات التوظيف في مجموعة الكعكي.

تفاصيل المقابلة:
المكان: *{place}*
التاريخ: *{date}*
اليوم: *{day}*
الوقت: *{time}*

رابط الموقع:
{location_link}

نأمل الالتزام بالحضور في الوقت المحدد.

قسم التوظيف - مجموعة الكعكي`,
      en: `Dear Candidate *{name}*,

Greetings,,

We are pleased to inform you that you have been selected for an interview at Al-Kaki Group.

Interview Details:
Location: *{place}*
Date: *{date}*
Day: *{day}*
Time: *{time}*

Location Link:
{location_link}

We look forward to your attendance at the scheduled time.

Recruitment Department - Al-Kaki Group`
    }
  },
  [MessageType.REMINDER]: {
    type: MessageType.REMINDER,
    variables: ['name', 'place', 'location_link'],
    content: {
      ar: `عزيزي/عزيزتي المرشح(ة) *{name}*،

تحية طيبة،،

نأمل تأكيد حضوركم لموعد المقابلة المقررة اليوم في: *{place}* – مجموعة الكعكي

التفاصيل الكاملة للموقع في الرابط التالي:
{location_link}

شاكرين لكم تعاونكم، ونتمنى لكم كل التوفيق.

قسم التوظيف - مجموعة الكعكي`,
      en: `Dear Candidate *{name}*,

Greetings,,

We hope to confirm your attendance for the interview scheduled today at: *{place}* – Al-Kaki Group

Full location details in the following link:
{location_link}

Thank you for your cooperation, we wish you the best of luck.

Recruitment Department - Al-Kaki Group`
    }
  },
  [MessageType.INFO_COLLECTION]: {
    type: MessageType.INFO_COLLECTION,
    variables: ['name', 'position', 'form_link'],
    content: {
      ar: `عزيزي/عزيزتي المرشح *{name}*،

نشكركم على اهتمامكم بالانضمام إلى مجموعة الكعكي.

حرصًا منا على استكمال خطوات الترشيح المبدئي، نرجو منكم التكرم بالإجابة على النموذج المرفق حيث تم ترشيحكم للمسمى الوظيفي (*{position}*).

رابط النموذج:
{form_link}

ملاحظة: في حال لم يكن المسمى الوظيفي المقترح مناسبًا لكم، نأمل منكم الرد بعبارة "غير مهتم".

مع خالص التحية، قسم التوظيف – مجموعة الكعكي`,
      en: `Dear Candidate *{name}*,

Thank you for your interest in joining Al-Kaki Group.

To complete the initial screening process, please fill out the attached form as you have been nominated for the position: (*{position}*).

Form Link:
{form_link}

Note: If the proposed position is not suitable for you, please reply with "Not Interested".

Best regards, Recruitment Department – Al-Kaki Group`
    }
  },
  [MessageType.REJECTION]: {
    type: MessageType.REJECTION,
    variables: ['name'],
    content: {
      ar: `عزيزي/عزيزتي المرشح *{name}*،

نشكر لك اهتمامك بشركتنا وتخصيص وقتك لحضور المقابلة الشخصية.

بعد دراسة جميع الطلبات بعناية ومراجعة متطلبات الوظيفة، نأسف لإبلاغك بعدم اختيارك لهذه الفرصة في الوقت الحالي. نود التأكيد على أن هذا القرار يتعلق بمتطلبات الوظيفة ولا يعكس أي تقصير في مؤهلاتك أو قدراتك.

كما يسعدنا الاحتفاظ ببياناتك في قاعدة بياناتنا للتواصل معك في حال توفر فرص تناسب خبراتك مستقبلاً.

نتمنى لك كل التوفيق والنجاح في مسيرتك المهنية.

تقبل منا خالص التحيات، مجموعة الكعكي`,
      en: `Dear Candidate *{name}*,

Thank you for your interest and for taking the time to attend the interview.

After careful review of all applications and job requirements, we regret to inform you that you have not been selected for this opportunity at this time. We would like to emphasize that this decision relates to job requirements and does not reflect any deficiency in your qualifications.

We are happy to keep your data in our database to contact you if future opportunities fit your experience.

We wish you all the best and success in your career.

Best regards, Al-Kaki Group`
    }
  }
};
