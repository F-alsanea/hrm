
export enum MessageType {
  INTERVIEW = 'دعوة مقابلة',
  REMINDER = 'تذكير',
  INFO_COLLECTION = 'جمع معلومات',
  REJECTION = 'رفض'
}

export type Language = 'ar' | 'en';
export type ThemeMode = 'light' | 'dark' | 'sepia';

export interface User {
  username: string;
  role: 'admin' | 'manager' | 'staff';
  displayName: string;
}

export interface Template {
  type: MessageType;
  content: {
    ar: string;
    en: string;
  };
  variables: string[];
}

export interface MessageLog {
  id: string;
  timestamp: string;
  type: MessageType;
  candidateName: string;
  phoneNumber: string;
  details: string;
  status: string;
  notes: string;
  sender: string;
}

export interface FormData {
  type: MessageType;
  name: string;
  phone: string;
  formLink: string;
  place?: string;
  date?: string;
  day?: string;
  time?: string;
  position?: string;
  notes?: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}
