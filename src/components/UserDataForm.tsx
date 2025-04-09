import React, { useState, useEffect } from 'react';
import { WorkPattern, LeaveBalance, LeavePhase, LeaveType } from '../types';
import { WorkPatternSelector } from './WorkPatternSelector';
import { LeavePhaseForm } from './LeavePhaseForm';
import { HelpCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface UserDataFormProps {
  onSubmit: (data: {
    workPattern: WorkPattern;
    expectedDueDate: string;
  }) => void;
  onPhasesChange: (phases: LeavePhase[]) => void;
  onLeaveHoursChange: (hours: { [key in LeaveType]: number }) => void;
  onWorkPatternChange: (pattern: WorkPattern) => void;
  onExpectedDueDateChange: (date: string) => void;
  onContractHoursChange: (hours: number) => void;
  workPattern: WorkPattern;
  phases: LeavePhase[];
  leaveHours: { [key in LeaveType]: number };
  expectedDueDate: string;
  contractHours: number;
}

export const UserDataForm: React.FC<UserDataFormProps> = ({ 
  onSubmit, 
  onPhasesChange,
  onLeaveHoursChange,
  onWorkPatternChange,
  onExpectedDueDateChange,
  onContractHoursChange,
  workPattern,
  phases: initialPhases,
  leaveHours: initialLeaveHours,
  expectedDueDate: initialExpectedDueDate,
  contractHours: initialContractHours
}) => {
  const [leavePhases, setLeavePhases] = useState<LeavePhase[]>(initialPhases);
  const [contractHours, setContractHours] = useState<number>(initialContractHours);
  const [expectedDueDate, setExpectedDueDate] = useState<string>(initialExpectedDueDate);
  const [leaveHours, setLeaveHours] = useState<{ [key in LeaveType]: number }>(initialLeaveHours);
  const [showAsDays, setShowAsDays] = useState<boolean>(false);
  const { t } = useTranslation();

  const calculateLeaveHours = (hours: number) => {
    const weeklyHours = hours;
    const dailyHours = weeklyHours / 5;

    return {
      GV: weeklyHours,
      AGV: weeklyHours * 5,
      BOV: weeklyHours * 9,
      VD: dailyHours * 20,
    };
  };

  const convertHoursToDays = (hours: number): number => {
    return Number((hours / (contractHours / 5)).toFixed(2));
  };

  const convertDaysToHours = (days: number): number => {
    return Number((days * (contractHours / 5)).toFixed(2));
  };

  useEffect(() => {
    onPhasesChange(leavePhases);
  }, [leavePhases, onPhasesChange]);

  useEffect(() => {
    onLeaveHoursChange(leaveHours);
  }, [leaveHours, onLeaveHoursChange]);

  const handleContractHoursChange = (newHours: number) => {
    setContractHours(newHours);
    onContractHoursChange(newHours);
    
    // Calculate new leave hours based on contract hours
    const newLeaveHours = calculateLeaveHours(newHours);
    setLeaveHours(newLeaveHours);
    onLeaveHoursChange(newLeaveHours);
  };

  const handleExpectedDueDateChange = (date: string) => {
    setExpectedDueDate(date);
    onExpectedDueDateChange(date);
  };

  const handleLeaveHoursChange = (type: keyof typeof leaveHours, value: number) => {
    const newValue = showAsDays ? convertDaysToHours(value) : value;
    const newLeaveHours = {
      ...leaveHours,
      [type]: newValue
    };
    setLeaveHours(newLeaveHours);
    onLeaveHoursChange(newLeaveHours);
  };

  const handlePhasesChange = (newPhases: LeavePhase[]) => {
    setLeavePhases(newPhases);
  };

  const toggleShowAsDays = () => {
    setShowAsDays(!showAsDays);
  };

  return (
    <form className="space-y-8">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">{t('planner.workPattern.title')}</h2>
        <WorkPatternSelector value={workPattern} onChange={onWorkPatternChange} />
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">{t('planner.personalData.title')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
              {t('planner.personalData.contractHours')}
              <span className="inline-block" title={t('planner.personalData.contractHoursHelp')}>
                <HelpCircle className="w-4 h-4 text-gray-400" />
              </span>
            </label>
            <input
              type="number"
              value={contractHours}
              onChange={(e) => handleContractHoursChange(Number(e.target.value))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="40"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
              {t('planner.personalData.dueDate')}
              <span className="inline-block" title={t('planner.personalData.dueDateHelp')}>
                <HelpCircle className="w-4 h-4 text-gray-400" />
              </span>
            </label>
            <input
              type="date"
              value={expectedDueDate}
              onChange={(e) => handleExpectedDueDateChange(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{t('planner.leaveHours.title')}</h2>
          <label className="inline-flex items-center cursor-pointer">
            <span className="mr-3 text-sm font-medium text-gray-700">
              {t('common.hours')}
            </span>
            <div className="relative">
              <input
                type="checkbox"
                checked={showAsDays}
                onChange={toggleShowAsDays}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </div>
            <span className="ml-3 text-sm font-medium text-gray-700">
             {t('common.days')}
            </span>
          </label>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
              {t('leaveTypes.GV')}
              <span className="inline-block" title={t('planner.leaveHours.gvHelp')}>
                <HelpCircle className="w-4 h-4 text-gray-400" />
              </span>
            </label>
            <div className="relative">
              <input
                type="number"
                value={showAsDays ? convertHoursToDays(leaveHours.GV) : leaveHours.GV}
                onChange={(e) => handleLeaveHoursChange('GV', Number(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                step="0.01"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                {showAsDays ? t('common.days') : t('common.hours')}
              </span>
            </div>
            <p className="mt-1 text-sm text-gray-500">{t('planner.leaveHours.weekLeave')}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
              {t('leaveTypes.AGV')}
              <span className="inline-block" title={t('planner.leaveHours.agvHelp')}>
                <HelpCircle className="w-4 h-4 text-gray-400" />
              </span>
            </label>
            <div className="relative">
              <input
                type="number"
                value={showAsDays ? convertHoursToDays(leaveHours.AGV) : leaveHours.AGV}
                onChange={(e) => handleLeaveHoursChange('AGV', Number(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                step="0.01"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                {showAsDays ? t('common.days') : t('common.hours')}
              </span>
            </div>
            <p className="mt-1 text-sm text-gray-500">{t('planner.leaveHours.fiveWeeks')}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
              {t('leaveTypes.BOV')}
              <span className="inline-block" title={t('planner.leaveHours.bovHelp')}>
                <HelpCircle className="w-4 h-4 text-gray-400" />
              </span>
            </label>
            <div className="relative">
              <input
                type="number"
                value={showAsDays ? convertHoursToDays(leaveHours.BOV) : leaveHours.BOV}
                onChange={(e) => handleLeaveHoursChange('BOV', Number(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                step="0.01"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                {showAsDays ? t('common.days') : t('common.hours')}
              </span>
            </div>
            <p className="mt-1 text-sm text-gray-500">{t('planner.leaveHours.nineWeeks')}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
              {t('leaveTypes.VD')}
              <span className="inline-block" title={t('planner.leaveHours.vdHelp')}>
                <HelpCircle className="w-4 h-4 text-gray-400" />
              </span>
            </label>
            <div className="relative">
              <input
                type="number"
                value={showAsDays ? convertHoursToDays(leaveHours.VD) : leaveHours.VD}
                onChange={(e) => handleLeaveHoursChange('VD', Number(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                step="0.01"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                {showAsDays ? t('common.days') : t('common.hours')}
              </span>
            </div>
            <p className="mt-1 text-sm text-gray-500">{t('planner.leaveHours.twentyDays')}</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <LeavePhaseForm 
          phases={leavePhases} 
          onChange={handlePhasesChange}
          expectedDueDate={expectedDueDate}
          defaultWorkPattern={workPattern}
        />
      </div>
    </form>
  );
};