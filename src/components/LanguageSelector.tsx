import React from 'react';
import { useTranslation } from 'react-i18next';
import { Languages } from 'lucide-react';

export const LanguageSelector: React.FC = () => {
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'nl' ? 'en' : 'nl';
    i18n.changeLanguage(newLang);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-indigo-700"
      title={t('common.language')}
    >
      <Languages className="w-4 h-4 mr-2" />
      {i18n.language.toUpperCase()}
    </button>
  );
};