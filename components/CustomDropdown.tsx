import React, { useState, useRef, useEffect } from 'react';
import { Language, ThemeMode } from '../types';

interface Option {
    id: string;
    label: string;
}

interface CustomDropdownProps {
    options: Option[];
    value: string;
    onChange: (value: string) => void;
    lang: Language;
    theme: ThemeMode;
    label?: string;
    className?: string;
}

export const CustomDropdown: React.FC<CustomDropdownProps> = ({
    options,
    value,
    onChange,
    lang,
    theme,
    label,
    className = ""
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const selectedOption = options.find(opt => opt.id === value) || options[0];

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleDropdown = () => setIsOpen(!isOpen);

    const handleSelect = (optionId: string) => {
        onChange(optionId);
        setIsOpen(false);
    };

    return (
        <div className={`relative ${className}`} ref={dropdownRef}>
            {label && (
                <label className="block text-[9px] font-black text-muted uppercase tracking-wider ml-1 mb-3">
                    {label}
                </label>
            )}

            <div
                onClick={toggleDropdown}
                className={`
          w-full px-6 py-4 rounded-xl font-bold cursor-pointer transition-all duration-300
          flex items-center justify-between border-2
          ${isOpen ? 'border-blue-500 shadow-lg scale-[1.01]' : 'border-transparent shadow-md hover:border-blue-500/30'}
          ${theme === 'light' ? 'bg-white text-slate-900' :
                        theme === 'dark' ? 'bg-slate-800 text-white' : 'bg-indigo-900/50 text-indigo-50'}
        `}
            >
                <div className="flex-1 text-center truncate px-2">
                    {selectedOption.label}
                </div>

                <svg
                    className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''} ${lang === 'ar' ? 'mr-2' : 'ml-2'}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                </svg>
            </div>

            {isOpen && (
                <div
                    className={`
            absolute z-[1000] w-full mt-2 py-2 rounded-2xl shadow-2xl border animate-fadeIn
            backdrop-blur-xl max-h-[250px] overflow-y-auto
            ${theme === 'light' ? 'bg-white/95 border-slate-200' :
                            theme === 'dark' ? 'bg-slate-900/95 border-white/10' : 'bg-indigo-950/95 border-indigo-400/30'}
          `}
                >
                    {options.map((option) => (
                        <div
                            key={option.id}
                            onClick={() => handleSelect(option.id)}
                            className={`
                px-6 py-3 cursor-pointer text-center transition-colors font-bold text-sm
                ${option.id === value ?
                                    'bg-blue-600 text-white' :
                                    (theme === 'light' ? 'hover:bg-slate-100 text-slate-700' : 'hover:bg-white/10 text-slate-300')}
              `}
                        >
                            {option.label}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
