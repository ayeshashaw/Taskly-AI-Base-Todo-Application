import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './LanguageSwitcher.css';

const LanguageSwitcher = () => {
  const { i18n, t } = useTranslation();

  // Load saved language preference on component mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('i18nextLng');
    if (savedLanguage) {
      i18n.changeLanguage(savedLanguage);
    }
  }, [i18n]);

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('i18nextLng', lang);
  };

  return (
    <div className="language-switcher">
      <button 
        className={`lang-btn ${i18n.language === 'en' ? 'active' : ''}`}
        onClick={() => changeLanguage('en')}
        aria-label={t('language.english')}
      >
        {t('language.english').substring(0, 2)}
      </button>
      <button 
        className={`lang-btn ${i18n.language === 'hi' ? 'active' : ''}`}
        onClick={() => changeLanguage('hi')}
        aria-label={t('language.hindi')}
      >
        {t('language.hindi').substring(0, 2)}
      </button>
    </div>
  );
};

export default LanguageSwitcher;