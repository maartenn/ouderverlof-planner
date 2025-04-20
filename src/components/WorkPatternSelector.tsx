import React from 'react';
import { WorkPattern, WeekType } from '../types';
import { HelpCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface WorkPatternSelectorProps {
  value: WorkPattern;
  onChange: (pattern: WorkPattern) => void;
}

const weekTypeOptions: { value: WeekType; label: string }[] = [
  { value: 'beide', label: 'planner.workPattern.weekTypes.both' },
  { value: 'even', label: 'planner.workPattern.weekTypes.even' },
  { value: 'oneven', label: 'planner.workPattern.weekTypes.odd' },
];

const defaultWorkPattern: WorkPattern = {
  daysPerWeek: 5,
  hoursPerWeek: 40,
  isFlexible: false,
  workDays: {
    maandag: { enabled: true, weekType: 'beide', hours: 8 },
    dinsdag: { enabled: true, weekType: 'beide', hours: 8 },
    woensdag: { enabled: true, weekType: 'beide', hours: 8 },
    donderdag: { enabled: true, weekType: 'beide', hours: 8 },
    vrijdag: { enabled: true, weekType: 'beide', hours: 8 },
  },
};

export const WorkPatternSelector: React.FC<WorkPatternSelectorProps> = ({
  value = defaultWorkPattern,
  onChange,
}) => {
  const { t } = useTranslation();

  const handleDayChange = (
    day: keyof WorkPattern['workDays'],
    field: keyof typeof value.workDays[keyof typeof value.workDays],
    newValue: any
  ) => {
    const newPattern = {
      ...value,
      workDays: {
        ...value.workDays,
        [day]: {
          ...value.workDays[day],
          [field]: newValue,
        },
      },
    };
    onChange(newPattern);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-sm text-gray-600">{t('planner.workPattern.configuration')}</span>
        <span 
          className="inline-block" 
          title={t('planner.workPattern.configuration')}
        >
          <HelpCircle className="w-4 h-4 text-gray-400" />
        </span>
      </div>
      <div className="grid grid-cols-1 gap-4">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('common.days')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('common.workDay')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('common.weekType')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('common.hours_per_day')}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {Object.entries(value.workDays).map(([day, dayData]) => (
              <tr key={day}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-medium text-gray-900">
                    {t(`planner.workPattern.days.${day}`)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={dayData.enabled}
                    onChange={(e) =>
                      handleDayChange(
                        day as keyof WorkPattern['workDays'],
                        'enabled',
                        e.target.checked
                      )
                    }
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    title={t('common.workDay')}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    value={dayData.weekType}
                    onChange={(e) =>
                      handleDayChange(
                        day as keyof WorkPattern['workDays'],
                        'weekType',
                        e.target.value as WeekType
                      )
                    }
                    disabled={!dayData.enabled}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 disabled:bg-gray-100 sm:text-sm"
                    title={t('common.weekType')}
                  >
                    {weekTypeOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {t(option.label)}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="number"
                    value={dayData.hours}
                    onChange={(e) =>
                      handleDayChange(
                        day as keyof WorkPattern['workDays'],
                        'hours',
                        parseInt(e.target.value) || 0
                      )
                    }
                    disabled={!dayData.enabled}
                    min="0"
                    max="24"
                    className="block w-24 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 disabled:bg-gray-100 sm:text-sm"
                    title={t('common.hours_per_day')}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
