import React from 'react';
import { Calendar, Info, HelpCircle, AlertTriangle } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LanguageSelector } from './LanguageSelector';

export const Header: React.FC = () => {
  const location = useLocation();
  const { t } = useTranslation();

  const isActive = (path: string) => {
    return location.pathname === path ? 'bg-indigo-700' : 'hover:bg-indigo-700';
  };

  return (
    <header className="bg-indigo-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3">
            <Calendar className="w-8 h-8" />
            <h1 className="text-2xl font-bold">{t('nav.planner')}</h1>
          </Link>
          <nav className="flex items-center space-x-4">
            <Link
              to="/info"
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${isActive('/info')}`}
            >
              <Info className="w-4 h-4 mr-2" />
              {t('nav.leaveInfo')}
            </Link>
            <Link
              to="/guide"
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${isActive('/guide')}`}
            >
              <HelpCircle className="w-4 h-4 mr-2" />
              {t('nav.guide')}
            </Link>
            <Link
              to="/disclaimer"
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${isActive('/disclaimer')}`}
            >
              <AlertTriangle className="w-4 h-4 mr-2" />
              {t('nav.disclaimer')}
            </Link>
            <LanguageSelector />
          </nav>
        </div>
      </div>
    </header>
  );
};