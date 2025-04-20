import { format, differenceInDays } from 'date-fns';
import { nl, enUS } from 'date-fns/locale';

const locales = {
  nl,
  en: enUS
};

export const formatDate = (dateStr: string, language: string = 'nl'): string => {
  if (!dateStr) return '';
  
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      return '';
    }
    
    const locale = locales[language as keyof typeof locales] || locales.nl;
    return format(date, 'eee. dd-MM-yyyy', { locale });
  } catch (error) {
    console.error('Error formatting date:', dateStr, error);
    return '';
  }
};

export const formatDateLong = (dateStr: string, language: string = 'nl'): string => {
  if (!dateStr) return '';
  
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      return '';
    }
    
    const locale = locales[language as keyof typeof locales] || locales.nl;
    return format(date, 'EEEE d MMMM yyyy', { locale });
  } catch (error) {
    console.error('Error formatting date:', dateStr, error);
    return '';
  }
};

export const getWeekNumber = (date: Date): number => {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
};

export const formatDuration = (startDate: string, endDate: string, language: string = 'nl'): string => {
  if (!startDate || !endDate) return '';

  try {
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return '';
    }

    // Calculate total days including weekends
    const totalDays = differenceInDays(end, start) + 1;

    // Calculate complete weeks (7 days)
    const weeks = Math.floor(totalDays / 7);
    const remainingDays = totalDays % 7;

    if (language === 'nl') {
      if (totalDays === 1) {
        return '1 dag';
      } else if (weeks === 0) {
        return `${totalDays} dagen`;
      } else if (remainingDays === 0) {
        return `${weeks} ${weeks === 1 ? 'week' : 'weken'}`;
      } else {
        return `${weeks} ${weeks === 1 ? 'week' : 'weken'} en ${remainingDays} ${remainingDays === 1 ? 'dag' : 'dagen'}`;
      }
    } else {
      if (totalDays === 1) {
        return '1 day';
      } else if (weeks === 0) {
        return `${totalDays} days`;
      } else if (remainingDays === 0) {
        return `${weeks} ${weeks === 1 ? 'week' : 'weeks'}`;
      } else {
        return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} and ${remainingDays} ${remainingDays === 1 ? 'day' : 'days'}`;
      }
    }
  } catch (error) {
    console.error('Error calculating duration:', error);
    return '';
  }
};
